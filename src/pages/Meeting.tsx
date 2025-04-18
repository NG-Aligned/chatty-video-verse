
import React, { useState } from 'react';
import VideoGrid from '../components/VideoGrid';
import MeetingControls from '../components/MeetingControls';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Meeting = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [participants, setParticipants] = useState([
    { id: 'local', name: 'You', isLocal: true },
    { id: 'user1', name: 'John Doe', isMuted: true },
    { id: 'user2', name: 'Jane Smith', isCameraOff: true }
  ]);

  const handleLeave = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Meeting Room</h1>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Participants</span>
              <span className="inline-block bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {participants.length}
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="py-6">
              <h3 className="text-lg font-medium mb-4">Participants ({participants.length})</h3>
              <ul className="space-y-2">
                {participants.map(participant => (
                  <li key={participant.id} className="p-2 border-b flex items-center justify-between">
                    <span>{participant.name} {participant.isLocal && '(You)'}</span>
                    <div className="flex space-x-1">
                      {participant.isMuted && (
                        <span className="bg-red-100 text-red-600 p-1 rounded-full">
                          <MicOff className="h-3 w-3" />
                        </span>
                      )}
                      {participant.isCameraOff && (
                        <span className="bg-red-100 text-red-600 p-1 rounded-full">
                          <VideoOff className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <VideoGrid />
      <MeetingControls onLeave={handleLeave} />
    </div>
  );
};

export default Meeting;
