import * as tf from '@tensorflow/tfjs';
import { useEffect } from 'react';
export const SimpleTtt = () => {
    useEffect(() => {
        (async () => {
            await tf.ready();
            const modelPath: string = "../models/ttt_model.json";

            const model: tf.LayersModel = await tf.loadLayersModel(modelPath);
            const emptyBoard = tf.zeros([9]);
            const betterBlockMe = tf.tensor([-1, 0, 0, 1, 1, -1, 0, 0, -1]);
            const goForTheKill = tf.tensor([1, 0, 1, 0, -1, -1, -1, 0, 1]);

            const matches = tf.stack([emptyBoard, betterBlockMe, goForTheKill]);
            const result: tf.Tensor = model.predict(matches) as tf.Tensor;

            result.reshape([3, 3, 3]).print();

            model.dispose();
            emptyBoard.dispose();
            betterBlockMe.dispose();
            goForTheKill.dispose();
            matches.dispose();
            result.dispose();
        })();
    }, []);

    return (
        <>
        </>
    )
}