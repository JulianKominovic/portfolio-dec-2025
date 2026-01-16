import { type ClassValue, clsx } from "clsx";
import type { Metadata } from "next";
import { twMerge } from "tailwind-merge";
import { baseUrl } from "@/app/config";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export function detectMacOSOrIOS() {
	const ua = navigator.userAgent;
	const platform = navigator.platform;

	const isMacOS = platform.toUpperCase().includes("MAC");
	const isIOS =
		/iPad|iPhone|iPod/.test(platform) ||
		(ua.includes("Mac") && "ontouchend" in document);

	return isIOS || isMacOS;
}

export function createMetadata({
	title = "Julian Kominovic - Frontend developer",
	description = "Frontend developer based in Buenos Aires, Argentina with almost 3 years of experience in fintech products. I enjoy creating development tools to make developers' life easier.",
	ogImage = "https://jkominovic.dev/og/og.png",
	keywords = [
		"React",
		"Next.js",
		"TailwindCSS",
		"Javascript",
		"Typescript",
		"Development tools",
	],
}: {
	title?: string;
	description?: string;
	ogImage?: string;
	keywords?: string[];
}): Metadata {
	return {
		metadataBase: new URL(baseUrl),
		title,
		description,
		openGraph: {
			images: ogImage,
			type: "website",
			title,
			description,
			url: baseUrl,
		},
		twitter: {
			title,
			description,
			images: ogImage,
			card: "summary_large_image",
			creatorId: "@juliankominovic",
			creator: "@juliankominovic",
		},
		icons: [
			{
				url: "/favicon/apple-icon-180x180.png",
				sizes: "180x180",
				rel: "apple-touch-icon",
			},
			{
				url: "/favicon/favicon-32x32.png",
				sizes: "32x32",
				rel: "icon",
				type: "image/png",
			},
			{
				url: "/favicon/favicon-16x16.png",
				sizes: "16x16",
				rel: "icon",
				type: "image/png",
			},
			{
				url: "/favicon/favicon.ico",
				rel: "shortcut icon",
			},
			{
				url: "/favicon/favicon.ico",
				rel: "icon",
			},
		],
		creator: "Julian Kominovic",
		keywords: [
			...Array.from(
				new Set([
					"Julian",
					"Kominovic",
					"Frontend developer",
					"Web developer",
					"Fintech",
					"Argentina",
					"Buenos Aires",
					...keywords,
				]),
			),
		],
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
	};
}
