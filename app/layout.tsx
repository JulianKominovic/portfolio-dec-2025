import "./global.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import clsx from "clsx";
import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";
// import { GeistSans } from "geist/font/sans";
// import { Young_Serif } from "next/font/google";
import { Alata } from "next/font/google";
import Footer from "./components/footer";
import { baseUrl } from "./sitemap";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	title: {
		default: "Julian Kominovic - Frontend developer",
		template: "%s | Julian Kominovic - Frontend developer",
	},
	keywords: [
		"Julian",
		"Kominovic",
		"Frontend developer",
		"Web developer",
		"Fintech",
		"Argentina",
		"Buenos Aires",
		"Smart notes",
		"Notes",
		"Bookmarks",
		"Takes",
		"Resources",
		"Web development",
		"Frontend",
		"Backend",
		"React",
		"Next.js",
		"TailwindCSS",
		"Javascript",
		"Typescript",
	],
	description:
		"Frontend developer based in Buenos Aires, Argentina with more than 4 years of experience in fintech products. I enjoy creating development tools to make developers' life easier.",
	openGraph: {
		title: "Julian Kominovic - Frontend developer",
		description:
			"Frontend developer based in Buenos Aires, Argentina with more than 4 years of experience in fintech products. I enjoy creating development tools to make developers' life easier.",
		url: baseUrl,
		siteName: "Julian Kominovic - Frontend developer",
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Julian Kominovic - Frontend developer",
		description:
			"Frontend developer based in Buenos Aires, Argentina with more than 4 years of experience in fintech products. I enjoy creating development tools to make developers' life easier.",
		images: [
			{
				url: "/og/og.png",
			},
		],
		creator: "@juliankominovic",
		creatorId: "@juliankominovic",
	},
	icons: {
		icon: [
			{
				rel: "apple-touch-icon",
				url: "/favicon/apple-icon-180x180.png",
				sizes: "180x180",
			},
			{
				rel: "icon",
				url: "/favicon/favicon-32x32.png",
				sizes: "32x32",
				type: "image/png",
			},
			{
				rel: "icon",
				url: "/favicon/favicon-16x16.png",
				sizes: "16x16",
				type: "image/png",
			},
			{
				rel: "icon",
				url: "/favicon/favicon.ico",
			},
		],
	},
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
// const youngSerif = Young_Serif({
// 	subsets: ["latin"],
// 	weight: ["400"],
// 	variable: "--font-young-serif",
// });

const alata = Alata({
	subsets: ["latin"],
	weight: ["400"],
	variable: "--font-alata",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			className={clsx(
				"bg-white text-black",
				// GeistSans.variable,
				GeistMono.variable,
				alata.variable,
				// youngSerif.variable
			)}
			lang="en"
		>
			<body className="antialiased">
				{children}
				<Footer />
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
