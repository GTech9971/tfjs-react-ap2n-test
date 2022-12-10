import * as tf from '@tensorflow/tfjs';
import { useEffect, useRef } from 'react';
export const BoundingBox = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        (async () => {
            const modelPath = "../models/tfjs_quant_uint8/model.json";
            const model = await tf.loadLayersModel(modelPath);

            const petImage = new Image();
            petImage.src = "../cats.jpeg";
            petImage.onload = async () => {
                const petTensor = await tf.browser.fromPixelsAsync(petImage);
                const readyfied = tf.image.resizeNearestNeighbor(petTensor, [256, 256], true).div(256).reshape([1, 256, 256, 3]);
                const result = model.predict(readyfied) as tf.Tensor;
                result.print();

                // Draw box on canvas                
                const imgWidth = petImage.width
                const imgHeight = petImage.height
                canvasRef.current!.width = imgWidth
                canvasRef.current!.height = imgHeight
                const box = result.dataSync()
                const startX = box[0] * imgWidth
                const startY = box[1] * imgHeight
                const width = (box[2] - box[0]) * imgWidth
                const height = (box[3] - box[1]) * imgHeight
                const ctx = canvasRef.current!.getContext('2d')
                ctx?.drawImage(petImage, 0, 0);
                ctx!.strokeStyle = '#0F0'
                ctx!.lineWidth = 4
                ctx!.strokeRect(startX, startY, width, height)

                // dispose
                petTensor.dispose();
                readyfied.dispose();
                model.dispose();
                result.dispose();
            }
        })();
    }, [canvasRef]);

    return (
        <canvas ref={canvasRef}></canvas>
    )
}