import React, { useState, useContext } from "react";
import "../styles/LogInPage.scss"
import PetContext from "../context/petsContextProvider";
// import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import axios from "axios";

axios.defaults.withCredentials = true;

function LoginPage() {
  const { user, setUser, handleLogin } = useContext(PetContext);

  // console.log(user);
  // console.log(user.user.favorites)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmitLogin = async (event) => {
    console.log("1")
    event.preventDefault();
    try { console.log("2");
      const response = await axios.post(
        "https://rescuemebackend.onrender.com/api/users/login",
        { email, password }
      );
      console.log(response)
      // check if the response contains a token or some other form of authentication
      if (response.data.user) {
        // save the token in local storage for subsequent requests
       
           
        setUser(response.data.user);
        console.log(setUser);
        // console.log(response.data);
        handleLogin();
console.log("jwdxsnnqajxml d.simlwed")
        // redirect the user to the dashboard or home page
        //window.location.href = "/userprofile";
      } else {
        // display an error message to the user
        setErrorMessage("Invalid email or password");
      }
    } catch (error) {
      // display an error message to the user
      setErrorMessage("Error occurred while logging in");
      console.error(error);
    }
  };

  return (
    <div className="form_container container_login">
      <Form className="form login-form" onSubmit={handleSubmitLogin}>
        <Form.Group controlId="formEmail" className="text-start">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            className="form-control"
            value={email}
            onChange={handleEmailChange}
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="text-start">
          <Form.Label>Enter password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            className="form-control"
            value={password}
            onChange={handlePasswordChange}
          />
        </Form.Group>

        <Button type="submit" className="btn_lgr login-fix">
          Log in
        </Button>

        {errorMessage && <div className="text-danger">{errorMessage}</div>}

        <h6 className="login-with"> Or log in with</h6>

        <div className="icon-buttons">
          <Button variant="light" className="btn_sml">
            <FaFacebook className="mr-2" />
          </Button>
          <Button variant="light" className="btn_sml">
            <FaGoogle className="mr-2 " />
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default LoginPage;
