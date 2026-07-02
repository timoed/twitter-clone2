import { useContext, useState } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import { AuthContext } from "./AuthProvider";
import UpdatePostModal from "./UpdatePostModal";

export default function ProfilePostCard({ post }) {
  // Decoding to get the userId
  const { content, id: postId, likes: postLikes = [], imageUrl } = post;
  const { currentUser, likePost, removeLikeFromPost, deletePost } =
    useContext(AuthContext);
  const userId = currentUser?.uid;
  const [likes, setLikes] = useState(postLikes || []);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const isLiked = likes.includes(userId);

  const pic =
    "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";
  const BASE_URL = "http://localhost:3000";

  const handleShowUpdateModal = () => setShowUpdateModal(true);
  const handleCLoseUpdateModal = () => setShowUpdateModal(false);

  const handleLike = () => {
    if (!userId) return;
    if (isLiked) {
      setLikes(likes.filter((id) => id !== userId));
      removeLikeFromPost(userId, postId);
    } else {
      setLikes([...likes, userId]);
      likePost(userId, postId);
    }
  };

  const handleDelete = () => {
    if (!userId) return;
    deletePost(userId, postId);
  };

  const addToLikes = () => {
    axios
      .post(`${BASE_URL}/likes`, {
        user_id: userId,
        post_id: postId,
      })
      .then((response) => {
        setLikes([...likes, { ...response.data, likes_id: response.data.id }]);
      })
      .catch((error) => console.error("Error:", error));
  };

  const removeFromLikes = () => {
    const like = likes.find((like) => like.user_id === userId);
    if (like) {
      axios
        .put(`${BASE_URL}/likes/${userId}/${postId}`) // Include userId and postId in the URL
        .then(() => {
          // Update the state to reflect the removal of the like
          setLikes(likes.filter((likeItem) => likeItem.user_id !== userId));
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  return (
    <Row
      className="p-3"
      style={{
        borderTop: "1px solid #D3D3D3",
        borderBottom: "1px solid #D3D3D3",
      }}
    >
      <Col sm={1}>
        <Image src={pic} fluid roundedCircle />
      </Col>

      <Col>
        <strong>Haris</strong>
        <span> @haris.samingan · Apr 16</span>
        <p>{content}</p>
        {imageUrl && <Image src={imageUrl} style={{ width: 150 }} />}
        <div className="d-flex justify-content-between">
          <Button variant="light">
            <i className="bi bi-chat"></i>
          </Button>
          <Button variant="light">
            <i className="bi bi-repeat"></i>
          </Button>
          <Button variant="light" onClick={handleLike}>
            {isLiked ? (
              <i className="bi bi-heart-fill text-danger"></i>
            ) : (
              <i className="bi bi-heart"></i>
            )}
            {likes.length}
          </Button>
          <Button variant="light">
            <i className="bi bi-graph-up"></i>
          </Button>
          <Button variant="light" onClick={handleShowUpdateModal}>
            <i className="bi bi-pencil-square"></i>
          </Button>
          <Button variant="light" onClick={handleDelete}>
            <i className="bi bi-trash"></i>
          </Button>
        </div>

        <UpdatePostModal
          show={showUpdateModal}
          handleClose={handleCLoseUpdateModal}
          postId={postId}
          originalPostContent={content}
        />
      </Col>
    </Row>
  );
}
