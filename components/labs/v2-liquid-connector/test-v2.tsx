"use client";

import {
	Children,
	type CSSProperties,
	type ReactElement,
	type ReactNode,
	isValidElement,
	useEffect,
	useEffectEvent,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import {
	animate,
	type AnimationPlaybackControls,
	useMotionValue,
	useMotionValueEvent,
	useReducedMotion,
} from "motion/react";
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

/**
 * Scale a base duration (seconds) by speed.
 * speed 0 → ~1.9× (inspect), speed 1 → ~0.5× (snappy).
 */
function scaleDur(baseSec: number, speed: number, minSec = 0.04) {
	const t = Math.min(1, Math.max(0, speed));
	const mul = 1.9 - t * 1.4;
	return Math.max(minSec, baseSec * mul);
}

const DENT_PX = -8;
/** Gap (px) between annex bottom and anchor top once fully clear / open. */
const CLEAR_GAP = 10;
/** Base timings at speed ≈ 0.35 (mul ≈ 1.4). */
const WINDUP_S = 0.11;
const NECK_RETRACT_S = 0.09;
const REVEAL_S = 0.2;
const HIT_SQUASH_S = 0.06;
const ABSORB_FADE_S = 0.09;
const EJECT_S = 0.32;
const COLLAPSE_S = 0.22;
const REATTACH_S = 0.12;
const RETRACT_S = 0.3;
const SQUASH_Y = 0.92;
const SQUASH_X = 1.04;
const REBOUND_SPRING = { stiffness: 520, damping: 18, mass: 0.85 };

/**
 * Offset of annex center from anchor center so the annex sits fully above
 * the anchor. `gap` is the space between annex bottom and anchor top.
 * Negative = up.
 */
function annexLiftY(anchorH: number, annexH: number, gap: number) {
	return -(anchorH / 2 + annexH / 2 + gap);
}

type SlotProps = {
	children?: ReactNode;
	className?: string;
	style?: CSSProperties;
};

function AnchorSlot(_props: SlotProps) {
	return null;
}
AnchorSlot.displayName = "LiquidEject.Anchor";

function AnnexSlot(_props: SlotProps) {
	return null;
}
AnnexSlot.displayName = "LiquidEject.Annex";

function pickSlot(
	children: ReactNode,
	slot: typeof AnchorSlot | typeof AnnexSlot,
): ReactElement<SlotProps> | null {
	const match = Children.toArray(children).find(
		(child) => isValidElement(child) && child.type === slot,
	);
	return (match as ReactElement<SlotProps> | undefined) ?? null;
}

export type LiquidEjectProps = {
	children: ReactNode;
	open?: boolean;
	/** 0 = slow, 1 = fast. Default 0.35. */
	speed?: number;
	spring?: Partial<GooeySpringConfig>;
	/** Corner radius baked into the SVG path. */
	radius?: number;
	fill?: string;
	/** Idle / flight disk diameter (px). */
	annexSize?: number;
	/** Gap (px) between annex bottom and anchor top when open / after detach. */
	clearGap?: number;
	className?: string;
	style?: CSSProperties;
};

type Frame = {
	topDisplace: number;
	annexY: number;
	scaleX: number;
	scaleY: number;
	annexW: number;
	annexH: number;
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
 */
export function LiquidEject({
	children,
	open = false,
	speed = 0.35,
	spring,
	radius = 16,
	fill = "#1c1c1e",
	annexSize = 40,
	clearGap = CLEAR_GAP,
	className,
	style,
}: LiquidEjectProps) {
	const reduced = useReducedMotion() ?? false;
	const anchorSlot = pickSlot(children, AnchorSlot);
	const annexSlot = pickSlot(children, AnnexSlot);

	const anchorMeasureRef = useRef<HTMLDivElement>(null);
	const annexMeasureRef = useRef<HTMLDivElement>(null);
	const [anchorSize, setAnchorSize] = useState({ w: 160, h: 48 });
	const [annexTarget, setAnnexTarget] = useState({ w: 200, h: 72 });

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
	const annexOpacityMv = useMotionValue(0);
	const annexBlurMv = useMotionValue(0);
	const contentOpacityMv = useMotionValue(0);
	const detachedMv = useMotionValue(0);

	const [frame, setFrame] = useState<Frame>({
		...IDLE_FRAME,
		annexW: annexSize,
		annexH: annexSize,
	});

	const syncFrame = useEffectEvent(() => {
		setFrame({
			topDisplace: topDisplaceMv.get(),
			annexY: annexYMv.get(),
			scaleX: scaleXMv.get(),
			scaleY: scaleYMv.get(),
			annexW: annexWMv.get(),
			annexH: annexHMv.get(),
			annexOpacity: annexOpacityMv.get(),
			annexBlur: annexBlurMv.get(),
			contentOpacity: contentOpacityMv.get(),
			detached: detachedMv.get() > 0.5,
		});
	});

	useLayoutEffect(() => {
		const a = anchorMeasureRef.current;
		const b = annexMeasureRef.current;
		if (!a || !b) return;

		const measure = () => {
			const ar = a.getBoundingClientRect();
			const br = b.getBoundingClientRect();
			setAnchorSize({
				w: Math.max(48, Math.ceil(ar.width)),
				h: Math.max(32, Math.ceil(ar.height)),
			});
			setAnnexTarget({
				w: Math.max(annexSize, Math.ceil(br.width)),
				h: Math.max(annexSize, Math.ceil(br.height)),
			});
		};

		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(a);
		ro.observe(b);
		return () => ro.disconnect();
	}, [annexSize]);

	useMotionValueEvent(topDisplaceMv, "change", syncFrame);
	useMotionValueEvent(annexYMv, "change", syncFrame);
	useMotionValueEvent(scaleXMv, "change", syncFrame);
	useMotionValueEvent(scaleYMv, "change", syncFrame);
	useMotionValueEvent(annexWMv, "change", syncFrame);
	useMotionValueEvent(annexHMv, "change", syncFrame);
	useMotionValueEvent(annexOpacityMv, "change", syncFrame);
	useMotionValueEvent(annexBlurMv, "change", syncFrame);
	useMotionValueEvent(contentOpacityMv, "change", syncFrame);
	useMotionValueEvent(detachedMv, "change", syncFrame);

	const didMountRef = useRef(false);

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
			annexOpacityMv.jump(0);
			annexBlurMv.jump(0);
			contentOpacityMv.jump(0);
			detachedMv.jump(0);
			syncFrame();
		};

		if (reduced) {
			if (open) jumpOpen();
			else jumpClosed();
			didMountRef.current = true;
			return;
		}

		// Skip close animation on first mount when already idle.
		if (!didMountRef.current) {
			didMountRef.current = true;
			if (!open) {
				jumpClosed();
				return;
			}
		}

		let cancelled = false;

		const runOpen = async () => {
			detachedMv.jump(0);
			contentOpacityMv.jump(0);
			annexWMv.jump(annexSize);
			annexHMv.jump(annexSize);
			annexBlurMv.jump(0);
			annexYMv.jump(0);

			const windup = scaleDur(WINDUP_S, speed);
			const ejectDur = scaleDur(EJECT_S, speed);
			const neckDur = scaleDur(NECK_RETRACT_S, speed);
			const hitDur = scaleDur(HIT_SQUASH_S, speed, 0.03);
			const revealDur = scaleDur(REVEAL_S, speed);

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
				wait(
					track(
						animate(annexOpacityMv, 1, {
							duration: windup,
							ease: "easeOut",
						}),
					),
				),
			]);
			if (cancelled) return;

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

			const dockY = annexLiftY(anchorSize.h, annexSize, 0);
			const dockBulge = Math.abs(dockY);
			await Promise.all([
				wait(
					track(
						animate(annexYMv, dockY, {
							duration: ejectDur,
							ease: [0.22, 1, 0.36, 1],
						}),
					),
				),
				wait(
					track(
						animate(topDisplaceMv, dockBulge, {
							duration: ejectDur,
							ease: [0.22, 1, 0.36, 1],
						}),
					),
				),
			]);
			if (cancelled) return;

			detachedMv.jump(1);
			await wait(
				track(
					animate(topDisplaceMv, 0, {
						duration: neckDur,
						ease: [0.55, 0, 1, 0.45],
					}),
				),
			);
			if (cancelled) return;

			// Marked rebound: compress then spring back with overshoot.
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
				animate(scaleYMv, 1, { type: "spring", ...REBOUND_SPRING }),
			);
			track(
				animate(scaleXMv, 1, { type: "spring", ...REBOUND_SPRING }),
			);

			// Reveal — grow while keeping the annex bottom parked above the anchor.
			const parkedY = annexLiftY(anchorSize.h, annexTarget.h, clearGap);
			annexBlurMv.jump(8);
			await Promise.all([
				wait(
					track(
						animate(annexWMv, annexTarget.w, {
							duration: revealDur,
							ease: [0.22, 1, 0.36, 1],
						}),
					),
				),
				wait(
					track(
						animate(annexHMv, annexTarget.h, {
							duration: revealDur,
							ease: [0.22, 1, 0.36, 1],
						}),
					),
				),
				wait(
					track(
						animate(annexBlurMv, 0, {
							duration: revealDur,
							ease: "easeOut",
						}),
					),
				),
				wait(
					track(
						animate(contentOpacityMv, 1, {
							duration: revealDur,
							ease: "easeOut",
						}),
					),
				),
				wait(
					track(
						animate(annexYMv, parkedY, {
							duration: revealDur,
							ease: [0.22, 1, 0.36, 1],
						}),
					),
				),
			]);
		};

		const runClose = async () => {
			const collapseDur = scaleDur(COLLAPSE_S, speed);
			const reattachDur = scaleDur(REATTACH_S, speed);
			const retractDur = scaleDur(RETRACT_S, speed);
			const neckDur = scaleDur(NECK_RETRACT_S, speed);
			const hitDur = scaleDur(HIT_SQUASH_S, speed, 0.03);
			const absorbDur = scaleDur(ABSORB_FADE_S, speed);
			const dockY = annexLiftY(anchorSize.h, annexSize, 0);
			const dockBulge = Math.abs(dockY);

			// 1) Collapse annex back to flight disk (content hides, blur in, size down).
			//    Stay fully above the anchor so the re-dock can read as a reunion.
			await Promise.all([
				wait(
					track(
						animate(contentOpacityMv, 0, {
							duration: collapseDur * 0.55,
							ease: "easeIn",
						}),
					),
				),
				wait(
					track(
						animate(annexBlurMv, 8, {
							duration: collapseDur * 0.55,
							ease: "easeIn",
						}),
					),
				),
				wait(
					track(
						animate(annexWMv, annexSize, {
							duration: collapseDur,
							ease: [0.55, 0.05, 0.8, 0.4],
						}),
					),
				),
				wait(
					track(
						animate(annexHMv, annexSize, {
							duration: collapseDur,
							ease: [0.55, 0.05, 0.8, 0.4],
						}),
					),
				),
				wait(
					track(
						animate(annexYMv, dockY, {
							duration: collapseDur,
							ease: [0.33, 1, 0.68, 1],
						}),
					),
				),
			]);
			if (cancelled) return;

			annexBlurMv.jump(0);

			// 2) Re-dock — grow the anchor bulge up to meet the disk.
			await wait(
				track(
					animate(topDisplaceMv, dockBulge, {
						duration: reattachDur,
						ease: [0.22, 1, 0.36, 1],
					}),
				),
			);
			if (cancelled) return;
			detachedMv.jump(0);

			// 3) Retract together — disk descends into the anchor while the
			//    bulge shrinks in sync (inverse of the eject bulge grow).
			await Promise.all([
				wait(
					track(
						animate(annexYMv, 0, {
							duration: retractDur,
							ease: [0.55, 0.05, 0.8, 0.35],
						}),
					),
				),
				wait(
					track(
						animate(topDisplaceMv, DENT_PX, {
							duration: retractDur,
							ease: [0.55, 0.05, 0.8, 0.35],
						}),
					),
				),
			]);
			if (cancelled) return;

			// 4) Absorb — annex fades as it “sinks in”; anchor takes a marked
			//    squash hit (same language as open detach rebound), then settles.
			await Promise.all([
				wait(
					track(
						animate(annexOpacityMv, 0, {
							duration: absorbDur,
							ease: "easeIn",
						}),
					),
				),
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

			track(
				animate(scaleYMv, 1, { type: "spring", ...REBOUND_SPRING }),
			);
			track(
				animate(scaleXMv, 1, { type: "spring", ...REBOUND_SPRING }),
			);
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
		annexOpacityMv,
		annexBlurMv,
		contentOpacityMv,
		detachedMv,
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
	const svgPath = anchorSurfacePath(pathRect, frame.topDisplace).d;

	const annexLeft = (rootW - frame.annexW) / 2;
	const annexTop =
		svgPad + anchorSize.h / 2 - frame.annexH / 2 + frame.annexY;

	return (
		<div
			data-liquid-eject=""
			data-liquid-eject-open={open ? "" : undefined}
			data-liquid-eject-detached={frame.detached ? "" : undefined}
			className={cn("relative mx-auto", className)}
			style={{
				width: rootW,
				height: svgPad + anchorSize.h + 8,
				...style,
			}}
		>
			{/* Off-flow measures */}
			<div className="absolute top-0 left-[-9999px] opacity-0" aria-hidden>
				<div
					ref={anchorMeasureRef}
					className={cn(
						"w-max px-5 py-3 text-sm font-medium",
						anchorSlot?.props.className,
					)}
					style={anchorSlot?.props.style}
				>
					{anchorSlot?.props.children}
				</div>
				<div
					ref={annexMeasureRef}
					className={cn(
						"w-max max-w-70 px-5 py-4 text-sm leading-snug",
						annexSlot?.props.className,
					)}
					style={annexSlot?.props.style}
				>
					{annexSlot?.props.children}
				</div>
			</div>

			{/* Annex — starts centered on the anchor; rises fully above on Y */}
			<div
				className="absolute overflow-hidden"
				style={{
					left: annexLeft,
					top: annexTop,
					width: frame.annexW,
					height: frame.annexH,
					borderRadius: frame.detached
						? Math.min(radius, frame.annexW / 2, frame.annexH / 2)
						: 9999,
					background: fill,
					opacity: frame.annexOpacity,
					filter:
						frame.annexBlur > 0.05
							? `blur(${frame.annexBlur}px)`
							: undefined,
					zIndex: frame.detached ? 2 : 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<div
					className={cn(
						"px-5 py-4 text-sm leading-snug text-white/85",
						annexSlot?.props.className,
					)}
					style={{
						opacity: frame.contentOpacity,
						...annexSlot?.props.style,
					}}
				>
					{annexSlot?.props.children}
				</div>
			</div>

			{/* Anchor */}
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
				<div
					className={cn(
						"relative flex h-full items-center justify-center px-5 text-sm font-medium tracking-tight text-[#f5f5f7]",
						anchorSlot?.props.className,
					)}
					style={anchorSlot?.props.style}
				>
					{anchorSlot?.props.children}
				</div>
			</div>
		</div>
	);
}

LiquidEject.Anchor = AnchorSlot;
LiquidEject.Annex = AnnexSlot;

/** Immediate topDisplace scrub — inspect dent / bulge path. */
export function LiquidEjectScrub({
	topDisplace,
	radius = 16,
	fill = "#1c1c1e",
	width = 200,
	height = 56,
}: {
	topDisplace: number;
	radius?: number;
	fill?: string;
	width?: number;
	height?: number;
}) {
	const pad = Math.max(28, Math.abs(topDisplace) + 8);
	const rect: GooeyRect = { x: 0, y: pad, w: width, h: height, r: radius };
	const { d } = anchorSurfacePath(rect, topDisplace);

	return (
		<div className="relative mx-auto" style={{ width, height: height + pad }}>
			<svg
				width={width}
				height={height + pad}
				className="overflow-visible"
				aria-hidden
			>
				<title>Liquid surface</title>
				<path d={d} fill={fill} />
			</svg>
			<div
				className="pointer-events-none absolute inset-x-0 flex items-center justify-center text-sm font-medium text-[#f5f5f7]"
				style={{ top: pad, height }}
			>
				displace {topDisplace.toFixed(1)}
			</div>
		</div>
	);
}

/** Labs playground. */
export function LiquidEjectDemo() {
	const [open, setOpen] = useState(false);
	const [speed, setSpeed] = useState(0.35);
	const [scrub, setScrub] = useState(false);
	const [scrubDisplace, setScrubDisplace] = useState(0);
	const spring = springFromSpeed(speed);

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center gap-3">
				<button
					type="button"
					onClick={() => {
						setScrub(false);
						setOpen(true);
					}}
					className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm text-white transition duration-150 ease-out active:scale-[0.98]"
				>
					Open
				</button>
				<button
					type="button"
					onClick={() => {
						setScrub(false);
						setOpen(false);
					}}
					className="rounded-lg bg-neutral-200 px-3 py-1.5 text-sm text-neutral-900 transition duration-150 ease-out active:scale-[0.98]"
				>
					Close
				</button>
				<label className="flex items-center gap-2 text-sm text-neutral-500">
					<input
						type="checkbox"
						checked={scrub}
						onChange={(e) => setScrub(e.target.checked)}
					/>
					Scrub displace
				</label>
			</div>

			<div className="flex max-w-sm flex-col gap-3">
				{!scrub && (
					<label className="flex flex-col gap-1 text-sm text-neutral-500">
						<span>
							speed: {speed.toFixed(2)}{" "}
							<span className="text-neutral-400">
								(k={spring.stiffness.toFixed(0)} · d=
								{spring.damping.toFixed(0)} · m=
								{spring.mass.toFixed(2)})
							</span>
						</span>
						<input
							type="range"
							min={0}
							max={1}
							step={0.05}
							value={speed}
							onChange={(e) => setSpeed(Number(e.target.value))}
							className="w-full"
						/>
						<span className="flex justify-between text-xs text-neutral-400">
							<span>slow</span>
							<span>fast</span>
						</span>
					</label>
				)}

				{scrub && (
					<label className="flex flex-col gap-1 text-sm text-neutral-500">
						<span>
							topDisplace: {scrubDisplace.toFixed(1)} (dent − / bulge +)
						</span>
						<input
							type="range"
							min={-16}
							max={36}
							step={0.5}
							value={scrubDisplace}
							onChange={(e) => setScrubDisplace(Number(e.target.value))}
							className="w-full"
						/>
					</label>
				)}
			</div>

			<div className="flex justify-center rounded-2xl bg-neutral-100/80 py-16">
				{scrub ? (
					<LiquidEjectScrub topDisplace={scrubDisplace} />
				) : (
					<LiquidEject open={open} speed={speed} radius={18} annexSize={40}>
						<LiquidEject.Anchor>Now Playing</LiquidEject.Anchor>
						<LiquidEject.Annex>
							Spring windup · bulge tracks the disk · neck snaps · annex
							reveals.
						</LiquidEject.Annex>
					</LiquidEject>
				)}
			</div>
		</div>
	);
}

/** @deprecated Prefer LiquidEjectDemo */
export const GooeyPairDemo = LiquidEjectDemo;
