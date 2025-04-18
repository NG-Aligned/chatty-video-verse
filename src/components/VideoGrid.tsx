
import React from 'react';

interface VideoTileProps {
  isLocal?: boolean;
  isMuted?: boolean;
  isCameraOff?: boolean;
}

const VideoTile: React.FC<VideoTileProps> = ({ isLocal = false, isMuted = false, isCameraOff = false }) => {
  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
      {/* Placeholder for video stream */}
      <div className="absolute inset-0 flex items-center justify-center">
        {cameraOff ? (
          <div className="text-white text-opacity-60 text-lg">Camera Off</div>
        ) : (
          <div className="w-full h-full bg-gray-700" />
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <VideoTile isLocal={true} />
      <VideoTile isMuted={true} />
      <VideoTile isCameraOff={true} />
    </div>
  );
};

export default VideoGrid;
