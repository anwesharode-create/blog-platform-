import { useState } from "react";
import { useNavigate } from "react-router-dom";
import blogService from "../services/blogService";

const CATS = ["Technology", "Lifestyle", "Travel", "Health", "Food", "Education", "Sports"];

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(CATS[0]);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => setFile(e.target.files[0] || null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      if (file) formData.append("image", file);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first!");
        setBusy(false);
        return;
      }

      // ✅ fixed: only pass formData and token
      const res = await blogService.createBlog(formData, token);

      navigate(`/blogs/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create blog");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card form fade-in">
      <h2>Write a new blog</h2>

      <label>Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} required />

      <label>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <label>Content</label>
      <textarea
        rows="8"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <label>Image</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      <button className="btn" disabled={busy}>
        {busy ? "Publishing..." : "Publish"}
      </button>
    </form>
  );
}
