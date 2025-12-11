import logoKoin from "../../public/logos/logo-koin.webp";
export const WORKING_EXPERIENCE = [
	{
		company: "Koin",
		title: "Software engineer II",
		startDate: "March 2025",
		endDate: "Present",
		logo: logoKoin,
		url: "https://www.koin.com.br",
	},
	{
		company: "Koin",
		title: "Software engineer I",
		startDate: "December 2023",
		endDate: "March 2025",
		logo: logoKoin,
		url: "https://www.koin.com.br",
	},
	{
		company: "Koin",
		title: "Software developer III",
		startDate: "February 2023",
		endDate: "December 2023",
		logo: logoKoin,
		url: "https://www.koin.com.br",
	},
	{
		company: "Koin",
		title: "Software developer II",
		startDate: "August 2022",
		endDate: "February 2023",
		logo: logoKoin,
		url: "https://www.koin.com.br",
	},
	{
		company: "Koin",
		title: "Software developer I",
		startDate: "January 2022",
		endDate: "August 2022",
		logo: logoKoin,
		url: "https://www.koin.com.br",
	},
];

/**
 *
 * @param year The year of the date.
 * @param month The month of the date. (1-12)
 * @param day
 * @returns
 */
function date(year: number, month: number, day: number) {
	return new Date(year, month - 1, day);
}

export const PROJECTS: {
	status: "In progress" | "Online" | "Deprecated";
	title: string;
	description: string;
	url: string;
	logo: string;
	year: number;
	progress: {
		title: string;
		description?: string;
		date: Date;
		image?: string;
		video?: string;
	}[];
}[] = [
	{
		status: "In progress",
		title: "Libritus",
		description:
			"Modern reading app designed to make reading simple, elegant, and enjoyable. Clean interface for exploring texts, highlighting key parts, and managing your reading experience without distractions. Built for curious minds. AI powered.",
		url: "https://github.com/JulianKominovic/libritus",
		logo: "logos/libritus-logo.webp",
		progress: [
			{
				title: "Lock horizontal scroll",
				description:
					"Lock the horizontal scroll and make the PDF stay in the center.",
				date: date(2025, 9, 25),
				image: "images/libritus/lock-horizontal-scroll.webp",
			},
			{
				title: "Essays (MVP)",
				description:
					"Create essays with a WYSIWYG editor (thanks to PlateJS). Custom mentions with @. Still needs a ton of work.",
				date: date(2025, 9, 23),
				image: "images/libritus/essays-mvp.webp",
				video: "videos/libritus/essays-mvp.mp4",
			},
			{
				title: "PDF preview",
				description: "Sneak peek of the PDF before opening it.",
				date: date(2025, 9, 23),
				image: "images/libritus/sneak-peek-pdf-sidebar.webp",
				video: "videos/libritus/sneak-peek-pdf-sidebar.mp4",
			},
			{
				title: "PDF search",
				description: "Search for text in the PDF.",
				date: date(2025, 9, 21),
				image: "images/libritus/pdf-search.webp",
			},
			{
				title: "App icon",
				description: "Every good app needs an icon.",
				date: date(2025, 9, 16),
				image: "images/libritus/dock-icon.webp",
			},
			{
				title: "Basic annotations",
				description: "Add annotations over highlighted text.",
				date: date(2025, 9, 16),
				image: "images/libritus/basic-annotations.webp",
			},
			{
				title: "Wikipedia overview",
				date: date(2025, 9, 15),
				description: "Select text and get a Wikipedia overview.",
				image: "images/libritus/wikipedia-overview.webp",
			},
			{
				title: "Dictionary",
				date: date(2025, 9, 15),
				description: "Select text and get a dictionary overview on the go.",
				image: "images/libritus/dictionary-overview.webp",
			},
			{
				title: "Highlights",
				date: date(2025, 9, 14),
				description: "Highlight text with different colors.",
				image: "images/libritus/highlights.webp",
			},
			{
				title: "Sidebar toggles",
				date: date(2025, 9, 13),
				description: "Toggle the right and left sidebar to focus on the PDF.",
				image: "images/libritus/toggleable-sidebars.webp",
			},
			{
				title: "Category edition",
				date: date(2025, 9, 12),
				image: "images/libritus/category-edition-video-preview.webp",
				video: "videos/libritus/category-edition.mp4",
				description: "Create and edit categories to organize your books.",
			},
			{
				title: "First steps",
				date: date(2025, 9, 11),
				image: "images/libritus/first-steps.webp",
				video: "videos/libritus/first-steps.mp4",
				description: "Layout, navigation, themes and pdf reader.",
			},
		],
		year: 2025,
	},
	{
		status: "In progress",
		title: "Braindump",
		description:
			"Capture your thoughts as they come. Find them the way your mind would.",
		url: "https://braindump.jkominovic.dev",
		logo: "logos/braindump.webp",
		year: 2025,
		progress: [
			{
				title: "Web articles",
				description: "Save web articles even if they go offline.",
				date: date(2025, 8, 31),
				video: "videos/braindump/web-articles.mp4",
				image: "images/braindump/web-articles.webp",
			},
			{
				title: "Redesign",
				description: "Updated cards organization. Added filters.",
				date: date(2025, 5, 18),
				image: "images/braindump/second-redesign.webp",
			},
			{
				title: "Collection list",
				description: "Show which collections a note belongs to.",
				date: date(2025, 5, 16),
				video: "videos/braindump/collection-chips.mp4",
				image: "images/braindump/collection-chips.webp",
			},
			{
				title: "Chrome extension",
				description: "One click to save bookmarks to Braindump.",
				date: date(2025, 5, 15),
				video: "videos/braindump/extension-first-iteration.mp4",
				image: "images/braindump/extension-first-iteration.webp",
			},
			{
				title: "View by date",
				description: "View notes by updated date.",
				date: date(2025, 5, 8),
				video: "videos/braindump/view-by-date.mp4",
				image: "images/braindump/view-by-date.webp",
			},
			{
				title: "Collections",
				description: "Create collections of notes to organize your thoughts.",
				date: date(2025, 5, 4),
				video: "videos/braindump/collections-demo.mp4",
				image: "images/braindump/collections-demo.webp",
			},
			{
				title: "Add to collection",
				description:
					"Assign notes to multiple collections from the context menu (right click).",
				date: date(2025, 5, 4),
				image: "images/braindump/note-add-to-collection.webp",
			},
			{
				title: "Note colors",
				description: "Notes can be colored to make them more readable.",
				date: date(2025, 5, 3),
				image: "images/braindump/note-colors.webp",
			},
			{
				title: "Choose note color",
				description:
					"Choose one color out of the palette from the context menu (right click).",
				date: date(2025, 5, 3),
				image: "images/braindump/note-choose-color.webp",
			},
			{
				title: "Comments",
				description: "Add comments or reflections to any card.",
				date: date(2025, 4, 15),
				video: "videos/braindump/comments.mp4",
			},
			{
				title: "First redesign",
				description: "Filters. Pagination. Search.",
				date: date(2025, 4, 10),
				image: "images/braindump/first-redesign.webp",
			},
			{
				title: "Backlinks",
				description: "Links to other notes are displayed as backlinks.",
				date: date(2025, 3, 24),
				video: "videos/braindump/backlinks.mp4",
			},
			{
				title: "PDF document",
				description:
					"Add a PDF document as a note card. E-Reader mode is available.",
				date: date(2025, 3, 21),
				video: "videos/braindump/pdf-card.mp4",
				image: "images/braindump/pdf-card.webp",
			},
			{
				title: "Card image",
				description: "Add an image as a note card.",
				date: date(2025, 3, 20),
				image: "images/braindump/card-image.webp",
			},
			{
				title: "Floating navbar",
				date: date(2025, 3, 19),
				image: "images/braindump/first-navbar.webp",
			},
			{
				title: "Twitter bookmarks",
				description: "Save tweets as notes.",
				date: date(2025, 3, 18),
				video: "videos/braindump/twitter-bookmarks.mp4",
			},
			{
				title: "Bookmarks!",
				description: "Save links as notes. Autoscrapping is available.",
				date: date(2025, 3, 18),
				video: "videos/braindump/first-bookmarks.mp4",
			},
			{
				title: "Context menu",
				description:
					"The context menu is a simple menu that appears when you right click on a note.",
				date: date(2025, 3, 17),
				video: "videos/braindump/first-context-menu.mp4",
			},
			{
				title: "Masonry layout",
				description: "The notes are displayed in a masonry layout.",
				date: date(2025, 3, 15),
				image: "images/braindump/first-masonry.webp",
			},
			{
				title: "First note card",
				description:
					"The first note card is a simple note card with just a title and content.",
				date: date(2025, 3, 15),
				video: "videos/braindump/first-note-card.mp4",
				image: "images/braindump/first-note-card.webp",
			},
			{
				title: "Home page design",
				description: "The home page is a simple list of notes.",
				date: date(2025, 3, 15),
				image: "images/braindump/first-home-page.webp",
			},
		],
	},
	{
		status: "Deprecated",
		title: "Mechy keyboard",
		description:
			"Give your keyboard a voice. Simulate the sounds of typing on a mechanical keyboard.",
		url: "https://mechy-keyboard.jkominovic.dev",
		logo: "logos/mechy-keyboard-logo.webp",
		year: 2025,
		progress: [
			{
				title: "App",
				description: "Release 1.0.0-beta.1",
				date: date(2025, 2, 15),
				image: "images/mechy-keyboard/app.webp",
			},
			{
				title: "Website",
				date: date(2025, 2, 5),
				image: "images/mechy-keyboard/website.webp",
			},
		],
	},
	{
		status: "Online",
		title: "Bentisca",
		description:
			"22 handcrafted social media bento cards thanks to Double Glitch's figma design and +3150 dynamic card icons using SimpleIcons.",
		url: "https://bentos.jkominovic.dev",
		logo: "logos/bentisca-logo.webp",
		year: 2024,
		progress: [
			{
				title: "Website",
				description: "API & documentation.",
				date: date(2024, 6, 30),
				image: "images/bentisca/website-demo.webp",
			},
			{
				title: "Handcrafted cards",
				date: date(2024, 6, 30),
				image: "images/bentisca/cards.webp",
			},
		],
	},
	{
		status: "Deprecated",
		title: "Live feedback",
		description:
			"Share development feedback with your team directly on the website.",
		url: "https://live-feedback.jkominovic.dev",
		logo: "logos/live-feedback.webp",
		year: 2024,
		progress: [
			{
				title: "Threads",
				description: "Simple way to organize feedback.",
				date: date(2024, 6, 12),
				image: "images/live-feedback/threads.webp",
			},
			{
				title: "Text highlight",
				date: date(2024, 5, 19),
				image: "images/live-feedback/text-highlight.webp",
			},
			{
				title: "Participant bubbles",
				description:
					"The participant bubbles are a simple way to identify the participants.",
				date: date(2024, 5, 1),
				image: "images/live-feedback/navbar-participants.png",
			},
			{
				title: "Floating feedback bubble",
				description:
					"The feedback bubble is a floating bubble cleverly attached to an element.",
				date: date(2024, 4, 30),
				image: "images/live-feedback/feedback-floating-bubble.webp",
			},
			{
				title: "Github integration",
				description: "Save feedback in a Github issue.",
				date: date(2024, 4, 28),
				image: "images/live-feedback/github-integration.png",
			},
			{
				title: "Navbar",
				date: date(2024, 4, 27),
				image: "images/live-feedback/navbar.png",
			},
		],
	},
	// {
	// 	status: "Deprecated",
	// 	title: "Clipboard manager",
	// 	description:
	// 		"Another offline, cool looking, comfortable, clipboard manager.",
	// 	url: "https://github.com/JulianKominovic/clipboard-manager",
	// 	logo: "logos/clippis.webp",
	// 	year: 2024,
	// 	progress: [
	// 		{
	// 			title: "Release 1.0.0",
	// 			description: "Only Ubuntu.",
	// 			date: date(2024, 6, 30),
	// 			image: "images/clippis/app.webp",
	// 		},
	// 	],
	// },
	{
		status: "Deprecated",
		title: "Sittly",
		description:
			"Launcher for Linux (gnome) similar to Raycast, Spotlight, Albert...",
		url: "https://github.com/JulianKominovic/sittly-launcher",
		logo: "logos/sittly.webp",
		year: 2023,
		progress: [
			{
				title: "Website",
				description: "Landing page, documentation and store.",
				date: date(2023, 8, 18),
				image: "images/sittly/banner.webp",
			},
			{
				title: "Extensions",
				description:
					"Download extensions created by the community from the store.",
				date: date(2023, 8, 15),
				image: "images/sittly/extensions.webp",
			},
			{
				title: "Context menu",
				description: "Shortcuts and actions for each item.",
				date: date(2023, 8, 6),
				image: "images/sittly/context-menu.webp",
			},
			{
				title: "Emojis",
				date: date(2023, 7, 1),
				image: "images/sittly/sittly-select-emoji.webp",
			},
		],
	},
];
