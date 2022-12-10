import { TensorCanvas } from './components/TensorCanvas';
import { LoadImg } from './components/LoadImg';
import { CropImg } from './components/CropImg';
import { SimpleTtt } from './components/SimpleTtt';

export const App = () => {
  return (
    <>
      <TensorCanvas />
      <LoadImg />
      <CropImg />
      <SimpleTtt />
    </>
  );
}
