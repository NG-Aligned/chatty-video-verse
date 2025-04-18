
import React, { useState, useEffect, useRef } from 'react';

interface VideoTileProps {
  isLocal?: boolean;
  isMuted?: boolean;
  isCameraOff?: boolean;
}

const VideoTile: React.FC<VideoTileProps> = ({ 
  isLocal = false, 
  isMuted = false, 
  isCameraOff = false 
}) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Clean up any previous stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            console.log(`Stopping previous track: ${track.label}`);
            track.stop();
          });
          streamRef.current = null;
        }
        
        setHasPermission(true); // Assume permission until denied
        
        // If camera is enabled, get the video stream
        if (!isCameraOff) {
          try {
            console.log("Attempting to access camera...");
            const constraints = { 
              video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: "user"
              },
              audio: !isMuted
            };
            
            console.log("getUserMedia constraints:", JSON.stringify(constraints));
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;
            
            console.log("Camera stream obtained successfully!");
            
            // Debug stream information
            const videoTracks = stream.getVideoTracks();
            console.log(`Got ${videoTracks.length} video tracks:`, 
              videoTracks.map(t => `${t.label} (${t.readyState})`));
            
            if (videoTracks.length === 0) {
              console.warn("Stream has no video tracks!");
              setError("Camera stream has no video tracks");
            }
            
            // Attach stream directly to video element using ref
            if (videoRef.current) {
              console.log("Attaching stream to video element");
              videoRef.current.srcObject = stream;
              
              // Ensure the video plays
              videoRef.current.onloadedmetadata = () => {
                console.log("Video metadata loaded, playing video");
                videoRef.current?.play().catch(e => console.error("Error playing video:", e));
              };
            } else {
              console.warn("Video ref is null, can't attach stream");
            }
          } catch (streamError: any) {
            console.error('Error accessing camera stream:', streamError);
            setError(`Camera access error: ${streamError.message || 'Unknown error'}`);
            setHasPermission(false);
          }
        }
      } catch (error: any) {
        console.error('Camera setup error:', error);
        setError(`Failed to set up camera: ${error.message || 'Unknown error'}`);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    setupCamera();
    
    // Listen for camera state changes
    const handleCameraStateChange = () => {
      console.log("Camera state changed event received");
      setupCamera();
    };
    window.addEventListener('cameraStateChanged', handleCameraStateChange);
    
    // Cleanup function to stop camera when component unmounts
    return () => {
      window.removeEventListener('cameraStateChanged', handleCameraStateChange);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          console.log(`Stopping track on unmount: ${track.label}`);
          track.stop();
        });
      }
    };
  }, [isCameraOff, isMuted]);

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
      <div className="absolute inset-0 flex items-center justify-center">
        {isLoading ? (
          <div className="text-white text-opacity-70 flex flex-col items-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
            <span>Loading camera...</span>
          </div>
        ) : isCameraOff || !hasPermission ? (
          <div className="text-white text-opacity-60 flex flex-col items-center justify-center">
            <div className="bg-gray-700 p-3 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="3" y="6" width="12" height="12" rx="2" ry="2" />
                <line x1="2" y1="2" x2="22" y2="22" />
              </svg>
            </div>
            <div className="text-center">
              {error ? error : "Camera Off"}
              {!hasPermission && !error && (
                <button 
                  className="block mx-auto mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  onClick={() => {
                    console.log("Manual camera permission request");
                    navigator.mediaDevices.getUserMedia({ video: true })
                      .then(() => setupCamera())
                      .catch(e => console.log("Manual permission error:", e));
                  }}
                >
                  Enable Camera
                </button>
              )}
            </div>
          </div>
        ) : (
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted={true} // Always mute local video to prevent feedback
            className="w-full h-full object-cover" 
          />
        )}
      </div>
      
      {/* Status indicators */}
      <div className="absolute bottom-4 left-4 flex space-x-2">
        {isMuted && (
          <div className="bg-red-500 p-1.5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2c1.7 0 3 1.3 3 3v6c0 1.7-1.3 3-3 3s-3-1.3-3-3V5c0-1.7 1.3-3 3-3z" />
              <path d="M19 10v2c0 4.4-3.6 8-8 8s-8-3.6-8-8v-2" />
              <line x1="2" y1="2" x2="22" y2="22" />
            </svg>
          </div>
        )}
        {isLocal && <div className="bg-blue-500 px-2 py-1 rounded-md text-xs text-white">You</div>}
      </div>
    </div>
  );
};

const VideoGrid = () => {
  const [meetingStatus, setMeetingStatus] = useState<string | null>(null);

  useEffect(() => {
    // Check if browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMeetingStatus("Your browser doesn't support camera access");
    }
  }, []);

  return (
    <div className="relative">
      {meetingStatus && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>{meetingStatus}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <VideoTile isLocal={true} />
        <VideoTile isMuted={true} />
        <VideoTile isCameraOff={true} />
      </div>
    </div>
  );
};

export default VideoGrid;
