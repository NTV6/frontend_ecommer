import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

function ReviewForm({ productId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const user = auth.currentUser;

      if (!user) {
        setError('Vui lòng đăng nhập để đánh giá sản phẩm');
        return;
      }

      const reviewsRef = collection(db, 'reviews');
      const q = query(
        reviewsRef,
        where('productId', '==', productId),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const reviewDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'reviews', reviewDoc.id), {
          rating,
          comment,
          updatedAt: new Date()
        });
      } else {
        await addDoc(reviewsRef, {
          productId,
          userId: user.uid,
          userEmail: user.email,
          rating,
          comment,
          createdAt: new Date()
        });
      }

      setRating(0);
      setComment('');
      onReviewSubmitted();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Đánh giá của bạn
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="text-2xl focus:outline-none"
            >
              <FaStar
                className={`${star <= (hover || rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
                  }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nhận xét
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
        />
      </div>

      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full bg-gray-900 dark:bg-blue-700 text-white py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
      </button>
    </form>
  );
}

export default ReviewForm;