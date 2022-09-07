import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Create from './routes/Create';
import Join from './routes/Join';
import Room from './routes/Room';
import Single from './routes/Single';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route path="/single" element={<Single />}></Route>
        <Route path="/join" element={<Join />}></Route>
        <Route path="/create" element={<Create />}></Route>
        <Route path="/:roomId" element={<Room />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
