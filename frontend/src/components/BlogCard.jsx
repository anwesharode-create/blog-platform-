import { Link } from 'react-router-dom';
export default function BlogCard({ blog }){
  return (
    <Link to={`/blogs/${blog._id}`} className="card fade-in">
      {blog.imageUrl && <img src={`http://localhost:5000${blog.imageUrl}`} alt={blog.title} className="thumb" />}
      <div className="card-body">
        <span className="category">{blog.category}</span>
        <h3 className="title">{blog.title}</h3>
        <p className="meta">by {blog.author?.name || 'Unknown'} · {new Date(blog.createdAt).toLocaleDateString()}</p>
      </div>
    </Link>
  );
}
