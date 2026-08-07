import { getBlogPosts } from "app/blog/utils";
import { baseUrl, routes } from "./config";

export function getBlogPostsSitemap() {
	return getBlogPosts()
		.filter((post) => !post.metadata.draft)
		.map((post) => ({
			url: `${baseUrl}/blog/${post.slug}`,
			title: post.metadata.title,
			lastModified: post.metadata.publishedAt,
		}));
}
export default function sitemap() {
	const blogs = getBlogPostsSitemap().map(({ title, ...post }) => ({
		...post,
		changeFrequency: "monthly" as const,
		priority: 0.7,
	}));

	const routesSitemap = routes.map(({ title: _title, ...route }) => ({
		...route,
		changeFrequency: "monthly" as const,
		priority: route.url === baseUrl ? 1 : 0.5,
	}));

	return [...routesSitemap, ...blogs];
}