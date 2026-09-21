import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const { register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const ok = await register(name, email, password);
    if (ok) navigate('/');
  };

  return (
    <form className="card form fade-in" onSubmit={submit}>
      <h2>Create account</h2>
      <label>Name</label>
      <input value={name} onChange={e=>setName(e.target.value)} required />
      <label>Email</label>
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <label>Password</label>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <button className="btn" disabled={loading}>Register</button>
    </form>
  );
}
