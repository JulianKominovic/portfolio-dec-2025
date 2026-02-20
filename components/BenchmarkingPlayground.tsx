"use client";
import {
	CheckCircle2,
	CircleDotIcon,
	Loader2Icon,
	Play,
	Plus,
	XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter } from "@/components/ui/card";
import KBD from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import { AvgRunTime } from "./benchmark-page/AvgRunTime";
import { RunsPerSecond } from "./benchmark-page/RunsPerSecond";
import Editor from "./Editor";
import { Button } from "./ui/button";

type BenchmarkingPlaygroundProps = {
	files?: {
		name: string;
		value: string;
		/**
		 * If this file is a test data file.
		 * Test data files are not included in the benchmarking.
		 * They are used to provide test data for the benchmarking files.
		 */
		testData?: boolean;
	}[];
	readonly?: boolean;
	/**
	 * To save in localStorage
	 */
	id: string;
};

function BenchmarkingPlayground({
	files: _files,
	id,
	readonly,
}: BenchmarkingPlaygroundProps) {
	const localStorageKey = `benchmarks-${id}`;
	const [files, setFiles] = useState<
		NonNullable<BenchmarkingPlaygroundProps["files"]>
	>(_files ?? []);
	const [savePending, setSavePending] = useState(false);
	const [worker, setWorker] = useState(
		typeof window !== "undefined" && new Worker("/sw/benchmarks.js"),
	);
	const filesCreated = useRef(1);
	const [activeIndex, setActiveIndex] = useState(0);
	const [status, setStatus] = useState<
		{ code: "IDLE" } | { code: "RUNNING" } | { code: "ERROR"; error: unknown }
	>({ code: "IDLE" });
	const [results, setResults] = useState<
		{
			avgTime: number;
			file: NonNullable<BenchmarkingPlaygroundProps["files"]>[0];
			error: unknown;
			totalIterations: number;
			totalTime: number;
		}[]
	>([]);
	const activeFile = files.at(activeIndex);
	useEffect(() => {
		if (typeof window !== "undefined" && localStorage && !readonly) {
			if (localStorage.getItem(localStorageKey)) {
				setFiles(JSON.parse(localStorage.getItem(localStorageKey) ?? "[]"));
			}
		}

		if (worker) {
			worker.onmessage = (event) => {
				setResults(event.data);
				if (event.data.error) {
					console.error("Error:", event.data.error);
					setStatus({ code: "ERROR", error: event.data.error });
				} else {
					setStatus({ code: "IDLE" });
				}
			};
			worker.onerror = (error) => {
				console.error("Error:", error);
				setResults([]);
				setStatus({ code: "ERROR", error });
			};
		}
		return () => {
			if (worker) worker.terminate();
		};
	}, []);

	useEffect(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				save();
			}
			if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				if (status.code === "IDLE") play();
				else stop();
			}
		}
		document.addEventListener("save", save);
		window.addEventListener("keydown", handleKeydown);
		return () => {
			document.removeEventListener("save", save);
			window.removeEventListener("keydown", handleKeydown);
		};
	}, [save, status]);

	function createFile() {
		filesCreated.current++;
		const name = `case-${filesCreated.current}.js`;
		setFiles((prev) => [...prev, { name, value: "// Go ahead 🚀" }]);
		setSavePending(true);
		setActiveIndex(files.length);
	}
	function removeFile(name: string) {
		let removedIndex = 0;
		const newFiles = [...files].filter((file, idx) => {
			if (file.name === name) removedIndex = idx;
			return file.name !== name;
		});
		setFiles(newFiles);
		setActiveIndex(Math.max(Math.min(removedIndex, newFiles.length - 1), 0));
		setSavePending(true);
	}
	function updateFileValue(name: string, value: string) {
		setFiles((prev) =>
			prev.map((file) => (file.name === name ? { ...file, value } : file)),
		);
		setSavePending(true);
	}
	function updateFileName(name: string, newName: string) {
		setFiles((prev) =>
			prev.map((file) =>
				file.name === name ? { ...file, name: newName } : file,
			),
		);
		setSavePending(true);
	}

	function play() {
		setStatus({ code: "RUNNING" });
		if (worker) worker.postMessage({ files });
	}
	function stop() {
		if (worker) worker.terminate();
		setStatus({ code: "IDLE" });
		const wrk = new Worker("/sw/benchmarks.js");
		setWorker(wrk);
		wrk.onmessage = (event) => {
			setResults(event.data);
			if (event.data.error) {
				console.error("Error:", event.data.error);
				setStatus({ code: "ERROR", error: event.data.error });
			} else {
				setStatus({ code: "IDLE" });
			}
		};
		wrk.onerror = (error) => {
			console.error("Error:", error);
			setResults([]);
			setStatus({ code: "ERROR", error });
		};
	}

	function save() {
		setSavePending(false);
		localStorage.setItem(
			localStorageKey,
			JSON.stringify(
				files.map(({ name, value, testData }) => ({ name, value, testData })),
			),
		);
	}
	return (
		<>
			<Card hoverable={false} className="mb-12 overflow-visible not-prose">
				<div className="flex items-start">
					<Button
						className="h-8 [&_svg]:size-[1em]"
						onClick={status.code === "IDLE" ? play : stop}
					>
						{status.code === "RUNNING" ? (
							<Loader2Icon className="animate-spin" />
						) : (
							<Play />
						)}
						<KBD
							id="play-stop-kbd"
							keys={["CTRL_OR_COMMAND", "ENTER"]}
							title="Play/Stop"
							className="text-xs bg-white/10"
						/>
					</Button>
					<ul className="flex w-full gap-2 pt-0 pb-4 pl-3 pr-6 overflow-x-auto">
						<Card
							asChild
							active={activeIndex === 0}
							className={cn(
								"h-8 p-0 translate-y-0 py-0 rounded-lg hover:translate-y-0 flex items-center gap-2 text-sm",
							)}
						>
							<li>
								<input
									onFocus={() => setActiveIndex(0)}
									data-editable="false"
									className="bg-transparent field-sizing-content max-w-32 focus:outline-none data-[editable='true']:cursor-text h-full px-3 cursor-pointer"
									defaultValue={files[0].name}
									readOnly
								/>
							</li>
						</Card>
						{files.map(({ name, testData }, idx) =>
							idx === 0 ? null : (
								<Card
									asChild
									active={idx === activeIndex}
									// biome-ignore lint/suspicious/noArrayIndexKey: index is used to create a unique key
									key={`${idx}-file`}
									className={cn(
										"h-8 translate-y-0 p-0 rounded-lg hover:translate-y-0 flex items-center gap-2 text-sm",
									)}
								>
									<li>
										<input
											readOnly={readonly}
											onFocus={() => setActiveIndex(idx)}
											data-editable="false"
											className={cn(
												"bg-transparent field-sizing-content max-w-32 focus:outline-none data-[editable='true']:cursor-text h-full pl-3 pr-0 cursor-pointer",
												readonly
													? "cursor-pointer pr-2 max-w-none"
													: "cursor-text",
											)}
											value={name}
											onChange={(e) => {
												const value = e.target.value;
												updateFileName(name, value);
											}}
										/>
										{readonly || testData ? null : (
											<button
												type="button"
												onClick={() => removeFile(name)}
												className="mr-2 rounded-lg hover:bg-black/10"
											>
												<XIcon size={"18px"} />
											</button>
										)}
									</li>
								</Card>
							),
						)}
						{readonly ? null : (
							<Card
								asChild
								className={cn(
									"h-8 translate-y-0 p-0 rounded-lg hover:translate-y-0 flex items-center gap-2 text-sm",
								)}
							>
								<li>
									<button
										type="button"
										onClick={createFile}
										className="flex items-center justify-center w-8 h-8 aspect-square"
									>
										<Plus size={"18px"} />
									</button>
								</li>
							</Card>
						)}
					</ul>
				</div>
				<Editor
					height="40vh"
					language="javascript"
					options={{
						minimap: { enabled: false },
						padding: { top: 16 },
						readOnly: readonly,
					}}
					wrapperProps={{
						className: "rounded-lg overflow-hidden shadow-natural",
					}}
					loading={
						<div className="flex items-center justify-center w-full h-full bg-white">
							Loading...
						</div>
					}
					defaultLanguage="javascript"
					value={
						typeof activeFile?.value === "string"
							? activeFile.value
							: "// Create a new file to start"
					}
					onChange={(value) =>
						activeFile &&
						!readonly &&
						updateFileValue(activeFile.name, value ?? "")
					}
					onMount={(editor, monaco) => {
						editor.addCommand(
							monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
							() => {
								editor.trigger("format", "editor.action.formatDocument", {});
								document.dispatchEvent(new Event("save"));
							},
						);
					}}
				/>
				{readonly ? null : (
					<CardFooter className="flex justify-between gap-2 pt-4 pb-0 text-sm">
						<hgroup className="flex items-center gap-2">
							<Badge
								variant={savePending ? "warning" : "success"}
								className="flex items-center gap-1"
							>
								{savePending ? (
									<>
										<CircleDotIcon size={"14px"} />
										Waiting for save
									</>
								) : (
									<>
										<CheckCircle2 size={"14px"} />
										Up to date
									</>
								)}
							</Badge>
							<div className="flex items-center truncate">
								<KBD
									id="save-kbd"
									keys={["CTRL_OR_COMMAND", "S"]}
									title="Save"
									className="mr-2"
								/>{" "}
								to save and format
							</div>
						</hgroup>
					</CardFooter>
				)}
			</Card>
			{results.length > 0 && (
				<>
					<h2 className="font-serif text-3xl font-bold leading-loose">
						Results
					</h2>
					<AvgRunTime
						chartData={results.map((r) => ({
							filename: r.file.name,
							avgTime: r.avgTime,
						}))}
					/>
					<RunsPerSecond
						chartData={results.map((r) => ({
							filename: r.file.name,
							totalIterations: r.totalIterations,
						}))}
					/>
				</>
			)}
		</>
	);
}

export default BenchmarkingPlayground;
