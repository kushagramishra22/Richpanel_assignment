// pages/Login.js
import { useNavigate } from 'react-router-dom';
import AuthForm from "../components/AuthForm";
const Login = () => <AuthForm isLogin={true} />;
export default Login;
