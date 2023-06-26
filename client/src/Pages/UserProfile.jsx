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
   const [localUser, setLocalUser] = useState(user);
   const navigate = useNavigate();
   const [favoritePets, setFavoritePets] = useState([]);
   const [addedPets, setAddedPets] = useState([]);

  console.log(user);
  console.log(localUser)
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const favorites = localUser?.favorites || [];
        const addedPets = localUser?.pets || [];
        const favoritePetRequests = favorites.map((id) =>
          axios.get(
            `https://rescuemebackend.onrender.com/api/pets/${id.toString()}`
          )
        );
        const addedPetRequests = addedPets.map((id) =>
          axios.get(
            `https://rescuemebackend.onrender.com/api/pets/${id.toString()}`
          )
        );
        const favoritePetResponses = await Promise.all(favoritePetRequests);
        const addedPetResponses = await Promise.all(addedPetRequests);
        const favoritePetData = favoritePetResponses.map(
          (response) => response.data.data.pet
        );
        const addedPetData = addedPetResponses.map((response) => response.data.data.pet);
        
        setFavoritePets(favoritePetData);
        setAddedPets(addedPetData);

        console.log(favoritePetData)
        console.log(addedPetData)
        
      } catch (error) {
        console.error(error);
      }
    };

    fetchPetData();
  }, [localUser]);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  const handleSettings = () => {
    navigate("/userprofilesettings"); // Navigate to settings page
  };

  const handleAdoptionClick = () => {
    navigate("/giveforadoption");
  };

  if (!localUser || loading) {
    return <p>Loading user data...</p>;
  }

  const favorites = favoritePets || [];



  // Check if user and photoURL are defined before accessing them
  const userPhotoURL = localUser.user && localUser.user.photoURL;

  console.log (user)

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
                {user.shelter ? <h4>Shelter</h4> : null}
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
