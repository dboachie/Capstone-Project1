import React, { useState } from "react";

function ReviewForm({ setReviewButtonClicked, token }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    //Prevents page from refreshing
    e.preventDefault();
    // Handle submission logic here, e.g., send data to server

    //console.log("Review submitted:", { name, rating, comment });
    console.log("Review submitted:", { title, rating, content });
    try {
      const response = await fetch("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, rating, comment }),
      });
      console.log(response);
    } catch {
      throw new Error("An error");
    }
    setReviewButtonClicked(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="rating">Rating:</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value={0}>Select a rating</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>
      <div>
        <label htmlFor="comment">Comment:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default ReviewForm;
