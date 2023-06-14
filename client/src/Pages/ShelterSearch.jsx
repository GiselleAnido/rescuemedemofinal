import React, { useState } from "react";
import { Row, Col, Button, Card, Form } from "react-bootstrap";
import axios from "axios";
import shelterGif from "../svgs/shelter.gif";

const ShelterSearch = () => {
  const [city, setCity] = useState("");
  const [shelters, setShelters] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleShelterSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(
        `https://rescuemebackend.onrender.com/api/shelters?city=${city}`
      );

      setShelters(response.data.data.shelters);
    } catch (error) {
      setErrorMessage("Error occurred while retrieving shelters");
      console.error(error);
    }
  };

  return (
    <>
      <div className='title_shelter'>
        <h1>Find Animalshelters in your city</h1>
      </div>
      <div className="maincontainer">
      <div className="shelterpic">
        <img src={shelterGif} alt="My GIF" />
                </div>
      <div fluid className='cont-shelter'>
        <div className='card-shelter'>
          <Card.Body>
            <Row>
              <Col>
                <Form.Group controlId='city'>
                  {/* <Form.Label>City</Form.Label> */}
                  <Form.Control
                    type='text'
                    placeholder='Enter city'
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              className='btn_sml submit'
              type='submit'
              onClick={handleShelterSearch}
            >
              Submit
            </Button>
          </Card.Body>
        </div>

        <div className='shelters'>
          {shelters.map((shelter) => (
            <div key={shelter._id}>
              <p>Name: {shelter.name}</p>

              <p>Email:{shelter.email}</p>

              <hr />
            </div>
          ))}
        </div>
        
      
      </div>
    
      {/* <a href="https://storyset.com/love">Love illustrations by Storyset</a> */}
      </div>
    </>
  );
};
export default ShelterSearch;
