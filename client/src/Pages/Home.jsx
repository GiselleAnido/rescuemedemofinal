import React from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FactsCarousel from "../components/FactsCarousel";
import MeetThemContainer from "../components/MeetThemContainer";
import { Player } from "@lottiefiles/react-lottie-player";
import { motion } from "framer-motion";


const Home = () => {
   const navigate = useNavigate();

    const handleCheckMoreClick = () => {
      navigate("/giveforadoption");
    };

  return (
    <Container fluid className="cont">
      <Col>
        <Row className="first-block-home">
          <Col className="first-block-text">
            <motion.div
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1>Welcome to Rescue Me!</h1>
              <p>
                Adopting a pet can bring so much joy and love into your life.
              </p>
              <p>
                There are countless pets in shelters waiting for their forever
                homes.
              </p>
              <p>
                Give a homeless pet a chance for happiness by adopting today.
              </p>
            </motion.div>
          </Col>
          <Col className="image-container">
            <Player
              src="https://assets7.lottiefiles.com/packages/lf20_z9ed2jna.json"
              className="player"
              loop
              autoplay
            ></Player>
          </Col>
        </Row>
        <Row>
          <Col className="second-block-home">
            <h2>Pets available for adoption</h2>
            <Row>
              <Col className="meet_them">
                <MeetThemContainer />
                <div className="div-btn-lgr">
                  <Button className="btn_lgr" onClick={handleCheckMoreClick}>
                    Check more
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <FactsCarousel />
      </Col>
    </Container>
  );
};

export default Home;
