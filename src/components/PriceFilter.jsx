import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedPriceRange } from '../store/categorySlice';

function PriceFilter() {
  const dispatch = useDispatch();
  const { priceRanges, selectedPriceRange } = useSelector((state) => state.categories);

  const handlePriceRangeChange = (range) => {
    dispatch(setSelectedPriceRange(selectedPriceRange?.id === range.id ? null : range));
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Giá</h3>
      <div className="space-y-2">
        {priceRanges.map((range) => (
          <label key={range.id} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedPriceRange?.id === range.id}
              onChange={() => handlePriceRangeChange(range)}
              className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
            />
            <span className="text-gray-700 dark:text-gray-300">{range.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default PriceFilter;