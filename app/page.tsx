import clsx from "clsx";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
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
import { WORKING_EXPERIENCE } from "./data/bio";

export default function Page() {
	return (
		<>
			<main
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
					<h2 className="font-serif text-4xl">Frontend Developer</h2>
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
						based in{" "}
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
					<svg
						className="m-2 text-white size-6"
						role="img"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>X</title>
						<path
							d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"
							fill="currentColor"
						/>
					</svg>
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
					<svg
						aria-label="LinkedIn"
						xmlns="http://www.w3.org/2000/svg"
						height="40"
						viewBox="0 0 72 72"
						width="40"
					>
						<title>LinkedIn</title>
						<g fill="none" fillRule="evenodd">
							<path
								d="M8,72 L64,72 C68.418278,72 72,68.418278 72,64 L72,8 C72,3.581722 68.418278,-8.11624501e-16 64,0 L8,0 C3.581722,8.11624501e-16 -5.41083001e-16,3.581722 0,8 L0,64 C5.41083001e-16,68.418278 3.581722,72 8,72 Z"
								fill="transparent"
							/>
							<path
								d="M62,62 L51.315625,62 L51.315625,43.8021149 C51.315625,38.8127542 49.4197917,36.0245323 45.4707031,36.0245323 C41.1746094,36.0245323 38.9300781,38.9261103 38.9300781,43.8021149 L38.9300781,62 L28.6333333,62 L28.6333333,27.3333333 L38.9300781,27.3333333 L38.9300781,32.0029283 C38.9300781,32.0029283 42.0260417,26.2742151 49.3825521,26.2742151 C56.7356771,26.2742151 62,30.7644705 62,40.051212 L62,62 Z M16.349349,22.7940133 C12.8420573,22.7940133 10,19.9296567 10,16.3970067 C10,12.8643566 12.8420573,10 16.349349,10 C19.8566406,10 22.6970052,12.8643566 22.6970052,16.3970067 C22.6970052,19.9296567 19.8566406,22.7940133 16.349349,22.7940133 Z M11.0325521,62 L21.769401,62 L21.769401,27.3333333 L11.0325521,27.3333333 L11.0325521,62 Z"
								fill="#FFF"
							/>
						</g>
					</svg>
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
			<div className="max-w-5xl px-2 mx-auto" />
		</>
	);
}
