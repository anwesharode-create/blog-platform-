import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BlogCard from '../components/BlogCard.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import Pagination from '../components/Pagination.jsx';
import Loader from '../components/Loader.jsx';
import API from '../services/blogService';
export default function Home(){
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const qsSearch = params.get('search') || '';
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState(qsSearch);

  const fetchData = async (pageNo=1) => {
  setLoading(true);
  try {
    const res = await API.fetchBlogs({ page: pageNo, search, category, limit: 9 });
    setItems(res.data.items);
    setPages(res.data.pages);
    setPage(res.data.page);
  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => { fetchData(1); /* eslint-disable-next-line */ }, [category, search]);

  return (
    <main>
      <div className="toolbar">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search blogs..." />
        <CategoryFilter value={category} onChange={setCategory} />
      </div>
      {loading ? <Loader /> : (
        <>
        <div className="grid">
          {items.map(b => <BlogCard key={b._id} blog={b} />)}
        </div>
        <Pagination page={page} pages={pages} onPage={fetchData} />
        </>
      )}
    </main>
  );
}
