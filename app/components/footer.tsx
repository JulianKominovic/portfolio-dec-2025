import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { PROJECTS, SOCIAL_LINKS } from "../data/bio";
import { baseUrl, getBlogPostsSitemap, routes, subroutes } from "../sitemap";
import GithubIcon from "./icons/github";
import LinkedinIcon from "./icons/linkedin";
import XIcon from "./icons/x";

const linksClasses =
	"block mb-2 text-neutral-600 hover:text-black transition-colors";

export default async function Footer() {
	const blogposts = await getBlogPostsSitemap();
	return (
		<footer className="relative overflow-hidden bg-neutral-50 border-t border-neutral-200 mt-24 pt-12 pb-24">
			{/* Background blobs */}
			<div className="absolute top-0 left-0 size-2/3 bg-blue-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
			<div className="absolute bottom-0 right-0 size-2/5 bg-purple-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

			<nav className="max-w-5xl mx-auto px-4 relative z-10">
				<div
					className="flex flex-wrap md:justify-center gap-x-24 gap-y-8"
					// className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
				>
					{/* Navigation */}
					<div>
						<h3 className="font-semibold text-neutral-900 mb-4">Navigation</h3>
						<ul className="max-w-[40ch] overflow-x-hidden">
							{routes.map((item) => {
								if (item.url === baseUrl) {
									return (
										<Fragment key={item.url + item.title}>
											<li className={linksClasses}>
												<Link href={item.url}>{item.title}</Link>
											</li>
											<li className={"pl-4 mb-4"}>
												<ul>
													{Object.entries(subroutes.home).map(
														([key, value]) => (
															<li
																key={`${key}home`}
																className={cn(
																	linksClasses,
																	"text-neutral-400 mb-2",
																)}
															>
																<Link href={value.url}>{value.title}</Link>
															</li>
														),
													)}
												</ul>
											</li>
										</Fragment>
									);
								}
								if (item.url.startsWith(`${baseUrl}/blog`)) {
									return (
										<Fragment key={item.url + item.title}>
											<li className={linksClasses}>
												<Link href={item.url}>{item.title}</Link>
											</li>
											<li className={"pl-4 mb-4"}>
												<ul>
													{blogposts.map(({ url, title, lastModified }) => (
														<li
															key={url}
															className={cn(
																linksClasses,
																"text-neutral-400 mb-4",
															)}
														>
															<Link href={url}>
																{title}
																<time
																	dateTime={lastModified}
																	className="block text-xs text-neutral-400"
																>
																	{new Date(lastModified).toLocaleDateString(
																		undefined,
																		{
																			month: "long",
																			day: "numeric",
																			year: "numeric",
																		},
																	)}
																</time>
															</Link>
														</li>
													))}
												</ul>
											</li>
										</Fragment>
									);
								}
								return (
									<li key={item.url} className={linksClasses}>
										<Link href={item.url}>{item.title}</Link>
									</li>
								);
							})}
						</ul>
					</div>

					{/* Projects */}
					<div>
						<h3 className="font-semibold text-neutral-900 mb-4">Projects</h3>
						<ul>
							{PROJECTS.map((project) => (
								<li key={project.title} className="mb-4">
									<a
										href={project.url}
										target="_blank"
										rel="noopener noreferrer"
										className={cn(linksClasses, "flex items-center gap-2")}
									>
										<Image
											unoptimized
											src={project.logo}
											alt={project.title}
											width={24}
											height={24}
											className="size-6 object-cover rounded-full"
										/>
										{project.title}{" "}
										<p
											className={cn(
												" font-bold text-xs font-serif px-2 leading-relaxed rounded-md flex items-center justify-center w-fit",
												project.status === "In progress" &&
													"text-yellow-500 bg-yellow-500/10",
												project.status === "Online" &&
													"text-green-500 bg-green-500/10",
												project.status === "Deprecated" &&
													"text-neutral-400 bg-neutral-400/10",
											)}
										>
											{project.status}
										</p>
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Blog posts
					<div>
						<h3 className="font-semibold text-neutral-900 mb-4">Posts</h3>
						<ul>
							{blogposts.map((item) => (
								<li key={item.url} className={linksClasses}>
									<Link href={item.url}>{item.title}</Link>
								</li>
							))}
						</ul>
					</div> */}
				</div>
			</nav>
			<div className="max-w-5xl mx-auto px-4 relative z-10 mt-12 border-t border-neutral-200 pt-4">
				<p className="text-center text-neutral-400 mb-4">
					Julian Kominovic - Frontend developer
				</p>
				<ul className="flex items-center justify-center gap-4">
					{Object.entries(SOCIAL_LINKS).map(([key, value]) => {
						const Icon =
							key === "github"
								? GithubIcon
								: key === "linkedin"
									? LinkedinIcon
									: XIcon;
						return (
							<li key={key}>
								<a
									href={value.url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-neutral-400 hover:text-black transition-colors"
								>
									<Icon className="size-5" />
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		</footer>
	);
}
