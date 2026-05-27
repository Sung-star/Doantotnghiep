import { StrictMode } from 'react'; // Thiếu dòng này
import { createRoot } from 'react-dom/client';
import App from './App.jsx';        // Thiếu dòng quan trọng nhất này
import { ThemeProvider } from './contexts/ThemeContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/index.css';
import './styles/App.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);