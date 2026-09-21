import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import BlogCard from '../components/BlogCard.jsx';

export default function Profile(){
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    API.get(`/users/${id}`).then(res => setUser(res.data));
    API.get(`/users/${id}/blogs`).then(res => setBlogs(res.data));
    API.get(`/users/${id}/saved`).then(res => setSaved(res.data));
  }, [id]);

  if (!user) return <p>Loading...</p>;
  return (
    <div className="profile">
      <header className="profile-header">
        <div className="avatar-lg">{user.name?.charAt(0)}</div>
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      </header>
      <section>
        <h3>Your Blogs</h3>
        <div className="grid">{blogs.map(b=> <BlogCard key={b._id} blog={b} />)}</div>
      </section>
      <section>
        <h3>Saved</h3>
        <div className="grid">{saved.map(b=> <BlogCard key={b._id} blog={b} />)}</div>
      </section>
    </div>
  );
}
