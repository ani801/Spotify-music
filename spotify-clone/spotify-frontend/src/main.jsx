import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import { BrowserRouter} from 'react-router-dom';
import PlayerContextProvider from './context/PlayerContext.jsx';
import { Route, Routes } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  
    <PlayerContextProvider>
     <App />
    </PlayerContextProvider>
    </BrowserRouter>
  </StrictMode>
 
)
