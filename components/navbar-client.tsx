"use client";

import { AnimatePresence, motion } from "framer-motion";
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
	const [hash, setHash] = useState("");
	const [openHref, setOpenHref] = useState<string | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

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
		<div ref={containerRef} className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
			<motion.nav
				initial={{ y: -24, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5, ease: easeOut }}
				aria-label="Primary"
			>
				<ul className="flex items-center gap-1 rounded-full border border-neutral-200/60 bg-white/90 px-2 py-1.5 shadow-border backdrop-blur-sm">
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
							<li key={item.href} className="relative">
								{hasChildren ? (
									<>
										<button
											type="button"
											aria-label={item.title}
											aria-expanded={open}
											onClick={() =>
												setOpenHref(open ? null : item.href)
											}
											className={buttonClasses}
										>
											{icon}
										</button>
										<AnimatePresence>
											{open && (
												<motion.ul
													initial={{ opacity: 0, y: -6, scale: 0.96 }}
													animate={{ opacity: 1, y: 0, scale: 1 }}
													exit={{ opacity: 0, y: -6, scale: 0.96 }}
													transition={{ duration: 0.15, ease: easeOut }}
													className="absolute left-0 top-full z-50 mt-2 min-w-44 max-w-60 rounded-2xl border border-neutral-200/60 bg-white/95 p-1.5 shadow-natural backdrop-blur-sm"
												>
													{item.children?.map((child) => {
														const childActive = isChildActive(
															pathname,
															hash,
															child.url,
														);
														return (
															<li key={child.url}>
																<Link
																	href={child.url}
																	onClick={() => setOpenHref(null)}
																	className={cn(
																		"block truncate rounded-xl px-3 py-2 text-sm text-neutral-600 transition-colors duration-150 ease-[var(--ease-out)] hover:bg-neutral-100 hover:text-black",
																		childActive &&
																			"bg-neutral-100 font-medium text-black",
																	)}
																>
																	{child.title}
																</Link>
															</li>
														);
													})}
												</motion.ul>
											)}
										</AnimatePresence>
									</>
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
			</motion.nav>
		</div>
	);
}
