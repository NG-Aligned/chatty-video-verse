
import React, { useState, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MeetingControlsProps {
  onLeave?: () => void;
}

const MeetingControls: React.FC<MeetingControlsProps> = ({ onLeave }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(true); // Start with camera off
  const [hasCamera, setHasCamera] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Check if the device has camera capabilities
    const checkDeviceCapabilities = async () => {
      try {
        console.log("Checking media devices...");
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const hasVideoInput = videoDevices.length > 0;
        
        console.log(`Found ${videoDevices.length} video devices:`, 
          videoDevices.map(d => d.label || 'Unnamed device'));
        
        setHasCamera(hasVideoInput);
        
        if (!hasVideoInput) {
          console.warn("No camera detected on this device");
          toast("No camera detected on this device");
        } else {
          console.log("Camera detected, will attempt to initialize...");
          // Don't auto-start the camera - let the user click to enable
          setIsCameraOff(true);
        }
      } catch (err) {
        console.error("Error checking media devices:", err);
        setHasCamera(false);
      }
    };
    
    checkDeviceCapabilities();
    
    // Additional listener for permission changes
    const permissionChangeHandler = () => {
      navigator.permissions.query({ name: 'camera' as PermissionName })
        .then(permissionStatus => {
          console.log("Camera permission status:", permissionStatus.state);
        })
        .catch(err => console.log("Permission check error:", err));
    };
    
    try {
      navigator.permissions.query({ name: 'camera' as PermissionName })
        .then(permissionStatus => {
          permissionStatus.onchange = permissionChangeHandler;
        })
        .catch(err => console.log("Initial permission check error:", err));
    } catch (err) {
      console.log("Permission API not supported:", err);
    }
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
        console.log("Turning camera OFF");
        setIsCameraOff(true);
        toast("Camera turned off");
        
        // Force re-render of VideoGrid to pick up camera state change
        window.dispatchEvent(new Event('cameraStateChanged'));
      } else {
        // If turning camera on, try to get camera permission
        console.log("Turning camera ON - requesting permission...");
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user"
          }
        });
        
        // Check if we actually got video tracks
        const videoTracks = stream.getVideoTracks();
        console.log(`Got ${videoTracks.length} video tracks:`, 
          videoTracks.map(t => `${t.label} (${t.readyState})`));
        
        if (videoTracks.length === 0) {
          throw new Error("Camera permission granted but no video tracks available");
        }
        
        setIsCameraOff(false);
        toast("Camera turned on");
        
        // Release this stream as it will be recreated in the VideoTile component
        stream.getTracks().forEach(track => track.stop());
        
        // Force re-render of VideoGrid to pick up camera state change
        window.dispatchEvent(new Event('cameraStateChanged'));
      }
    } catch (err: any) {
      console.error("Error toggling camera:", err);
      toast(`Camera access issue: ${err.message || 'Permission denied'}`);
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
