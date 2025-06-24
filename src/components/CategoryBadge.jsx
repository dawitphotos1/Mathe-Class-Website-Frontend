// ✅ Modular Component: CategoryBadge.jsx
import React from "react";

const CategoryBadge = ({ category }) => {
  return (
    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
      {category}
    </span>
  );
};

export default CategoryBadge;

