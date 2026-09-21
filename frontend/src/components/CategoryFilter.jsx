const DEFAULTS = ['Technology','Lifestyle','Travel','Health','Food','Education','Sports'];
export default function CategoryFilter({ value, onChange, options = DEFAULTS }){
  return (
    <div className="categories">
      <select value={value} onChange={e=>onChange(e.target.value)}>
        <option value="">All Categories</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
