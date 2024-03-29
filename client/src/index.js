import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Leader from './Leader';
import EndScreen from './EndScreen';
import 'bootstrap/dist/css/bootstrap.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: '/game',
    element: <App />,
  },
  {
    path: '/',
    element: <Leader />,
  },
  {
    path: '/leader',
    element: <EndScreen />,
  }
]);
root.render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
