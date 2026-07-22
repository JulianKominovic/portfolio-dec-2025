import Link from "next/link";
import { EcommerceCheckoutExample } from "@/components/blog/creating-a-good-action-button/creating-a-good-action-button";
import { LiquidEjectDemo } from "@/components/labs/v2-liquid-connector/test-v2";

function LabsPage() {
	return (
		<main className="mx-auto max-w-3xl px-4 pt-20">
			<h1 className="font-sans text-5xl font-bold leading-tight mb-12">Labs</h1>
			<section className="mb-32">
				<h2 className="text-2xl font-bold mb-4 flex flex-wrap items-center justify-between">
					Liquid eject{" "}
					<time dateTime="2026-07-22" className="text-neutral-400 text-sm">
						July 22, 2026
					</time>
				</h2>
				<p className="text-neutral-400 mb-4 text-pretty">
					Single-SVG anchor surface: windup dent, bulge that tracks a rising
					annex disk, neck snap, squash rebound, then blur→clear reveal. Scrub{" "}
					<code className="text-neutral-600">topDisplace</code> to inspect the
					path.
				</p>
				<div className="bg-card p-4 rounded-2xl shadow-border">
					<LiquidEjectDemo />
				</div>
			</section>
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
