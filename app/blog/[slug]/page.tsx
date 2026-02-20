import { formatDate, getBlogPosts } from "app/blog/utils";
import { baseUrl } from "app/config";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import OnlyClientSide from "@/components/OnlyClientSide";

export async function generateStaticParams() {
	const posts = getBlogPosts();

	return posts.map((post) => ({
		slug: post.slug,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const awaitedParams = await params;
	const post = getBlogPosts().find((post) => post.slug === awaitedParams.slug);
	if (!post) {
		return;
	}

	const {
		title,
		publishedAt: publishedTime,
		summary: description,
		image,
	} = post.metadata;
	const ogImage = image
		? image
		: `${baseUrl}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "article",
			publishedTime,
			url: `${baseUrl}/blog/${post.slug}`,
			images: [
				{
					url: ogImage,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImage],
		},
	};
}

export default async function Blog({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const awaitedParams = await params;
	const post = getBlogPosts().find((post) => post.slug === awaitedParams.slug);
	if (!post || post?.metadata?.draft) {
		notFound();
	}

	return (
		<article className="prose prose-h2:mt-16 prose-h3:mt-12 prose-h4:mt-10 prose-h5:mt-8 prose-h6:mt-6 prose-p:mb-8 prose-li:mb-6 mx-auto px-4 pt-20">
			<Link
				href="/blog"
				className="mb-8! w-fit px-4 h-12 rounded-full shadow-border bg-muted flex items-center gap-2 text-muted-foreground no-underline! active:scale-97 transition-[transform,colors] hover:text-foreground hover:bg-neutral-50 duration-150"
			>
				<ArrowLeftIcon size={18} /> Go back
			</Link>
			<script
				type="application/ld+json"
				suppressHydrationWarning
				// biome-ignore lint/security/noDangerouslySetInnerHtml: sh
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "BlogPosting",
						headline: post.metadata.title,
						datePublished: post.metadata.publishedAt,
						dateModified: post.metadata.publishedAt,
						description: post.metadata.summary,
						image: post.metadata.image
							? `${baseUrl}${post.metadata.image}`
							: `/og?title=${encodeURIComponent(post.metadata.title)}`,
						url: `${baseUrl}/blog/${post.slug}`,
						author: {
							"@type": "Person",
							name: "Julian Kominovic",
						},
					}),
				}}
			/>
			<h1 className="title font-serif text-5xl font-bold leading-tight mb-0">
				{post.metadata.title}
			</h1>
			<div className="flex justify-between items-center mb-8 text-sm">
				<OnlyClientSide>
					<p className="text-sm text-neutral-600">
						{formatDate(post.metadata.publishedAt)}
					</p>
				</OnlyClientSide>
			</div>
			<CustomMDX source={post.content} />
		</article>
	);
}
