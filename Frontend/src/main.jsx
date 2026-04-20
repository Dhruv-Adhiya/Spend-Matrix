import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.875rem',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          padding: '12px 16px',
        },
        success: {
          style: {
            borderLeft: '4px solid #10B981',
            background: '#fff',
            color: '#065F46',
          },
        },
        error: {
          style: {
            borderLeft: '4px solid #EF4444',
            background: '#fff',
            color: '#991B1B',
          },
        },
      }}
    />
  </React.StrictMode>
);
