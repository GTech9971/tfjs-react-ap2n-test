import { useEffect, useRef } from "react"
import * as tf from '@tensorflow/tfjs';

export const TensorCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    //画像の作成
    useEffect(() => {
        (async () => {
            const tensorPic: tf.Tensor3D = tf.randomUniform([300, 400, 3]);
            await tf.browser.toPixels(tensorPic, canvasRef.current as HTMLCanvasElement);
            tensorPic.dispose();
        })();
    }, [canvasRef]);

    return (
        <canvas ref={canvasRef}></canvas>
    )
}