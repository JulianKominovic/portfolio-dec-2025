import prettyMilliseconds from "pretty-ms";
import React from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
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

export function AvgRunTime({
	chartData,
}: {
	chartData: { filename: string; avgTime: number }[];
}) {
	const base = chartData[0];
	const best = chartData.reduce((acc, curr) =>
		acc.avgTime < curr.avgTime ? acc : curr,
	);
	const largestFilename = chartData.reduce((acc, curr) =>
		acc.filename.length > curr.filename.length ? acc : curr,
	);
	return (
		<Card hoverable={false} className="mb-12">
			<CardHeader>
				<CardTitle>Average run time</CardTitle>
				<CardDescription>
					This chart shows how long each test case takes to run 1 iteration on
					average.
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
							dataKey="avgTime"
							type="number"
							tickFormatter={(value) => {
								if (value === 0) return value;
								return prettyMilliseconds(value, {
									formatSubMilliseconds: true,
								});
							}}
						/>
						<ChartTooltip
							cursor={false}
							formatter={(value, _name, item) => {
								return (
									<p>
										<b>{item.payload.filename}</b>{" "}
										<span className="font-serif italic">took</span>{" "}
										{prettyMilliseconds(value as any, {
											formatSubMilliseconds: true,
										})}
									</p>
								);
							}}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar dataKey="avgTime" radius={5} />
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<p>
					<b>{base.filename}</b> is{" "}
					<span className={"text-card-foreground"}>the base (100%)</span>
				</p>
				{chartData.slice(1).map((data) => (
					<p key={data.filename + "resume"}>
						<b>{data.filename}</b> is{" "}
						<span
							className={
								data.avgTime < base.avgTime ? "text-green-700" : "text-red-700"
							}
						>
							{data.avgTime < base.avgTime ? "faster" : "slower"}
						</span>{" "}
						by{" "}
						{base.avgTime < data.avgTime
							? Math.abs(100 - (data.avgTime / base.avgTime) * 100).toFixed(2)
							: Math.abs(100 - (base.avgTime / data.avgTime) * 100).toFixed(2)}
						%
					</p>
				))}
				<span>
					Fastest test case is <b>{best.filename}</b> with{" "}
					{prettyMilliseconds(best.avgTime, {
						formatSubMilliseconds: true,
					})}
				</span>
			</CardFooter>
		</Card>
	);
}
