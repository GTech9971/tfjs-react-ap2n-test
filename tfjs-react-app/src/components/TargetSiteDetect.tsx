import { useEffect, useRef } from "react";
import * as tf from '@tensorflow/tfjs';

export const TargetSiteDetect = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const cropCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const setupModel = async (): Promise<tf.GraphModel> => {
        await tf.ready();
        const modelPath = "../models/targetsite_web_model/model.json";
        return await tf.loadGraphModel(modelPath);
    }

    const setupWebCam = async (): Promise<{ ctx: CanvasRenderingContext2D, cropCtx: CanvasRenderingContext2D }> => {
        const webcam: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
        videoRef.current!.srcObject = webcam;

        return new Promise((resolve) => {
            videoRef.current!.onloadedmetadata = () => {
                canvasRef.current!.width = videoRef.current!.clientWidth;
                canvasRef.current!.height = videoRef.current!.clientHeight;

                cropCanvasRef.current!.width = videoRef.current!.clientWidth;
                cropCanvasRef.current!.height = videoRef.current!.clientHeight;

                const ctx = canvasRef.current!.getContext("2d") as CanvasRenderingContext2D;
                const cropCtx = cropCanvasRef.current!.getContext("2d") as CanvasRenderingContext2D;
                resolve({ ctx: ctx, cropCtx: cropCtx });
            }
        });
    }

    const performDetection = async (model: tf.GraphModel, ctx: CanvasRenderingContext2D, cropCtx: CanvasRenderingContext2D) => {
        const imageTensor = await tf.browser.fromPixelsAsync(videoRef.current as HTMLVideoElement);
        //yolo batch
        const [modelWidth, modelHeight] = model.inputs[0].shape!.slice(1, 3);
        const readyfied = tf.image.resizeBilinear(imageTensor, [modelWidth, modelHeight]).div(255).expandDims(0);
        const results: tf.Tensor<tf.Rank>[] = await model.executeAsync(readyfied) as tf.Tensor<tf.Rank>[];

        const imgHeight: number = videoRef.current!.clientHeight;
        const imgWidth: number = videoRef.current!.clientWidth;

        // Move results back to JavaScript in parallel
        const [boxes, scores, classes, valid_detections] = await Promise.all([
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

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        cropCtx.clearRect(0, 0, cropCtx.canvas.width, cropCtx.canvas.height);

        const detect_count: number = valid_detections[0];
        for (let i = 0; i < detect_count; i++) {
            // No negative values for start positions
            const startY = boxes[0] > 0 ? boxes[0] * imgHeight : 0;
            const startX = boxes[1] > 0 ? boxes[1] * imgWidth : 0;
            const height = (boxes[2] - boxes[0]) * imgHeight;
            const width = (boxes[3] - boxes[1]) * imgWidth;

            const score: string = scores[i].toFixed(2);

            // Draw the bounding box.            
            ctx.strokeStyle = "#00FFFF";
            ctx.lineWidth = 4;
            ctx.strokeRect(startX, startY, width, height);

            //crop image out
            cropCtx.drawImage(videoRef.current as HTMLVideoElement, startX, startY, width, height, 0, 0, width, height);
        }

        requestAnimationFrame(() => {
            performDetection(model, ctx, cropCtx);
        });
    }


    useEffect(() => {
        (async () => {
            try {
                const model: tf.GraphModel = await setupModel();
                const { ctx, cropCtx } = await setupWebCam();
                performDetection(model, ctx, cropCtx);
            } catch (e) {
                throw e;
            }
        })();
    }, [videoRef, canvasRef, cropCanvasRef]);


    return (
        <div>
            <video ref={videoRef} autoPlay></video>
            <canvas ref={canvasRef} style={{ position: "absolute", left: 0 }}></canvas>
            <br></br>

            <canvas ref={cropCanvasRef}></canvas>
        </div>
    )
}