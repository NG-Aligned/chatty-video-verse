
import React, { useState, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MeetingControlsProps {
  onLeave?: () => void;
}

const MeetingControls: React.FC<MeetingControlsProps> = ({ onLeave }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Check if the device has camera capabilities
    const checkDeviceCapabilities = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoInput = devices.some(device => device.kind === 'videoinput');
        setHasCamera(hasVideoInput);
        
        if (!hasVideoInput) {
          toast("No camera detected on this device");
        } else {
          // Try to start camera automatically
          try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            setIsCameraOff(false);
            console.log("Camera started automatically on page load");
          } catch (err) {
            console.log("Could not start camera automatically:", err);
            setIsCameraOff(true);
          }
        }
      } catch (err) {
        console.error("Error checking media devices:", err);
        setHasCamera(false);
      }
    };
    
    checkDeviceCapabilities();
  }, []);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    toast(isMuted ? "Microphone enabled" : "Microphone muted");
  };

  const toggleCamera = async () => {
    if (!hasCamera) {
      toast("No camera available on this device");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!isCameraOff) {
        // If turning camera off, we don't need to request permissions
        setIsCameraOff(true);
        toast("Camera turned off");
        
        // Force re-render of VideoGrid to pick up camera state change
        window.dispatchEvent(new Event('cameraStateChanged'));
      } else {
        // If turning camera on, try to get camera permission
        console.log("Requesting camera permission...");
        await navigator.mediaDevices.getUserMedia({ video: true });
        setIsCameraOff(false);
        toast("Camera turned on");
        
        // Force re-render of VideoGrid to pick up camera state change
        window.dispatchEvent(new Event('cameraStateChanged'));
      }
    } catch (err) {
      console.error("Error toggling camera:", err);
      toast("Camera access denied. Please check your browser permissions.");
      setIsCameraOff(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
      <div className="max-w-3xl mx-auto flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="lg"
          className={`rounded-full p-4 ${isMuted ? 'bg-red-100 text-red-600' : ''}`}
          onClick={toggleMute}
        >
          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>

        <Button
          variant="outline"
          size="lg"
          className={`rounded-full p-4 ${isCameraOff ? 'bg-red-100 text-red-600' : ''} ${isLoading ? 'opacity-50' : ''}`}
          onClick={toggleCamera}
          disabled={!hasCamera || isLoading}
        >
          {isLoading ? (
            <span className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></span>
          ) : isCameraOff ? (
            <VideoOff className="h-6 w-6" />
          ) : (
            <Video className="h-6 w-6" />
          )}
        </Button>

        <Button
          variant="destructive"
          size="lg"
          className="rounded-full p-4"
          onClick={onLeave}
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default MeetingControls;
