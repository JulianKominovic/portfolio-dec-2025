import clsx from "clsx";
import Image from "next/image";
import {
	type GitHubData,
	getContributionBorderIntensity,
	getContributionIntensity,
	getGitHubData,
	getTotalContributions,
} from "@/lib/github";

function ContributionGraph({ data }: { data: GitHubData }) {
	const weeks = data.contributions.contributionCalendar.weeks;
	const totalContributions = getTotalContributions(data.contributions);

	// Obtener el máximo de contribuciones en un día para normalizar
	const maxContributions = Math.max(
		...weeks.flatMap((week) =>
			week.contributionDays.map((day) => day.contributionCount),
		),
		1, // Evitar división por cero
	);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex gap-1 overflow-x-auto">
				{weeks.map((week) => (
					<div key={week.firstDay} className="flex flex-col gap-1">
						{week.contributionDays.map((day, dayIndex) => {
							const intensity = getContributionIntensity(day.contributionCount);
							const borderIntensity = getContributionBorderIntensity(
								day.contributionCount,
							);
							const opacity = Math.max(
								0.2,
								Math.min(1, day.contributionCount / maxContributions),
							);

							return (
								<div
									key={`${week.firstDay}-${dayIndex}`}
									className={clsx(
										"size-3 rounded-sm border",
										intensity,
										borderIntensity,
									)}
									style={{
										opacity: day.contributionCount > 0 ? opacity : 0.1,
									}}
									title={`${day.date}: ${day.contributionCount} contributions`}
								/>
							);
						})}
					</div>
				))}
			</div>
			<p className="text-sm text-neutral-400">
				{totalContributions.toLocaleString()} contributions in the last year
			</p>
		</div>
	);
}

export default async function GitHubActivity() {
	let data: GitHubData;

	try {
		data = await getGitHubData();
	} catch (error) {
		console.error("Failed to fetch GitHub data:", error);
		return (
			<>
				<p className="px-3 text-sm text-neutral-400">GitHub Activity</p>
				<div className="h-full p-4 overflow-auto squircle bg-neutral-100 flex items-center justify-center">
					<p className="text-sm text-neutral-400">
						Unable to load GitHub activity
					</p>
				</div>
			</>
		);
	}

	return (
		<div className="h-full overflow-y-hidden flex flex-col gap-4">
			{/* Header con perfil */}
			<a
				href="https://github.com/JulianKominovic"
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-start gap-1"
			>
				<Image
					src={data.profile.avatar_url}
					alt={data.profile.login}
					width={28}
					height={28}
					className="rounded-[50%]"
				/>
				<div className="flex-1 mb-2">
					<h2 className="font-serif text-sm">
						{data.profile.name || data.profile.login}
					</h2>
					{data.profile.bio && (
						<p className="text-xs text-neutral-400">{data.profile.bio}</p>
					)}
				</div>
				{/* Estadísticas */}
				<div className="grid grid-cols-3 gap-4">
					<div>
						<p className="text-xs text-neutral-400">Followers</p>
						<p className="font-serif text-sm">
							{data.profile.followers.toLocaleString()}
						</p>
					</div>
					<div>
						<p className="text-xs text-neutral-400">Following</p>
						<p className="font-serif text-sm">
							{data.profile.following.toLocaleString()}
						</p>
					</div>
					<div>
						<p className="text-xs text-neutral-400">Repos</p>
						<p className="font-serif text-sm">
							{data.profile.public_repos.toLocaleString()}
						</p>
					</div>
				</div>
			</a>

			{/* Gráfico de contribuciones */}
			<ContributionGraph data={data} />
		</div>
	);
}
