import { toast } from "react-toastify";

let mediaRecorder = null;
let audioChunks = [];
let recordingStartTime = null;

// Start Recording Audio
export const startAudioRecording = async (onDataAvailable, onRecordingStart) => {
    try {
        // Request microphone permission
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100,
            }
        });

        // Create MediaRecorder instance
        const mimeType = MediaRecorder.isTypeSupported('audio/webm')
            ? 'audio/webm'
            : 'audio/mp4';

        mediaRecorder = new MediaRecorder(stream, { mimeType });
        audioChunks = [];
        recordingStartTime = Date.now();

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            const duration = Math.floor((Date.now() - recordingStartTime) / 1000);

            if (onDataAvailable) {
                onDataAvailable(audioBlob, duration, mimeType);
            }

            // Stop all tracks to release microphone
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.onerror = (error) => {
            toast.error('Recording error occurred');
        };

        mediaRecorder.start();

        if (onRecordingStart) {
            onRecordingStart();
        }

        return true;
    } catch (error) {
        if (error.name === 'NotAllowedError') {
            toast.error('Microphone access denied. Please enable microphone permissions.');
        } else if (error.name === 'NotFoundError') {
            toast.error('No microphone found. Please connect a microphone.');
        } else {
            toast.error('Failed to start recording. Please try again.');
        }

        return false;
    }
};

// Stop Recording Audio
export const stopAudioRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        return true;
    }
    return false;
};

// Cancel Recording (without saving)
export const cancelAudioRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        audioChunks = []; // Clear chunks so onstop doesn't process them
        mediaRecorder.stop();

        // Stop all tracks
        if (mediaRecorder.stream) {
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }

        return true;
    }
    return false;
};

// Check if browser supports audio recording
export const isAudioRecordingSupported = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
};

// Get recording duration in seconds
export const getRecordingDuration = () => {
    if (recordingStartTime) {
        return Math.floor((Date.now() - recordingStartTime) / 1000);
    }
    return 0;
};

// Convert Blob to File
export const blobToFile = (blob, filename) => {
    return new File([blob], filename, { type: blob.type });
};
