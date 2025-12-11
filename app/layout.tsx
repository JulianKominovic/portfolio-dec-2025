import "./global.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import clsx from "clsx";
import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";
// import { GeistSans } from "geist/font/sans";
// import { Young_Serif } from "next/font/google";
import { Alata, Cal_Sans } from "next/font/google";
import Footer from "./components/footer";
import { baseUrl } from "./sitemap";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	title: {
		default: "Next.js Portfolio Starter",
		template: "%s | Next.js Portfolio Starter",
	},
	description: "This is my portfolio.",
	openGraph: {
		title: "My Portfolio",
		description: "This is my portfolio.",
		url: baseUrl,
		siteName: "My Portfolio",
		locale: "en_US",
		type: "website",
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
