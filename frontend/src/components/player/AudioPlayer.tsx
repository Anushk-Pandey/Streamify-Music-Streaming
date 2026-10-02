import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  Radio,
  AlertCircle,
} from "lucide-react";
import { usePlayerStore } from "../../store/usePlayerStore";
import { formatDuration } from "../../lib/utils";

export const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    togglePlay,
    playNext,
    playPrevious,
    setCurrentTime,
    setDuration,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  // Audio element source loading and play/pause synchronization
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentSong?.audioUrl) {
      setAudioError(null);
      if (audio.src !== currentSong.audioUrl) {
        audio.src = currentSong.audioUrl;
        audio.load();
      }

      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Audio playback notice:", err.message);
            if (err.name === "NotAllowedError") {
              setAudioError("Click Play to start audio");
            }
          });
        }
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
    }
  }, [currentSong, isPlaying]);

  // Volume synchronization
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleEnded = () => {
    playNext();
  };

  const handleAudioError = (e: any) => {
    console.warn("Audio error encountered:", e);
    setAudioError("Unable to load audio stream. Skipping to next...");
    setTimeout(() => {
      setAudioError(null);
    }, 3000);
  };

  return (
    <>
      {/* Permanent, unmount-safe HTML5 Audio Engine */}
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleAudioError}
        onCanPlay={() => {
          if (isPlaying && audioRef.current?.paused) {
            audioRef.current.play().catch(() => {});
          }
        }}
      />

      {!currentSong ? (
        <div className="h-20 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/80 px-4 md:px-6 flex items-center justify-between z-40 fixed bottom-0 left-0 right-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-300">Streamify Ready</p>
              <p className="text-xs text-zinc-500">
                Click any song or "Play Featured Track" to start listening
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-24 md:h-20 bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-800/80 px-4 md:px-6 flex items-center justify-between z-40 fixed bottom-0 left-0 right-0 shadow-2xl">
          {/* Left: Song Info */}
          <div className="flex items-center gap-3 w-1/4 min-w-[160px]">
            <div className="relative group w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0 shadow-md">
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-0.5">
                  <span className="eq-bar" />
                  <span className="eq-bar" />
                  <span className="eq-bar" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">
                {currentSong.title}
              </h4>
              <p className="text-xs text-zinc-400 truncate mt-0.5">{currentSong.artist}</p>
              {audioError && (
                <span className="text-[10px] text-amber-400 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" />
                  {audioError}
                </span>
              )}
            </div>

            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-1.5 rounded-lg transition-colors hidden sm:block ${
                isLiked ? "text-emerald-400" : "text-zinc-500 hover:text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-emerald-400" : ""}`} />
            </button>
          </div>

          {/* Center: Playback Controls & Progress Bar */}
          <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-xl">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleShuffle}
                title="Shuffle"
                className={`p-1.5 rounded-lg transition-colors ${
                  isShuffle ? "text-emerald-400" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={playPrevious}
                title="Previous"
                className="p-1.5 text-zinc-300 hover:text-white transition-colors"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                title={isPlaying ? "Pause" : "Play"}
                className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current translate-x-0.5" />
                )}
              </button>

              <button
                onClick={playNext}
                title="Next"
                className="p-1.5 text-zinc-300 hover:text-white transition-colors"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={toggleRepeat}
                title="Repeat"
                className={`p-1.5 rounded-lg transition-colors ${
                  isRepeat ? "text-emerald-400" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Time Scrubber */}
            <div className="w-full flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
              <span>{formatDuration(currentTime)}</span>
              <div className="relative flex-1 flex items-center">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
                />
              </div>
              <span>{formatDuration(duration || currentSong.duration)}</span>
            </div>
          </div>

          {/* Right: Volume & Mute */}
          <div className="flex items-center justify-end gap-3 w-1/4 min-w-[160px]">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-16 md:w-24 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
