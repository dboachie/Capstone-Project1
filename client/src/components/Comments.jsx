import React, { useState } from "react";

function ReviewCommentBox() {
  const [comment, setComment] = useState("");

  const handleInputChange = (event) => {
    setComment(event.target.value);
  };

 // const handleSubmit = (event) => {
   // event.preventDefault();
    // Here you would typically send the comment to your backend for storage
   // console.log("Submitted comment:", comment);
  
  //};

  const handleSubmit = async (e, title, rating, visit_date, content) => {
    //Prevents page from refreshing
    try {
      const response = await fetch("http://localhost:3000/api/comments", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });
      console.log(response);
      setComment("");
    } catch {
      throw new Error("An error");
    }
    setReviewButtonClicked(false);
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
