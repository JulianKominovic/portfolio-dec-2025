"use client";
import type React from "react";
import { useEffect, useState } from "react";

const OnlyClientSide = ({ children }: { children: React.ReactNode }) => {
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);
	if (mounted) return children;
	return null;
};

export default OnlyClientSide;
