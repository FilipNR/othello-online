import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div>Page not found, <button onClick={() => navigate('/')}>go to home</button></div>
  )
}

export default NotFound