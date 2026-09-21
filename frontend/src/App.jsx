import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import BlogDetail from './pages/BlogDetail.jsx';
import CreateBlog from './pages/CreateBlog.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import UpdateBlog from './components/UpdateBlog';
import API from './services/blogService';

export default function App(){
  return (
    <div className="container">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/create" element={<CreateBlog />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/blogs/:id/edit" element={<UpdateBlog />} />
      </Routes>
    </div>
  );
}
