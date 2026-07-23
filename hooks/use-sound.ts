"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { decodeAudioData, playSound, type SoundPlayback } from "@/lib/sound-engine";
import type {
	PlayFunction,
	SoundAsset,
	UseSoundOptions,
	UseSoundReturn,
} from "@/lib/sound-types";

function prefersReducedMotion(): boolean {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Play a {@link SoundAsset} with shared Web Audio decoding/caching.
 * API mirrors Josh Comeau’s use-sound: `const [play] = useSound(asset)`.
 */
export function useSound(
	sound: SoundAsset,
	options: UseSoundOptions = {},
): UseSoundReturn {
	const playbackRef = useRef<SoundPlayback | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const optionsRef = useRef(options);
	optionsRef.current = options;

	useEffect(() => {
		void decodeAudioData(sound.dataUri).catch(() => {});
	}, [sound.dataUri]);

	useEffect(() => {
		return () => {
			playbackRef.current?.stop();
			playbackRef.current = null;
		};
	}, []);

	const stop = useCallback(() => {
		playbackRef.current?.stop();
		playbackRef.current = null;
		setIsPlaying(false);
		optionsRef.current.onStop?.();
	}, []);

	const pause = useCallback(() => {
		playbackRef.current?.stop();
		playbackRef.current = null;
		setIsPlaying(false);
		optionsRef.current.onPause?.();
	}, []);

	const play = useCallback<PlayFunction>(
		(overrides) => {
			const opts = optionsRef.current;
			if (opts.soundEnabled === false) return;
			if (prefersReducedMotion()) return;

			if (opts.interrupt) {
				playbackRef.current?.stop();
				playbackRef.current = null;
			}

			opts.onPlay?.();
			setIsPlaying(true);

			void playSound(sound.dataUri, {
				volume: overrides?.volume ?? opts.volume ?? 1,
				playbackRate: overrides?.playbackRate ?? opts.playbackRate ?? 1,
				onEnd: () => {
					playbackRef.current = null;
					setIsPlaying(false);
					opts.onEnd?.();
				},
			})
				.then((playback) => {
					playbackRef.current = playback;
				})
				.catch(() => {
					setIsPlaying(false);
				});
		},
		[sound.dataUri],
	);

	return [
		play,
		{
			stop,
			pause,
			isPlaying,
			duration: sound.duration,
			sound,
		},
	] as const;
}
