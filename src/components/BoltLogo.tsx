import React from 'react';

export function BoltLogo() {
  return (
    <div className="fixed top-4 left-4 z-50">
      <a href="https://bolt.new" target="_blank" rel="noopener noreferrer">
        <img 
          src="/bolt-logo.png" 
          alt="Built with Bolt" 
          className="h-10 w-auto shadow-md rounded-md hover:opacity-90 transition-opacity"
        />
      </a>
    </div>
  );
}