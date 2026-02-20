"use client";

import type { MotionProps, Variants } from "motion/react";
import { motion } from "motion/react";
import { forwardRef } from "react";

export interface ReceiptIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface ReceiptIconProps extends MotionProps {
	size?: number;
	className?: string;
}

const RECEIPT_VARIANTS: Variants = {
	initial: {
		scale: 1,
		pathLength: 0,
	},
	animate: {
		pathLength: [0, 1],
	},
	exit: {
		pathLength: 0,
	},
};

const FIRST_HORIZONTAL_LINE_VARIANTS: Variants = {
	initial: {
		pathLength: 0,
	},
	animate: {
		pathLength: [0, 1],
	},
	exit: {
		pathLength: 0,
	},
};

const ReceiptIcon = forwardRef<ReceiptIconHandle, ReceiptIconProps>(
	({ size = 28, ...props }, _ref) => {
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
				<title>Receipt icon</title>
				{/* Animated wavy border */}
				<motion.path
					animate="animate"
					initial="initial"
					exit="exit"
					d="M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z"
					variants={RECEIPT_VARIANTS}
					transition={{
						duration: 2,
					}}
				/>
				{/* Static horizontal lines (text) */}
				<motion.path
					d="M14 8H8"
					initial="initial"
					animate="animate"
					exit="exit"
					variants={FIRST_HORIZONTAL_LINE_VARIANTS}
					transition={{
						duration: 2,
					}}
				/>
				<motion.path
					d="M16 12H8"
					initial="initial"
					animate="animate"
					exit="exit"
					variants={FIRST_HORIZONTAL_LINE_VARIANTS}
					transition={{
						duration: 2,
						delay: 1,
					}}
				/>
				<motion.path
					d="M13 16H8"
					initial="initial"
					animate="animate"
					exit="exit"
					variants={FIRST_HORIZONTAL_LINE_VARIANTS}
					transition={{
						duration: 2,
						delay: 2,
					}}
				/>
			</motion.svg>
		);
	},
);

ReceiptIcon.displayName = "ReceiptIcon";

export { ReceiptIcon };
