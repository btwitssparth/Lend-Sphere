import { useState } from "react";
import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../Context/AuthContext";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await loginUser({ email, password });
            login(data.user, data.accessToken);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>


        </form>
    );
};

export default LoginForm;