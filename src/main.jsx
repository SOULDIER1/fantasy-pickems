import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// React.StrictMode is used to highlight potential problems in an application and helps with identifying unsafe lifecycle methods, legacy API usage, and other issues.
const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found. Unable to render the app. Please ensure your index.html contains a <div id='root'></div> element.");
}
