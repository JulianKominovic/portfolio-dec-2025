import { unstable_cache } from "next/cache";
import { Suspense } from "react";
import { EmbeddedTweet, TweetNotFound, TweetSkeleton } from "react-tweet";
import { getTweet as _getTweet } from "react-tweet/api";
import "./tweet-theme.css";
const getTweet = unstable_cache(
	async (id: string) => _getTweet(id),
	["tweet"],
	{ revalidate: 3600 * 24 * 365 }, // 1 year in seconds
);

const TweetPage = async ({ id }: { id: string }) => {
	try {
		const tweet = await getTweet(id);
		return tweet ? <EmbeddedTweet tweet={tweet} /> : <TweetNotFound />;
	} catch (error) {
		console.error(error);
		return <TweetNotFound error={error} />;
	}
};

const CacheableTweet = ({ id }: { id: string }) => (
	<Suspense fallback={<TweetSkeleton />}>
		<TweetPage id={id} />
	</Suspense>
);

export default CacheableTweet;
