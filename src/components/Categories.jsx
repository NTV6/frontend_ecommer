import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchCategories } from '../store/categorySlice';

function Categories() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.id}`} state={{ category }}
          className="relative overflow-hidden group"
        >
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h3 className="text-white text-2xl font-bold">{category.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Categories;