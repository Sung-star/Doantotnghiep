import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from './contexts/ThemeContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/index.css';
import './styles/App.css';

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);