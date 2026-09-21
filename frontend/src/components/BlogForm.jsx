// frontend/src/components/BlogForm.jsx
import { useEffect, useState } from 'react';

/**
 * Props:
 * - onSubmit(formDataOrObject)  => called with FormData when file is present, otherwise plain object
 * - isEditing (bool)
 * - initialData (object) optional: { title, content, category, imageUrl }
 * - onCancel() optional
 * - submitting (bool) optional
 */
export default function BlogForm({ onSubmit, isEditing = false, initialData = {}, onCancel, submitting = false }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [category, setCategory] = useState(initialData.category || '');
  const [file, setFile] = useState(null);

  useEffect(() => {
    setTitle(initialData.title || '');
    setContent(initialData.content || '');
    setCategory(initialData.category || '');
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // If there's a file, send FormData (multipart)
    if (file) {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('content', content);
      fd.append('category', category);
      fd.append('image', file);
      await onSubmit(fd);
    } else {
      // send plain object
      await onSubmit({ title, content, category, image: initialData.imageUrl || undefined });
    }
  };

  return (
    <form className="card form fade-in" onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
      <h2>{isEditing ? 'Edit blog' : 'Write a new blog'}</h2>

      <label>Title</label>
      <input value={title} onChange={e => setTitle(e.target.value)} required />

      <label>Category</label>
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">Select category</option>
        <option>Technology</option>
        <option>Lifestyle</option>
        <option>Travel</option>
        <option>Health</option>
        <option>Food</option>
        <option>Education</option>
        <option>Sports</option>
      </select>

      <label>Content</label>
      <textarea rows="8" value={content} onChange={e => setContent(e.target.value)} required />

      <label>Image (optional)</label>
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0] || null)} />

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn" type="submit" disabled={submitting}>{isEditing ? 'Update' : 'Publish'}</button>
        {onCancel && <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
