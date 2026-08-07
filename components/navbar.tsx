import { getBlogPostsSitemap } from "../app/sitemap";
import NavbarClient from "./navbar-client";

export default async function Navbar() {
	const blogPosts = await getBlogPostsSitemap();
	return (
		<NavbarClient
			blogPosts={blogPosts.map(({ url, title }) => ({ url, title }))}
		/>
	);
}
