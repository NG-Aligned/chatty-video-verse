
import React from 'react';
import VideoGrid from '../components/VideoGrid';
import MeetingControls from '../components/MeetingControls';
import { useNavigate } from 'react-router-dom';

const Meeting = () => {
  const navigate = useNavigate();

  const handleLeave = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <VideoGrid />
      <MeetingControls onLeave={handleLeave} />
    </div>
  );
};

export default Meeting;
