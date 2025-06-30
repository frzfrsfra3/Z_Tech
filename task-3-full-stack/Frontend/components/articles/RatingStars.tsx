'use client';

import { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import '@/styles/rating/review.css';
import { rateArticle } from '@/lib/api/articles';

export default function RatingStars({ articleId }: { articleId: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleRate = async (value: number) => {
    setRating(value);
    await rateArticle(articleId, value);
    setSubmitted(true);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="review-section mt-4">
      <h3>Your Rating</h3>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <span
            key={value}
            onClick={() => handleRate(value)}
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
            style={{ cursor: 'pointer' }}
          >
            {value <= (hoverRating || rating) ? (
              <StarIcon style={{ color: '#ffc107', fontSize: '2rem' }} />
            ) : (
              <StarBorderIcon style={{ color: '#e4e5e9', fontSize: '2rem' }} />
            )}
          </span>
        ))}
      </div>

      {submitted && (
        <p className="text-green-500 mt-2">Thanks for rating!</p>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Rating submitted!
        </Alert>
      </Snackbar>
    </div>
  );
}
