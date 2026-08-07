import { BlogPosts } from "@/components/posts";
import { createMetadata } from "@/lib/utils";
import { getBlogPosts } from "./utils";

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
	path: "/blog",
});

export default function Page() {
	const posts = getBlogPosts()
		.filter((post) => !post.metadata.draft)
		.sort(
			(a, b) =>
				new Date(b.metadata.publishedAt).getTime() -
				new Date(a.metadata.publishedAt).getTime(),
		);

	return (
		<main className="mx-auto max-w-3xl px-4 pt-20">
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: sh
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "ItemList",
						name: "Blog posts",
						itemListElement: posts.map((post, index) => ({
							"@type": "BlogPosting",
							position: index + 1,
							name: post.metadata.title,
							url: `/blog/${post.slug}`,
							datePublished: post.metadata.publishedAt,
						})),
					}),
				}}
			/>
			<h1 className="font-sans text-5xl font-bold leading-loose mb-8">
				Blog posts
			</h1>
			<BlogPosts />
		</main>
	);
}
