import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
	return (
		<main className="mx-auto max-w-5xl px-4 pt-20">
			<h1 className="title font-sans text-5xl font-bold! leading-tight mb-8">
				404 - Page Not Found
			</h1>
			<p className="text-neutral-600">
				The page you are looking for does not exist.
			</p>
			<Link
				href="/"
				className="text-primary text-xl hover:text-primary/80 transition-colors mt-4 inline-flex items-center gap-2 border-b-2 border-neutral-600"
			>
				<ArrowLeftIcon className="size-4" strokeWidth={3} /> Go back to the home
				page
			</Link>
		</main>
	);
}
