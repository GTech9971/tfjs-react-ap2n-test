import { useEffect, useRef } from "react";
import * as tf from '@tensorflow/tfjs';

export const ShootInfoDetect = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const resultRef = useRef<HTMLCanvasElement | null>(null);

    const setupModel = async (): Promise<tf.GraphModel> => {
        await tf.ready();
        const modelPath = "../models/site_model/model.json";
        return await tf.loadGraphModel(modelPath);
    }

    const setupImg = async (): Promise<{ ctx: CanvasRenderingContext2D, resultCtx: CanvasRenderingContext2D }> => {
        const img = new Image();
        img.src = "../shoot-result.png";

        return new Promise((resolve) => {
            img.onload = () => {
                canvasRef.current!.width = img.width;
                canvasRef.current!.height = img.height

                resultRef.current!.width = img.width;
                resultRef.current!.height = img.height;

                const ctx = canvasRef.current!.getContext("2d") as CanvasRenderingContext2D;
                ctx.drawImage(img, 0, 0);
                const resultCtx = resultRef.current!.getContext("2d") as CanvasRenderingContext2D;
                resultCtx.drawImage(img, 0, 0);

                resolve({ ctx: ctx, resultCtx: resultCtx });
            }
        });
    }

    const performDetection = async (model: tf.GraphModel, resultCtx: CanvasRenderingContext2D) => {
        const imageTensor = await tf.browser.fromPixelsAsync(canvasRef.current!);
        //yolo batch
        const [modelWidth, modelHeight] = model.inputs[0].shape!.slice(1, 3);
        const readyfied = tf.image.resizeBilinear(imageTensor, [modelWidth, modelHeight]).div(255).expandDims(0);
        const results: tf.Tensor<tf.Rank>[] = await model.executeAsync(readyfied) as tf.Tensor<tf.Rank>[];

        const imgHeight: number = canvasRef.current!.clientHeight;
        const imgWidth: number = canvasRef.current!.clientWidth;

        // Move results back to JavaScript in parallel
        const [boxes, scores, _, valid_detections] = await Promise.all([
            results[0].dataSync(),
            results[1].dataSync(),
            results[2].dataSync(),
            results[3].dataSync()
        ]);

        tf.dispose([
            imageTensor,
            readyfied,
            results[0],
            results[1],
            results[2],
            results[3]
        ]);

        resultCtx.lineWidth = 4;

        const detect_count: number = valid_detections[0];
        for (let i = 0; i < detect_count; i++) {
            console.log(boxes[i]);
            // No negative values for start positions
            const x1: number = boxes[i] * imgWidth;
            const y1: number = boxes[i + 1] * imgHeight;
            const x2: number = boxes[i + 2] * imgWidth;
            const y2: number = boxes[i + 3] * imgHeight;

            const width: number = x2 - x1;
            const height: number = y2 - y1;
            // const startY = boxes[i] > 0 ? boxes[i] * imgHeight : 0;
            // const startX = boxes[i + 1] > 0 ? boxes[i + 1] * imgWidth : 0;
            // const height = (boxes[i + 2] - boxes[i]) * imgHeight;
            // const width = (boxes[i + 3] - boxes[i + 1]) * imgWidth;

            const score: string = scores[i].toFixed(2);

            // Draw the bounding box.
            resultCtx.strokeStyle = "#" + Math.floor(Math.random() * 16777215).toString(16);
            resultCtx.strokeRect(x1, y2, width, height);
        }
    }


    useEffect(() => {
        (async () => {
            try {
                const model: tf.GraphModel = await setupModel();
                const { ctx, resultCtx } = await setupImg();
                await performDetection(model, resultCtx);
            } catch (e) {
                throw e;
            }
        })();
    }, [canvasRef, resultRef, performDetection]);


    return (
        <div>
            <canvas ref={canvasRef}></canvas>
            <br />
            <canvas ref={resultRef}></canvas>
        </div>
    )
}