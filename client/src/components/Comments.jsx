import React, { useState } from "react";

function ReviewCommentBox() {
  const [comment, setComment] = useState("");

  const handleInputChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would typically send the comment to your backend for storage
    console.log("Submitted comment:", comment);
    setComment("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={handleInputChange}
          placeholder="Write your comment for a review here..."
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ReviewCommentBox;
