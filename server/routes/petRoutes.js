const express = require("express");
const {
  getAllPets,
  createPet,
  getPet,
  updatePet,
  deletePet,
  randomPets,
  deletePetPhoto,
  getPetsWithin,
  
} = require("./../controllers/petController");
const { protect } = require("./../controllers/authController");

const router = express.Router();

router.route("/random").get(randomPets, getAllPets);

router.route("/pets-within/:distance/center/:latlng/unit/:unit").get(getPetsWithin)

router.route("/").get(getAllPets).post(createPet);

router.delete("/:id/photo",  deletePetPhoto);

router
  .route("/:id")
  .get(getPet)
  .patch( updatePet)
  .delete(deletePet);

module.exports = router;
