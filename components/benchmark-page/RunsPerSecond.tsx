import React from "react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

const BARSIZE = 40;
const BARGAP = 16;
const chartConfig = {
	filename: {
		label: "File name",
	},
} satisfies ChartConfig;

export function RunsPerSecond({
	chartData,
}: {
	chartData: { filename: string; totalIterations: number }[];
}) {
	const best = chartData.reduce((acc, curr) =>
		acc.totalIterations > curr.totalIterations ? acc : curr,
	);
	const largestFilename = chartData.reduce((acc, curr) =>
		acc.filename.length > curr.filename.length ? acc : curr,
	);
	return (
		<Card hoverable={false} className="mb-12 not-prose">
			<CardHeader>
				<CardTitle>Operations per second</CardTitle>
				<CardDescription>
					This chart shows the number of operations per second for each test
					case. The higher the number, the better.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					style={{
						height: chartData.length * (BARSIZE + BARGAP),
						width: "calc(100% - 1rem)",
					}}
					config={chartConfig}
				>
					<BarChart
						accessibilityLayer
						data={chartData.map((d) =>
							d.filename === best.filename ? { ...d, fill: "#118011" } : d,
						)}
						layout="vertical"
						margin={{
							left: 0,
						}}
					>
						<YAxis
							dataKey="filename"
							type="category"
							tickLine={false}
							tickMargin={0}
							width={largestFilename.filename.length * 6}
							axisLine={false}
						/>
						<XAxis
							dataKey="totalIterations"
							type="number"
							tickFormatter={(value) => {
								return Intl.NumberFormat().format(value);
							}}
						/>
						<ChartTooltip
							cursor={false}
							formatter={(value) => {
								return `${value} ops/sec`;
							}}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar
							dataKey="totalIterations"
							radius={5}
							minPointSize={best.totalIterations.toString().length * 7}
						>
							<LabelList
								dataKey="totalIterations"
								position="right"
								offset={8}
								className="fill-primary"
								id="totalIterations-label-list"
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				{chartData.map((data) => (
					<p key={data.filename + "resume"}>
						<b>{data.filename}</b> run {data.totalIterations.toLocaleString()}{" "}
						ops/sec
					</p>
				))}
				<span>
					Fastest test case is <b>{best.filename}</b> with{" "}
					{best.totalIterations.toLocaleString()} ops/sec
				</span>
			</CardFooter>
		</Card>
	);
}
