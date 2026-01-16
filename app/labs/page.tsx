import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function LabsPage() {
	return (
		<main className="mx-auto max-w-3xl px-4 pt-20">
			<h1 className="font-serif text-5xl font-bold leading-tight">Labs</h1>

			<section className="mt-10">
				<h2 className="text-2xl font-bold mb-4">
					Apple Sequoia Dropdown Experiment
				</h2>
				<DropdownMenu>
					<DropdownMenuTrigger>Open Dropdown</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>Item 1</DropdownMenuItem>
						<DropdownMenuItem>Item 2</DropdownMenuItem>
						<DropdownMenuItem>Item 3</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</section>
		</main>
	);
}

export default LabsPage;
