"use client";

import {
	AnimatePresence,
	animate,
	motion,
	useMotionValue,
	useReducedMotion,
} from "framer-motion";
import {
	FileText,
	FlaskConical,
	Gauge,
	Home,
	type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { baseUrl, routes, subroutes } from "@/app/config";
import { cn } from "@/lib/utils";

const easeOut = [0.23, 1, 0.32, 1] as const;
const STAGGER_DELAY = 0.04;
const WINDUP = { duration: 0.09, ease: [0.33, 1, 0.68, 1] } as const;
const PUNCH_SPRING = {
	type: "spring",
	stiffness: 1200,
	damping: 20,
	mass: 0.9,
} as const;

const subLinkVariants = {
	hidden: { opacity: 0, y: 8 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.2, ease: easeOut },
	},
} as const;

const subListVariants = {
	hidden: {},
	show: { transition: { staggerChildren: STAGGER_DELAY } },
} as const;

const SLIDE_DISTANCE = 48;

const subPanelVariants = {
	enter: (dir: number) => ({ x: -dir * SLIDE_DISTANCE, opacity: 0 }),
	center: { x: 0, opacity: 1 },
	exit: (dir: number) => ({ x: dir * SLIDE_DISTANCE, opacity: 0 }),
};

type ChildItem = {
	url: string;
	title: string;
};

type NavItem = {
	title: string;
	href: string;
	icon: LucideIcon;
	children?: ChildItem[];
};

function buildItems(blogPosts: ChildItem[]): NavItem[] {
	const findUrl = (title: string) =>
		routes.find((route) => route.title === title)?.url ?? baseUrl;

	return [
		{
			title: "Home",
			href: findUrl("Home"),
			icon: Home,
			children: Object.values(subroutes.home),
		},
		{
			title: "Blog",
			href: findUrl("Blog"),
			icon: FileText,
			children: blogPosts,
		},
		{
			title: "Labs",
			href: findUrl("Labs"),
			icon: FlaskConical,
			children: Object.values(subroutes.labs),
		},
		{
			title: "Benchmarks",
			href: findUrl("Benchmarks"),
			icon: Gauge,
		},
	];
}

function isTopLevelActive(pathname: string, href: string) {
	const path = new URL(href).pathname;
	if (path === "/") return pathname === "/";
	return pathname === path || pathname.startsWith(`${path}/`);
}

function isChildActive(pathname: string, hash: string, href: string) {
	const url = new URL(href);
	if (url.hash) return pathname === url.pathname && hash === url.hash;
	return pathname === url.pathname;
}

export default function NavbarClient({
	blogPosts,
}: {
	blogPosts: ChildItem[];
}) {
	const items = buildItems(blogPosts);
	const pathname = usePathname();
	const reduced = useReducedMotion() ?? false;
	const scaleX = useMotionValue(1);
	const scaleY = useMotionValue(1);
	const [hash, setHash] = useState("");
	const [openHref, setOpenHref] = useState<string | null>(null);
	const [direction, setDirection] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const openItem = items.find((item) => item.href === openHref);

	const punch = async () => {
		if (reduced) return;
		await Promise.all([
			animate(scaleX, 1.06, WINDUP),
			animate(scaleY, 0.9, WINDUP),
		]);
		await Promise.all([
			animate(scaleX, 1, PUNCH_SPRING),
			animate(scaleY, 1, PUNCH_SPRING),
		]);
	};

	const handleToggle = (href: string) => {
		if (openHref === href) {
			setDirection(0);
			setOpenHref(null);
			return;
		}
		if (openHref === null) {
			setDirection(0);
			setOpenHref(href);
			void punch();
			return;
		}
		const oldIndex = items.findIndex((item) => item.href === openHref);
		const newIndex = items.findIndex((item) => item.href === href);
		setDirection(newIndex < oldIndex ? 1 : -1);
		setOpenHref(href);
	};

	useEffect(() => {
		setHash(window.location.hash);
		const onHashChange = () => setHash(window.location.hash);
		window.addEventListener("hashchange", onHashChange);
		return () => window.removeEventListener("hashchange", onHashChange);
	}, []);

	useEffect(() => {
		const onPointerDown = (event: PointerEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setOpenHref(null);
			}
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpenHref(null);
		};
		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, []);

	const previousPathname = useRef(pathname);

	useEffect(() => {
		if (previousPathname.current !== pathname) {
			setOpenHref(null);
			previousPathname.current = pathname;
		}
	}, [pathname]);

		return (
			<div
				ref={containerRef}
				className="fixed top-4 left-1/2 z-50 -translate-x-1/2"
			>
				<motion.nav
					layout
					initial={{ y: -24, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{
						y: { duration: 0.5, ease: easeOut },
						opacity: { duration: 0.5, ease: easeOut },
						layout: { type: "spring", stiffness: 400, damping: 35 },
					}}
					style={{
						scaleX,
						scaleY,
						borderRadius: 32,
						transformOrigin: "top center",
					}}
					aria-label="Primary"
					className="relative flex flex-col items-stretch border border-neutral-200/60 bg-white/90 px-2 py-1.5 shadow-border backdrop-blur-sm"
				>
					<ul className="flex items-center gap-1">
						{items.map((item) => {
							const active = isTopLevelActive(pathname, item.href);
							const hasChildren = (item.children?.length ?? 0) > 0;
							const open = openHref === item.href;

							const buttonClasses = cn(
								"inline-flex size-10 items-center justify-center rounded-full text-neutral-500 outline-none transition-colors duration-150 ease-[var(--ease-out)] hover:bg-neutral-100 hover:text-black focus-visible:ring-2 focus-visible:ring-ring/50",
								active && "bg-neutral-100 text-black",
							);

							const icon = (
								<item.icon
									className="size-5"
									fill={active ? "currentColor" : "none"}
								/>
							);

							return (
								<li key={item.href}>
									{hasChildren ? (
										<button
											type="button"
											aria-label={item.title}
											aria-expanded={open}
											onClick={() => handleToggle(item.href)}
											className={buttonClasses}
										>
											{icon}
										</button>
									) : (
										<Link
											href={item.href}
											aria-label={item.title}
											className={buttonClasses}
										>
											{icon}
										</Link>
									)}
								</li>
							);
						})}
					</ul>
					<AnimatePresence mode="popLayout" custom={direction} initial={false}>
						{openItem && (
							<motion.div
								key={openItem.href}
								variants={subPanelVariants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={
									reduced
										? { duration: 0 }
										: {
												x: { duration: 0.25, ease: easeOut },
												opacity: { duration: 0.18, ease: easeOut },
											}
								}
								className="overflow-hidden"
							>
								<motion.ul
									variants={subListVariants}
									initial="hidden"
									animate="show"
									className="flex flex-col gap-0.5 px-1 pb-1"
								>
									{openItem.children?.map((child) => {
										const childActive = isChildActive(
											pathname,
											hash,
											child.url,
										);
										return (
											<motion.li variants={subLinkVariants} key={child.url}>
												<Link
													href={child.url}
													onClick={() => setOpenHref(null)}
													className={cn(
														"block max-w-60 truncate rounded-full px-3 py-1.5 text-sm text-neutral-600 transition-colors duration-150 ease-[var(--ease-out)] hover:bg-neutral-100 hover:text-black",
														childActive &&
															"bg-neutral-100 font-medium text-black",
													)}
												>
													{child.title}
												</Link>
											</motion.li>
										);
									})}
								</motion.ul>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.nav>
			</div>
		);
	}

