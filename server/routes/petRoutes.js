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

router.route("/").get(getAllPets).post(protect, createPet);

router.delete("/:id/photo", protect, deletePetPhoto);

router
  .route("/:id")
  .get(getPet)
  .patch(protect, updatePet)
  .delete(protect, deletePet);

module.exports = router;
