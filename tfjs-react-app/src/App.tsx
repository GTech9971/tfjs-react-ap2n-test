import { Link } from 'react-router-dom';
export const App = () => {
  return (
    <ul>
      <li><Link to="/TensorCanvas">TensorCanvas</Link></li>
      <li><Link to="SimpleTtt">SimpleTtt</Link></li>
      <li><Link to="/LoadImg">LoadImg</Link></li>
      <li><Link to="CropImg">CropImg</Link></li>
      <li><Link to="/LoadTfHub">LoadTfHub</Link></li>
      <li><Link to="/BoundingBox">BoundingBox</Link></li>
      <li><Link to="/UseWebcam">UseWebcam</Link></li>
      <li><Link to="/TargetSiteDetect">TargetSiteDetect</Link></li>
    </ul>
  );
}
