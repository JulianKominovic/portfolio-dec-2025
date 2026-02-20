/** biome-ignore-all lint/suspicious/noArrayIndexKey: shh*/
import { useId } from "react";

export function SimpleTable({
	headers,
	rows,
}: {
	headers: string[];
	rows: string[][];
}) {
	const id = useId();

	if (!headers || !rows) return null;
	return (
		<table>
			<thead>
				<tr>
					{headers.map((header, index) => (
						<th key={`${id}-header-${index}`}>{header}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.map((row, index) => (
					<tr key={`${id}-row-${index}`}>
						{row.map((cell, cellIndex) => (
							<td key={`${id}-cell-${index}-${cellIndex}`}>{cell}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}
