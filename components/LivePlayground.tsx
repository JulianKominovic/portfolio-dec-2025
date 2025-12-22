import { Sandpack, type SandpackFiles } from "@codesandbox/sandpack-react";

type Props = {
	files?: SandpackFiles;
	layout?: "preview" | "tests" | "console";
};

function LivePlayground({ files, layout = "console" }: Props) {
	return (
		<Sandpack
			options={{
				layout,
			}}
			files={files ?? { "index.js": "" }}
			theme="light"
		/>
	);
}

export default LivePlayground;
