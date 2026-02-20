/** biome-ignore-all lint/suspicious/noArrayIndexKey: sh */
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import React, { useId } from "react";
import { highlight } from "sugar-high";
import BenchmarkingPlayground from "@/components/BenchmarkingPlayground";
import LivePlayground from "@/components/LivePlayground";
import SavingButtonBlogComponents from "./blog/creating-a-good-action-button/index";
import DemoCard from "./blog/demo-card";
import CacheableTweet from "./cacheable-tweet";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
	const id = useId();
	return (
		<table>
			<thead>
				<tr>
					{headers.map((header, index) => (
						<th key={`${id}-header-${index}`}>{header}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.map((row, index) => (
					<tr key={`${id}-row-${index}`}>
						{row.map((cell, cellIndex) => (
							<td key={`${id}-cell-${index}-${cellIndex}`}>{cell}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}

function CustomLink(props) {
	const href = props.href;

	if (href.startsWith("/")) {
		return (
			<Link href={href} {...props}>
				{props.children}
			</Link>
		);
	}

	if (href.startsWith("#")) {
		return <a {...props} />;
	}

	return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function CaptionedImage(props) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<span className="flex flex-col gap-3 my-12! items-center justify-center">
					{/** biome-ignore lint/performance/noImgElement: no need to use Image component here */}
					<img
						alt={props.alt}
						className="rounded-lg my-0! drop-shadow-md"
						{...props}
					/>
					<span className="text-muted-foreground my-0">
						{props.caption || props.alt}
					</span>
				</span>
			</DialogTrigger>
			<DialogContent className="max-w-[calc(100%-2rem)]! p-2 overflow-y-auto justify-center max-h-[calc(100%-2rem)]! no-scrollbar">
				<DialogTitle className="sr-only">
					{props.caption || props.alt}
				</DialogTitle>
				<DialogDescription className="sr-only">
					{props.caption || props.alt}
				</DialogDescription>
				{/** biome-ignore lint/performance/noImgElement: no need to use Image component here */}
				<img
					alt={props.alt}
					className="rounded-lg my-0! drop-shadow-md object-contain w-full h-full "
					{...props}
				/>
			</DialogContent>
		</Dialog>
	);
}

function Code({ children, ...props }) {
	const codeHTML = highlight(children);
	// biome-ignore lint/security/noDangerouslySetInnerHtml: sh
	return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

function slugify(str) {
	return str
		.toString()
		.toLowerCase()
		.trim() // Remove whitespace from both ends of a string
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(/&/g, "-and-") // Replace & with 'and'
		.replace(/[^\w-]+/g, "") // Remove all non-word characters except for -
		.replace(/--+/g, "-"); // Replace multiple - with single -
}

function createHeading(level) {
	const Heading = ({ children }) => {
		const slug = slugify(children);
		return React.createElement(
			`h${level}`,
			{ id: slug },
			[
				React.createElement("a", {
					href: `#${slug}`,
					key: `link-${slug}`,
					className: "anchor",
				}),
			],
			children,
		);
	};

	Heading.displayName = `Heading${level}`;

	return Heading;
}

const components = {
	h1: createHeading(1),
	h2: createHeading(2),
	h3: createHeading(3),
	h4: createHeading(4),
	h5: createHeading(5),
	h6: createHeading(6),
	img: CaptionedImage,
	a: CustomLink,
	code: Code,
	Table,
	BenchmarkingPlayground,
	LivePlayground,
	CacheableTweet,
	Button,
	DemoCard,
	SavingButtonBlogComponents,
	Alert,
	AlertTitle,
	AlertDescription,
};

export function CustomMDX(props) {
	return (
		<MDXRemote
			{...props}
			components={{ ...components, ...(props.components || {}) }}
		/>
	);
}
