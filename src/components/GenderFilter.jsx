import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setSelectedGender } from '../store/categorySlice';

function GenderFilter() {
  const dispatch = useDispatch();
  const { genderCategories, selectedGender } = useSelector((state) => state.categories);

  const handleGenderChange = (gender) => {
    dispatch(setSelectedGender(selectedGender?.id === gender.id ? null : gender));
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Giới tính</h3>
      <div className="space-y-2">
        {genderCategories.map((gender) => (
          <label key={gender.id} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedGender?.id === gender.id}
              onChange={() => handleGenderChange(gender)}
              className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
            />
            <span className="text-gray-700 dark:text-gray-300">{gender.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default GenderFilter