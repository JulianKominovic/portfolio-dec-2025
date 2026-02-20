"use client";

import type { MotionProps, Variants } from "motion/react";
import { motion } from "motion/react";
import { forwardRef } from "react";

export interface HandCoinsIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface HandCoinsIconProps extends MotionProps {
	size?: number;
	className?: string;
}

const CIRCLE_VARIANTS: Variants = {
	initial: {
		translateY: 0,
		opacity: 1,
	},
	animate: {
		opacity: [0, 1],
		translateY: [-20, 0],
	},
	exit: {
		translateY: 0,
		opacity: 1,
	},
};

const SECOND_CIRCLE_VARIANTS: Variants = {
	initial: {
		translateY: 0,
		opacity: 1,
	},
	animate: {
		opacity: [0, 1],
		translateY: [-20, 0],
	},
	exit: {
		translateY: 0,
		opacity: 1,
	},
};

const HandCoinsIcon = forwardRef<HandCoinsIconHandle, HandCoinsIconProps>(
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
				<title>Hand coins icon</title>
				<path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
				<path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
				<path d="m2 16 6 6" />
				<motion.circle
					animate="animate"
					initial="initial"
					exit="exit"
					cx="16"
					cy="9"
					r="2.9"
					variants={CIRCLE_VARIANTS}
					transition={{
						duration: 1,
						repeat: Infinity,
						repeatType: "mirror",
						repeatDelay: 0.2,
					}}
				/>
				<motion.circle
					animate="animate"
					initial="initial"
					exit="exit"
					cx="6"
					cy="5"
					r="3"
					variants={SECOND_CIRCLE_VARIANTS}
					transition={{
						duration: 1,
						repeat: Infinity,
						repeatType: "mirror",
						repeatDelay: 0.2,
					}}
				/>
			</motion.svg>
		);
	},
);

HandCoinsIcon.displayName = "HandCoinsIcon";

export { HandCoinsIcon };
