
import React, { useState } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MeetingControlsProps {
  onLeave?: () => void;
}

const MeetingControls: React.FC<MeetingControlsProps> = ({ onLeave }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
      <div className="max-w-3xl mx-auto flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="lg"
          className={`rounded-full p-4 ${isMuted ? 'bg-red-100 text-red-600' : ''}`}
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>

        <Button
          variant="outline"
          size="lg"
          className={`rounded-full p-4 ${isCameraOff ? 'bg-red-100 text-red-600' : ''}`}
          onClick={() => setIsCameraOff(!isCameraOff)}
        >
          {isCameraOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
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
