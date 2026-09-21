import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) navigate('/');
  };

  return (
    <form className="card form fade-in" onSubmit={submit}>
      <h2>Login</h2>
      <label>Email</label>
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <label>Password</label>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <button className="btn" disabled={loading}>Login</button>
    </form>
  );
}
