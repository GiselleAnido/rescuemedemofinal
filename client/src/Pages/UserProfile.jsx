import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { Button } from "react-bootstrap";
import "../styles/UserProfile.scss";
import PetContext from "../context/petsContextProvider";
import PetCard from "../components/PetCard";
import axios from "axios";

const UserProfile = () => {
  const { user, loading } = useContext(PetContext);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [addedPets, setAddedPets] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://rescuemebackend.onrender.com/api/users/getMe");
        const userData = response.data;
        setFavorites(userData.favorites);
        setAddedPets(userData.addedPets);
        console.log(response)
        console.log(response.data)
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  console.log("user:", user);
  console.log("loading:", loading);
  console.log(favorites);
  console.log(addedPets);

  const handleSettings = () => {
    navigate("/userprofilesettings"); // Navigate to settings page
  };

  const handleAdoptionClick = () => {
    navigate("/giveforadoption");
  };

  if (!user || loading) {
    return <p>Loading user data...</p>;
  }

  // Check if user and photoURL are defined before accessing them
  const userPhotoURL = user && user.photoURL;

  return (
    <div className="user-profile">
      <div className="user-data">
        <div className="user-personal-info">
          <div className="user-avatar-image">
            {/* Use the userPhotoURL variable with nullish coalescing operator ?? */}
            <img src={userPhotoURL ?? ""} alt="User Avatar" />
          </div>
          <div className="user-details">
            <div className="go-to-settings">
              <h1>{user.name}</h1>
              <h4 className="checkboxes-userprofile">
                {" "}
                User: {user.shelter ? <h4>Shelter</h4> : null}{" "}
              </h4>
              <h4 className="city-name capitalize checkboxes-userprofile">
                {" "}
                City: <h4>{user.city}</h4>
              </h4>

              <Button
                className="settings-button"
                size="xs"
                onClick={handleSettings}
              >
                Settings
                {/* <BiEdit /> */}
              </Button>
            </div>
          </div>
        </div>

        <div className="pet-groups-container">
          <div className="favorite-pets">
            <h4>Your favorite pets list</h4>
            {favorites.length > 0 ? (
              <div className="pet-card-container">
                {favorites.map((pet) => (
                  <PetCard key={pet._id} pet={pet} />
                ))}
              </div>
            ) : (
              <p>No favorite pets found.</p>
            )}
          </div>

          <div className="added-pets">
            <h4>Pets added for adoption</h4>
            {addedPets.length > 0 ? (
              <div className="pet-card-container">
                {addedPets.map((pet) => (
                  <PetCard key={pet._id} pet={pet} />
                ))}
              </div>
            ) : (
              <p>No pets found.</p>
            )}
          </div>
        </div>
      </div>

      <div className="give-for-adoption">
        <h4>Give for adoption</h4>

        <Button type="submit" className="btn_lgr" onClick={handleAdoptionClick}>
          Click here
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
