import React from 'react';
import * as tf from '@tensorflow/tfjs';




export const App = () => {
  const dataArray = [8, 6, 8, 7, 4, 1];
  const first = tf.tensor(dataArray);
  console.log(first)
  return (
    <></>
  );
}
