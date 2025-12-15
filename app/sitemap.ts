import { getBlogPosts } from "app/blog/utils";
import { baseUrl, routes } from "./config";

export async function getBlogPostsSitemap() {
	const blogs = getBlogPosts().map((post) => ({
		url: `${baseUrl}/blog/${post.slug}`,
		lastModified: post.metadata.publishedAt,
		title: post.metadata.title,
	}));
	return blogs;
}
export default async function sitemap() {
	const blogs = await getBlogPostsSitemap();

	return [...routes, ...blogs];
}
