import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

function RatingStars({ rating }) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }

    // Add half star
    if (hasHalfStar) {
        stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />);
    }

    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars.push(
            <FaStar
                key={`empty-${i}`}
                className="text-gray-300 dark:text-gray-600"
            />
        );
    }

    return <div className="flex">{stars}</div>;
}

export default RatingStars;