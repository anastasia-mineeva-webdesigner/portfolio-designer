import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './fonts.css';
import './tokens.css';
import './base.css';
import './styles.css';
import './responsive.css';
// Browsers can keep :focus-visible after a touch or scripted focus restoration.
// Show focus decoration only while the visitor is navigating with a keyboard.
document.addEventListener('keydown', event => {
 if (event.key === 'Tab') document.documentElement.classList.add('keyboard-navigation');
}, true);
document.addEventListener('pointerdown', () => {
 document.documentElement.classList.remove('keyboard-navigation');
}, true);
createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>);
