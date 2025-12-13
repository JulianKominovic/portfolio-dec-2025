import { getBlogPosts } from "app/blog/utils";

export const baseUrl = "https://jkominovic.dev";

export const subroutes = {
	home: {
		hero: {
			url: `${baseUrl}/#hero`,
			title: "Hero",
		},
		projects: {
			url: `${baseUrl}/#projects`,
			title: "Projects",
		},
	},
};

export const routes = [
	{
		url: baseUrl,
		lastModified: new Date().toISOString().split("T")[0],
		title: "Home",
	},
	{
		url: `${baseUrl}/blog`,
		lastModified: new Date().toISOString().split("T")[0],
		title: "Blog",
	},
];

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
