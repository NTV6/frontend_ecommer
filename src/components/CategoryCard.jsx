import { Link } from 'react-router-dom';

function CategoryCard({ category }) {
  return (
    <div className="rounded-lg overflow-hidden shadow-md">
      <Link to={`/category/${category.id}`} state={{ category }} className="relative overflow-hidden group">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h3 className="text-white text-2xl font-bold">{category.name}</h3>
        </div>
      </Link>
    </div>
  );
}

export default CategoryCard;