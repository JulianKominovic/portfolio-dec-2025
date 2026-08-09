import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Reveal from "@/components/reveal";
import ArgentinaFlag from "@/components/ui/icons/argentina-flag";
import GithubIcon from "@/components/ui/icons/github";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ZoomeableChildren from "@/components/zoomeable-image";
import { cn } from "@/lib/utils";
import LinkedinIcon from "../components/ui/icons/linkedin";
import XIcon from "../components/ui/icons/x";
import buenosairesmini from "./assets/buenos-aires-mini.png";
import profile from "./assets/profile.jpeg";
import { CURRENT_ROLE, PROJECTS } from "./data/bio";

export default function Page() {
	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: sh
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@graph": [
							{
								"@type": "WebSite",
								name: "Julian Kominovic · Frontend Developer",
								url: "https://jkominovic.dev",
							},
							{
								"@type": "ProfilePage",
								url: "https://jkominovic.dev",
								mainEntity: {
									"@type": "Person",
									name: "Julian Kominovic",
									url: "https://jkominovic.dev",
									jobTitle: "Frontend Developer",
									worksFor: {
										"@type": "Organization",
										name: "Koin",
									},
									image: "https://jkominovic.dev/og/og.png",
									sameAs: [
										"https://github.com/JulianKominovic",
										"https://www.linkedin.com/in/jkominovic",
										"https://x.com/juliankominovic",
									],
								},
							},
							{
								"@type": "ItemList",
								name: "Projects",
								itemListElement: PROJECTS.map((project, index) => ({
									"@type": "ListItem",
									position: index + 1,
									name: project.title,
									url: project.url,
								})),
							},
						],
					}),
				}}
			/>
			<main
				id="hero"
				className="mx-auto relative max-w-2xl px-4 pt-20 text-2xl"
			>
				<p className="animate-fade-up text-neutral-400 font-sans mb-1 font-semibold">
					Hey, I'm
				</p>
				<h1
					className="animate-fade-up font-sans font-bold flex items-center gap-2 mb-2 flex-wrap"
					style={{ animationDelay: "70ms" }}
				>
					<span className="flex items-center gap-2">
						<Image
							alt="Profile"
							className="rounded-xl squircle size-12 rotate-3 ring-2 shadow-lg ring-white"
							loading="eager"
							priority
							height={48}
							src={profile}
							width={48}
						/>
						Julian
					</span>
					Kominovic
				</h1>
				<div
					className="animate-fade-up flex items-center flex-wrap mb-8"
					style={{ animationDelay: "140ms" }}
				>
					<h2 className="font-sans font-bold mr-4 text-muted-foreground">
						Frontend Developer
					</h2>
				</div>
				<div
					className="animate-fade-up flex items-center flex-wrap gap-x-2 gap-y-1 text-neutral-400 mb-10"
					style={{ animationDelay: "210ms" }}
				>
					<p className="inline-block">Based in </p>
					<div className="inline-flex items-center relative gap-2">
						<Image
							src={buenosairesmini}
							alt="Buenos Aires, Argentina miniaturized"
							className="bg-card shrink-0 squircle size-12 shadow-border ring-2 ring-white -rotate-2 drop-shadow-lg inline-block"
							loading="eager"
							height={48}
							width={48}
						/>
						<p className="text-foreground flex items-center justify-center">
							Buenos Aires, Argentina{" "}
						</p>
						<ArgentinaFlag className="size-6 rounded-[50%] shadow-border shrink-0 hidden md:inline-block" />
					</div>
					<p className="inline-block">
						More than 4 years of experience developing{" "}
					</p>
					<div className="flex items-center gap-2 text-foreground">
						fintech products at{" "}
						<Image
							className="aspect-square squircle size-12 shadow-border ring-2 ring-white rotate-2 drop-shadow-lg inline-block bg-[#282828]"
							src={CURRENT_ROLE.logo}
							alt={CURRENT_ROLE.company}
							width={48}
							height={48}
						/>
					</div>
					<p>
						and a <i>lot</i> of
					</p>
					<p className="text-foreground">other stuff</p>
				</div>
				<div
					className="animate-fade-up flex items-center gap-4 flex-wrap text-sm"
					style={{ animationDelay: "280ms" }}
				>
					<a
						href="https://x.com/juliankominovic"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="X (Twitter)"
						className="flex justify-center items-center py-4 px-6 bg-neutral-900 shadow-border drop-shadow-neutral-900/20 rounded-4xl! squircle hover-lift active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
					>
						<XIcon className="size-6 text-white" />
					</a>
					<a
						href="https://www.linkedin.com/in/jkominovic"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="LinkedIn"
						className="flex justify-center items-center py-4 px-6 bg-[#007EBB] shadow-border drop-shadow-[#007EBB]/20 rounded-4xl! squircle hover-lift active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
					>
						<LinkedinIcon className="text-white size-6" />
					</a>
					<a
						href="https://github.com/JulianKominovic"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="GitHub"
						className="flex justify-center items-center py-4 px-6 bg-black shadow-border drop-shadow-black/20 rounded-4xl! squircle hover-lift active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
					>
						<GithubIcon className="size-6 text-white" />
					</a>
				</div>
			</main>

			<section id="projects" className="py-48 mx-auto max-w-5xl px-4">
				<Reveal>
					<h2 className="text-6xl font-bold font-sans text-center leading-normal">
						Projects
					</h2>
					<p className="text-center text-2xl text-neutral-400 mb-8">
						Apps, proof of concepts, excuses to learn.
					</p>
					<Tabs defaultValue={PROJECTS[0].title} className="gap-12">
						<TabsList className="bg-transparent h-auto flex-wrap-balance justify-center mx-auto">
							{PROJECTS.map((project) => (
								<TabsTrigger
									className="size-32 squircle shadow-none! flex-auto group p-1 bg-transparent! relative"
									key={`${project.title}title`}
									value={project.title}
								>
									<Image
										src={project.logo}
										alt={project.title}
										width={96}
										height={96}
										unoptimized
										loading="lazy"
										className={cn(
											"size-24 object-cover squircle saturate-0 opacity-20 group-data-[state=active]:opacity-100 group-data-[state=active]:saturate-100 group-hover:saturate-100 transition-[opacity,filter,transform,box-shadow] duration-150 ease-[var(--ease-out)] group-data-[state=active]:ring-2 group-data-[state=active]:ring-black/10",
											project.title === "Libritus" && "scale-115",
										)}
									/>
								</TabsTrigger>
							))}
						</TabsList>
						{PROJECTS.map((project) => (
							<TabsContent
								key={project.title}
								value={project.title}
								className="max-w-3xl mx-auto w-full relative"
							>
								<p
									className={cn(
										"font-bold px-2 leading-loose rounded-lg flex items-center justify-center w-fit mb-2",
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
								<header className="group flex justify-between items-center flex-wrap gap-4">
									<h3 className="text-4xl font-sans leading-tight">
										<a
											className="flex items-center gap-2"
											href={project.url}
											target="_blank"
											rel="noopener noreferrer"
										>
											<span className="text-neutral-900 font-black underline underline-offset-4">
												{project.title}
											</span>{" "}
											<ArrowUpRight
												className="size-6 mt-2 transition-transform duration-150 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
												strokeWidth={3}
											/>
											<span className="text-neutral-400 text-sm mt-1">
												({project.year})
											</span>
										</a>
									</h3>
								</header>
								<p className="text-lg text-neutral-400 text-balance mb-20">
									{project.description}
								</p>
								<ul>
									{project.progress.map((progress) => (
										<li
											key={progress.title + project.title}
											className="flex md:flex-row flex-col justify-between md:items-center pb-16 border-b border-neutral-200 mb-16 gap-4"
										>
											<aside>
												{progress.date && (
													<time
														className="text-neutral-400 text-sm"
														dateTime={progress.date.toISOString()}
													>
														{progress.date.toLocaleDateString("en-US", {
															month: "long",
															day: "numeric",
															year: "numeric",
														})}
													</time>
												)}
												<h4 className="text-2xl font-bold font-sans leading-snug">
													{progress.title}
												</h4>
												{progress.description && (
													<p className="text-neutral-400 max-w-[40ch] text-balance">
														{progress.description}
													</p>
												)}
											</aside>
											{progress.image && !progress.video && (
												<ZoomeableChildren
													mini={
														// biome-ignore lint/performance/noImgElement: shh
														<img
															loading="lazy"
															src={progress.image}
															alt={progress.title}
															className="rounded-xl drop-shadow-sm object-contain size-auto max-w-sm max-h-96 cursor-zoom-in"
														/>
													}
													zoomed={
														// biome-ignore lint/performance/noImgElement: shh
														<img
															loading="lazy"
															src={progress.image}
															alt={progress.title}
															className="rounded-xl drop-shadow-sm object-contain size-full"
														/>
													}
												/>
											)}
											{progress.video && (
												// biome-ignore lint/a11y/useMediaCaption: self-recorded screencast, no caption file; content is described in the adjacent text
												<video
													src={progress.video}
													loop
													className="rounded-xl drop-shadow-sm object-contain size-auto max-w-sm max-h-96"
													preload="none"
													poster={progress.image}
													controls
													aria-label={`Demo of ${progress.title}`}
												></video>
											)}
										</li>
									))}
								</ul>
							</TabsContent>
						))}
					</Tabs>
				</Reveal>
			</section>
		</>
	);
}
