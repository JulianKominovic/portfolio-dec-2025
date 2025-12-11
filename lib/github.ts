const GITHUB_USERNAME = "JulianKominovic";
const GITHUB_API_URL = "https://api.github.com";
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

// Caché en memoria para desarrollo local (más agresivo)
const memoryCache = new Map<string, { data: unknown; expires: number }>();

// 24 horas en segundos para producción
const PRODUCTION_REVALIDATE = 86400; // 1 día
// 1 hora en desarrollo (pero con caché en memoria puede durar más)
const DEV_REVALIDATE = 3600;

function isDevelopment(): boolean {
	return process.env.NODE_ENV === "development";
}

function getCacheKey(type: "profile" | "contributions"): string {
	return `github-${type}-${GITHUB_USERNAME}`;
}

function getCachedData<T>(key: string): T | null {
	if (!isDevelopment()) {
		return null; // Solo usar caché en memoria en desarrollo
	}

	const cached = memoryCache.get(key);
	if (!cached) {
		return null;
	}

	if (Date.now() > cached.expires) {
		memoryCache.delete(key);
		return null;
	}

	return cached.data as T;
}

function setCachedData<T>(key: string, data: T, ttlSeconds: number): void {
	if (!isDevelopment()) {
		return; // Solo usar caché en memoria en desarrollo
	}

	memoryCache.set(key, {
		data,
		expires: Date.now() + ttlSeconds * 1000,
	});
}

export interface GitHubProfile {
	login: string;
	name: string | null;
	bio: string | null;
	avatar_url: string;
	followers: number;
	following: number;
	public_repos: number;
}

export interface ContributionDay {
	date: string;
	contributionCount: number;
	weekday: number;
}

export interface ContributionWeek {
	firstDay: string;
	contributionDays: ContributionDay[];
}

export interface GitHubContributions {
	totalCommitContributions: number;
	contributionCalendar: {
		weeks: ContributionWeek[];
	};
}

export interface GitHubData {
	profile: GitHubProfile;
	contributions: GitHubContributions;
}

async function fetchGitHubProfile(): Promise<GitHubProfile> {
	const cacheKey = getCacheKey("profile");
	const cached = getCachedData<GitHubProfile>(cacheKey);
	if (cached) {
		return cached;
	}

	const token = process.env.GITHUB_TOKEN;
	const headers: HeadersInit = {
		"User-Agent": "portfolio-app",
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const revalidate = isDevelopment() ? DEV_REVALIDATE : PRODUCTION_REVALIDATE;

	const response = await fetch(`${GITHUB_API_URL}/users/${GITHUB_USERNAME}`, {
		headers,
		next: { revalidate }, // Revalidar según el entorno
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch GitHub profile: ${response.statusText}`);
	}

	const data = await response.json();
	console.log("GitHub Profile Data headers", response.headers);
	// Guardar en caché en memoria para desarrollo
	setCachedData(cacheKey, data, revalidate);

	return data;
}

async function fetchGitHubContributions(): Promise<GitHubContributions> {
	const cacheKey = getCacheKey("contributions");
	const cached = getCachedData<GitHubContributions>(cacheKey);
	if (cached) {
		return cached;
	}

	const token = process.env.GITHUB_TOKEN;

	if (!token) {
		throw new Error("GITHUB_TOKEN environment variable is required");
	}

	// Calcular fechas: último año desde hoy
	const to = new Date();
	const from = new Date();
	from.setFullYear(from.getFullYear() - 1);

	const query = `
		query {
			user(login: "${GITHUB_USERNAME}") {
				contributionsCollection(from: "${from.toISOString()}", to: "${to.toISOString()}") {
					totalCommitContributions
					contributionCalendar {
						weeks {
							firstDay
							contributionDays {
								date
								contributionCount
								weekday
							}
						}
					}
				}
			}
		}
	`;

	const revalidate = isDevelopment() ? DEV_REVALIDATE : PRODUCTION_REVALIDATE;

	const response = await fetch(GITHUB_GRAPHQL_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ query }),
		next: { revalidate }, // Revalidar según el entorno
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch GitHub contributions: ${response.statusText}`,
		);
	}

	const data = await response.json();

	if (data.errors) {
		throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
	}

	const contributions = data.data.user.contributionsCollection;

	// Guardar en caché en memoria para desarrollo
	setCachedData(cacheKey, contributions, revalidate);

	return contributions;
}

export async function getGitHubData(): Promise<GitHubData> {
	const [profile, contributions] = await Promise.all([
		fetchGitHubProfile(),
		fetchGitHubContributions(),
	]);

	return {
		profile,
		contributions,
	};
}

export function getContributionIntensity(count: number): string {
	if (count === 0) return "bg-neutral-100";
	if (count <= 2) return "bg-green-200";
	if (count <= 5) return "bg-green-400";
	if (count <= 10) return "bg-green-600";
	return "bg-green-800";
}
export function getContributionBorderIntensity(count: number): string {
	if (count === 0) return "border-neutral-400";
	if (count <= 2) return "border-green-400";
	if (count <= 5) return "border-green-600";
	if (count <= 10) return "border-green-800";
	return "border-green-1000";
}

export function getTotalContributions(
	contributions: GitHubContributions,
): number {
	return contributions.contributionCalendar.weeks.reduce(
		(total, week) =>
			total +
			week.contributionDays.reduce(
				(weekTotal, day) => weekTotal + day.contributionCount,
				0,
			),
		0,
	);
}
