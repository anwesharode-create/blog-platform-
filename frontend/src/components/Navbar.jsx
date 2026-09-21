import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { useState } from 'react';

export default function Navbar(){
  const { user, logout } = useAuth();
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('search', q);
    navigate('/?' + params.toString());
  };

  return (
    <header className="nav">
      <Link className="brand" to="/">MERN Blog</Link>
      <form onSubmit={onSearch} className="search">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search blogs..." />
      </form>
      <nav className="links">
        <Link to="/create" className="btn">Write</Link>
        {user ? (
          <>
            <Link to={`/profile/${user.id || user._id}`} className="btn ghost">Profile</Link>
            <button onClick={logout} className="btn danger">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn ghost">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </>
        )}
        <ThemeToggle />
      </nav>
    </header>
  );
}
