import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

const blogService = {
  fetchBlogs: (params) => API.get('/blogs', { params }),
  fetchBlog: (id) => API.get(`/blogs/${id}`),
  createBlog: (formData, token) =>
    API.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    }),
  updateBlog: (id, formData) =>
    API.put(`/blogs/${id}`, formData, {
      headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }),
  deleteBlog: (id) => API.delete(`/blogs/${id}`),
  likeBlog: (id) => API.post(`/blogs/${id}/like`),
 saveBlog: (id, token) =>
  API.put(`/blogs/${id}/save`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  }),
};

export default blogService;
