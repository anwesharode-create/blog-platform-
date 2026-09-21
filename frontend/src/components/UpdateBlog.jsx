import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/blogService';
import BlogForm from './BlogForm';

export default function UpdateBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.fetchBlog(id);
        setInitialData(res.data.blog);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch blog');
      }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      // formData can be FormData (if file uploaded) or plain object
      const res = await API.updateBlog(id, formData);
      navigate(`/blogs/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update');
    } finally {
      setSubmitting(false);
    }
  };

  return initialData ? (
    <BlogForm
      isEditing={true}
      initialData={initialData}
      onSubmit={handleSubmit}
      submitting={submitting}
    />
  ) : (
    <p>Loading blog data...</p>
  );
}
