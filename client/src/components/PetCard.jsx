import React, { useState, useContext, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PetContext from "../context/petsContextProvider";
import axios from "axios";

const PetCard = ({ pet, rdmpet }) => {
  const displayPet = rdmpet || pet;
  const { user, setUser } = useContext(PetContext);
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkIfFavorite = async () => {
    try {
      if (!isLoggedIn) {
        return;
      }

      const response = await axios.get(
        "https://rescuemebackend.onrender.com/api/users/getMe"
      );
      const favorites = response.data.data.user.favorites.map((pet) => pet._id);
      setFavorite(favorites.includes(displayPet._id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkIfFavorite();
  }, [displayPet._id, isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleCardClick = () => {
    navigate("/petprofile", { state: displayPet });
  };

  const FavHandler = async (e) => {
    console.log(user)
    console.log(pet)
    console.log(displayPet._id)
    if (!favorite) {
      e.stopPropagation();
      try {
        const response = await axios.post(
          "https://rescuemebackend.onrender.com/api/users/favorites",
          {
            petId: displayPet._id,
          }
        );
        console.log(response)
        setUser(response.data.user);
        setFavorite(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const res = await axios.delete(
          "https://rescuemebackend.onrender.com/api/users/favorites",
          {
            data: {
              petId: displayPet._id,
            },
          }
        );
        setUser(res.data);
        setFavorite(false);
      } catch (error) {
        console.error(error);
      }
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
              onClick={(e) => {
                e.stopPropagation(); // Stop event propagation to prevent navigation
                FavHandler(e);
              }}
            ></i>
          </span>
          <Card.Title>{displayPet.name}</Card.Title>
        </Card.Body>
      </div>
    </Card>
  );
};

export default PetCard;
