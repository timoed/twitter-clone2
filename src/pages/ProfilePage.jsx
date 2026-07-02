import { useEffect, useContext } from "react";
import { Container, Row } from "react-bootstrap";
import { useAsyncError, useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import ProfileMidBody from "../components/ProfileMidBody";
import ProfileSideBar from "../components/ProfileSideBar";
import { getAuth, signOut } from "firebase/auth";
import { AuthContext } from "../components/AuthProvider";

export default function ProfilePage() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    // Check if current user is logged in
    if (!currentUser) {
      navigate("/"); // Redirect to login if user not logged in
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Container>
        <Row>
          <ProfileSideBar handleLogout={handleLogout} />
          <ProfileMidBody />
        </Row>
      </Container>
    </>
  );
}
