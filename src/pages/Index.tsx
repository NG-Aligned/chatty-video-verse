
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const handleJoinMeeting = () => {
    navigate('/meeting');
  };

  const handleCreateMeeting = () => {
    navigate('/meeting');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Video Conferencing</h1>
        <p className="text-gray-600 mb-8">Connect with anyone, anywhere, anytime</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90"
            onClick={handleCreateMeeting}
          >
            Create Meeting
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleJoinMeeting}
          >
            Join Meeting
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
