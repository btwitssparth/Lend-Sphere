import { useAuth } from "./Context/AuthContext";
import LoginForm from "./components/Auth/LoginForm";

function App() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <>
      <h1>Welcome {user.email}</h1>
      <button onClick={logout}>Logout</button>
    </>
  );
}

export default App;
