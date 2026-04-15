import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/organisms/Navbar';
import BottomNav from '../components/organisms/BottomNav';
import Button from '../components/atoms/Button';
import { Construction } from 'lucide-react';

const ComingSoonPage = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-blue-100 p-6 rounded-full text-[#1A6FA3] mb-6">
          <Construction size={48} />
        </div>
        <h1 className="text-3xl font-display font-bold text-[#1A2332] mb-4">
          {title} is Coming Soon
        </h1>
        <p className="text-[#8A9BB0] max-w-md mb-8">
          We are working hard to bring this feature to your community. Stay tuned for updates!
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </main>
      <BottomNav />
    </div>
  );
};

export default ComingSoonPage;
