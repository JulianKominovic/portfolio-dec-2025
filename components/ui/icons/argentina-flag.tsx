import type React from "react";

type Props = React.SVGProps<SVGSVGElement>;

function ArgentinaFlag(props: Props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			viewBox="0 0 512 512"
			{...props}
		>
			<title>Argentina Flag</title>
			<path fill="#74acdf" d="M0 0h512v512H0z" />
			<path fill="#fff" d="M0 171h512v170H0z" />
			<g id="c" transform="matrix(1.02 0 0 1.02 -154 0)">
				<path
					id="a"
					fill="#f6b40e"
					stroke="#85340a"
					strokeWidth="1.1"
					d="m397 251 28 62 2 1v-1l-24-64m0 24c-1 9 5 14 4 23s4 13 5 16v6c1 0 3-2 2-7s-4-6-3-16-4-13-3-22"
				/>
				<use
					xlinkHref="#a"
					width="100%"
					height="100%"
					transform="rotate(23 400 250)"
				/>
				<use
					xlinkHref="#a"
					width="100%"
					height="100%"
					transform="rotate(45 400 250)"
				/>
				<use
					xlinkHref="#a"
					width="100%"
					height="100%"
					transform="rotate(68 400 250)"
				/>
				<path
					id="b"
					fill="#85340a"
					d="M404 274c1 9 6 13 5 22 2-7-3-12-3-22m-8-23 20 42-16-44"
				/>
				<use
					xlinkHref="#b"
					width="100%"
					height="100%"
					transform="rotate(23 400 250)"
				/>
				<use
					xlinkHref="#b"
					width="100%"
					height="100%"
					transform="rotate(45 400 250)"
				/>
				<use
					xlinkHref="#b"
					width="100%"
					height="100%"
					transform="rotate(68 400 250)"
				/>
			</g>
			<use
				xlinkHref="#c"
				width="100%"
				height="100%"
				transform="rotate(90 256 256)"
			/>
			<use
				xlinkHref="#c"
				width="100%"
				height="100%"
				transform="rotate(180 256 256)"
			/>
			<use
				xlinkHref="#c"
				width="100%"
				height="100%"
				transform="rotate(-90 256 256)"
			/>
			<circle
				cx="256"
				cy="256"
				r="28.4"
				fill="#f6b40e"
				stroke="#85340a"
				strokeWidth="1.5"
			/>
			<path
				id="h"
				fill="#843511"
				strokeWidth="1"
				d="M266 250q-3 0-5 3c2 2 7 2 10-1a8 8 0 0 0-5-2zm0 0 4 2c-3 2-6 2-8 0q1-2 4-2"
			/>
			<use
				xlinkHref="#d"
				width="100%"
				height="100%"
				transform="matrix(-1 0 0 1 512 0)"
			/>
			<use
				xlinkHref="#e"
				width="100%"
				height="100%"
				transform="matrix(-1 0 0 1 512 0)"
			/>
			<use
				xlinkHref="#f"
				width="100%"
				height="100%"
				transform="translate(19)"
			/>
			<use
				xlinkHref="#g"
				width="100%"
				height="100%"
				transform="matrix(-1 0 0 1 512 0)"
			/>
			<path
				fill="#85340a"
				d="M252 260a2 2 0 1 0 2 3l2 1 3-1 1 1a2 2 0 0 0 1-4l1 1a1 1 0 0 1-3 0 3 3 0 0 1-3 2 3 3 0 0 1-3-2l-1 2a1 1 0 0 1 0-3zm2 6c-2 0-3 2-5 3l3-2h8l3 2c-2-1-3-3-5-3a6 6 0 0 0-2 0h-2"
			/>
			<path fill="#85340a" d="m253 268-4 1c4-1 5 1 7 1s3-2 7-1h-7l-3-1" />
			<path
				fill="#85340a"
				d="M250 269h-1c4 1 2 3 7 3s3-2 7-3c-5 0-3 3-7 3s-3-3-6-3"
			/>
			<path fill="#85340a" d="M260 276a4 4 0 0 0-8 0 4 4 0 0 1 8 0" />
			<path
				id="e"
				fill="#85340a"
				strokeWidth="1"
				d="M238 250c5-4 12-5 15-2a9 9 0 0 1 2 4q1 4-2 8h1q2-5 1-10l-1-2c-4-4-11-5-16 2"
			/>
			<path
				id="d"
				fill="#85340a"
				strokeWidth="1"
				d="m246 249 5 1 2 1v1l-3-2-4-1c-4 0-6 3-6 3s2-3 6-3"
			/>
			<use
				xlinkHref="#h"
				width="100%"
				height="100%"
				transform="translate(-20)"
			/>
			<circle
				id="f"
				cx="246.3"
				cy="252.1"
				r="2"
				fill="#85340a"
				strokeWidth="1"
			/>
			<path
				id="g"
				fill="#85340a"
				strokeWidth="1"
				d="M241 253c4 3 7 3 10 2s2-2 1-2l-2 1c-1 1-5 1-9-1z"
			/>
		</svg>
	);
}

export default ArgentinaFlag;
