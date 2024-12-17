import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { Rate } from 'antd'; // Import component Rate từ Ant Design

const ReviewCard = ({ busId }) => {
  const [reviews, setReviews] = useState([]);
  const beUrl = import.meta.env.VITE_APP_BE_URL;

  useEffect(() => {
    // Hàm gọi API để lấy các reviews
    const fetchReviews = async () => {
        const response = await axios.get(`${beUrl}/bus/review/${busId}`); 
        setReviews(response.data.reviews); 
    };

    fetchReviews();
  }, [busId]); 

  return (
    <div className='border-t-2 pt-3'>
      <p className='font-semibold text-lg'>Đánh giá cho chuyến xe</p>
      {reviews.length === 0 ? (
        <p>Không có đánh giá nào.</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className="border-2 p-2 rounded-md my-4">
            <div className='flex items-center gap-2'><img src={review.userId.avatar} className='w-8 h-8 rounded-full'></img><p className='font-semibold'> {review.userId ? review.userId.username : 'Không có thông tin người dùng'}</p></div>
            <p className='my-2'>
              <Rate disabled value={review.rating} /> 
            </p>
            <p>{review.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewCard;
