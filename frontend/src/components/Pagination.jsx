export default function Pagination({ page, pages, onPage }){
  if (pages <= 1) return null;
  const items = [];
  for (let i=1;i<=pages;i++) items.push(i);
  return (
    <div className="pagination">
      {items.map(n => (
        <button key={n} className={n===page?'page active':'page'} onClick={()=>onPage(n)}>{n}</button>
      ))}
    </div>
  );
}
