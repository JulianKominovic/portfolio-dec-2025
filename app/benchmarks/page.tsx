import type { Metadata } from "next";
import BenchmarkingPlayground from "@/components/BenchmarkingPlayground";
import { createMetadata } from "@/lib/utils";

export const metadata: Metadata = createMetadata({
	title: "Javascript benchmarking playground by Julian Kominovic",
	description:
		"A simple yet useful Javascript Benchmarking Playground. Test your code performance and compare it with others. Compare CPU time of different algorithms and find the most efficient one. Visualize your results and share them with your team.",
	ogImage: "https://jkominovic.dev/images/assets/og-benchmarking.png",
	keywords: [
		"Benchmarking",
		"Playground",
		"Tool",
		"Javascript",
		"JS",
		"Performance",
		"Stats",
		"Algorithms",
		"Data Structures",
		"Performance",
	],
});

export default function BenchmarksPage() {
	return (
		<main className="mx-auto max-w-5xl px-4 pt-20">
			<h1 className="font-serif text-5xl font-bold leading-tight">
				Benchmarks
			</h1>
			<h2 className="mb-16 text-muted-foreground">
				Test your code performance and compare it with others
			</h2>
			<BenchmarkingPlayground
				id="benchmarks-demo"
				files={[
					{
						name: "test-data",
						value: `// Put your test data here.
    // Variables declared here will be available in the test code.
    // You can use this 'arr' variable in your test code.
    this.arr = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 1000));
    `,
						testData: true,
					},
					{
						name: "bubble-sort",
						value: `// Bubble sort algorithm
        for (var i = 0; i < arr.length; i++) {
          for (var j = 0; j < (arr.length - i - 1); j++) {
                if (arr[j] > arr[j + 1]) {
                    var temp = arr[j]
                    arr[j] = arr[j + 1]
                    arr[j + 1] = temp
                }
            }
        }
            `,
					},
					{
						name: "merge-sort",
						value: `// Merge sort algorithm
        function merge(arr, left, mid, right) {
            const n1 = mid - left + 1;
            const n2 = right - mid;
        
            // Create temp arrays
            const L = new Array(n1);
            const R = new Array(n2);
        
            // Copy data to temp arrays L[] and R[]
            for (let i = 0; i < n1; i++)
                L[i] = arr[left + i];
            for (let j = 0; j < n2; j++)
                R[j] = arr[mid + 1 + j];
        
            let i = 0, j = 0;
            let k = left;
        
            // Merge the temp arrays back into arr[left..right]
            while (i < n1 && j < n2) {
                if (L[i] <= R[j]) {
                    arr[k] = L[i];
                    i++;
                } else {
                    arr[k] = R[j];
                    j++;
                }
                k++;
            }
        
            // Copy the remaining elements of L[], if there are any
            while (i < n1) {
                arr[k] = L[i];
                i++;
                k++;
            }
        
            // Copy the remaining elements of R[], if there are any
            while (j < n2) {
                arr[k] = R[j];
                j++;
                k++;
            }
        }
        
        function mergeSort(arr, left, right) {
            if (left >= right)
                return;
        
            const mid = Math.floor(left + (right - left) / 2);
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
        
        mergeSort(arr, 0, arr.length - 1);`,
					},
					{
						name: "native-sort",
						value: `// Native sort algorithm
        arr.sort((a, b) => a - b);`,
					},
				]}
			/>
			<h2 className="font-serif text-3xl font-bold leading-loose">Tips</h2>
			<ul className="mb-12 list-disc list-inside text-neutral-600">
				<li>
					<b className="text-neutral-900">Use bigger test data sets</b> whenever
					possible to get more accurate results. The test data is available in
					the first file and only initialized once before the tests are run.
				</li>
			</ul>
			<h2 className="font-serif text-3xl font-bold leading-loose">
				Disclaimers
			</h2>
			<ul className="list-disc list-inside text-neutral-600">
				<li>
					<b className="text-neutral-900">Results may vary</b> based on your
					machine, browser, OS and a thousand other factors that are out of our
					control.
				</li>
				<li>
					<b className="text-neutral-900">
						Use this tool for relative comparison
					</b>{" "}
					and not as an absolute benchmarking tool.
				</li>
				<li>
					<b className="text-neutral-900">Runs on dedicated worker</b> to
					achieve consistent results. Absolute run time may vary. Your tests may
					run faster in a real environment.
				</li>
				<li>
					<b className="text-neutral-900">Tests are sequential</b> and not
					parallelized. This is to ensure consistent results and prevent workers
					to compete for resources.
				</li>
				<li>
					<b className="text-neutral-900">
						Each test will run for at least 1 second.
					</b>{" "}
					Please be patient 😁.
				</li>
			</ul>
		</main>
	);
}
