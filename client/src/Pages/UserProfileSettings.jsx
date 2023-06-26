import React, { useState, useContext, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import "../styles/UserProfileSettings.scss";
import PetContext from "../context/petsContextProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";


axios.defaults.withCredentials = true;

const UserProfileSettings = () => {
  const { user, setUser, fetchMe } = useContext(PetContext);

  const [photo, setPhoto] = useState(null); // store the photo in state
  const [uploading, setUploading] = useState(false);
  // track whether a photo is being uploaded
  const [error, setError] = useState(null);
  // track any errors that occur during uploading
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const navigate = useNavigate();
  console.log(user);
  
  useEffect(() => {
    console.log("User object in useEffect:", user);
    if (user && user.user && user.user.photoURL) {
      setPhoto(user.user.photoURL);
    }
  }, [user]);

  console.log("User object in component:", user);

  
  const handleUploadPhoto = (event) => {
    const file = event.target.files[0];
    console.log(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const photo = reader.result;

      // Make API call to update user in database
      (async () => {
        try {
          const res = await axios.patch(
            "https://rescuemebackend.onrender.com/api/users/updateMe",
            { withCredentials: true },
            {
              photo,
            }
          );
          console.log(res);
          setUser(res.data.data);
          setPhoto(res.data.data.photoURL);
        } catch (error) {
          console.error(error);
        }
      })();
    };
  };

  const handleSelectPhoto = () => {
    document.getElementById("photo-input").click();
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };


  const handleSaveName = async (e) => {
   e.preventDefault();
   try {
     const res = await axios.patch(
       "https://rescuemebackend.onrender.com/api/users/updateMe",
       { name: newName },
       { withCredentials: true }
     );
     console.log(res.data.data);
     setUser((prevUser) => ({
       ...prevUser,
       name: res.data.data.name,
     }));
     setNewName(res.data.data.name);
         const userRes = await axios.get(
           "https://rescuemebackend.onrender.com/api/users/getMe",
           { withCredentials: true }
         );
         const refreshedUser = userRes.data.data;
         setUser(refreshedUser);
     console.log(user)
     navigate("/userprofile");
   } catch (err) {
     console.log(err);
   }
  };

  const handleSaveEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        "https://rescuemebackend.onrender.com/api/users/updateMe",
        { withCredentials: true },
        {
          email: newEmail,
        }
      );
      setUser(res.data.data);
      setNewEmail("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const res = await axios.delete(
        "https://rescuemebackend.onrender.com/api/users/deleteMe",{ withCredentials: true}
      );
      console.log("Res _> ", res);
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="settings-container">
      <h1>User Profile Settings</h1>

      <Form.Group controlId="formName" className="form-groups">
        <Form.Label>Edit photo</Form.Label>
   
          <Button className="settings-button" onClick={handleSelectPhoto}>
            Choose file 
          </Button>
        
        {uploading && <p>Uploading photo...</p>}
        {error && <p className="text-danger">{error}</p>}
        <Form.Control
          id="photo-input"
          type="file"
          accept="image/*"
          onChange={handleUploadPhoto}
          style={{ display: "none" }}
        />
      </Form.Group>

      <Form.Group controlId="formName" className="form-groups">
        <Form.Label>Name</Form.Label>
        <Form.Control
          className="form-inputs"
          type="text"
          placeholder="Enter new name"
          value={newName}
          onChange={handleNameChange}
        />
        <Button className="settings-button" onClick={handleSaveName}>
          Save 
        </Button>
      </Form.Group>

      <Form.Group controlId="formEmail" className="form-groups">
        <Form.Label>Email</Form.Label>
        <Form.Control
          className="form-inputs"
          type="email"
          placeholder="Enter new email"
          value={newEmail}
          onChange={handleEmailChange}
        />
        <Button className="settings-button" onClick={handleSaveEmail}>
          Save 
        </Button>
      </Form.Group>

      <div className="delete-profile-btn">
        <Button className="settings-button" onClick={handleDeleteProfile}>
          Delete Profile
        </Button>
      </div>
    </div>
  );
};

export default UserProfileSettings;
