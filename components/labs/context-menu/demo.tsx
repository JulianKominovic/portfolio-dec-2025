"use client";

import {
	ArchiveIcon,
	CopyIcon,
	PencilIcon,
	ShareIcon,
	Trash2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuTrigger,
} from "./index";

function DemoTriggerCard({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"w-full select-none rounded-2xl border border-black/8 bg-neutral-50 p-4 shadow-border",
				className,
			)}
		>
			<div className="mb-3 aspect-16/10 overflow-hidden rounded-xl bg-linear-to-br from-neutral-200 via-neutral-100 to-neutral-300">
				<div className="flex h-full items-end p-3">
					<span className="rounded-md bg-white/80 px-2 py-1 font-mono text-[10px] tracking-wide text-neutral-600 backdrop-blur-sm">
						Right-click me
					</span>
				</div>
			</div>
			<p className="text-balance text-base font-medium text-neutral-900">
				Cinematic context menu
			</p>
			<p className="mt-1 text-pretty text-sm text-neutral-500">
				Scroll so this card is clipped, then right-click — the trigger lifts
				into view and leaves an empty slot behind.
			</p>
		</div>
	);
}

export function CinematicContextMenuDemo() {
	return (
		<div className="h-190 overflow-auto rounded-xl bg-card shadow-border mx-auto">
			<div className="flex min-h-190 flex-col justify-end px-4 pt-16 pb-6 w-[200vw] bg-card">
				<p className="mb-4 text-center text-xs text-neutral-400">
					Scroll down, then right-click the card near the edge
				</p>
				<div className="flex justify-center">
					<ContextMenu>
						<ContextMenuTrigger className="w-full max-w-sm">
							<DemoTriggerCard />
						</ContextMenuTrigger>

						<ContextMenuContent>
							<ContextMenuItem>
								<PencilIcon />
								Edit
								<ContextMenuShortcut>⌘E</ContextMenuShortcut>
							</ContextMenuItem>
							<ContextMenuItem>
								<CopyIcon />
								Duplicate
								<ContextMenuShortcut>⌘D</ContextMenuShortcut>
							</ContextMenuItem>
							<ContextMenuSeparator />
							<ContextMenuItem>
								<ShareIcon />
								Share
							</ContextMenuItem>
							<ContextMenuItem>
								<ArchiveIcon />
								Archive
								<ContextMenuShortcut>⌘N</ContextMenuShortcut>
							</ContextMenuItem>
							<ContextMenuSeparator />
							<ContextMenuItem variant="destructive">
								<Trash2Icon />
								Delete
								<ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
							</ContextMenuItem>
						</ContextMenuContent>
					</ContextMenu>
				</div>
			</div>
		</div>
	);
}
