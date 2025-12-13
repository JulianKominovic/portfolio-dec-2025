import clsx from "clsx";
import {
	ArrowDownToLine,
	ArrowUp,
	ArrowUpRight,
	ExternalLinkIcon,
} from "lucide-react";
import Image from "next/image";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import buenosairesmini from "./assets/buenos-aires-mini.png";
import backendfrontend1 from "./assets/frontend-memes/backend-frontend-1.jpg";
import backendfrontend2 from "./assets/frontend-memes/backend-frontend-2.jpeg";
import cssaward from "./assets/frontend-memes/css-award.jpg";
import responsivedesignnightmare from "./assets/frontend-memes/responsive-design-nightmare.png";
import typesofheadache from "./assets/frontend-memes/types-of-headache.png";
import messiworldcup from "./assets/messi-world-cup.gif";
import profile from "./assets/profile.jpeg";
import xprofilepic from "./assets/x-profile-pic.jpg";
import GitHubActivity from "./components/github-activity";
import LinkedinIcon from "./components/icons/linkedin";
import XIcon from "./components/icons/x";
import { PROJECTS, WORKING_EXPERIENCE } from "./data/bio";

export default function Page() {
	return (
		<>
			<main
				id="hero"
				className={clsx(
					"mx-auto grid max-w-5xl px-4 pt-20 gap-2",
					"lg:grid-cols-4 lg:grid-rows-[280px_235px_235px]",
					"md:grid-cols-3 md:grid-rows-[280px_280px_235px_235px]",
				)}
			>
				<section className="self-center col-span-2">
					<Image
						alt="Profile"
						className="rounded-[50%] mb-4"
						height={64}
						src={profile}
						width={64}
					/>
					<h1 className="font-serif text-xl">
						<span className="text-neutral-400">Hey {"I'm "}</span>{" "}
						<span>Julian Kominovic</span>
					</h1>
					<h2 className="font-serif text-4xl font-bold">Frontend Developer</h2>
					<p className="text-neutral-400 max-w-[40ch]">
						more than 4 years of experience in fintech products. I enjoy
						creating development tools to make developers' life easier.
					</p>
				</section>
				<section className="flex flex-col w-full h-full gap-1">
					<p className="px-3 text-sm text-neutral-400">
						what is <span className="text-neutral-900">frontend</span>? well...
					</p>
					<Carousel
						className="w-full h-full min-h-0"
						opts={{
							loop: true,
							align: "center",
							active: true,
						}}
					>
						<CarouselContent className="w-full h-full">
							<CarouselItem>
								<Image
									className="w-full h-full squircle "
									src={cssaward}
									alt="CSS Award"
								/>
							</CarouselItem>
							<CarouselItem>
								<Image
									className="w-full h-full squircle "
									src={backendfrontend1}
									alt="Backend & Frontend Comparison"
								/>
							</CarouselItem>
							<CarouselItem>
								<Image
									className="w-full h-full squircle "
									src={backendfrontend2}
									alt="Backend & Frontend Comparison 2"
								/>
							</CarouselItem>
							<CarouselItem>
								<Image
									className="w-full h-full squircle "
									src={responsivedesignnightmare}
									alt="Responsive Design Nightmare"
								/>
							</CarouselItem>
							<CarouselItem>
								<Image
									className="w-full h-full squircle "
									src={typesofheadache}
									alt="Types of Headache"
								/>
							</CarouselItem>
						</CarouselContent>
						<CarouselPrevious className="rounded-[50%]" />
						<CarouselNext className="rounded-[50%] z-10" />
					</Carousel>
				</section>
				<section className="relative flex flex-col justify-end gap-1 overflow-hidden">
					<Image
						src={buenosairesmini}
						alt="Buenos Aires, Argentina"
						className="bg-neutral-100 squircle"
					/>
					<p className="px-2 text-sm text-neutral-400">
						living in{" "}
						<span className="text-neutral-900">Buenos Aires, Argentina</span>
					</p>
				</section>
				<section className="flex flex-col w-full h-full col-span-2 gap-1">
					<p className="px-3 text-sm text-neutral-400">working experience</p>
					<ul className="h-full p-4 overflow-auto squircle bg-neutral-100">
						{WORKING_EXPERIENCE.map((experience, i) => (
							<li
								key={`${
									// biome-ignore lint/suspicious/noArrayIndexKey: we use the index as a key because the experience is unique
									i
								}wkxp`}
								className={clsx(
									"flex justify-between items-center mb-4 pb-4 border-b border-neutral-200",
									i === WORKING_EXPERIENCE.length - 1 && "border-b-0",
								)}
							>
								<aside className="flex gap-2">
									<Image
										className="aspect-square rounded-[50%] size-6"
										src={experience.logo}
										alt={experience.company}
										width={24}
										height={24}
									/>

									<div>
										<p className="font-serif text-sm font-normal">
											{experience.title}
										</p>
										<p className="text-sm text-neutral-400">
											at{" "}
											<a
												href={experience.url}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center gap-1 leading-none border-b border-neutral-400 hover:text-neutral-900 hover:border-neutral-900"
											>
												{experience.company}{" "}
												<ExternalLinkIcon className="size-3" />
											</a>
										</p>
									</div>
								</aside>
								<p className="text-xs text-neutral-400">
									{experience.startDate} - {experience.endDate}
								</p>
							</li>
						))}
					</ul>
				</section>
				<section className="w-full h-full col-span-2">
					<Image
						src={messiworldcup}
						alt="Messi World Cup"
						className="object-cover w-full h-full bg-neutral-100 squircle"
					/>
				</section>
				<a
					href="https://x.com/juliankominovic"
					target="_blank"
					rel="noopener noreferrer"
					className="flex flex-col justify-between h-full p-4 bg-neutral-900 squircle"
				>
					<XIcon className="size-6 text-white m-2" />
					<footer>
						<Image
							src={xprofilepic}
							alt="X Profile Pic"
							width={40}
							height={40}
							className="rounded-[50%] object-cover"
						/>
						<p className="font-bold text-white">Juli Kominovic 🧉</p>
						<p className="text-neutral-300">@julikominovic</p>
					</footer>
				</a>
				<a
					href="https://www.linkedin.com/in/jkominovic"
					target="_blank"
					rel="noopener noreferrer"
					className="flex flex-col justify-between h-full p-4 bg-[#007EBB] squircle"
				>
					<LinkedinIcon className="text-white size-6 m-2" />
					<footer>
						<Image
							src={profile}
							alt="LinkedIn Profile"
							width={40}
							height={40}
							className="rounded-[50%] object-cover"
						/>
						<p className="font-bold text-white">Julian Ezequiel Kominovic</p>
						<p className="text-neutral-300">@jkominovic</p>
					</footer>
				</a>
				<section className="flex flex-col w-full h-full col-span-2 gap-1 squircle bg-neutral-100 p-4">
					<GitHubActivity />
				</section>
			</main>
			<section id="projects" className="py-48 mx-auto max-w-5xl px-4">
				<h2 className="text-6xl font-bold font-serif text-center leading-loose">
					Projects
				</h2>
				<p className="text-center text-2xl text-neutral-400 mb-8">
					Apps, proof of concepts, excuses to learn.
				</p>
				<Tabs defaultValue={PROJECTS[0].title} className="gap-12">
					<TabsList className="bg-transparent h-auto flex-wrap-balance justify-center mx-auto">
						{PROJECTS.map((project) => (
							<TabsTrigger
								className="size-32 squircle shadow-none! flex-auto group p-1"
								key={`${project.title}title`}
								value={project.title}
							>
								<Image
									src={project.logo}
									alt={project.title}
									width={96}
									height={96}
									unoptimized
									className="size-24 object-cover squircle saturate-0 opacity-20 group-data-[state=active]:opacity-100 group-data-[state=active]:saturate-100 group-hover:saturate-100 transition-all duration-300"
								/>
							</TabsTrigger>
						))}
					</TabsList>
					{PROJECTS.map((project) => (
						<TabsContent
							id={project.title}
							key={project.title}
							value={project.title}
							className="max-w-3xl mx-auto w-full relative"
						>
							<p
								className={cn(
									" font-bold font-serif px-2 leading-relaxed rounded-md flex items-center justify-center w-fit",
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
							<header className="bg-white flex justify-between items-center flex-wrap gap-4 group">
								<h3 className="text-4xl font-bold font-serif leading-loose">
									<a
										className="flex items-center gap-2"
										href={project.url}
										target="_blank"
										rel="noopener noreferrer"
									>
										<span className="text-neutral-900 font-bold underline underline-offset-4">
											{project.title}
										</span>{" "}
										<ArrowUpRight className="size-6 mt-2" strokeWidth={3} />
										<span className="text-neutral-400 text-sm mt-1">
											({project.year})
										</span>
									</a>
								</h3>
								{/* <a
									href={`#${project.title}`}
									className="text-neutral-500 text-sm mt-1 items-center gap-1 bg-neutral-100 px-2 py-1 rounded-md w-fit flex group-[]:"
								>
									Go back to top <ArrowUp className="size-4" />
								</a> */}
							</header>
							<p className="text-lg text-neutral-400 text-balance mb-12">
								{project.description}
							</p>
							<ul>
								{project.progress.map((progress) => (
									<li
										key={progress.title + project.title}
										className="flex md:flex-row flex-col justify-between md:items-center pb-8 border-b border-neutral-200 mb-8 gap-4"
									>
										<aside>
											{progress.date && (
												<time
													className="text-neutral-400 text-sm"
													dateTime={progress.date.toISOString()}
												>
													{progress.date.toLocaleDateString(undefined, {
														month: "long",
														day: "numeric",
														year: "numeric",
													})}
												</time>
											)}
											<h4 className="text-2xl font-bold font-serif leading-loose">
												{progress.title}
											</h4>
											{progress.description && (
												<p className="text-neutral-400 max-w-[40ch] text-balance">
													{progress.description}
												</p>
											)}
										</aside>
										{progress.image && !progress.video && (
											// biome-ignore lint/performance/noImgElement: shh
											<img
												loading="lazy"
												src={progress.image}
												alt={progress.title}
												className="rounded-lg object-cover size-auto max-w-sm max-h-96"
											/>
										)}
										{progress.video && (
											<video
												src={progress.video}
												loop
												className="rounded-lg object-cover size-auto max-w-sm max-h-96"
												preload="none"
												poster={progress.image}
												controls
											>
												<track kind="captions" />
											</video>
										)}
									</li>
								))}
							</ul>
						</TabsContent>
					))}
				</Tabs>
			</section>
			<div className="max-w-5xl px-2 mx-auto" />
		</>
	);
}
