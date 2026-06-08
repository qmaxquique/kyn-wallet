import React from 'react';
import { Button } from './ui/Button';

const SocialLogins: React.FC = () => {
  const handleComingSoon = () => {
    alert('Próximamente');
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button 
        variant="secondary" 
        onClick={handleComingSoon}
        className="flex items-center justify-center space-x-2"
      >
        <span className="text-lg">G</span>
        <span>Google</span>
      </Button>
      <Button 
        variant="secondary" 
        onClick={handleComingSoon}
        className="flex items-center justify-center space-x-2"
      >
        <span className="text-lg"></span>
        <span>Apple</span>
      </Button>
    </div>
  );
};

export default SocialLogins;
