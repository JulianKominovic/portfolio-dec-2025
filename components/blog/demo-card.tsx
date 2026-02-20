import type React from "react";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"div">;

function DemoCard({ children, className, ...props }: Props) {
	return (
		<div
			className={cn("bg-card p-4 rounded-2xl mb-8 shadow-border", className)}
			{...props}
		>
			{children}
		</div>
	);
}

export default DemoCard;
