import { TensorCanvas } from './components/TensorCanvas';
import { LoadImg } from './components/LoadImg';
import { CropImg } from './components/CropImg';

export const App = () => {
  return (
    <>
      <TensorCanvas />
      <LoadImg />
      <CropImg />
    </>
  );
}
