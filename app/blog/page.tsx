import { BlogPosts } from "app/components/posts";
import { createMetadata } from "@/lib/utils";

export const metadata = createMetadata({
	title: "Blog posts by Julian Kominovic",
	description:
		"Read my blog posts about frontend development, performance optimization, and other topics.",
	keywords: [
		"Blog",
		"Posts",
		"Frontend development",
		"Performance optimization",
		"Javascript",
		"Typescript",
		"React",
		"Next.js",
		"TailwindCSS",
		"HTML",
		"CSS",
		"SQL",
		"NoSQL",
		"Database",
		"API",
		"REST",
		"GraphQL",
		"WebSocket",
		"Server-side rendering",
		"Client-side rendering",
		"Static site generation",
		"Dynamic site generation",
		"Serverless",
		"Cloudflare",
		"Vercel",
		"AWS",
		"GCP",
		"Azure",
		"Docker",
	],
});

export default function Page() {
	return (
		<main className="mx-auto max-w-3xl px-4 pt-20">
			<h1 className="font-serif text-5xl font-bold leading-loose mb-8">
				Blog posts
			</h1>
			<BlogPosts />
		</main>
	);
}
