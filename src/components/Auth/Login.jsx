import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      navigate("/");
    } catch (err) {
      setError("Невірні дані");
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError("Помилка Google авторизації");
    }
  };

  return (
    <div className="auth-box">
      <form onSubmit={handleLogin}>
        <h2>Вхід</h2>
        {error && <p className="error">{error}</p>}
        <input type="email" placeholder="e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="пароль" value={pass} onChange={(e) => setPass(e.target.value)} required />
        <button type="submit">Увійти</button>
        <button type="button" onClick={handleGoogle}>Увійти через Google</button>
        <p>
          Немає акаунту? <strong onClick={() => navigate("/register")}>Зареєструйтесь</strong>
        </p>
      </form>
    </div>
  );
};

export default Login;
