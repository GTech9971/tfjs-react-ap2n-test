import { useEffect, useRef } from "react";
import * as tf from '@tensorflow/tfjs';

export const CropImg = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    //画像切り取り
    useEffect(() => {
        (async () => {
            const img = new Image();
            img.src = "../ap2n-header.png";
            img.onload = async () => {
                const t: tf.Tensor3D = await tf.browser.fromPixelsAsync(img);
                const startPoint = [0, 40, 0];
                const newSize = [265, 245, 3];
                const crop = tf.slice(t, startPoint, newSize);
                await tf.browser.toPixels(crop, canvasRef.current as HTMLCanvasElement);
                t.dispose();
                crop.dispose();
            }
        })();
    }, [canvasRef]);

    return (
        <canvas ref={canvasRef}></canvas>
    )
}