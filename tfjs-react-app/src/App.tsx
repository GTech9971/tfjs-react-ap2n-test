import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasImgRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    (async () => {
      const tensorPic: tf.Tensor3D = tf.randomUniform([300, 400, 3]);
      await tf.browser.toPixels(tensorPic, canvasRef.current as HTMLCanvasElement);
      tensorPic.dispose();
    })()

  }, [canvasRef]);


  useEffect(() => {
    (async () => {
      const img = new Image();
      img.src = "../ap2n-header.png";
      img.onload = async () => {
        console.log("A");
        const t: tf.Tensor3D = await tf.browser.fromPixelsAsync(img);
        await tf.browser.toPixels(t, canvasImgRef.current as HTMLCanvasElement);
        t.dispose();
      }
    })();

  }, [canvasImgRef]);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
      <canvas ref={canvasImgRef}></canvas>
    </>
  );
}
