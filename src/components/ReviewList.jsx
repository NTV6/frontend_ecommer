import { FaStar } from 'react-icons/fa';

function ReviewList({ reviews }) {
  const formatDate = (timestamp) => {
    const date = timestamp?.toDate() || new Date();
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border-b dark:border-gray-700 pb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={index < review.rating ? 'text-orange-500' : 'text-gray-300 dark:text-gray-600'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(review.createdAt)}
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{review.userEmail}</p>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;