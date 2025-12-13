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
			<body className="antialiased overflow-x-hidden relative">
				{/* <img
					src="/1135b45b-6349-4f93-878c-0f07c2308454.jpg"
					alt=""
					className="absolute top-[120vh] left-0 w-full h-[1000px] object-cover -z-10 blur-[400px] opacity-5"
				/> */}
				{/* <img
					src="/3ac8d930-5345-46af-a0d4-3977ce824074.jpg"
					src="/3ac8d930-5345-46af-a0d4-3977ce824074.jpg"
					alt=""
					className="absolute top-full left-0 w-full h-full object-cover -z-10 blur-[400px] opacity-20"
				/> */}
				{children}
				<Footer />
				{/* <svg
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
					id="visual"
					viewBox="0 0 900 600"
					width="900"
					height="600"
					version="1.1"
					className="absolute bottom-0 left-0 w-full h-screen -z-10 blur-[100px] opacity-20"
				>
					<title>Background blobs</title>
					<g fill="#715DF2">
						<circle r="113" cx="247" cy="360" />
						<circle r="36" cx="378" cy="151" />
						<circle r="69" cx="755" cy="428" />
						<circle r="106" cx="636" cy="205" />
						<circle r="44" cx="534" cy="479" />
					</g>
				</svg> */}
				{/* Background blobs */}
				{/* <div className="absolute bottom-0 left-0 w-full h-screen">
					<div className="absolute bottom-0 left-0 size-2/3 bg-blue-400/10 rounded-[50%] blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
					<div className="absolute bottom-0 right-0 size-2/5 bg-purple-400/10 rounded-[50%] blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
				</div> */}
				{/* <svg
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
					id="visual"
					viewBox="0 0 900 600"
					width="900"
					height="600"
					version="1.1"
					aria-label="Background blobs"
				>
					<title>Background blobs</title>
					<g transform="translate(900, 0)">
						<path
							d="M0 324.5C-26 314.3 -51.9 304.1 -80 298.5C-108 292.9 -138.2 291.9 -159.5 276.3C-180.8 260.6 -193.3 230.4 -206.5 206.5C-219.6 182.6 -233.5 165 -253.7 146.5C-274 128 -300.6 108.6 -313.4 84C-326.3 59.4 -325.4 29.7 -324.5 0L0 0Z"
							fill="#18223c"
						/>
						<path
							d="M0 259.6C-20.8 251.4 -41.5 243.3 -64 238.8C-86.4 234.3 -110.5 233.5 -127.6 221C-144.7 208.5 -154.6 184.3 -165.2 165.2C-175.7 146.1 -186.8 132 -203 117.2C-219.2 102.4 -240.5 86.8 -250.8 67.2C-261 47.5 -260.3 23.8 -259.6 0L0 0Z"
							fill="#683a67"
						/>
						<path
							d="M0 194.7C-15.6 188.6 -31.2 182.4 -48 179.1C-64.8 175.7 -82.9 175.1 -95.7 165.8C-108.5 156.4 -116 138.2 -123.9 123.9C-131.8 109.5 -140.1 99 -152.2 87.9C-164.4 76.8 -180.4 65.1 -188.1 50.4C-195.8 35.6 -195.2 17.8 -194.7 0L0 0Z"
							fill="#c0526a"
						/>
						<path
							d="M0 129.8C-10.4 125.7 -20.8 121.6 -32 119.4C-43.2 117.1 -55.3 116.8 -63.8 110.5C-72.3 104.3 -77.3 92.2 -82.6 82.6C-87.9 73 -93.4 66 -101.5 58.6C-109.6 51.2 -120.2 43.4 -125.4 33.6C-130.5 23.8 -130.2 11.9 -129.8 0L0 0Z"
							fill="#f6884d"
						/>
						<path
							d="M0 64.9C-5.2 62.9 -10.4 60.8 -16 59.7C-21.6 58.6 -27.6 58.4 -31.9 55.3C-36.2 52.1 -38.7 46.1 -41.3 41.3C-43.9 36.5 -46.7 33 -50.7 29.3C-54.8 25.6 -60.1 21.7 -62.7 16.8C-65.3 11.9 -65.1 5.9 -64.9 0L0 0Z"
							fill="#fbae3c"
						/>
					</g>
					<g transform="translate(0, 600)">
						<path
							d="M0 -324.5C30.3 -325.8 60.7 -327.1 84 -313.4C107.3 -299.8 123.5 -271.1 148.5 -257.2C173.5 -243.3 207.1 -244 227.7 -227.7C248.3 -211.3 255.8 -177.9 258.1 -149C260.3 -120.1 257.4 -95.8 267.6 -71.7C277.8 -47.6 301.1 -23.8 324.5 0L0 0Z"
							fill="#18223c"
						/>
						<path
							d="M0 -259.6C24.3 -260.6 48.5 -261.7 67.2 -250.8C85.8 -239.8 98.8 -216.9 118.8 -205.8C138.8 -194.6 165.7 -195.2 182.2 -182.2C198.6 -169.1 204.6 -142.3 206.5 -119.2C208.3 -96.1 205.9 -76.6 214 -57.4C222.2 -38.1 240.9 -19 259.6 0L0 0Z"
							fill="#683a67"
						/>
						<path
							d="M0 -194.7C18.2 -195.5 36.4 -196.3 50.4 -188.1C64.4 -179.9 74.1 -162.7 89.1 -154.3C104.1 -146 124.3 -146.4 136.6 -136.6C149 -126.8 153.5 -106.7 154.8 -89.4C156.2 -72.1 154.4 -57.5 160.5 -43C166.7 -28.6 180.7 -14.3 194.7 0L0 0Z"
							fill="#c0526a"
						/>
						<path
							d="M0 -129.8C12.1 -130.3 24.3 -130.8 33.6 -125.4C42.9 -119.9 49.4 -108.5 59.4 -102.9C69.4 -97.3 82.8 -97.6 91.1 -91.1C99.3 -84.5 102.3 -71.2 103.2 -59.6C104.1 -48 102.9 -38.3 107 -28.7C111.1 -19 120.5 -9.5 129.8 0L0 0Z"
							fill="#f6884d"
						/>
						<path
							d="M0 -64.9C6.1 -65.2 12.1 -65.4 16.8 -62.7C21.5 -60 24.7 -54.2 29.7 -51.4C34.7 -48.7 41.4 -48.8 45.5 -45.5C49.7 -42.3 51.2 -35.6 51.6 -29.8C52.1 -24 51.5 -19.2 53.5 -14.3C55.6 -9.5 60.2 -4.8 64.9 0L0 0Z"
							fill="#fbae3c"
						/>
					</g>
				</svg> */}
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
