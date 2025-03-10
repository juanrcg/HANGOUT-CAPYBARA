import React, { useEffect, useRef, useState } from "react";
import { useCall } from "../../Context/CallContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash, faPhoneSlash } from "@fortawesome/free-solid-svg-icons";

function VideoCall() {
    const { localStream, remoteStream, endCall } = useCall();
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    // Attach streams to video elements
    useEffect(() => {
        if (localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    // Toggle Microphone
    const toggleMute = () => {
        localStream.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        setIsMuted(!isMuted);
    };

    // Toggle Camera
    const toggleVideo = () => {
        localStream.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        setIsVideoOff(!isVideoOff);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white relative">
            {/* Background Blur */}
            <div className="absolute inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-lg"></div>

            {/* Video Containers */}
            <div className="relative flex justify-center gap-4 w-full max-w-4xl p-4">
                {/* Remote Video */}
                <div className="relative w-3/4 border border-gray-500 rounded-lg overflow-hidden shadow-lg">
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        className="w-full h-full bg-black"
                    />
                </div>

                {/* Local Video (Floating) */}
                <div className="absolute bottom-6 right-6 w-1/4 border border-gray-500 rounded-lg overflow-hidden shadow-lg">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        className="w-full h-full bg-black"
                        style={{ display: isVideoOff ? "none" : "block" }}
                    />
                    {isVideoOff && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 text-white text-lg font-semibold">
                            Camera Off
                        </div>
                    )}
                </div>
            </div>

            {/* Call Controls */}
            <div className="absolute bottom-6 flex gap-4 bg-gray-800 bg-opacity-75 p-3 rounded-full shadow-lg">
                {/* Mute Button */}
                <button
                    onClick={toggleMute}
                    className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg"
                >
                    <FontAwesomeIcon icon={isMuted ? faMicrophoneSlash : faMicrophone} size="lg" />
                </button>

                {/* Camera Toggle */}
                <button
                    onClick={toggleVideo}
                    className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg"
                >
                    <FontAwesomeIcon icon={isVideoOff ? faVideoSlash : faVideo} size="lg" />
                </button>

                {/* End Call */}
                <button
                    onClick={endCall}
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg"
                >
                    <FontAwesomeIcon icon={faPhoneSlash} size="lg" />
                </button>
            </div>
        </div>
    );
}

export default VideoCall;
