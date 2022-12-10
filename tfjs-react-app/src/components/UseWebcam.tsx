import { useEffect, useRef } from "react"
import * as tf from '@tensorflow/tfjs';
import { CLASSES } from "./labels";


export const UseWebcam = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const setupModel = async (): Promise<tf.GraphModel> => {
        await tf.ready();
        const modelPath = "https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1";
        return await tf.loadGraphModel(modelPath, { fromTFHub: true });
    }

    const setupWebCam = async (): Promise<void> => {
        const webcam: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
        videoRef.current!.srcObject = webcam;

        return new Promise((resolve) => {
            videoRef.current!.onloadedmetadata = () => {
                canvasRef.current!.width = videoRef.current!.clientWidth;
                canvasRef.current!.height = videoRef.current!.clientHeight;
                resolve();
            }
        });
    }

    const performDetection = async (model: tf.GraphModel) => {
        const ctx = canvasRef.current!.getContext("2d");
        const imageTensor = await tf.browser.fromPixelsAsync(videoRef.current as HTMLVideoElement);
        //SSD mobilient signal batch
        const readyfied = tf.expandDims(imageTensor, 0);
        const results: tf.Tensor<tf.Rank>[] = await model.executeAsync(readyfied) as tf.Tensor<tf.Rank>[];

        const imgHeight: number = videoRef.current!.clientHeight;
        const imgWidth: number = videoRef.current!.clientWidth;

        // Get a clean tensor of top indices
        const detectionThreshold = 0.4;
        const iouThreshold = 0.5;
        const maxBoxes = 20;
        const prominentDetection = tf.topk(results[0]);
        const justBoxes = results[1].squeeze();
        const justValues = prominentDetection.values.squeeze();

        // Move results back to JavaScript in parallel
        const [maxIndices, scores, boxes] = await Promise.all([
            prominentDetection.indices.data(),
            justValues.array(),
            justBoxes.array(),
        ]);

        // https://arxiv.org/pdf/1704.04503.pdf, use Async to keep visuals
        const nmsDetections = await tf.image.nonMaxSuppressionWithScoreAsync(
            justBoxes as tf.Tensor2D, // [numBoxes, 4]
            justValues as tf.Tensor1D, // [numBoxes]
            maxBoxes,
            iouThreshold,
            detectionThreshold,
            1 // 0 is normal NMS, 1 is Soft-NMS for overlapping support
        );

        const chosen = await nmsDetections.selectedIndices.data();
        // Mega Clean
        tf.dispose([
            results[0],
            results[1],
            nmsDetections.selectedIndices,
            nmsDetections.selectedScores,
            prominentDetection.indices,
            prominentDetection.values,
            imageTensor,
            readyfied,
            justBoxes,
            justValues,
        ]);
        //model.dispose();

        ctx!.clearRect(0, 0, ctx!.canvas.width, ctx!.canvas.height);
        chosen.forEach((detection) => {
            ctx!.strokeStyle = "#0F0";
            ctx!.lineWidth = 4;
            ctx!.globalCompositeOperation = "destination-over";
            const detectedIndex = maxIndices[detection];
            const detectedClass = CLASSES[detectedIndex];
            const detectedScore = (scores as number[])[detection];
            const dBox: number[] = (boxes as number[][])[detection];

            // No negative values for start positions
            const startY = dBox[0] > 0 ? dBox[0] * imgHeight : 0;
            const startX = dBox[1] > 0 ? dBox[1] * imgWidth : 0;
            const height = (dBox[2] - dBox[0]) * imgHeight;
            const width = (dBox[3] - dBox[1]) * imgWidth;
            ctx!.strokeRect(startX, startY, width, height);
            // Draw the label background.
            ctx!.globalCompositeOperation = "source-over";
            ctx!.fillStyle = "#0B0";
            const textHeight = 16;
            const textPad = 4;
            const label = `${detectedClass} ${Math.round(detectedScore * 100)}%`;
            const textWidth = ctx!.measureText(label).width;
            ctx!.fillRect(startX, startY, textWidth + textPad, textHeight + textPad);
            // Draw the text last to ensure it's on top.
            ctx!.fillStyle = "#000000";
            ctx!.fillText(label, startX, startY + 10);
        });

        await performDetection(model);
    }

    useEffect(() => {
        (async () => {
            try {
                const model: tf.GraphModel = await setupModel();
                await setupWebCam();
                performDetection(model);
            } catch (e) {
                throw e;
            }
        })();
    }, [videoRef, canvasRef]);


    return (
        <div>
            <video ref={videoRef} autoPlay></video>
            <canvas ref={canvasRef} style={{ position: "absolute", left: 0 }}></canvas>
        </div>
    )
}