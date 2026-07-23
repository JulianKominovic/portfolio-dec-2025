"use client";

import { useState } from "react";
import { anchorSurfacePath, type GooeyRect } from "./gooey-path";
import { LiquidEject, springFromSpeed } from "./liquid-eject";

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
	const [speed, setSpeed] = useState(0.8);
	const [scrub, setScrub] = useState(false);
	const [scrubDisplace, setScrubDisplace] = useState(0);
	const [sound, setSound] = useState(true);
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
				<label className="flex items-center gap-2 text-sm text-neutral-500">
					<input
						type="checkbox"
						checked={sound}
						onChange={(e) => setSound(e.target.checked)}
					/>
					Sound
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
					<LiquidEject
						open={open}
						speed={speed}
						radius={18}
						annexWidth={240}
						annexHeight={100}
						fill="#1c1c1e"
						sound={sound}
					>
						<LiquidEject.Anchor
							className="select-none"
							as="button"
							type="button"
							onClick={() => setOpen((v) => !v)}
							aria-expanded={open}
						>
							Click me!
						</LiquidEject.Anchor>
						<LiquidEject.Annex role="region" aria-label="Click me! details">
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

export type {
	GooeySpringConfig,
	LiquidEjectAnchorProps,
	LiquidEjectAnnexProps,
	LiquidEjectProps,
} from "./liquid-eject";
export { LiquidEject, springFromSpeed } from "./liquid-eject";
