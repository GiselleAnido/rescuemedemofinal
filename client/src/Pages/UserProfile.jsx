import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { Button } from "react-bootstrap";
import "../styles/UserProfile.scss";
import PetContext from "../context/petsContextProvider";
import PetCard from "../components/PetCard";
import axios from "axios";

const UserProfile = () => {
  const { user, pet, fetchMe, setUser } = useContext(PetContext);
  const navigate = useNavigate();
  const [favoritePets, setFavoritePets] = useState([]);
  const [addedPets, setAddedPets] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(user)
 

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const res = await axios.get(
        "https://rescuemebackend.onrender.com/api/users/getMe",
        {
          withCredentials: true,
        }
      );
      setUser(res.data.data.user);

      const favorites = res.data.data.user?.favorites || [];
      const addedPets = res.data.data.user?.pets || [];

      const favoritePetRequests = favorites.map((id) =>
        axios.get(`https://rescuemebackend.onrender.com/api/pets/${id}`, {
          withCredentials: true,
        })
      );
      const addedPetRequests = addedPets.map((id) =>
        axios.get(`https://rescuemebackend.onrender.com/api/pets/${id}`, {
          withCredentials: true,
        })
      );
      const favoritePetResponses = await Promise.all(favoritePetRequests);
      const addedPetResponses = await Promise.all(addedPetRequests);
      const favoritePetData = favoritePetResponses.map(
        (response) => response.data.data.pet
      );
      const addedPetData = addedPetResponses.map(
        (response) => response.data.data.pet
      );

      setFavoritePets(favoritePetData);
      setAddedPets(addedPetData);
      setLoading(false);
    } catch (error) {
      console.error(error.response);
    }
  };

  fetchUserData();
}, []);


  const handleSettings = () => {
    navigate("/userprofilesettings");
  };

  const handleAdoptionClick = () => {
    navigate("/giveforadoption");
  };

  if (!user || loading) {
    return <p>Loading user data...</p>;
  }

  const favorites = favoritePets || [];
  const userPhotoURL = user.user && user.user.photoURL;

  return (
    <div className="user-profile">
      {/* User data */}
      <div className="user-data">
        {/* User personal info */}
        <div className="user-personal-info">
          <div className="user-avatar-image">
            <img src={userPhotoURL ?? ""} alt="User Avatar" />
          </div>
          <div className="user-details">
            <div className="go-to-settings">
              <h1>{user.name}</h1>
              <h4 className="checkboxes-userprofile">
                {user.shelter && <h4>Shelter</h4>}
              </h4>
              <h4 className="city-name capitalize checkboxes-userprofile">
                City: <h4>{user.city}</h4>
              </h4>
              <Button
                className="settings-button"
                size="xs"
                onClick={handleSettings}
              >
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Pet groups */}
        <div className="pet-groups-container">
          {/* Favorite pets */}
          <div className="favorite-pets">
            <h4>Your favorite pets list</h4>
            {user.favorites.length > 0 ? (
              <div className="pet-card-container">
                {favoritePets.map((pet) => (
                  <PetCard key={pet._id} pet={pet} />
                ))}
              </div>
            ) : (
              <p>No favorite pets found.</p>
            )}
          </div>

          {/* Added pets for adoption */}
          <div className="added-pets">
            <h4>Pets added for adoption</h4>
            {user.pets.length > 0 ? (
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

      {/* Give for adoption */}
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
