const Pet = require("./../models/petModel");
const User = require("./../models/userModel");
const APIQueries = require("./../utils/APIQueries");
const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//Get fav pets

exports.favPets = async (req, res, next) => {
  try {
    const { petId } = req.body;
    const { userId } = req.body;

    // Check if the pet exists
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).send("Pet not found");
    }
    
    // Add the pet to the user's favorites array
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: petId } },
      { new: true }
    )
      .populate({
        path: "favorites",
        select: "-__v -createdAt -user",
      })
      .populate({
        path: "pets",
        select: "-__v",
      });

    res.send({ user });
  } catch (err) {
    next(err);
  }
};

exports.removeFavoritePet = async (req, res, next) => {
  try {
    const { petId } = req.body;
    const { userId } = req.body;
    console.log(req.body);
    console.log(petId);

    // Check if the pet exists
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).send("Pet not found");
    }

    // Remove the pet from the user's favorites array
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: petId } },
      { new: true }
    )
      .populate({
        path: "favorites",
        select: "-__v -createdAt -user",
      })
      .populate({
        path: "pets",
        select: "-__v",
      });

    res.send({ user });
  } catch (err) {
    next(err);
  }
};

//Gets 3 random pets from the DB
exports.randomPets = async (req, res, next) => {
  try {
    const pets = await Pet.aggregate([{ $sample: { size: 3 } }]);
    res.json(pets);
  } catch (err) {
    next(err);
  }
};

exports.getAllPets = async (req, res, next) => {
  try {
    console.log("heee");
    const features = new APIQueries(Pet.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const pets = await features.query;
console.log(pets);
    res.status(200).json({
      status: "success",
      results: pets.length,
      data: { pets },
    });
  } catch (err) {
    next(err);
  }
};

exports.getPet = async (req, res, next) => {
  try {



    const pet = await Pet.findById(req.params.id).populate("user");

    res.status(200).json({
      status: "success",
      data: { pet },
    });
  } catch (err) {
    next(err);
  }
};

exports.createPet = async (req, res, next) => {
  try {
    // Luke added this
    let photoURL = null;
    console.log(req.body.photo);

    const { userId } = req.body;

    if (req.body.photo) {
      const result = await cloudinary.uploader.upload(req.body.photo, {
        public_id: uuidv4(),
      });

      photoURL = result.secure_url;
      console.log("photo", photoURL);
    }
    const newPet = await Pet.create({
      ...req.body,
      photoURL,
      user: userId,
    });

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { pets: newPet._id } },
      { new: true }
    );
    console.log("user after update:", user);
    
    res.status(201).json({
      status: "success",
      data: { pet: newPet },
    });
  } catch (err) {
    next(err);
  }
   
};

exports.updatePet = async (req, res, next) => {
  try {
    console.log(uuidv4());

    let photoURL = null;

    if (req.body.photo) {
      console.log(req.user.email);

      const result = await cloudinary.uploader.upload(req.body.photo, {
        public_id: uuidv4(),
      });

      photoURL = result.secure_url;
      console.log("photo", photoURL);
    }

    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      { ...req.body, photoURL },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        pet,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deletePetPhoto = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        status: "fail",
        message: "Pet not found",
      });
    }

    if (!pet.photoURL) {
      return res.status(400).json({
        status: "fail",
        message: "Pet has no photo",
      });
    }
    const petPhoto = pet.photoURL;

    const publicId = petPhoto.substring(
      petPhotoL.lastIndexOf("/") + 1,
      petPhoto.lastIndexOf(".")
    );

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      return res.status(500).json({
        status: "error",
        message: "Failed to delete photo",
      });
    }

    pet.photoURL = null;
    await pet.save();

    res.status(200).json({
      status: "success",
      message: "Photo deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.deletePet = async (req, res, next) => {
  try {
    await Pet.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.getPetsWithin = async (req, res, next) => {
  try {
    const { distance, latlng, unit } = req.params;

    const [lat, lng] = latlng.split(",");
    const radius = distance / 6378.1;

    if (!lat || !lng) {
      next(new Error("PLease provide latitude and longitude"));
    }

    const pets = await Pet.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    res.status(200).json({
      status: "success",
      data: {
        data: pets,
      },
    });
  } catch (err) {
    next(err);
  }
};
