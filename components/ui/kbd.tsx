import { CommandIcon } from "lucide-react";
import React from "react";
import OnlyClientSide from "@/components/OnlyClientSide";
import { cn, detectMacOSOrIOS } from "@/lib/utils";

type Props = {
	keys: Keys[];
	id: string;
} & React.HTMLProps<HTMLDivElement>;
type Keys =
	| "CTRL_OR_COMMAND"
	| "Q"
	| "W"
	| "E"
	| "R"
	| "T"
	| "Y"
	| "U"
	| "I"
	| "O"
	| "P"
	| "A"
	| "S"
	| "D"
	| "F"
	| "G"
	| "H"
	| "J"
	| "K"
	| "L"
	| "Z"
	| "X"
	| "C"
	| "V"
	| "B"
	| "N"
	| "M"
	| "SPACE"
	| "CTRL"
	| "ALT"
	| "SHIFT"
	| "TAB"
	| "ENTER"
	| "BACKSPACE"
	| "DELETE"
	| "ARROWUP"
	| "ARROWDOWN"
	| "ARROWLEFT"
	| "ARROWRIGHT"
	| "ESC"
	| "F1"
	| "F2"
	| "F3"
	| "F4"
	| "F5"
	| "F6"
	| "F7"
	| "F8"
	| "F9"
	| "F10"
	| "F11"
	| "F12";

function KBD({ keys, className, id, key, ...rest }: Props) {
	return (
		<OnlyClientSide key={key}>
			<div
				className={cn(
					"flex items-center gap-1 px-1.5 rounded-sm border border-black/5 bg-black/3",
					className,
				)}
				key={key}
				{...rest}
			>
				{keys.map((key, index) => {
					const postfix = index === keys.length - 1 ? "" : "+";
					let k = key as Keys | React.ReactNode;

					switch (k) {
						case "CTRL_OR_COMMAND":
							k = detectMacOSOrIOS() ? (
								<CommandIcon size={"1em"} className="m-0" />
							) : (
								"Ctrl"
							);
							break;
						case "SPACE":
							k = "␣";
							break;
						case "ENTER":
							k = "↵";
							break;
					}

					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: index is used to create a unique key
						<React.Fragment key={id + key + index}>
							<kbd className="m-0 font-mono">{k}</kbd>
							{postfix}
						</React.Fragment>
					);
				})}
			</div>
		</OnlyClientSide>
	);
}

export default KBD;
