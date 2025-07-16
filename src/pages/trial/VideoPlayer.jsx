import { useRef, useState, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  CirclePlayIcon,
} from 'lucide-react';

export default function VideoPlayer({
  url,
  onProgressUpdate = () => { },
  progressData,
  className = "",
}) {
  const playerRef = useRef(null);
  const wrapperRef = useRef(null);
  const delayTimeout = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const formatTime = (seconds) => {
    const pad = (string) => ("0" + string).slice(-2);
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    return hh ? `${hh}:${pad(mm)}:${ss}` : `${mm}:${ss}`;
  };

  const handleSeekChange = (e) => {
    if (!isPlayerReady || !playerRef.current) return;
    const value = parseFloat(e.target.value) / 100;
    setSeeking(true);
    setPlayed(value * 100);
  };

  const handleSeekMouseUp = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(played / 100);
    setSeeking(false);
  };

  const handleForward = () => {
    if (!isPlayerReady || !playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + 5);
  };

  const handleBackward = () => {
    if (!isPlayerReady || !playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(Math.max(currentTime - 5, 0));
  };

  const toggleFullscreen = useCallback(() => {
    if (screenfull.isEnabled && wrapperRef.current) {
      if (screenfull.isFullscreen) {
        screenfull.exit();
      } else {
        screenfull.request(wrapperRef.current);
      }
    }
  }, []);

  useEffect(() => {
    const onFullScreenChange = () => {
      setIsFullScreen(screenfull.isFullscreen);
    };

    if (screenfull.isEnabled) {
      screenfull.on('change', onFullScreenChange);
    }

    return () => {
      if (screenfull.isEnabled) {
        screenfull.off('change', onFullScreenChange);
      }
    };
  }, []);

  useEffect(() => {
    setVideoEnded(false);
    setPlayed(0);
    setSeeking(false);
    setIsPlaying(false);
    setShowOverlay(false);
  }, [url]);


  useEffect(() => {
    clearTimeout(delayTimeout.current);
    if (isHovered || !isPlaying || videoEnded) {
      setShowOverlay(true);
    } else {
      delayTimeout.current = setTimeout(() => {
        setShowOverlay(false);
      }, 3500);
    }
    return () => clearTimeout(delayTimeout.current);
  }, [isHovered, isPlaying, videoEnded]);

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full bg-black rounded-lg overflow-hidden shadow-lg ${className}`}
    >
      <div className="relative aspect-video">
        <ReactPlayer
          ref={playerRef}
          url={url}
          controls={false}
          playing={isPlaying}
          muted={isMuted}
          volume={volume}
          width="100%"
          height="100%"
          onReady={() => setIsPlayerReady(true)}
          onProgress={({ played, playedSeconds }) => {
            if (!seeking) setPlayed(played * 100);

            const duration = playerRef.current?.getDuration?.() || 0;
            if (duration && duration - playedSeconds < 0.9) {
              onProgressUpdate({
                ...progressData,
                progressValue: 1,
              });
              setPlayed(0)
            }
          }}
          onPause={() => setIsPlaying(false)}
          onPlay={() => {
            setIsPlaying(true);
            setVideoEnded(false);
          }}
          onEnded={() => {
            setIsPlaying(false);
            setVideoEnded(true);
            setShowOverlay(true);
          }}
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1,
                rel: 0,
                controls: 0,
                disablekb: 1,
              },
            },
          }}
        />

        {showOverlay && (
          <div className="absolute h-16 w-full top-0 z-20 bg-black flex items-center justify-center text-white text-sm font-medium">
            {/* Optional: Add overlay message */}
          </div>
        )}

        {videoEnded && (
          <div className="absolute inset-0 z-30 bg-black flex flex-col items-center justify-center text-white text-xl font-semibold">
            <button
              onClick={() => {
                playerRef.current.seekTo(0);
                setVideoEnded(false);
                setIsPlaying(true);
              }}
              className="mt-4 px-4 py-2 transition"
            >
              <CirclePlayIcon size={28} />
            </button>
          </div>
        )}

        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none z-40">
          GoSkilled
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-40 bg-black/60 p-4 flex flex-col w-full items-center gap-4 px-3">
          <div className='flex items-center w-full'>
            <input
              type="range"
              min="0"
              max="99"
              value={played}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}
              className="w-full h-1 bg-gray-300 rounded-lg cursor-pointer accent-blue-600"
            />
            <span className="text-white text-xs w-24 text-right">
              {formatTime((played / 100) * (playerRef.current?.getDuration() || 0))} /{" "}
              {formatTime(playerRef.current?.getDuration() || 0)}
            </span>
          </div>
          <div className='w-full flex items-center justify-between gap-5'>
            <div className='flex items-center gap-3 md:gap-5'>
              <button onClick={handleBackward} className="text-white">
                <div className="text-16">
                  <RotateCcw />
                </div>
              </button>
              <button
                onClick={() => {
                  if (videoEnded) {
                    playerRef.current.seekTo(0);
                  }
                  setVideoEnded(false);
                  setIsPlaying((p) => !p);
                }}
                className="text-white"
              >
                {isPlaying ?
                  <div className="text-16">
                    <Pause />
                  </div> :
                  <div className="text-16">
                    <Play />
                  </div>}
              </button>
              <button onClick={handleForward} className="text-white">
                <div className="text-16">
                  <RotateCw />
                </div>
              </button>
              <button onClick={() => setIsMuted((m) => !m)} className="text-white">
                {isMuted ?
                  <div className="text-16">
                    <VolumeX />
                  </div> :
                  <div className="text-16">
                    <Volume2 />
                  </div>}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 md:w-36 h-1 bg-gray-300 rounded-lg cursor-pointer accent-blue-600"
              />
            </div>
            <button onClick={toggleFullscreen} className="text-white">
              {isFullScreen ?
                <div className="text-[160px] md:text-[24px]">
                  <Minimize />
                </div> :
                <div className="text-[160px] md:text-[24px]">
                  <Maximize />
                </div>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
