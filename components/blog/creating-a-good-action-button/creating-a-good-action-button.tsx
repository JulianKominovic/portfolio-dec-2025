/** biome-ignore-all lint/suspicious/noExplicitAny: to prevent ts error (union type too complex) */
"use client";
import {
	LoaderCircle,
	LoaderCircleIcon,
	RefreshCcw,
	TrashIcon,
	User2Icon,
} from "lucide-react";
import { Button } from "../../ui/button";
import "./creating-a-good-action-button.css";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import type { TargetAndTransition, VariantLabels, Variants } from "motion";
import { useRef, useState } from "react";
import { HandCoinsIcon } from "@/components/animate-ui/icons/hand-coins";
import { PartyPopperIcon } from "@/components/animate-ui/icons/party-popper";
import { ReceiptIcon } from "@/components/animate-ui/icons/receipt";
import { SquarePenIcon } from "@/components/animate-ui/icons/square-pen";
import { TruckIcon } from "@/components/animate-ui/icons/truck-shipping";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn, playClickSound, playDisabledClickSound } from "@/lib/utils";

async function waitFor(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const CHECKOUT_BUTTON_VARIANTS: Variants = {
	idle: {
		scale: 1,
		opacity: 1,
		filter: "blur(0px)",
		boxShadow:
			"rgba(0, 0, 0, 0.2) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgb(0, 0, 0) -1px -5px 0px inset, rgb(171, 171, 171) 0px -1px 10px inset",
		backgroundColor: "#262626",
	},

	success: {
		backgroundColor: "#009e08",
		boxShadow:
			"rgba(0, 64, 3,0.2) 0px 2px 4px, rgba(7, 137, 13,0.3) 0px 7px 13px -3px, rgb(15, 151, 21) -1px -5px 0px inset, rgb(151, 237, 153) 0px -1px 10px inset",
		scale: [1.1, 1],
		transition: {
			scale: {
				type: "spring",
				damping: 5,
			},
		},
	},
	"shipping-purchase": {
		rotate: -1,
		transition: {
			rotate: {
				type: "spring",
				damping: 5,
			},
		},
	},
	exit: {
		scale: 0.8,
		opacity: 0,
		filter: "blur(10px)",
	},
	initial: {
		scale: 0.8,
		opacity: 0,
		filter: "blur(10px)",
	},
};

function EcommerceCheckoutStep({
	children,
	initial = { opacity: 0, filter: "blur(6px)", scale: 0.8, y: -4 },
	animate = { opacity: 1, filter: "blur(0px)", scale: 1, y: 0 },
	exit = { opacity: 0, filter: "blur(6px)", scale: 0.8, y: 10 },
}: {
	children: React.ReactNode;
	initial?: TargetAndTransition | VariantLabels | boolean;
	animate?: TargetAndTransition | VariantLabels | boolean;
	exit?: TargetAndTransition | VariantLabels | boolean;
}) {
	return (
		<motion.p
			initial={initial as any}
			animate={animate as any}
			exit={exit as any}
			transition={{
				duration: 0.2,
			}}
			className="flex items-center gap-3 my-0!"
		>
			{children}
		</motion.p>
	);
}
export const EcommerceCheckoutExample = () => {
	const [r, setR] = useState(0);
	const [state, setState] = useState<
		| "idle"
		| "loading"
		| "registering-purchase"
		| "validating-with-bank"
		| "shipping-purchase"
		| "creating-invoice"
		| "success"
	>("idle");
	const btnRef = useRef<HTMLButtonElement>(null);

	const getProgress = (currentState: typeof state) => {
		const states = [
			"idle",
			"loading",
			"registering-purchase",
			"validating-with-bank",
			"creating-invoice",
			"shipping-purchase",
			"success",
		];
		const currentIndex = states.indexOf(currentState);
		return (currentIndex / (states.length - 1)) * 100;
	};

	const progress = getProgress(state);

	function fireConfetti() {
		if (!btnRef.current) return;
		try {
			const rect = btnRef.current.getBoundingClientRect();
			const x = rect.left + rect.width / 2;
			const y = rect.top + rect.height / 2;
			confetti({
				ticks: 1000,
				origin: {
					x: x / window.innerWidth,
					y: y / window.innerHeight,
				},
			});
			confetti({
				ticks: 1000,
				particleCount: 100,
				startVelocity: 90,
				origin: {
					x: x / window.innerWidth,
					y: y / window.innerHeight,
				},
			});
		} catch (error) {
			console.error("Confetti button error:", error);
		}
	}

	async function handleMouseDown(e: React.MouseEvent<HTMLButtonElement>) {
		if (state !== "idle") {
			const btn = e.currentTarget as HTMLButtonElement;
			btn.style.animationName = "shake";
			btn.style.animationDuration = "0.1s";
			btn.style.animationIterationCount = "2";
			btn.style.animationFillMode = "forwards";
			for (const animation of btn.getAnimations()) {
				animation.onfinish = () => {
					btn.style.removeProperty("animation-name");
					btn.style.removeProperty("animation-duration");
					btn.style.removeProperty("animation-iteration-count");
					btn.style.removeProperty("animation-fill-mode");
				};
			}
			window.navigator.vibrate([100, 100, 100, 100]);
			return playDisabledClickSound();
		}
		window.navigator.vibrate(20);
		playClickSound();
	}
	async function handleClick() {
		if (state !== "idle") return;
		setState("loading");
		await waitFor(1000);
		setState("registering-purchase");
		await waitFor(2000);
		setState("validating-with-bank");
		await waitFor(3000);
		setState("creating-invoice");
		await waitFor(2000);
		setState("shipping-purchase");
		await waitFor(3000);
		setState("success");
		await fireConfetti();
		await waitFor(5000);
		setState("idle");
	}
	return (
		<div
			className="group flex items-center justify-center relative"
			key={`r${r}`}
		>
			<motion.button
				ref={btnRef}
				data-state={state}
				variants={CHECKOUT_BUTTON_VARIANTS as any}
				initial="initial"
				animate={
					state === "success"
						? ["idle", "success"]
						: state === "shipping-purchase"
							? ["idle", "shipping-purchase"]
							: "idle"
				}
				exit="exit"
				whileHover={
					state !== "idle"
						? {}
						: {
								scale: 1.01,
								y: -1,
							}
				}
				whileTap={
					state !== "idle"
						? {}
						: {
								scale: 0.99,
								y: 2,
								boxShadow:
									"rgba(0, 0, 0, 0.2) 0px 0px 2px, rgba(0, 0, 0, 0.3) 0px 4px 10px -3px, rgb(0, 0, 0) -1px -2px 0px inset, rgb(171, 171, 171) 0px -1px 6px inset",
							}
				}
				className={cn(
					"text-white font-medium w-72 h-14 rounded-full select-none flex items-center justify-center focus-within:outline-neutral-900 outline-transparent outline-2 outline-offset-4 checkout-button-progress",
					state === "idle"
						? "cursor-pointer"
						: "cursor-not-allowed animate-active-shake",
				)}
				style={
					{
						"--opacity": state === "success" ? "0" : "1",
						"--progress-width": `${progress}%`,
						"--animation-duration":
							state === "success" ? "0.2s" : state === "idle" ? "0s" : "5s",
					} as React.CSSProperties
				}
				type="button"
				onMouseDown={handleMouseDown}
				onMouseUp={handleClick}
			>
				<AnimatePresence mode="wait" propagate>
					{state === "idle" ? (
						<EcommerceCheckoutStep key={"purchase"}>
							<span className="flex items-center gap-2">Purchase</span>
						</EcommerceCheckoutStep>
					) : state === "loading" ? (
						<EcommerceCheckoutStep key={"loading"}>
							<LoaderCircle className="animate-spin [--animation-duration:400ms]" />
						</EcommerceCheckoutStep>
					) : state === "registering-purchase" ? (
						<EcommerceCheckoutStep key={"registering-purchase"}>
							<span>Registering purchase</span>
							<SquarePenIcon
								initial={{
									rotate: -12,
									scale: 0.8,
								}}
								animate={{
									rotate: 0,
									scale: 1,
								}}
								exit={{
									rotate: 12,
									scale: 0.8,
								}}
								transition={{
									delay: 0.2,
								}}
								size={20}
							/>
						</EcommerceCheckoutStep>
					) : state === "validating-with-bank" ? (
						<EcommerceCheckoutStep key={"validating-with-bank"}>
							<span>Collecting payment</span>
							<HandCoinsIcon
								initial={{
									rotate: -12,
									scale: 0.8,
								}}
								animate={{
									rotate: 0,
									scale: 1,
								}}
								exit={{
									rotate: 12,
									scale: 0.8,
								}}
								transition={{
									delay: 0.2,
								}}
								size={20}
							/>
						</EcommerceCheckoutStep>
					) : state === "creating-invoice" ? (
						<EcommerceCheckoutStep key={"creating-invoice"}>
							<span>Creating invoice</span>
							<ReceiptIcon
								initial={{
									rotate: -12,
									scale: 0.8,
								}}
								animate={{
									rotate: 0,
									scale: 1,
								}}
								exit={{
									rotate: 12,
									scale: 0.8,
								}}
								transition={{
									delay: 0.2,
								}}
								size={20}
							/>
						</EcommerceCheckoutStep>
					) : state === "shipping-purchase" ? (
						<EcommerceCheckoutStep
							key={"shipping-purchase"}
							exit={{
								x: [-20, "100%"],
								opacity: 0,
								transition: {
									x: {
										duration: 0.4,
									},
								},
							}}
						>
							<span>Preparing for delivery</span>
							<TruckIcon
								initial={{
									rotate: -12,
									scale: 0.8,
								}}
								animate={{
									rotate: 0,
									scale: 1,
									x: [0, 10, 5, 12, 0],
								}}
								exit={{
									rotate: 12,
									scale: 0.8,
								}}
								transition={{
									delay: 0.2,
									x: {
										repeat: Infinity,
										duration: 2,
										repeatType: "loop",
									},
								}}
								size={20}
							/>
						</EcommerceCheckoutStep>
					) : state === "success" ? (
						<EcommerceCheckoutStep key={"success"}>
							<span>Enjoy!</span>
							<PartyPopperIcon
								initial={{
									rotate: -12,
									scale: 0.8,
								}}
								animate={{
									rotate: 0,
									scale: 1,
								}}
								exit={{
									rotate: 12,
									scale: 0.8,
								}}
								transition={{
									delay: 0.2,
								}}
								size={20}
							/>
						</EcommerceCheckoutStep>
					) : null}
				</AnimatePresence>
			</motion.button>

			<button
				onClick={() => {
					setR((prev) => prev + 1);
				}}
				title="Reload"
				type="button"
				className="absolute -top-6 shadow-border -right-6 rounded-full bg-neutral-100 p-2"
			>
				<RefreshCcw className="size-4" />
			</button>
		</div>
	);
};

export const FlickeringExample = () => {
	const [isLoadingNoDelay, setIsLoadingNoDelay] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [isLoadingWithDelay, setIsLoadingWithDelay] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");

	const isDisabledNoDelay = isLoadingNoDelay !== "idle";
	const isDisabledWithDelay = isLoadingWithDelay !== "idle";

	function asyncAction() {
		return waitFor(100);
	}

	async function handleClickNoDelay() {
		if (isDisabledNoDelay) return;
		setIsLoadingNoDelay("loading");
		await asyncAction();
		setIsLoadingNoDelay("success");
		await waitFor(2000);
		setIsLoadingNoDelay("idle");
	}

	async function handleClickWithDelay() {
		if (isDisabledWithDelay) return;
		setIsLoadingWithDelay("loading");
		await Promise.allSettled([asyncAction(), waitFor(1000)]);
		setIsLoadingWithDelay("success");
		await waitFor(2000);
		setIsLoadingWithDelay("idle");
	}
	return (
		<div className="flex items-center gap-8 justify-center flex-wrap">
			<button
				type="button"
				onClick={handleClickNoDelay}
				className={cn(
					"cursor-pointer p-2 rounded-lg w-32 shadow-border transition-colors duration-200 bg-neutral-50",
					isLoadingNoDelay === "loading" && "animate-pulse",
					isLoadingNoDelay === "success" && "bg-green-100 text-green-600",
					isLoadingNoDelay === "loading" && "cursor-not-allowed bg-neutral-200",
				)}
			>
				{isLoadingNoDelay === "idle" && "No delay"}
				{isLoadingNoDelay === "loading" && "Loading..."}
				{isLoadingNoDelay === "success" && "Success"}
			</button>
			<button
				type="button"
				onClick={handleClickWithDelay}
				className={cn(
					"cursor-pointer p-2 rounded-lg w-32 shadow-border transition-colors duration-200 bg-neutral-50",
					isLoadingWithDelay === "loading" && "animate-pulse",
					isLoadingWithDelay === "success" && "bg-green-100 text-green-600",
					isLoadingWithDelay === "loading" &&
						"cursor-not-allowed bg-neutral-200",
				)}
			>
				{isLoadingWithDelay === "idle" && "1s Delay"}
				{isLoadingWithDelay === "loading" && "Loading..."}
				{isLoadingWithDelay === "success" && "Success"}
			</button>
		</div>
	);
};

export const ExpressiveExample = () => {
	const audioRef = useRef(
		typeof window !== "undefined" ? new Audio("/sounds/alert-sound.ogg") : null,
	);
	return (
		<div className="flex items-center justify-center gap-8 py-8 flex-wrap">
			<button
				type="button"
				className="bg-red-600 text-white shadow-border rounded-[50%] flex justify-center items-center size-12"
			>
				<TrashIcon className="size-6" />
			</button>
			<div className="group">
				<button
					onMouseDown={() => {
						window.navigator.vibrate(50);
						audioRef.current!.volume = 0.6;
						audioRef.current!.play();
					}}
					type="button"
					className="bg-red-600 drop-shadow-2xl drop-shadow-transparent text-white shadow-border rounded-[50%] flex justify-center items-center size-12 group-hover:bg-red-500 active:scale-95 transition-all duration-100 ease-out group-hover:drop-shadow-red-400/30 overflow-visible group-hover:-translate-y-0.5 group/button"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="size-6 overflow-visible group-active/button:scale-110 transition-transform duration-100 ease-out"
						aria-hidden="true"
					>
						<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
						<path
							d="M3 6h18"
							className="group-hover:-rotate-35 transition-transform duration-300 group-hover:-translate-x-1.5 group-hover:translate-y-1 group-active/button:-rotate-45 ease-out"
						></path>
						<path
							d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
							className="group-hover:-rotate-35 transition-transform duration-300 group-hover:-translate-x-1.5 group-hover:translate-y-1 group-active/button:-rotate-45 ease-out"
						></path>
					</svg>
				</button>
			</div>
		</div>
	);
};

export const LoadingButtonStateExample = () => {
	const [fastAnimation, setFastAnimation] = useState(false);
	return (
		<div>
			<div className="flex items-center gap-2 flex-wrap mb-4">
				<Button>
					<LoaderCircleIcon
						className={cn(
							"animate-spin",
							fastAnimation
								? "animation-duration-[500ms]"
								: "animation-duration-[1000ms]",
						)}
					/>
				</Button>
				<Button
					className={cn(
						"animate-pulse",
						fastAnimation
							? "animation-duration-[600ms]"
							: "animation-duration-[1000ms]",
					)}
				>
					Loading...
				</Button>
				<Button
					className={cn(
						"animate-filling-loader",
						fastAnimation
							? "animation-duration-[400ms]"
							: "animation-duration-[800ms]",
					)}
					style={
						{
							"--animation-duration": fastAnimation ? "1s" : "2s",
						} as React.CSSProperties
					}
				>
					<span className="z-10 mix-blend-exclusion">Loading...</span>
				</Button>
			</div>
			<label
				htmlFor="loading-button-example-states-fast-animation"
				className="text-sm flex items-center gap-2"
			>
				<input
					onChange={() => setFastAnimation((prev) => !prev)}
					checked={fastAnimation}
					type="checkbox"
					name="loading-button-example-states-fast-animation"
					id="loading-button-example-states-fast-animation"
				/>
				Fast animations
			</label>
		</div>
	);
};

export const PopularDoubleConfirmationExample = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="destructive">
					<User2Icon className="size-4" />
					Delete account
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Are you sure you want to delete your account?{" "}
					</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					<b>This action is irreversible.</b>
					<br />
					You will lose all your data and your account will be permanently
					deleted.
				</DialogDescription>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="secondary">Cancel</Button>
					</DialogClose>
					<Button variant="destructive">
						<TrashIcon className="size-4" />
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export const RejectingActionsExample = () => {
	const [state, setState] = useState<"idle" | "loading" | "success">("idle");
	const btnRef = useRef<HTMLButtonElement>(null);

	async function handleClick() {
		if (state !== "idle") {
			if (!btnRef.current) return;

			// Efecto shake
			btnRef.current.style.animationName = "shake";
			btnRef.current.style.animationDuration = "0.1s";
			btnRef.current.style.animationIterationCount = "2";

			for (const animation of btnRef.current.getAnimations()) {
				animation.onfinish = () => {
					if (!btnRef.current) return;
					btnRef.current.style.removeProperty("animation-name");
					btnRef.current.style.removeProperty("animation-duration");
					btnRef.current.style.removeProperty("animation-iteration-count");
					btnRef.current.style.removeProperty("animation-fill-mode");
				};
			}

			// Vibración y sonido
			window.navigator.vibrate([50, 50, 50]);
			playDisabledClickSound();
			return;
		}

		// Acción normal
		playClickSound();
		setState("loading");
		await waitFor(2000);
		setState("success");
		await waitFor(2000);
		setState("idle");
	}

	return (
		<div className="flex items-center justify-center">
			<button
				ref={btnRef}
				type="button"
				onClick={handleClick}
				className={cn(
					"p-2 rounded-lg w-32 shadow-border transition-colors duration-200 bg-neutral-50 text-neutral-900",
					state === "idle" &&
						"cursor-pointer hover:bg-neutral-100 active:scale-95",
					state === "success" &&
						"cursor-not-allowed bg-green-100 text-green-600",
					state === "loading" &&
						"cursor-not-allowed bg-neutral-200 text-neutral-600 animate-pulse",
				)}
			>
				{state === "idle" && "Save"}
				{state === "loading" && (
					<span className="flex items-center justify-center gap-2">
						<LoaderCircle className="animate-spin size-5" />
						Saving...
					</span>
				)}
				{state === "success" && "Saved"}
			</button>
		</div>
	);
};
