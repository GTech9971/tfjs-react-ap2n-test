import { useEffect, useRef } from "react";
import * as tf from '@tensorflow/tfjs';

export const LoadImg = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    //画像の読み込み
    useEffect(() => {
        (async () => {
            const img = new Image();
            img.src = "../ap2n-header.png";
            img.onload = async () => {
                const t: tf.Tensor3D = await tf.browser.fromPixelsAsync(img);
                await tf.browser.toPixels(t, canvasRef.current as HTMLCanvasElement);
                t.dispose();
            }
        })();
    }, [canvasRef]);

    return (
        <canvas ref={canvasRef}></canvas>
    )
}