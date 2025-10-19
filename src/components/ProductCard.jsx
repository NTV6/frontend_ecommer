import { Link } from 'react-router-dom';

import { getThumbnailImage, getLowestPrice } from '../utils';

function ProductCard({ product }) {
    return (
        <div className="rounded-lg overflow-hidden">
            <Link to={`/product/${product.id}`} state={{ product }}>
                <img
                    src={getThumbnailImage(product)}
                    alt={product.name}
                    className="w-full h-full object-contain hover:opacity-90 transition-opacity"
                />
            </Link>
            <div className="p-4">
                <h3 className="mb-2 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
                    {product.name}
                </h3>
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-100 mb-2">
                    {getLowestPrice(product).toLocaleString()}₫
                </p>
            </div>
        </div>
    );
}

export default ProductCard;