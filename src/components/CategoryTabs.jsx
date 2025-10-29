// src/components/CategoryTabs.jsx
const CATEGORIES = [
  { id: 'todos', name: 'Todos' },
  { id: 'hombre', name: 'Hombre' },
  { id: 'mujer', name: 'Mujer' },
  { id: 'mascotas', name: 'Mascotas' },
  { id: 'halloween', name: 'Halloween' },
  { id: 'pareja', name: 'Parejas' },
];

export default function CategoryTabs({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {CATEGORIES.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
            selected === cat.id
              ? 'bg-white/10 text-white ring-2 ring-[color:var(--primary)]'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
