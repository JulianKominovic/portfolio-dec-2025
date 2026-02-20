import { formatDate, getBlogPosts } from "app/blog/utils";
import Link from "next/link";

export function BlogPosts() {
	const allBlogs = getBlogPosts();
	return (
		<ul className="list-none">
			{allBlogs
				.filter((post) => !post.metadata.draft)
				.sort((a, b) => {
					if (
						new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
					) {
						return -1;
					}
					return 1;
				})
				.map((post) => (
					<li key={post.slug} className="mb-16">
						<Link
							key={post.slug}
							className="flex flex-col space-y-1 mb-4"
							href={`/blog/${post.slug}`}
						>
							<h3 className="text-neutral-900 tracking-tight text-xl font-bold">
								{post.metadata.title}
							</h3>
							<p className="text-neutral-600">{post.metadata.summary}</p>

							<time
								dateTime={post.metadata.publishedAt}
								className="text-neutral-600 tabular-nums"
							>
								{formatDate(post.metadata.publishedAt, false)}
							</time>
						</Link>
					</li>
				))}
		</ul>
	);
}
