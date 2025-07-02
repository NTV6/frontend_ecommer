import { Link } from 'react-router-dom';

import { getThumbnailImage, getLowestPrice } from '../utils';

function ProductCard({ product }) {
    return (
        <div className="rounded-lg overflow-hidden shadow-md">
            <Link to={`/product/${product.id}`} state={{ product }}>
                <img
                    src={getThumbnailImage(product)}
                    alt={product.name}
                    className="w-full h-full object-contain bg-white hover:opacity-90 transition-opacity"
                />
            </Link>
            <div className="p-4">
                <Link to={`/product/${product.id}`} state={{ product }}>
                    <h3 className="text-lg font-semibold mb-2 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-gray-600 dark:text-gray-100 mb-2">
                    {getLowestPrice(product).toLocaleString()}₫
                </p>
            </div>
        </div>
    );
}

export default ProductCard;