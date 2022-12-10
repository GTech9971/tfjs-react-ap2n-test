import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { TensorCanvas } from './components/TensorCanvas';
import { LoadImg } from './components/LoadImg';
import { LoadTfHub } from './components/LoadTfHub';
import { SimpleTtt } from './components/SimpleTtt';
import { CropImg } from './components/CropImg';
import { BoundingBox } from './components/BoundingBox';
import { UseWebcam } from './components/UseWebcam';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/TensorCanvas",
    element: <TensorCanvas />
  },
  {
    path: "/SimpleTtt",
    element: <SimpleTtt />
  },
  {
    path: "CropImg",
    element: <CropImg />
  },
  {
    path: "/LoadImg",
    element: <LoadImg />
  },
  {
    path: "/LoadTfHub",
    element: <LoadTfHub />
  },
  {
    path: "/BoundingBox",
    element: <BoundingBox />
  },
  {
    path: "/UseWebcam",
    element: <UseWebcam />
  }
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);