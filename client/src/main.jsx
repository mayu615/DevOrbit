import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';

// global styles
import './styles/index.css';
import './styles/App.css';

// context providers
import { AuthProvider } from './contexts/AuthContext.jsx';
import { JobProvider } from './contexts/JobContext.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx'; // <- import

const root = createRoot(document.getElementById('root'));

root.render(
  
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <JobProvider>
            <App />
          </JobProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  
);
