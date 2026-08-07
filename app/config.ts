export const baseUrl =
	process.env.NODE_ENV === "development"
		? "http://localhost:3000"
		: "https://jkominovic.dev";

export const subroutes = {
	home: {
		hero: {
			url: `${baseUrl}/#hero`,
			title: "Hero",
		},
		projects: {
			url: `${baseUrl}/#projects`,
			title: "Projects",
		},
	},
	labs: {
		contextMenu: {
			url: `${baseUrl}/labs#context-menu`,
			title: "Context menu",
		},
		liquidEject: {
			url: `${baseUrl}/labs#liquid-eject`,
			title: "Liquid eject",
		},
		purchaseButton: {
			url: `${baseUrl}/labs#purchase-button`,
			title: "Purchase button",
		},
	},
};

export const routes = [
	{
		url: baseUrl,
		lastModified: new Date().toISOString().split("T")[0],
		title: "Home",
	},
	{
		url: `${baseUrl}/blog`,
		lastModified: new Date().toISOString().split("T")[0],
		title: "Blog",
	},
	{
		url: `${baseUrl}/labs`,
		lastModified: new Date().toISOString().split("T")[0],
		title: "Labs",
	},
	{
		url: `${baseUrl}/benchmarks`,
		lastModified: new Date().toISOString().split("T")[0],
		title: "Benchmarks",
	},
];
