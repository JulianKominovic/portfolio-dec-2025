import Link from "next/link";
import { EcommerceCheckoutExample } from "@/components/blog/creating-a-good-action-button/creating-a-good-action-button";

function LabsPage() {
	return (
		<main className="mx-auto max-w-3xl px-4 pt-20">
			<h1 className="font-serif text-5xl font-bold leading-tight mb-12">
				Labs
			</h1>

			<section className="mb-32">
				<h2 className="text-2xl font-bold mb-4 flex flex-wrap items-center justify-between">
					Purchase button{" "}
					<time dateTime="2026-01-16" className="text-neutral-400 text-sm">
						February 01, 2026
					</time>
				</h2>

				<p className="text-neutral-400 mb-4">
					From{" "}
					<Link
						href="/blog/creating-a-good-action-button"
						className="underline underline-offset-4"
					>
						Creating a good action button
					</Link>{" "}
				</p>
				<div className="bg-card p-4 rounded-2xl shadow-border">
					<EcommerceCheckoutExample />
				</div>
			</section>
		</main>
	);
}

export default LabsPage;
