// frontend/src/pages/BlogDetail.jsx
import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import BlogForm from '../components/BlogForm';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState(null); // { blog, comments }
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [optimisticSaved, setOptimisticSaved] = useState(null); // null = unknown, true/false = optimistic state

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/blogs/${id}`);
      setData(res.data);
      setOptimisticSaved(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const isAuthor = useMemo(() => {
    if (!data || !user) return false;
    const blogAuthorId = data.blog.author?._id || data.blog.author;
    const uid = user._id || user.id;
    return blogAuthorId.toString() === uid.toString();
  }, [data, user]);

  // determine liked
  const liked = useMemo(() => {
    if (!data || !user) return false;
    const set = new Set((data.blog.likes || []).map(u => (u._id || u).toString()));
    return set.has((user._id || user.id).toString());
  }, [data, user]);

  // determine saved (from user's saved list)
  const saved = useMemo(() => {
    if (optimisticSaved !== null) return optimisticSaved;
    if (!user || !data) return false;
    // backend exposes saved via user endpoint; here we derive from user.saved if available
    try {
      const usaved = user.saved || [];
      return usaved.some(s => (s._id || s).toString() === (data.blog._id || data.blog._id).toString());
    } catch {
      return false;
    }
  }, [data, user, optimisticSaved]);

  // Optimistic toggle like
  const toggleLike = async () => {
    if (!user) return alert('Login to like');
    if (!data) return;
    const prev = JSON.parse(JSON.stringify(data));
    const uid = user._id || user.id;
    const likes = data.blog.likes || [];
    const has = likes.some(u => (u._id || u).toString() === uid.toString());
    if (has) {
      data.blog.likes = likes.filter(u => (u._id || u).toString() !== uid.toString());
    } else {
      data.blog.likes = [...likes, { _id: uid, name: user.name }];
    }
    setData({ ...data });

    try {
      await API.post(`/blogs/${id}/like`);
    } catch (e) {
      console.error(e);
      setData(prev); // rollback
    }
  };

  // Optimistic save (saves on user.saved on backend)
  const toggleSave = async () => {
    if (!user) return alert('Login to save');
    const prevSaved = optimisticSaved;
    setOptimisticSaved(!saved);
    try {
      await API.put(`/blogs/${id}/save`);
      // Optionally refresh user saved list by requesting /auth/me or user endpoint
    } catch (e) {
      console.error(e);
      setOptimisticSaved(prevSaved); // rollback
    }
  };

  // Delete blog
  const handleDelete = async () => {
    if (!isAuthor) return;
    if (!window.confirm('Delete this blog?')) return;
    try {
      await API.delete(`/blogs/${data.blog._id}`);
      navigate('/');
    } catch (e) {
      console.error(e);
      alert('Failed to delete');
    }
  };

  // Update blog (used by BlogForm while editing) — sends multipart if image chosen
  const handleUpdate = async (formData) => {
    try {
      setBusy(true);
      // formData should be a FormData instance (BlogForm will send FormData if file present)
      const headers = {};
      if (formData instanceof FormData) headers['Content-Type'] = 'multipart/form-data';
      const res = await API.put(`/blogs/${data.blog._id}`, formData, { headers });
      setData({ blog: res.data, comments: data.comments });
      setEditing(false);
    } catch (e) {
      console.error(e);
      alert('Update failed');
    } finally {
      setBusy(false);
    }
  };

  // Add comment (simple)
  const addComment = async (text, clearCallback) => {
    if (!user) return alert('Login to comment');
    if (!text || !text.trim()) return;
    const temp = {
      _id: 'tmp-' + Date.now(),
      text,
      createdAt: new Date().toISOString(),
      user: { _id: user._id || user.id, name: user.name },
    };
    setData({ ...data, comments: [temp, ...(data.comments || [])] });
    try {
      await API.post(`/blogs/${id}/comments`, { text });
      await load();
      if (typeof clearCallback === 'function') clearCallback();
    } catch (e) {
      console.error(e);
      // rollback by reloading
      await load();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;

  const { blog, comments } = data;

  return (
    <article className="detail fade-in">
      {editing ? (
        <BlogForm
          isEditing
          initialData={blog}
          onSubmit={(payload) => handleUpdate(payload)}
          onCancel={() => setEditing(false)}
          submitting={busy}
        />
      ) : (
        <>
          <h1>{blog.title}</h1>
          <p className="meta">In {blog.category} · by {blog.author?.name} · {new Date(blog.createdAt).toLocaleString()}</p>
          {blog.imageUrl && <img className="hero" src={`http://localhost:5000${blog.imageUrl}`} alt={blog.title} />}
          <p className="content">{blog.content}</p>

          <div className="actions">
            <button className={liked ? 'btn' : 'btn ghost'} onClick={toggleLike}>
              {liked ? '❤️ Liked' : '🤍 Like'} {blog.likes?.length || 0}
            </button>

            <button className={saved ? 'btn' : 'btn ghost'} onClick={toggleSave}>
              🔖 {saved ? 'Saved' : 'Save'}
            </button>

            {isAuthor && (
              <>
                <button className="btn ghost" onClick={() => setEditing(true)}>✏️ Edit</button>
                <button className="btn danger" onClick={handleDelete}>🗑️ Delete</button>
              </>
            )}
          </div>

          <section className="comments">
            <h3>Comments</h3>
            {user ? (
              <CommentForm onSubmit={(txt, clear) => addComment(txt, clear)} />
            ) : (
              <p>Login to comment.</p>
            )}

            <ul>
              {comments.map(c => (
                <li key={c._id} className="comment">
                  <div className="avatar">{c.user?.name?.charAt(0)}</div>
                  <div className="bubble">
                    <div className="author">{c.user?.name} <span>{new Date(c.createdAt).toLocaleString()}</span></div>
                    <div>{c.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </article>
  );
}

// Small inline comment form component used above
function CommentForm({ onSubmit }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    try {
      await onSubmit(text, () => setText(''));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="comment-form" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Write a comment..." />
      <button className="btn" disabled={busy || !text.trim()}>Post</button>
    </form>
  );
}
