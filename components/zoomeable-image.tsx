import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

// https://www.nico.fyi/blog/easy-zoomable-image-with-shadcn-tailwind
export default function ZoomeableChildren({
	mini,
	zoomed,
}: {
	mini: React.ReactNode;
	zoomed: React.ReactNode;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>{mini}</DialogTrigger>
			<DialogContent className="max-w-7xl! shadow-none border-0 bg-transparent p-2">
				<DialogTitle className="sr-only">Zoomeable Image</DialogTitle>
				<DialogDescription className="sr-only">
					Zoomeable Image
				</DialogDescription>
				<div className="relative max-h-[calc(100vh-220px)] w-full overflow-clip rounded-md bg-transparent shadow-none">
					{zoomed}
				</div>
			</DialogContent>
		</Dialog>
	);
}
