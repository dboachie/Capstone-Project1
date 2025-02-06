import React, { useState, useEffect } from "react";
import { MapPin, Star, Heart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReviewForm from "./Reviews";
import ReviewCommentBox from "./Comments";

export const Dashboard = () => {
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [reviewButtonClicked, setReviewButtonClicked] = useState(false);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(null);
  //const [newCommentText, setNewCommentText] = useState("");
  const [userData, setUserData] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [favoriteLocations, setFavoriteLocations] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [editReviewFormShown, setEditReviewFormShown] = useState(false);
  const [submitUpdatedReview, setSubmitUpdatedReview] = useState(false);
  console.log(userReviews);
  const navigate = useNavigate();

  //If token does not exist, navigate the user to the login page.
  useEffect(() => {
    if (token === null) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch user profile
        const profileResponse = await fetch("/api/users/profile", { headers });
        const profileData = await profileResponse.json();
        setUserData(profileData);

        // Fetch user reviews

        const reviewsResponse = await fetch("/api/reviews", { headers });

        const reviewsData = await reviewsResponse.json();
        console.log(reviewsData);
        setUserReviews(reviewsData);

        // Fetch user comments
        const commentsResponse = await fetch("/api/comments", {
          headers,
        });
        const commentsData = await commentsResponse.json();
        console.log(commentsData);
        setUserComments(commentsData);

        // Fetch favorite locations
        const favoritesResponse = await fetch("/api/users/favorites", {
          headers,
        });
        const favoritesData = await favoritesResponse.json();
        setFavoriteLocations(favoritesData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    //dependancy array
  }, [token]);

  async function deleteReview(id) {
    try {
      const response = await fetch(`http://localhost:3000/api/reviews/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      setUserReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== id)
      );

      console.log(result);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function editReview(id, content, rating) {
    console.log(id);
    try {
      const response = await fetch(`http://localhost:3000/api/reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, rating }),
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function deleteComments(id) {
    try {
      const response = await fetch(`http://localhost:3000/api/comments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      setUserReviews((prevComments) =>
        prevComments.filter((comment) => comment.id !== id)
      );

      console.log(result);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function editComment(id, content, rating) {
    console.log(id);
    try {
      const response = await fetch(`http://localhost:3000/api/comment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, rating }),
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>

      {userData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow flex flex-col items-center">
            <User className="w-8 h-8 text-blue-500 mb-2" />
            <h3 className="font-bold text-gray-600">Username</h3>
            <p className="text-xl font-bold">{userData.username}</p>
          </div>
          <div className="bg-white p-4 rounded shadow flex flex-col items-center">
            <MapPin className="w-8 h-8 text-green-500 mb-2" />
            <h3 className="font-bold text-gray-600">Total Places Visited</h3>
            <p className="text-2xl font-bold">{userData.places_visited || 0}</p>
          </div>
          <div className="bg-white p-4 rounded shadow flex flex-col items-center">
            <Star className="w-8 h-8 text-yellow-500 mb-2" />
            <h3 className="font-bold text-gray-600">Reviews Written</h3>

            <p className="text-2xl font-bold">{userReviews.length}</p>
          </div>
          {/* <div className="bg-white p-4 rounded shadow flex flex-col items-center">
            <Star className="w-8 h-8 text-yellow-500 mb-2" />
            <h3 className="font-bold text-gray-600">Comments Written</h3>

            <p className="text-2xl font-bold">{userReviews.length}</p>
          </div> */}
          <div className="bg-white p-4 rounded shadow flex flex-col items-center">
            <Heart className="w-8 h-8 text-red-500 mb-2" />
            <h3 className="font-bold text-gray-600">Favorite Locations</h3>
            <p className="text-2xl font-bold">{favoriteLocations.length}</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Reviews Section */}
        <div className="bg-white p-6 rounded shadow">
          <button onClick={() => setReviewButtonClicked(!reviewButtonClicked)}>
            {" "}
            Review Form{" "}
          </button>
          {reviewButtonClicked ? (
            <ReviewForm
              setReviewButtonClicked={setReviewButtonClicked}
              token={token}
            />
          ) : (
            <div></div>
          )}

          <h2 className="text-xl font-bold mb-4">My Reviews</h2>

          {userReviews.length === 0 ? (
            <p className="text-gray-500 text-center">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {userReviews.slice(0, 3).map((review) => (
                <div
                  key={review.review_id}
                  className="border p-4 rounded hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-bold">{review.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {review.rating} / 5
                  </div>
                  <p>{review.content}</p>
                  <button onClick={() => deleteReview(review.id)}>
                    {" "}
                    Delete Review{" "}
                  </button>

                  {editReviewFormShown && (
                    <>
                      <input
                        type="text"
                        placeholder="Update your review here."
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                      />
                      <input
                        type="Number"
                        placeholder="New rating"
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(e.target.value)}
                      />
                    </>
                  )}

                  <button
                    onClick={() => setEditReviewFormShown(!editReviewFormShown)}
                  >
                    {" "}
                    Edit Review{" "}
                  </button>
                  <button
                    onClick={() =>
                      editReview(review.id, newReviewText, newReviewRating)
                    }
                  >
                    {" "}
                    Submit Updated Review{" "}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <h2 className="text-xl font-bold mb-4">My Comments</h2>
        <ReviewCommentBox></ReviewCommentBox>

        {userComments.length === 0 ? (
          <>
            <p className="text-gray-500 text-center">No comments yet</p>
          </>
        ) : (
          <div className="space-y-4">
            {userComments.map((comment) => (
              <div
                key={comment.id}
                className="border p-4 rounded hover:bg-gray-50 transition-colors"
              >
                <p>{comment.content}</p>
                <button onClick={() => deleteComments(comment.id)}>
                  {" "}
                  Delete Comment{" "}
                </button>

                <button onClick={() => editComments(comment.id)}>
                  {" "}
                  Edit Comment{" "}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"></div>

        {/* Favorite Locations Section */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Favorite Locations</h2>
          {favoriteLocations.length === 0 ? (
            <p className="text-gray-500 text-center">No favorite locations</p>
          ) : (
            <div className="space-y-4">
              {favoriteLocations.slice(0, 3).map((location) => (
                <div
                  key={location.place_id}
                  className="border p-4 rounded hover:bg-gray-50 transition-colors flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold">{location.name}</h3>
                    <p className="text-sm text-gray-600">
                      {location.city_name}
                    </p>
                  </div>
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
