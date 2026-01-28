import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

const VoiceMessagePlayer = ({ audioBlob, duration }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(duration || 0);
    const audioRef = useRef(null);
    const audioUrlRef = useRef(null);

    useEffect(() => {
        // Create audio URL from blob
        if (audioBlob) {
            audioUrlRef.current = URL.createObjectURL(audioBlob);

            // Create audio element
            const audio = new Audio(audioUrlRef.current);
            audioRef.current = audio;

            // Set up event listeners
            audio.addEventListener('loadedmetadata', () => {
                setAudioDuration(Math.floor(audio.duration));
            });

            audio.addEventListener('timeupdate', () => {
                setCurrentTime(Math.floor(audio.currentTime));
            });

            audio.addEventListener('ended', () => {
                setIsPlaying(false);
                setCurrentTime(0);
            });

            audio.addEventListener('error', (e) => {
                setIsPlaying(false);
            });
        }

        // Cleanup
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (audioUrlRef.current) {
                URL.revokeObjectURL(audioUrlRef.current);
            }
        };
    }, [audioBlob]);

    const togglePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

    return (
        <div className="flex items-center gap-2 min-w-[200px]">
            {/* Play/Pause Button */}
            <button
                onClick={togglePlayPause}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
                {isPlaying ? (
                    <Pause size={14} className="text-white fill-white" />
                ) : (
                    <Play size={14} className="text-white fill-white ml-0.5" />
                )}
            </button>

            {/* Waveform/Progress Bar */}
            <div className="flex-1 relative h-8 flex items-center">
                <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white rounded-full transition-all duration-100"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Duration */}
            <span className="text-xs text-white/80 font-medium min-w-[35px] text-right">
                {formatTime(isPlaying ? currentTime : audioDuration)}
            </span>
        </div>
    );
};

export default VoiceMessagePlayer;
