import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasImgRef = useRef<HTMLCanvasElement | null>(null);
  const cropImgRef = useRef<HTMLCanvasElement | null>(null);

  //画像の作成
  useEffect(() => {
    (async () => {
      const tensorPic: tf.Tensor3D = tf.randomUniform([300, 400, 3]);
      await tf.browser.toPixels(tensorPic, canvasRef.current as HTMLCanvasElement);
      tensorPic.dispose();
    })()

  }, [canvasRef]);


  //画像の読み込み
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

  //画像切り取り
  useEffect(() => {
    (async () => {
      const img = new Image();
      img.src = "../ap2n-header.png";
      img.onload = async () => {
        console.log("A");
        const t: tf.Tensor3D = await tf.browser.fromPixelsAsync(img);
        const startPoint = [0, 40, 0];
        const newSize = [265, 245, 3];
        const crop = tf.slice(t, startPoint, newSize);
        await tf.browser.toPixels(crop, cropImgRef.current as HTMLCanvasElement);
        t.dispose();
        crop.dispose();
      }
    })();
  }, [cropImgRef]);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
      <canvas ref={canvasImgRef}></canvas>
      <canvas ref={cropImgRef}></canvas>
    </>
  );
}
