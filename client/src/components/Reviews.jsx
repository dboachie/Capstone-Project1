import React, { useState } from "react";

function ReviewForm({ setReviewButtonClicked, token }) {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  const handleSubmit = async (e, title, rating, content) => {
    //Prevents page from refreshing
    e.preventDefault();
    // Handle submission logic here, e.g., send data to server

    console.log("Review submitted:", { title, rating, content });
    try {
      const response = await fetch("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, rating, content }),
      });
      console.log(response);
    } catch {
      throw new Error("An error");
    }
    setReviewButtonClicked(false);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, title, rating, content)}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default ReviewForm;
