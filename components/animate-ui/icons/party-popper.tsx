"use client";

import type { MotionProps, Variants } from "motion/react";
import { motion } from "motion/react";
import { forwardRef } from "react";

export interface PartyPopperIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface PartyPopperIconProps extends MotionProps {
	size?: number;
	className?: string;
}

const LINES_VARIANTS: Variants = {
	initial: {
		opacity: 1,
		pathLength: 1,
		scale: 1,
		translateX: 0,
		translateY: 0,
	},
	animate: {
		opacity: [0, 1],
		scale: [0.3, 0.8, 1, 1.1, 1],
		pathLength: [0, 0.5, 1],
		translateX: [-5, 0],
		translateY: [5, 0],
	},
	exit: {
		opacity: 1,
		pathLength: 1,
		scale: 1,
		translateX: 0,
		translateY: 0,
	},
};

const DOTS_VARIANTS: Variants = {
	initial: { opacity: 1, scale: 1, translateX: 0, translateY: 0 },
	animate: {
		opacity: [0, 1],
		translateX: [-5, 0],
		translateY: [5, 0],
		scale: [0.5, 0.8, 1, 1.1, 1],
	},
	exit: { opacity: 1, scale: 1, translateX: 0, translateY: 0 },
};

const POPPER_VARIANTS: Variants = {
	initial: { translateX: 0, translateY: 0 },
	animate: {
		translateX: [-1.5, 0],
		translateY: [1.5, 0],
	},
	exit: { translateX: 0, translateY: 0 },
};

const PartyPopperIcon = forwardRef<PartyPopperIconHandle, PartyPopperIconProps>(
	({ size = 28, ...props }, _ref) => {
		// const controls = useAnimation();
		// const isControlledRef = useRef(false);

		// useImperativeHandle(ref, () => {
		// 	isControlledRef.current = true;

		// 	return {
		// 		startAnimation: () => controls.start("animate"),
		// 		stopAnimation: () => controls.start("normal"),
		// 	};
		// });

		// const handleMouseEnter = useCallback(
		// 	(e: React.MouseEvent<HTMLDivElement>) => {
		// 		if (isControlledRef.current) {
		// 			onMouseEnter?.(e);
		// 		} else {
		// 			controls.start("animate");
		// 		}
		// 	},
		// 	[controls, onMouseEnter],
		// );

		// const handleMouseLeave = useCallback(
		// 	(e: React.MouseEvent<HTMLDivElement>) => {
		// 		if (isControlledRef.current) {
		// 			onMouseLeave?.(e);
		// 		} else {
		// 			controls.start("normal");
		// 		}
		// 	},
		// 	[controls, onMouseLeave],
		// );

		return (
			<motion.svg
				fill="none"
				height={size}
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				style={{ overflow: "visible" }}
				viewBox="0 0 24 24"
				width={size}
				xmlns="http://www.w3.org/2000/svg"
				{...props}
			>
				<title>Party popper icon</title>
				<motion.path
					animate="animate"
					initial="initial"
					exit="exit"
					d="M5.8 11.3 2 22l10.7-3.79"
					variants={POPPER_VARIANTS}
					transition={{
						duration: 0.7,
						repeat: Infinity,
						repeatType: "mirror",
						repeatDelay: 0.2,
					}}
				/>
				<motion.path
					animate="animate"
					initial="initial"
					exit="exit"
					d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"
					variants={POPPER_VARIANTS}
					transition={{
						duration: 0.7,
						repeat: Infinity,
						repeatType: "mirror",
						repeatDelay: 0.2,
					}}
				/>
				<motion.path
					animate="animate"
					initial="initial"
					exit="exit"
					d="M4 3h.01"
					variants={DOTS_VARIANTS}
					transition={{
						duration: 0.7,
						repeat: Infinity,
						repeatType: "mirror",
						repeatDelay: 0.2,
					}}
				/>
				<motion.path
					animate="animate"
					initial="initial"
					exit="exit"
					d="M22 8h.01"
					variants={DOTS_VARIANTS}
					transition={{
						duration: 0.7,
						repeat: Infinity,
						repeatType: "mirror",
						repeatDelay: 0.2,
					}}
				/>
				<motion.path
					animate="animate"
					initial="initial"
					exit="exit"
					d="M15 2h.01"
					variants={DOTS_VARIANTS}
					transition={{
						duration: 0.7,
						repeat: Infinity,
						repeatType: "mirror",
						repeatDelay: 0.2,
					}}
				/>
				<motion.path
					animate="animate"
					initial="initial"
					exit="exit"
					d="M22 20h.01"
					variants={DOTS_VARIANTS}
					transition={{
						duration: 0.7,
						repeat: Infinity,
						repeatType: "mirror",
						repeatDelay: 0.2,
					}}
				/>
				<motion.path
					animate="animate"
					initial="initial"
					exit="exit"
					d="m14 10 1.21-1.06c0.16-0.84 0.9-1.44 1.76-1.44h0.38c0.88 0 1.55-0.77 1.45-1.63a2.9 2.9 0 0 1 1.96-3.12L22 2"
					variants={LINES_VARIANTS}
					transition={{
						duration: 0.7,
						repeat: Infinity,
						repeatType: "mirror",
						repeatDelay: 0.2,
					}}
				/>
				<motion.path
					animate="animate"
					initial="initial"
					exit="exit"
					d="M17 15h0.77c0.71 0 1.32-0.52 1.43-1.22c0.16-0.91 1.12-1.45 1.98-1.11L22 13"
					variants={LINES_VARIANTS}
					transition={{
						duration: 0.7,
						repeat: Infinity,
						repeatType: "mirror",
						repeatDelay: 0.2,
					}}
				/>
				<motion.path
					animate="animate"
					initial="initial"
					exit="exit"
					d="M9 7V6.23c0-0.71 0.52-1.33 1.22-1.43c0.91-0.16 1.45-1.12 1.11-1.98L11 2"
					variants={LINES_VARIANTS}
					transition={{
						duration: 0.7,
						repeat: Infinity,
						repeatType: "mirror",
						repeatDelay: 0.2,
					}}
				/>
			</motion.svg>
		);
	},
);

PartyPopperIcon.displayName = "PartyPopperIcon";

export { PartyPopperIcon };
