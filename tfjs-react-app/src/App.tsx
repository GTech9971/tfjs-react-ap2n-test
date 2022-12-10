import { Link } from 'react-router-dom';
export const App = () => {
  return (
    <ul>
      <li><Link to="/TensorCanvas">TensorCanvas</Link></li>
      <li><Link to="SimpleTtt">SimpleTtt</Link></li>
      <li><Link to="/LoadImg">LoadImg</Link></li>
      <li><Link to="CropImg">CropImg</Link></li>
      <li><Link to="/LoadTfHub">LoadTfHub</Link></li>
    </ul>
  );
}
