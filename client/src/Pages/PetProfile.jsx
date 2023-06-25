import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import PetContext from "../context/petsContextProvider"; 
import axios from "axios";




//carousel with photos of the actual searched pet
//Pet name
//a favourite icon/button
//breed , city, country
//age size , gender ,color
//shelter
//paragraph with description
// adopt me button

const PetProfile = () => {


     const navigate = useNavigate();


    let location = useLocation();
    let pet = location.state;

console.log(pet)
  console.log(pet.name)
  console.log(pet.data.pet.name)
  if (!pet) {
    return <div>Loading...</div>;
  }
   const handleAdoptMeClick = () => {
     navigate("/adoptionprocess");
   };
  
  return (
    <Container className="pet-profile-cont">
      <div className="pet-profile-info">
        <div className="pet-profile-photo">
          <img
            className="d-block w-100"
            src={
              pet.photoURL ? pet.photoURL : "https://picsum.photos/id/200/300"
            }
            alt="First slide"
          />
        </div>
        <div className="pet-profile-data">
          <h2>
            <strong>
              pet.name || pet.data.pet.name 
            </strong>
          </h2>
          <h4>Shelter</h4>
          <h4>Breed: {pet.breed}</h4>
          <h4>Size: {pet.size}</h4>

          <h4>
            {pet.city.charAt(0).toUpperCase() + pet.city.slice(1).toLowerCase()}
            , Germany
          </h4>
          <Button className="btn_lgr" onClick={handleAdoptMeClick}>
            Adopt me
          </Button>
        </div>
      </div>
      <div className="pet-profile-description">
        <h4>Description:</h4>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus
          laboriosam quisquam asperiores! Sed similique consequuntur ipsam
          ducimus aut, deserunt quam sapiente illo beatae nobis, odio ut facere
          animi at ipsum nisi pariatur. Ullam est quis repellendus! Facere
          dolorem asperiores suscipit. Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Possimus laboriosam quisquam asperiores! Sed
          similique consequuntur ipsam ducimus aut, deserunt quam sapiente illo
          beatae nobis, odio ut facere animi at ipsum nisi pariatur. Ullam est
          quis repellendus! Facere dolorem asperiores suscipit. Lorem ipsum
          dolor sit amet, consectetur adipisicing elit. Possimus laboriosam
          quisquam asperiores! Sed similique consequuntur ipsam ducimus aut,
          deserunt quam sapiente illo beatae nobis, odio ut facere animi at
          ipsum nisi pariatur. Ullam est quis repellendus! Facere dolorem
          asperiores suscipit. Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Possimus laboriosam quisquam asperiores! Sed
          similique consequuntur ipsam ducimus aut, deserunt quam sapiente illo
          beatae nobis, odio ut facere animi at ipsum nisi pariatur. Ullam est
          quis repellendus! Facere dolorem asperiores suscipit. Lorem ipsum
          dolor sit amet, consectetur adipisicing elit. Possimus laboriosam
          quisquam asperiores! Sed similique consequuntur ipsam ducimus aut,
          deserunt quam sapiente illo beatae nobis, odio ut facere animi at
          ipsum nisi pariatur. Ullam est quis repellendus! Facere dolorem
          asperiores suscipit.
        </p>
      </div>
    </Container>
  );
};

export default PetProfile;

/* <Carousel className="carousel-pet">
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://picsum.photos/id/200/300"
                alt="Second slide"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://picsum.photos/id/200/300"
                alt="Second slide"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://picsum.photos/id/200/300"
                alt="Third slide"
              />
            </Carousel.Item>
          </Carousel> */
