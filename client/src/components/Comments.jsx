import React, { useState } from "react";

function ReviewCommentBox({ review }) {
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");
  const [content, setContent] = useState("");

  const handleInputChange = (event) => {
    setContent(event.target.value);
  };

  // const handleSubmit = (event) => {
  // event.preventDefault();
  // Here you would typically send the comment to your backend for storage
  // console.log("Submitted comment:", comment);

  //};

  const handleSubmit = async (event, content, review_id) => {
    //Prevents page from refreshing
    console.log(content);
    console.log(review.id);
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/comments", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, review_id: review.id }),
      });
      console.log(response);
      setComment("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e, content, review.id)}>
        <textarea
          type="text"
          value={content}
          onChange={handleInputChange}
          placeholder="Write your comment for a review here..."
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ReviewCommentBox;
