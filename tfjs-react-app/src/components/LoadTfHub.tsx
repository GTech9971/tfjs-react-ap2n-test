import * as tf from '@tensorflow/tfjs';
import { INCEPTION_CLASSES } from './labels';


import { useEffect, useRef } from 'react';
export const LoadTfHub = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        (async () => {
            const modelPath: string = "https://tfhub.dev/google/tfjs-model/imagenet/inception_v3/classification/3/default/1";
            const loadOption: tf.io.LoadOptions = { fromTFHub: true };
            const model = await tf.loadGraphModel(modelPath, loadOption);
            const mouseImage = new Image();
            mouseImage.src = "../mouse.png";
            mouseImage.onload = async () => {
                const mouseTensor = await tf.browser.fromPixelsAsync(mouseImage);
                await tf.browser.toPixels(mouseTensor as tf.Tensor3D, canvasRef.current as HTMLCanvasElement);

                const resizeTensor = tf.image.resizeBilinear(mouseTensor, [299, 299], true).div(255).reshape([1, 299, 299, 3]);

                const result = model.predict(resizeTensor) as tf.Tensor;

                const { values, indices } = tf.topk(result, 3);

                const winners = indices.dataSync();
                console.log(`
                    First:${INCEPTION_CLASSES[winners[0]]},
                    Second:${INCEPTION_CLASSES[winners[1]]},
                    Third:${INCEPTION_CLASSES[winners[2]]}
                `);

                model.dispose();
                mouseTensor.dispose();
                resizeTensor.dispose();
                result.dispose();
                values.dispose();
                indices.dispose();
            }
        })();
    }, [canvasRef]);

    return (
        <>
            <canvas ref={canvasRef}></canvas>
        </>
    )
}