import { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  RotateCw,
} from 'lucide-react';

export default function VideoPlayer({ url, className = '' }) {
  const playerRef = useRef(null);
  const wrapperRef = useRef(null);
  const delayTimeout = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const handleSeekChange = (e) => {
    if (!isPlayerReady || !playerRef.current) return;
    const value = parseFloat(e.target.value) / 100;
    playerRef.current.seekTo(value);
    setPlayed(value * 100);
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

  const toggleFullscreen = () => {
    if (screenfull.isEnabled && wrapperRef.current) {
      screenfull.request(wrapperRef.current);
    }
  };

  useEffect(() => {
    clearTimeout(delayTimeout.current);

    if (isHovered || !isPlaying || videoEnded) {
      setShowOverlay(true);
    } else {
      delayTimeout.current = setTimeout(() => {
        setShowOverlay(false);
      }, 2500);
    }

    return () => clearTimeout(delayTimeout.current);
  }, [isHovered, isPlaying, videoEnded]);

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full max-w-3xl mx-auto bg-black rounded-lg overflow-hidden shadow-lg ${className}`}
    >
      <div className="relative aspect-video">
        <ReactPlayer
          ref={playerRef}
          url={url}
          controls={false}
          playing={isPlaying}
          muted={isMuted}
          width="100%"
          height="100%"
          onReady={() => setIsPlayerReady(true)}
          onProgress={({ played }) => setPlayed(played * 100)}
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

        {/* Overlay on hover, pause, or not started */}
        {showOverlay && (
          <div className="absolute h-16 w-full top-0 z-40 bg-black flex items-center justify-center text-white text-sm font-medium">
            Hover / Paused / Start Overlay — Lesson Info or Title
          </div>
        )}

        {/* End Overlay */}
        {videoEnded && (
          <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center text-white text-xl font-semibold">
            <p>🎉 Video Completed!</p>
            <button
              onClick={() => {
                playerRef.current.seekTo(0);
                setVideoEnded(false);
                setIsPlaying(true);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              Replay Video
            </button>
          </div>
        )}

        {/* Watermark */}
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none z-50">
          YourLMS - demo@example.com
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/60 p-4 flex items-center gap-4">
          <button onClick={handleBackward} className="text-white"><RotateCcw /></button>
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
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <button onClick={handleForward} className="text-white"><RotateCw /></button>
          <button onClick={() => setIsMuted((m) => !m)} className="text-white">
            {isMuted ? <VolumeX /> : <Volume2 />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={played}
            onChange={handleSeekChange}
            className="w-full h-1 bg-gray-300 rounded-lg cursor-pointer accent-blue-600"
          />
          <button onClick={toggleFullscreen} className="text-white"><Maximize /></button>
        </div>
      </div>
    </div>
  );
}
