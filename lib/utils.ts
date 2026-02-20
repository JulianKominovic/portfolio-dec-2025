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

export function playClickSound() {
	const AudioContextClass =
		window.AudioContext ||
		(window as typeof window & { webkitAudioContext: typeof AudioContext })
			.webkitAudioContext;
	const audioContext = new AudioContextClass();
	const oscillator = audioContext.createOscillator();
	const gainNode = audioContext.createGain();

	oscillator.connect(gainNode);
	gainNode.connect(audioContext.destination);

	// Configuración para un click más percusivo
	oscillator.frequency.value = 300; // Frecuencia más alta para más "golpe"
	oscillator.type = "sine";

	// Envelope más agresivo para simular un click con golpe
	const now = audioContext.currentTime;
	gainNode.gain.setValueAtTime(0.3, now); // Volumen inicial más alto
	gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.03); // Decay más rápido y corto

	oscillator.start(now);
	oscillator.stop(now + 0.03); // Duración más corta (30ms) para ser más percusivo
}

export function playDisabledClickSound() {
	const AudioContextClass =
		window.AudioContext ||
		(window as typeof window & { webkitAudioContext: typeof AudioContext })
			.webkitAudioContext;
	const audioContext = new AudioContextClass();

	// Primer tono (más alto)
	const osc1 = audioContext.createOscillator();
	const gain1 = audioContext.createGain();
	osc1.connect(gain1);
	gain1.connect(audioContext.destination);

	osc1.frequency.value = 300; // Tono grave
	osc1.type = "sine";

	const now = audioContext.currentTime;
	gain1.gain.setValueAtTime(0.2, now);
	gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

	osc1.start(now);
	osc1.stop(now + 0.04);

	// Segundo tono (más bajo) - efecto de "denegado"
	const osc2 = audioContext.createOscillator();
	const gain2 = audioContext.createGain();
	osc2.connect(gain2);
	gain2.connect(audioContext.destination);

	osc2.frequency.value = 150; // Tono más grave aún
	osc2.type = "sine";

	gain2.gain.setValueAtTime(0, now + 0.03);
	gain2.gain.setValueAtTime(0.2, now + 0.04);
	gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

	osc2.start(now + 0.03);
	osc2.stop(now + 0.08);
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
