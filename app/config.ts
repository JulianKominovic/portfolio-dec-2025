export const baseUrl = "https://jkominovic.dev";

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
		url: `${baseUrl}/benchmarks`,
		lastModified: new Date().toISOString().split("T")[0],
		title: "Benchmarks",
	},
];
