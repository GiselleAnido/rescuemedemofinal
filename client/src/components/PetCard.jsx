import React, { useState, useContext } from "react";
import { Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PetContext from "../context/petsContextProvider";
import axios from "axios";

const PetCard = ({ pet, rdmpet }) => {
  const displayPet = rdmpet || pet;
  const { user, setUser } = useContext(PetContext);
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);

  const handleCardClick = () => {
    navigate("/petprofile", { state: displayPet });
  };

  const handleFavorite = async (e) => {
    if (!user) {
      // Redirect to login page or display a login modal
      return;
    }

    e.stopPropagation();

    try {
      if (!favorite) {
        const response = await axios.post(
          "https://rescuemebackend.onrender.com/api/users/favorites",
          {
            petId: displayPet._id,
            userId: user.user._id, // Use `user.user._id` instead of `user._id`
          },
          { withCredentials: true } // Move `withCredentials` to the third argument of `axios.post`
        );
        setUser(response.data.user);
        setFavorite(true);
        console.log(user);
        console.log(setUser);
      } else {
        const res = await axios.delete(
          "https://rescuemebackend.onrender.com/api/users/favorites",
          {
            data: {
              petId: displayPet._id,
              withCredentials: true,
            },
          }
        );
        setUser(res.data);
        setFavorite(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="card_petcard">
      <div className="linkpet" onClick={handleCardClick}>
        <Card.Img
          variant="top"
          src={
            displayPet.photoURL
              ? displayPet.photoURL
              : "https://picsum.photos/id/200/300"
          }
        />

        <Card.Body>
          <span>
            <i
              className={`${
                favorite ? "fa-solid fa-heart" : "fa-regular fa-heart"
              }`}
              onClick={handleFavorite}
            ></i>
          </span>
          <Card.Title>{displayPet.name}</Card.Title>
        </Card.Body>
      </div>
    </Card>
  );
};

export default PetCard;
