import { useState, useContext } from "react";
import "../styles/SignUpPage.scss"
import { Row, Col, Form, Button } from "react-bootstrap";
import Checkbox from "../components/Checkbox";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import PetContext from "../context/petsContextProvider";
import axios from "axios";

axios.defaults.withCredentials = true;

const SignUpPage = () => {
  const { updateUser } = useContext(PetContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // errorMessage is defined to store any error message that may occur during the sign-up process
  const [shelter, setShelter] = useState(false);
  const [city, setCity] = useState("");

  const handleCheckboxChange = (checked) => {
    setShelter(checked);
  };

  const handleSubmitSignUp = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        "https://rescuemebackend.onrender.com/api/users/signup",
        {
          name,
          email,
          password,
          passwordConfirm,
          shelter,
          city,
          //   city: "", // Add the city field from the user schema
          // location: { // Add the location field from the user schema
          //   type: "Point",
          //   coordinates: [],
          //   address: "",
          //   description: ""
        }
      );
      setErrorMessage("");
      alert("You are now a registered user");
      updateUser({ name, email, shelter,city });
      // window.location.href = "/";
    } catch (error) {
      console.error(error);
      setErrorMessage("Please check your inputs and try again");
      alert("Please check your inputs and try again");
    }
  };

  return (
    <div className="form_container container_signup">
      <Row className="signup-form">
        <Col>
          <Form onSubmit={handleSubmitSignUp} className="form">
            <Form.Group controlId="formName" className="text-start">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formCity" className="text-start">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Enter your city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="text-start">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                className="form-control"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="text-start">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                className="form-control"
                placeholder="Enter a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPasswordConfirm" className="text-start">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="password"
                className="form-control"
                placeholder="Reenter your password"
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
              />
            </Form.Group>

            <div className="checkboxes-signup">
              <Checkbox
                label="I am a shelter"
                isChecked={shelter}
                onCheckboxChange={handleCheckboxChange}
              />
            </div>
            <Button type="submit" className="btn_lgr">
              Sign up
            </Button>
          </Form>
        </Col>
      </Row>

      <Form.Label className="signup-with"> <h6 > Or sign up with</h6></Form.Label>

      <div className="icon-buttons">
        <Button variant="light" className="mr-2 btn_sml">
          <FaFacebook className="mr-2" />
        </Button>
        <Button variant="light" className="mr-2 btn_sml">
          <FaGoogle />
        </Button>
      </div>
    </div>
  );
};

export default SignUpPage;
