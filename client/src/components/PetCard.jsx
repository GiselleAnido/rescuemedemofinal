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
            withCredentials: true,
            userId: user._id,
          }
        );
        setUser(response.data.user);
        setFavorite(true);
        console.log(user)
        
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
              : "https://images.unsplash.com/photo-1573435567032-ff5982925350?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
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
