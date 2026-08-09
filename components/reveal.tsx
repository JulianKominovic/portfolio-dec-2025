"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { useIsInView } from "@/hooks/use-is-in-view";

export default function Reveal({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	const reduced = useReducedMotion();
	const viewRef = useRef<HTMLDivElement>(null);
	const { ref, isInView } = useIsInView<HTMLDivElement>(viewRef, {
		inViewOnce: true,
		inViewMargin: "-100px",
	});

	if (reduced) {
		return (
			<div ref={ref} className={className}>
				{children}
			</div>
		);
	}

	return (
		<motion.div
			ref={ref}
			className={className}
			initial={{ opacity: 0, y: 16 }}
			animate={isInView ? { opacity: 1, y: 0 } : undefined}
			transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
		>
			{children}
		</motion.div>
	);
}
