"use client";
import EditorMonaco from "@monaco-editor/react";
import type React from "react";

function Editor(props: React.ComponentProps<typeof EditorMonaco>) {
	return (
		<EditorMonaco
			options={{
				minimap: { enabled: false },
				padding: { top: 16 },
				readOnly: true,
			}}
			wrapperProps={{
				className: "rounded-lg overflow-hidden shadow-natural",
			}}
			height="40vh"
			loading={
				<div className="flex items-center justify-center w-full h-full bg-white">
					Loading...
				</div>
			}
			{...props}
		/>
	);
}

export default Editor;
