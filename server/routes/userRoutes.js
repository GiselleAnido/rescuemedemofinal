const express = require("express");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  getShelters,
  deleteUserPhoto
} = require("./../controllers/userController");
const {
  favPets,
  removeFavoritePet,
} = require("./../controllers/petController");
const {
  signUp,
  login,
  updatePassword,
  protect,
  logout,
} = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.route("/logout").get(logout);

router.patch("/updateMyPassword", protect, updatePassword);

router.get("/getMe", protect, getMe);
router.patch("/updateMe", protect, updateMe);
router.delete("/deleteMe", protect, deleteMe);

router.get("/shelters", getShelters);

router.delete("/deleteUserPhoto", protect, deleteUserPhoto);

router.route("/").get(getAllUsers).post(createUser);


router
  .route("/favorites")
  .post(protect, favPets)
  .delete(protect, removeFavoritePet);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
