"use client";

import { Slot } from "@radix-ui/react-slot";
import {
	type AnimationPlaybackControls,
	animate,
	useMotionValue,
	useMotionValueEvent,
	useReducedMotion,
} from "motion/react";
import type * as React from "react";
import {
	Children,
	type CSSProperties,
	type ElementType,
	isValidElement,
	type ReactElement,
	type ReactNode,
	useEffect,
	useEffectEvent,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/utils";
import { anchorSurfacePath, type GooeyRect } from "./gooey-path";

export type GooeySpringConfig = {
	stiffness: number;
	damping: number;
	mass: number;
};

/** Map 0 (slow / inspect) → 1 (snappy) to spring params. */
export function springFromSpeed(speed: number): GooeySpringConfig {
	const t = Math.min(1, Math.max(0, speed));
	return {
		stiffness: 36 + t * 280,
		damping: 14 + t * 10,
		mass: 1.5 - t * 0.7,
	};
}

/** Annex W/H/radius morph — wide speed range (slow inspect → snappy). */
function annexSizeSpring(speed: number): GooeySpringConfig {
	const t = Math.min(1, Math.max(0, speed));
	return {
		stiffness: 55 + t * 500,
		damping: 12 + t * 16,
		mass: 1.4 - t * 0.6,
	};
}

/** Annex Y travel (+ synced bulge) — slightly softer so the neck stretch reads. */
function annexTravelSpring(speed: number): GooeySpringConfig {
	const t = Math.min(1, Math.max(0, speed));
	return {
		stiffness: 38 + t * 360,
		damping: 16 + t * 14,
		mass: 1.55 - t * 0.55,
	};
}

/**
 * Scale a base duration (seconds) by speed.
 * speed 0 → ~1.9× (inspect), speed 1 → ~0.5× (snappy).
 */
function scaleDur(baseSec: number, speed: number, minSec = 0.04) {
	const t = Math.min(1, Math.max(0, speed));
	const mul = 1.9 - t * 1.4;
	return Math.max(minSec, baseSec * mul);
}

/** waitUntil patience — must grow when springs slow down, or slow speed gets cut short. */
function phaseTimeoutMs(speed: number, baseMs = 750) {
	return scaleDur(baseMs / 1000, speed, 0.2) * 1000;
}

/** Advance when predicate is true — avoids waiting for spring settle (staged feel). */
async function waitUntil(
	pred: () => boolean,
	isCancelled: () => boolean,
	timeoutMs = 900,
) {
	const start = performance.now();
	while (!isCancelled() && !pred()) {
		if (performance.now() - start > timeoutMs) break;
		await new Promise<void>((r) => requestAnimationFrame(() => r()));
	}
}

const DENT_PX = -16;
/** Gap (px) between annex bottom and anchor top once fully clear / open. */
const CLEAR_GAP = 10;
/**
 * Extra clearance (px) the flight disk travels past flush *while still
 * connected* — this is the readable liquid neck stretch before the snap.
 */
const STRETCH_GAP = 28;
/** How far the bulge embeds into the flight disk (px) for a solid seal. */
const NECK_EMBED = 18;
/** Detach only once the annex has nearly reached the stretch target. */
const DETACH_PROGRESS = 0.94;
/** Base timings at speed ≈ 0.35 (mul ≈ 1.4). */
const WINDUP_S = 0.11;
const NECK_RETRACT_S = 0.11;
const HIT_SQUASH_S = 0.06;
const SQUASH_Y = 0.9;
const SQUASH_X = 1.06;
/** Cap bulge height vs flight disk — tall enough for a stretched neck. */
const BULGE_CAP = 1.55;

function reboundSpring(speed: number): GooeySpringConfig {
	const t = Math.min(1, Math.max(0, speed));
	return {
		stiffness: 280 + t * 360,
		damping: 10 + t * 8,
		mass: 1.05 - t * 0.3,
	};
}

/**
 * Offset of annex center from anchor center so the annex sits fully above
 * the anchor. `gap` is the space between annex bottom and anchor top.
 * Negative = up.
 */
function annexLiftY(anchorH: number, annexH: number, gap: number) {
	return -(anchorH / 2 + annexH / 2 + gap);
}

/** Bulge that bridges `gap` and seals into the flight disk. */
function neckBulge(gap: number, flightSize: number) {
	return Math.min(Math.max(0, gap) + NECK_EMBED, flightSize * BULGE_CAP);
}

/** Re-dock merge bulge (flush / slight overlap) — taller of neck or travel. */
function cappedBulge(dockY: number, flightSize: number) {
	return Math.min(Math.abs(dockY), flightSize * BULGE_CAP);
}

/** Narrower bell as the bulge grows so the stretch reads as a stem, not a mound. */
function bulgeHalfWidthRatio(topDisplace: number) {
	const amp = Math.abs(topDisplace);
	if (amp < 1) return 0.48;
	return Math.min(0.48, Math.max(0.34, 0.48 - (amp / 70) * 0.14));
}

function openAnnexRadius(cornerR: number, w: number, h: number) {
	return Math.min(cornerR, w / 2, h / 2);
}

export type LiquidEjectAnchorProps<T extends ElementType = "div"> = {
	as?: T;
	asChild?: boolean;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "asChild">;

export type LiquidEjectAnnexProps<T extends ElementType = "div"> = {
	as?: T;
	asChild?: boolean;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "asChild">;

type StoredSlotProps = {
	as?: ElementType;
	asChild?: boolean;
	className?: string;
	style?: CSSProperties;
	children?: ReactNode;
	[key: string]: unknown;
};

function AnchorSlot(_props: LiquidEjectAnchorProps<ElementType>) {
	return null;
}
AnchorSlot.displayName = "LiquidEject.Anchor";

function AnnexSlot(_props: LiquidEjectAnnexProps<ElementType>) {
	return null;
}
AnnexSlot.displayName = "LiquidEject.Annex";

function pickSlot(
	children: ReactNode,
	slot: typeof AnchorSlot | typeof AnnexSlot,
): ReactElement<StoredSlotProps> | null {
	const match = Children.toArray(children).find(
		(child) => isValidElement(child) && child.type === slot,
	);
	return (match as ReactElement<StoredSlotProps> | undefined) ?? null;
}

function splitPolymorphic(props: StoredSlotProps | undefined) {
	const {
		as = "div",
		asChild = false,
		className,
		style,
		children,
		...rest
	} = props ?? {};
	return {
		as: as as ElementType,
		asChild: Boolean(asChild),
		className,
		style,
		children,
		rest: rest as Record<string, unknown>,
	};
}

/** Measure content only — never interactive tags / asChild hosts. */
function measureChildren(children: ReactNode, asChild: boolean): ReactNode {
	if (!asChild) return children;
	if (isValidElement<{ children?: ReactNode }>(children)) {
		return children.props.children;
	}
	return children;
}

export type LiquidEjectProps = Omit<
	React.ComponentProps<"div">,
	"children"
> & {
	children: ReactNode;
	open?: boolean;
	/** 0 = slow, 1 = fast. Default 0.35. */
	speed?: number;
	spring?: Partial<GooeySpringConfig>;
	/** Corner radius baked into the SVG path. */
	radius?: number;
	fill?: string;
	/** Idle / flight disk diameter (px). Independent of open annex size. */
	annexSize?: number;
	/** Open annex width (px). Overrides content measurement when set. */
	annexWidth?: number;
	/** Open annex height (px). Overrides content measurement when set. */
	annexHeight?: number;
	/** Gap (px) between annex bottom and anchor top when open / after detach. */
	clearGap?: number;
};

type Frame = {
	topDisplace: number;
	annexY: number;
	scaleX: number;
	scaleY: number;
	annexW: number;
	annexH: number;
	annexRadius: number;
	annexOpacity: number;
	annexBlur: number;
	contentOpacity: number;
	detached: boolean;
};

const IDLE_FRAME: Frame = {
	topDisplace: 0,
	annexY: 0,
	scaleX: 1,
	scaleY: 1,
	annexW: 40,
	annexH: 40,
	annexRadius: 20,
	annexOpacity: 0,
	annexBlur: 0,
	contentOpacity: 0,
	detached: false,
};

/**
 * Single-SVG liquid eject: anchor surface dents → bulges with a rising annex
 * disk → neck snaps flat + squash rebound → annex expands/reveals.
 * Close mirrors that: collapse → re-dock bulge → retract into anchor → absorb squash.
 *
 * Anchor must not use border, outline, box-shadow, or filter — color lives in
 * the SVG path only. Annex fill matches `fill` so the neck reads continuous.
 *
 * @see components/labs/v2-liquid-connector/liquid-container.md
 */
export function LiquidEject({
	children,
	open = false,
	speed = 0.8,
	spring,
	radius = 16,
	fill = "#1c1c1e",
	annexSize = 40,
	annexWidth,
	annexHeight,
	clearGap = CLEAR_GAP,
	className,
	style,
	...rootProps
}: LiquidEjectProps) {
	const reduced = useReducedMotion() ?? false;
	const anchorSlot = pickSlot(children, AnchorSlot);
	const annexSlot = pickSlot(children, AnnexSlot);
	const anchor = splitPolymorphic(anchorSlot?.props);
	const annex = splitPolymorphic(annexSlot?.props);

	const anchorMeasureRef = useRef<HTMLDivElement>(null);
	const annexMeasureRef = useRef<HTMLDivElement>(null);
	const [anchorSize, setAnchorSize] = useState({ w: 160, h: 48 });
	const [measuredAnnex, setMeasuredAnnex] = useState({ w: 200, h: 72 });

	const annexTarget = {
		w: annexWidth ?? measuredAnnex.w,
		h: annexHeight ?? measuredAnnex.h,
	};
	const measureAnnexW = annexWidth == null;
	const measureAnnexH = annexHeight == null;

	const springConfig: GooeySpringConfig = {
		...springFromSpeed(speed),
		...spring,
	};

	const topDisplaceMv = useMotionValue(0);
	const annexYMv = useMotionValue(0);
	const scaleXMv = useMotionValue(1);
	const scaleYMv = useMotionValue(1);
	const annexWMv = useMotionValue(annexSize);
	const annexHMv = useMotionValue(annexSize);
	const annexRadiusMv = useMotionValue(annexSize / 2);
	const annexOpacityMv = useMotionValue(0);
	const annexBlurMv = useMotionValue(0);
	const contentOpacityMv = useMotionValue(0);
	const detachedMv = useMotionValue(0);

	const [frame, setFrame] = useState<Frame>({
		...IDLE_FRAME,
		annexW: annexSize,
		annexH: annexSize,
		annexRadius: annexSize / 2,
	});

	const syncFrame = useEffectEvent(() => {
		setFrame({
			topDisplace: topDisplaceMv.get(),
			annexY: annexYMv.get(),
			scaleX: scaleXMv.get(),
			scaleY: scaleYMv.get(),
			annexW: annexWMv.get(),
			annexH: annexHMv.get(),
			annexRadius: annexRadiusMv.get(),
			annexOpacity: annexOpacityMv.get(),
			annexBlur: annexBlurMv.get(),
			contentOpacity: contentOpacityMv.get(),
			detached: detachedMv.get() > 0.5,
		});
	});

	useLayoutEffect(() => {
		const a = anchorMeasureRef.current;
		const b = annexMeasureRef.current;
		if (!a) return;

		const measure = () => {
			const ar = a.getBoundingClientRect();
			setAnchorSize({
				w: Math.max(48, Math.ceil(ar.width)),
				h: Math.max(32, Math.ceil(ar.height)),
			});
			if ((measureAnnexW || measureAnnexH) && b) {
				const br = b.getBoundingClientRect();
				setMeasuredAnnex((prev) => ({
					w: measureAnnexW ? Math.max(annexSize, Math.ceil(br.width)) : prev.w,
					h: measureAnnexH ? Math.max(annexSize, Math.ceil(br.height)) : prev.h,
				}));
			}
		};

		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(a);
		if ((measureAnnexW || measureAnnexH) && b) ro.observe(b);
		return () => ro.disconnect();
	}, [annexSize, measureAnnexW, measureAnnexH]);

	useMotionValueEvent(topDisplaceMv, "change", syncFrame);
	useMotionValueEvent(annexYMv, "change", syncFrame);
	useMotionValueEvent(scaleXMv, "change", syncFrame);
	useMotionValueEvent(scaleYMv, "change", syncFrame);
	useMotionValueEvent(annexWMv, "change", syncFrame);
	useMotionValueEvent(annexHMv, "change", syncFrame);
	useMotionValueEvent(annexRadiusMv, "change", syncFrame);
	useMotionValueEvent(annexOpacityMv, "change", syncFrame);
	useMotionValueEvent(annexBlurMv, "change", syncFrame);
	useMotionValueEvent(contentOpacityMv, "change", syncFrame);
	useMotionValueEvent(detachedMv, "change", syncFrame);

	const prevOpenRef = useRef<boolean | null>(null);

	useEffect(() => {
		const controls: AnimationPlaybackControls[] = [];
		const track = (c: AnimationPlaybackControls) => {
			controls.push(c);
			return c;
		};
		const stopAll = () => {
			for (const c of controls) {
				c.stop();
			}
		};
		const wait = (c: AnimationPlaybackControls) => c.finished;

		const jumpOpen = () => {
			const parked = annexLiftY(anchorSize.h, annexTarget.h, clearGap);
			topDisplaceMv.jump(0);
			annexYMv.jump(parked);
			scaleXMv.jump(1);
			scaleYMv.jump(1);
			annexWMv.jump(annexTarget.w);
			annexHMv.jump(annexTarget.h);
			annexRadiusMv.jump(openAnnexRadius(radius, annexTarget.w, annexTarget.h));
			annexOpacityMv.jump(1);
			annexBlurMv.jump(0);
			contentOpacityMv.jump(1);
			detachedMv.jump(1);
			syncFrame();
		};

		const jumpClosed = () => {
			topDisplaceMv.jump(0);
			annexYMv.jump(0);
			scaleXMv.jump(1);
			scaleYMv.jump(1);
			annexWMv.jump(annexSize);
			annexHMv.jump(annexSize);
			annexRadiusMv.jump(annexSize / 2);
			annexOpacityMv.jump(0);
			annexBlurMv.jump(0);
			contentOpacityMv.jump(0);
			detachedMv.jump(0);
			syncFrame();
		};

		if (reduced) {
			if (open) jumpOpen();
			else jumpClosed();
			prevOpenRef.current = open;
			return;
		}

		// initial=false: snap on first paint; never play open/close on mount.
		if (prevOpenRef.current === null) {
			prevOpenRef.current = open;
			if (open) jumpOpen();
			else jumpClosed();
			return;
		}

		// Measurement / spring deps changed without a toggle — don't replay.
		if (prevOpenRef.current === open) {
			return;
		}
		prevOpenRef.current = open;

		let cancelled = false;

		const runOpen = async () => {
			const windup = scaleDur(WINDUP_S, speed);
			const neckDur = scaleDur(NECK_RETRACT_S, speed);
			const hitDur = scaleDur(HIT_SQUASH_S, speed, 0.03);
			const sizeSpring = { type: "spring" as const, ...annexSizeSpring(speed) };
			const travelSpring = {
				type: "spring" as const,
				...annexTravelSpring(speed),
			};
			// Stretch past flush while connected — neck must be visible before snap.
			const stretchY = annexLiftY(anchorSize.h, annexSize, STRETCH_GAP);
			const stretchBulge = neckBulge(STRETCH_GAP, annexSize);
			const flushY = annexLiftY(anchorSize.h, annexSize, 0);
			const targetRadius = openAnnexRadius(
				radius,
				annexTarget.w,
				annexTarget.h,
			);
			const parkedY = annexLiftY(anchorSize.h, annexTarget.h, clearGap);
			const isCancelled = () => cancelled;

			// Interrupt-friendly: if already clear of the anchor, skip windup/eject
			// and just reveal from current size.
			const alreadyClear =
				detachedMv.get() > 0.5 &&
				Math.abs(annexYMv.get()) >= Math.abs(flushY) * 0.55;

			if (!alreadyClear) {
				const nearIdle = Math.abs(annexYMv.get()) < 6;
				if (nearIdle) {
					detachedMv.jump(0);
					contentOpacityMv.jump(0);
					annexWMv.jump(annexSize);
					annexHMv.jump(annexSize);
					annexRadiusMv.jump(annexSize / 2);
					annexBlurMv.jump(0);
					annexYMv.jump(0);
				} else {
					detachedMv.jump(0);
					// Shrink toward flight disk without waiting full settle.
					contentOpacityMv.jump(0);
					track(animate(annexWMv, annexSize, sizeSpring));
					track(animate(annexHMv, annexSize, sizeSpring));
					track(animate(annexRadiusMv, annexSize / 2, sizeSpring));
					await waitUntil(
						() => annexHMv.get() <= annexSize * 1.2,
						isCancelled,
						phaseTimeoutMs(speed, 800),
					);
					if (cancelled) return;
				}

				// Windup punch — short duration; annex visible immediately (no opacity tween).
				annexOpacityMv.jump(1);
				await Promise.all([
					wait(
						track(
							animate(scaleYMv, SQUASH_Y, {
								duration: windup,
								ease: [0.33, 1, 0.68, 1],
							}),
						),
					),
					wait(
						track(
							animate(scaleXMv, SQUASH_X, {
								duration: windup,
								ease: [0.33, 1, 0.68, 1],
							}),
						),
					),
					wait(
						track(
							animate(topDisplaceMv, DENT_PX, {
								duration: windup,
								ease: [0.33, 1, 0.68, 1],
							}),
						),
					),
				]);
				if (cancelled) return;

				// Eject + scale recover — fire together; advance on progress not settle.
				track(
					animate(scaleYMv, 1, {
						type: "spring",
						stiffness: springConfig.stiffness,
						damping: springConfig.damping,
						mass: springConfig.mass,
					}),
				);
				track(
					animate(scaleXMv, 1, {
						type: "spring",
						stiffness: springConfig.stiffness,
						damping: springConfig.damping,
						mass: springConfig.mass,
					}),
				);
				track(animate(annexYMv, stretchY, travelSpring));
				track(animate(topDisplaceMv, stretchBulge, travelSpring));

				// Hold the connection through the stretch — cut only near peak pull.
				await waitUntil(
					() =>
						Math.abs(annexYMv.get()) >= Math.abs(stretchY) * DETACH_PROGRESS &&
						topDisplaceMv.get() >= stretchBulge * 0.85,
					isCancelled,
					phaseTimeoutMs(speed, 1200),
				);
				if (cancelled) return;

				detachedMv.jump(1);

				// Neck cut + rebound + reveal overlap into one continuous beat.
				track(
					animate(topDisplaceMv, 0, {
						duration: neckDur,
						ease: [0.55, 0, 1, 0.45],
					}),
				);
				void (async () => {
					await Promise.all([
						wait(
							track(
								animate(scaleYMv, SQUASH_Y, {
									duration: hitDur,
									ease: "easeOut",
								}),
							),
						),
						wait(
							track(
								animate(scaleXMv, SQUASH_X, {
									duration: hitDur,
									ease: "easeOut",
								}),
							),
						),
					]);
					if (cancelled) return;
					track(
						animate(scaleYMv, 1, {
							type: "spring",
							...reboundSpring(speed),
						}),
					);
					track(
						animate(scaleXMv, 1, {
							type: "spring",
							...reboundSpring(speed),
						}),
					);
				})();

				if (annexOpacityMv.get() < 1) annexOpacityMv.jump(1);
				contentOpacityMv.jump(1);
				await Promise.all([
					wait(track(animate(annexWMv, annexTarget.w, sizeSpring))),
					wait(track(animate(annexHMv, annexTarget.h, sizeSpring))),
					wait(track(animate(annexRadiusMv, targetRadius, sizeSpring))),
					wait(track(animate(annexYMv, parkedY, travelSpring))),
				]);
				return;
			}

			if (annexOpacityMv.get() < 1) annexOpacityMv.jump(1);
			detachedMv.jump(1);
			contentOpacityMv.jump(1);
			await Promise.all([
				wait(track(animate(annexWMv, annexTarget.w, sizeSpring))),
				wait(track(animate(annexHMv, annexTarget.h, sizeSpring))),
				wait(track(animate(annexRadiusMv, targetRadius, sizeSpring))),
				wait(track(animate(annexYMv, parkedY, travelSpring))),
			]);
		};

		const runClose = async () => {
			const neckDur = scaleDur(NECK_RETRACT_S, speed);
			const hitDur = scaleDur(HIT_SQUASH_S, speed, 0.03);
			const dentDur = scaleDur(0.2, speed);
			const sizeSpring = { type: "spring" as const, ...annexSizeSpring(speed) };
			const travelSpring = {
				type: "spring" as const,
				...annexTravelSpring(speed),
			};
			// Rejoin with a short stretch neck, then settle flush into the anchor.
			const stretchY = annexLiftY(anchorSize.h, annexSize, STRETCH_GAP);
			const stretchBulge = neckBulge(STRETCH_GAP, annexSize);
			const dockY = annexLiftY(anchorSize.h, annexSize, 0);
			const dockBulge = cappedBulge(dockY, annexSize);
			const isCancelled = () => cancelled;

			// Collapse + drift toward stretch in one continuous motion.
			contentOpacityMv.jump(0);
			track(animate(annexWMv, annexSize, sizeSpring));
			track(animate(annexHMv, annexSize, sizeSpring));
			track(animate(annexRadiusMv, annexSize / 2, sizeSpring));
			track(animate(annexYMv, stretchY, travelSpring));

			// Bulge grows as the disk approaches — bridge before re-dock.
			await waitUntil(
				() => annexHMv.get() <= annexSize * 1.35,
				isCancelled,
				phaseTimeoutMs(speed, 700),
			);
			if (cancelled) return;
			track(animate(topDisplaceMv, stretchBulge, travelSpring));

			await waitUntil(
				() =>
					Math.abs(annexYMv.get() - stretchY) <
					Math.max(6, Math.abs(stretchY) * 0.12),
				isCancelled,
				phaseTimeoutMs(speed, 900),
			);
			if (cancelled) return;
			detachedMv.jump(0);

			// Pull flush while the neck thickens into a merge bulge.
			track(animate(annexYMv, dockY, travelSpring));
			track(animate(topDisplaceMv, dockBulge, travelSpring));
			await waitUntil(
				() =>
					Math.abs(annexYMv.get() - dockY) < Math.max(5, Math.abs(dockY) * 0.1),
				isCancelled,
				phaseTimeoutMs(speed, 700),
			);
			if (cancelled) return;

			// Retract: cut the bulge flat first, then form a readable dent while
			// the disk sinks. Ease (no spring) into Y=0 so we don't overshoot
			// below the anchor and peek out the bottom.
			const flattenDur = scaleDur(0.07, speed, 0.04);
			const retractDur = scaleDur(0.28, speed);
			track(
				animate(annexYMv, 0, {
					duration: retractDur,
					ease: [0.55, 0.05, 0.8, 0.35],
				}),
			);
			await wait(
				track(
					animate(topDisplaceMv, 0, {
						duration: flattenDur,
						ease: [0.55, 0, 1, 0.45],
					}),
				),
			);
			if (cancelled) return;

			track(
				animate(topDisplaceMv, DENT_PX, {
					duration: dentDur,
					ease: [0.33, 1, 0.68, 1],
				}),
			);

			// Hold until the dent has actually formed (and annex is mostly home).
			await waitUntil(
				() =>
					topDisplaceMv.get() <= DENT_PX * 0.65 &&
					Math.abs(annexYMv.get()) <= Math.abs(dockY) * 0.4,
				isCancelled,
				phaseTimeoutMs(speed, 1000),
			);
			if (cancelled) return;

			// Absorb: hide annex instantly — anchor punch runs now.
			annexOpacityMv.jump(0);
			await Promise.all([
				wait(
					track(
						animate(topDisplaceMv, 0, {
							duration: neckDur,
							ease: [0.55, 0, 1, 0.45],
						}),
					),
				),
				wait(
					track(
						animate(scaleYMv, SQUASH_Y, {
							duration: hitDur,
							ease: "easeOut",
						}),
					),
				),
				wait(
					track(
						animate(scaleXMv, SQUASH_X, {
							duration: hitDur,
							ease: "easeOut",
						}),
					),
				),
			]);
			if (cancelled) return;

			track(animate(scaleYMv, 1, { type: "spring", ...reboundSpring(speed) }));
			track(animate(scaleXMv, 1, { type: "spring", ...reboundSpring(speed) }));
		};

		if (open) void runOpen();
		else void runClose();

		return () => {
			cancelled = true;
			stopAll();
		};
	}, [
		open,
		reduced,
		annexSize,
		annexTarget.w,
		annexTarget.h,
		anchorSize.h,
		clearGap,
		speed,
		springConfig.stiffness,
		springConfig.damping,
		springConfig.mass,
		topDisplaceMv,
		annexYMv,
		scaleXMv,
		scaleYMv,
		annexWMv,
		annexHMv,
		annexRadiusMv,
		annexOpacityMv,
		annexBlurMv,
		contentOpacityMv,
		detachedMv,
		radius,
	]);

	const parkedHeadroom = Math.abs(
		annexLiftY(anchorSize.h, Math.max(annexTarget.h, annexSize), clearGap),
	);
	const headroom = Math.max(
		parkedHeadroom + Math.max(annexTarget.h, annexSize) / 2 + 16,
		Math.abs(frame.topDisplace) + annexSize,
	);
	const svgPad = Math.max(24, headroom);
	const rootW = Math.max(anchorSize.w, annexTarget.w);
	const anchorLeft = (rootW - anchorSize.w) / 2;
	const svgW = anchorSize.w;
	const svgH = anchorSize.h + svgPad;
	const pathRect: GooeyRect = {
		x: 0,
		y: svgPad,
		w: anchorSize.w,
		h: anchorSize.h,
		r: radius,
	};
	const svgPath = anchorSurfacePath(pathRect, frame.topDisplace, {
		bulgeHalfWidthRatio: bulgeHalfWidthRatio(frame.topDisplace),
	}).d;

	const annexLeft = (rootW - frame.annexW) / 2;
	// Never let the annex bottom sit below the anchor (spring overshoot / tall disk).
	const maxAnnexY = (anchorSize.h - frame.annexH) / 2;
	const annexYDraw = Math.min(frame.annexY, maxAnnexY);
	const annexTop = svgPad + anchorSize.h / 2 - frame.annexH / 2 + annexYDraw;

	const AnchorComp = anchor.asChild ? Slot : anchor.as;
	const AnnexComp = annex.asChild ? Slot : annex.as;

	const annexShellStyle: CSSProperties = {
		left: annexLeft,
		top: annexTop,
		width: frame.annexW,
		height: frame.annexH,
		borderRadius: frame.annexRadius,
		background: fill,
		opacity: frame.annexOpacity,
		zIndex: frame.detached ? 2 : 0,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		...(annex.asChild
			? { ...annex.style, opacity: frame.contentOpacity * frame.annexOpacity }
			: annex.style),
	};

	return (
		<div
			data-liquid-eject=""
			data-liquid-eject-open={open ? "" : undefined}
			data-liquid-eject-detached={frame.detached ? "" : undefined}
			data-slot="liquid-eject"
			className={cn("relative mx-auto", className)}
			style={{
				width: rootW,
				height: svgPad + anchorSize.h + 8,
				...style,
			}}
			{...rootProps}
		>
			{/* Off-flow measures — always plain divs */}
			<div className="absolute top-0 left-[-9999px] opacity-0" aria-hidden>
				<div
					ref={anchorMeasureRef}
					className={cn(
						"w-max px-5 py-3 text-sm font-medium",
						anchor.className,
					)}
					style={anchor.style}
				>
					{measureChildren(anchor.children, anchor.asChild)}
				</div>
				<div
					ref={annexMeasureRef}
					className={cn(
						"w-max max-w-70 px-5 py-4 text-sm leading-snug",
						annex.className,
					)}
					style={annex.style}
				>
					{measureChildren(annex.children, annex.asChild)}
				</div>
			</div>

			{/* Annex — starts centered on the anchor; rises fully above on Y */}
			<AnnexComp
				data-slot="liquid-eject-annex"
				className={cn("absolute overflow-hidden", annex.className)}
				style={annexShellStyle}
				{...annex.rest}
			>
				{annex.asChild ? (
					annex.children
				) : (
					<div
						className="px-5 py-4 text-sm leading-snug text-white/85"
						style={{ opacity: frame.contentOpacity }}
					>
						{annex.children}
					</div>
				)}
			</AnnexComp>

			{/* Anchor shell — SVG surface + polymorphic content layer */}
			<div
				className="absolute"
				style={{
					left: anchorLeft,
					top: svgPad,
					width: anchorSize.w,
					height: anchorSize.h,
					transform: `scale(${frame.scaleX}, ${frame.scaleY})`,
					transformOrigin: "bottom center",
					zIndex: 1,
				}}
			>
				<svg
					className="pointer-events-none absolute left-0 overflow-visible"
					style={{ top: -svgPad, width: svgW, height: svgH }}
					width={svgW}
					height={svgH}
					aria-hidden
				>
					<title>Liquid surface</title>
					<path d={svgPath} fill={fill} />
				</svg>
				<AnchorComp
					data-slot="liquid-eject-anchor"
					className={cn(
						"relative flex h-full w-full cursor-pointer items-center justify-center border-0 bg-transparent px-5 text-sm font-medium tracking-tight text-[#f5f5f7] appearance-none outline-none",
						anchor.className,
					)}
					style={anchor.style}
					{...anchor.rest}
				>
					{anchor.children}
				</AnchorComp>
			</div>
		</div>
	);
}

LiquidEject.Anchor = AnchorSlot as <T extends ElementType = "div">(
	props: LiquidEjectAnchorProps<T>,
) => null;
LiquidEject.Annex = AnnexSlot as <T extends ElementType = "div">(
	props: LiquidEjectAnnexProps<T>,
) => null;
