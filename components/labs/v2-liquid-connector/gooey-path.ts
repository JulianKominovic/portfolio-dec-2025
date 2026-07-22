/**
 * V2 gooey path — single-SVG liquid eject surface.
 *
 * `anchorSurfacePath` draws one rounded rect whose top edge can dent (negative
 * displace) or bulge (positive) for the windup → eject → detach sequence.
 * `gooeyPairPath` remains for reference / scrub experiments.
 */

export type GooeyRect = {
	x: number;
	y: number;
	w: number;
	h: number;
	r: number;
};

export type AnchorSurfaceOptions = {
	/** Half-width of the dent/bulge bell as a fraction of rect width (0–0.5). */
	bulgeHalfWidthRatio?: number;
};

export type AnchorSurfaceResult = {
	d: string;
	/** Signed top-edge displacement used (px). Positive = bulge up. */
	topDisplace: number;
};

export type GooeyPathOptions = {
	/** Face gap at which the bridge breaks. */
	detachGap?: number;
	/** Waist as a fraction of the narrower panel at gap ≤ 0. */
	maxWaistRatio?: number;
	/** Minimum waist (px) just before detach. */
	minWaist?: number;
	/** How far the neck attachment sits in from panel edges at full merge (0–0.5). */
	edgePad?: number;
};

export type GooeyPathResult = {
	d: string;
	connected: boolean;
	/** 0 = fully merged bridge, 1 = about to tear. */
	pinch: number;
	waistWidth: number;
	seamY: number;
};

const KAPPA = 0.5522847498;
/** Treat |displace| below this as a flat top (avoids tiny cubic noise). */
const FLAT_EPS = 0.35;

function clamp(n: number, lo: number, hi: number) {
	return Math.min(hi, Math.max(lo, n));
}

function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

function smootherstep(edge0: number, edge1: number, x: number) {
	const t = clamp((x - edge0) / (edge1 - edge0 || 1), 0, 1);
	return t * t * t * (t * (t * 6 - 15) + 10);
}

function f(n: number) {
	return Number(n.toFixed(3));
}

function clampRadius(r: number, w: number, h: number) {
	return Math.max(0, Math.min(r, w / 2, h / 2));
}

/** Single rounded rect path (clockwise from top-left). */
export function roundedRectPath(rect: GooeyRect): string {
	const { x, y, w, h } = rect;
	const r = clampRadius(rect.r, w, h);
	if (r <= 0.01) {
		return `M ${f(x)} ${f(y)} H ${f(x + w)} V ${f(y + h)} H ${f(x)} Z`;
	}
	return [
		`M ${f(x + r)} ${f(y)}`,
		`H ${f(x + w - r)}`,
		`C ${f(x + w - r + KAPPA * r)} ${f(y)} ${f(x + w)} ${f(y + r - KAPPA * r)} ${f(x + w)} ${f(y + r)}`,
		`V ${f(y + h - r)}`,
		`C ${f(x + w)} ${f(y + h - r + KAPPA * r)} ${f(x + w - r + KAPPA * r)} ${f(y + h)} ${f(x + w - r)} ${f(y + h)}`,
		`H ${f(x + r)}`,
		`C ${f(x + r - KAPPA * r)} ${f(y + h)} ${f(x)} ${f(y + h - r + KAPPA * r)} ${f(x)} ${f(y + h - r)}`,
		`V ${f(y + r)}`,
		`C ${f(x)} ${f(y + r - KAPPA * r)} ${f(x + r - KAPPA * r)} ${f(y)} ${f(x + r)} ${f(y)}`,
		"Z",
	].join(" ");
}

/**
 * Rounded rect with a soft dent (topDisplace < 0) or bulge (topDisplace > 0)
 * on the top edge. Apex sits at horizontal center with a *horizontal* tangent
 * so the crest/valley reads as a rounded mound, not a sharp peak.
 *
 * SVG y grows downward: positive topDisplace moves the apex *up* (smaller y).
 */
export function anchorSurfacePath(
	rect: GooeyRect,
	topDisplace: number,
	options: AnchorSurfaceOptions = {},
): AnchorSurfaceResult {
	const { x, y, w, h } = rect;
	const r = clampRadius(rect.r, w, h);

	if (Math.abs(topDisplace) < FLAT_EPS) {
		return { d: roundedRectPath(rect), topDisplace: 0 };
	}

	// Bell spans most of the top between corner radii (wider = softer).
	const halfRatio = clamp(options.bulgeHalfWidthRatio ?? 0.48, 0.28, 0.5);
	const cx = x + w / 2;
	const apexY = y - topDisplace;
	const amp = Math.abs(topDisplace);

	const leftTop = x + r;
	const rightTop = x + w - r;
	const span = Math.max(rightTop - leftTop, 1);

	// Shoulder inset from the rounded corners — leave a short flat near radii
	// only when the rect is wide; otherwise deform edge-to-edge.
	const edgeFlat = clamp(span * (0.5 - halfRatio), 0, span * 0.12);
	const leftShoulder = leftTop + edgeFlat;
	const rightShoulder = rightTop - edgeFlat;
	const bell = Math.max(rightShoulder - leftShoulder, 1);

	// Horizontal tangents at shoulders (y) and apex (apexY) → G1 smooth crest.
	// Apex handle grows with amplitude so tall bulges stay rounded, not spiked.
	const shoulderHx = bell * 0.28;
	const apexHx = Math.max(bell * 0.32, amp * 0.55);

	const d = [
		`M ${f(leftTop)} ${f(y)}`,
		leftShoulder > leftTop + 0.5 ? `H ${f(leftShoulder)}` : "",
		// Left shoulder → apex (horizontal out, horizontal into crest)
		`C ${f(leftShoulder + shoulderHx)} ${f(y)} ${f(cx - apexHx)} ${f(apexY)} ${f(cx)} ${f(apexY)}`,
		// Apex → right shoulder
		`C ${f(cx + apexHx)} ${f(apexY)} ${f(rightShoulder - shoulderHx)} ${f(y)} ${f(rightShoulder)} ${f(y)}`,
		rightShoulder < rightTop - 0.5 ? `H ${f(rightTop)}` : "",
		// Top-right corner
		`C ${f(rightTop + KAPPA * r)} ${f(y)} ${f(x + w)} ${f(y + r - KAPPA * r)} ${f(x + w)} ${f(y + r)}`,
		`V ${f(y + h - r)}`,
		`C ${f(x + w)} ${f(y + h - r + KAPPA * r)} ${f(x + w - r + KAPPA * r)} ${f(y + h)} ${f(x + w - r)} ${f(y + h)}`,
		`H ${f(x + r)}`,
		`C ${f(x + r - KAPPA * r)} ${f(y + h)} ${f(x)} ${f(y + h - r + KAPPA * r)} ${f(x)} ${f(y + h - r)}`,
		`V ${f(y + r)}`,
		`C ${f(x)} ${f(y + r - KAPPA * r)} ${f(x + r - KAPPA * r)} ${f(y)} ${f(x + r)} ${f(y)}`,
		"Z",
	]
		.filter(Boolean)
		.join(" ");

	return { d, topDisplace };
}

/**
 * Build the gooey silhouette for a top panel `a` above bottom panel `b`.
 * Panels may overlap (negative face gap) — the bridge stays wide.
 */
export function gooeyPairPath(
	a: GooeyRect,
	b: GooeyRect,
	options: GooeyPathOptions = {},
): GooeyPathResult {
	const detachGap = options.detachGap ?? 28;
	const maxWaistRatio = options.maxWaistRatio ?? 0.92;
	const minWaist = options.minWaist ?? 10;
	const edgePad = options.edgePad ?? 0;

	const ar = clampRadius(a.r, a.w, a.h);
	const br = clampRadius(b.r, b.w, b.h);
	const aBottom = a.y + a.h;
	const bTop = b.y;
	const faceGap = bTop - aBottom;
	const seamY = (aBottom + bTop) / 2;

	if (faceGap >= detachGap) {
		return {
			d: `${roundedRectPath(a)} ${roundedRectPath(b)}`,
			connected: false,
			pinch: 1,
			waistWidth: 0,
			seamY,
		};
	}

	// Pinch: 0 while overlapping / touching, → 1 at detach.
	// Square the curve so the neck stays thick early, then tears late.
	const pinch = smootherstep(0, detachGap, Math.max(0, faceGap));
	const pinchLate = pinch * pinch;

	const cx = (a.x + a.w / 2 + b.x + b.w / 2) / 2;
	const maxWaist = Math.min(a.w, b.w) * maxWaistRatio;
	const waistWidth = lerp(maxWaist, minWaist, pinchLate);
	const halfWaist = waistWidth / 2;
	const leftW = cx - halfWaist;
	const rightW = cx + halfWaist;

	// Attachment x on each panel's facing edge — starts near full width,
	// pulls inward with pinch so the flare into the neck reads as stretch.
	const aPad = lerp(edgePad, (a.w - waistWidth) / 2, pinchLate);
	const bPad = lerp(edgePad, (b.w - waistWidth) / 2, pinchLate);
	const aLeft = a.x + Math.max(ar, aPad);
	const aRight = a.x + a.w - Math.max(ar, aPad);
	const bLeft = b.x + Math.max(br, bPad);
	const bRight = b.x + b.w - Math.max(br, bPad);

	// Vertical handles for the neck cubics. Longer handles = softer gooey.
	// As pinch grows, handles shorten so the thread looks taut before break.
	const span = Math.max(faceGap, 0.5);
	const handle = lerp(span * 0.55, span * 0.28, pinchLate);

	const d = [
		// --- top panel (A), clockwise, skip bottom edge ---
		`M ${f(a.x + ar)} ${f(a.y)}`,
		`H ${f(a.x + a.w - ar)}`,
		`C ${f(a.x + a.w - ar + KAPPA * ar)} ${f(a.y)} ${f(a.x + a.w)} ${f(a.y + ar - KAPPA * ar)} ${f(a.x + a.w)} ${f(a.y + ar)}`,
		`V ${f(aBottom - ar)}`,
		`C ${f(a.x + a.w)} ${f(aBottom - ar + KAPPA * ar)} ${f(a.x + a.w - ar + KAPPA * ar)} ${f(aBottom)} ${f(aRight)} ${f(aBottom)}`,

		// --- right neck: A bottom → waist → B top ---
		`C ${f(aRight)} ${f(aBottom + handle)} ${f(rightW)} ${f(seamY - handle)} ${f(rightW)} ${f(seamY)}`,
		`C ${f(rightW)} ${f(seamY + handle)} ${f(bRight)} ${f(bTop - handle)} ${f(bRight)} ${f(bTop)}`,

		// --- bottom panel (B) ---
		`C ${f(b.x + b.w - br + KAPPA * br)} ${f(bTop)} ${f(b.x + b.w)} ${f(bTop + br - KAPPA * br)} ${f(b.x + b.w)} ${f(bTop + br)}`,
		`V ${f(b.y + b.h - br)}`,
		`C ${f(b.x + b.w)} ${f(b.y + b.h - br + KAPPA * br)} ${f(b.x + b.w - br + KAPPA * br)} ${f(b.y + b.h)} ${f(b.x + b.w - br)} ${f(b.y + b.h)}`,
		`H ${f(b.x + br)}`,
		`C ${f(b.x + br - KAPPA * br)} ${f(b.y + b.h)} ${f(b.x)} ${f(b.y + b.h - br + KAPPA * br)} ${f(b.x)} ${f(b.y + b.h - br)}`,
		`V ${f(bTop + br)}`,
		`C ${f(b.x)} ${f(bTop + br - KAPPA * br)} ${f(b.x + br - KAPPA * br)} ${f(bTop)} ${f(bLeft)} ${f(bTop)}`,

		// --- left neck: B top → waist → A bottom ---
		`C ${f(bLeft)} ${f(bTop - handle)} ${f(leftW)} ${f(seamY + handle)} ${f(leftW)} ${f(seamY)}`,
		`C ${f(leftW)} ${f(seamY - handle)} ${f(aLeft)} ${f(aBottom + handle)} ${f(aLeft)} ${f(aBottom)}`,

		// --- finish top panel left side ---
		`C ${f(a.x + ar - KAPPA * ar)} ${f(aBottom)} ${f(a.x)} ${f(aBottom - ar + KAPPA * ar)} ${f(a.x)} ${f(aBottom - ar)}`,
		`V ${f(a.y + ar)}`,
		`C ${f(a.x)} ${f(a.y + ar - KAPPA * ar)} ${f(a.x + ar - KAPPA * ar)} ${f(a.y)} ${f(a.x + ar)} ${f(a.y)}`,
		"Z",
	].join(" ");

	return {
		d,
		connected: true,
		pinch: pinchLate,
		waistWidth,
		seamY,
	};
}
