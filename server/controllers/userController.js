const User = require("./../models/userModel");
const Pet = require("./../models/petModel");
const cloudinary = require("cloudinary").v2;


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

   
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "This route is not yet defined!",
    });
    next();
  }
};

exports.getUser = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "This route is not yet defined!",
    });
  }
};

exports.getMe = async (req, res, next) => {
  try {
   
     const user = await User.findById(req.user._id)
       .populate({
         path: "favorites",
         select: "-__v -createdAt",
       })
       .populate({
         path: "pets",
         select: "-__v",
       });
 console.log("user",user);

 console.log(req.user._id);
     res.status(200).json({
       status: "success",
       data: {
         user
       },
     });
   } catch (err) {
      next(err)
   }
}

exports.updateMe = async (req, res, next) => {
  try {

    let photoURL = null;


    if (req.body.photo) {
  
       
        const result = await cloudinary.uploader.upload(req.body.photo, {public_id: req.user.email.split("@")[0]});
        
        photoURL = result.secure_url;
       
      
      }

    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new Error(
          "This route is not for password updates. Please use /updateMyPassword.")
      );
    }
    

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
    
      { ...req.body, photoURL },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });

  } catch (err) {
    next(err)
  }
};


exports.deleteUserPhoto = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    if (!user.photoURL) {
      return res.status(400).json({
        status: "fail",
        message: "User has no photo",
      });
    }

    const publicId = user.photoURL.substring(
      user.photoURL.lastIndexOf("/") + 1,
      user.photoURL.lastIndexOf(".")
    );

    const result = await cloudinary.uploader.destroy(
      publicId
    );
    
    if (result.result !== "ok") {
      return res.status(500).json({
        status: "error",
        message: "Failed to delete photo",
      });
    }

   await User.findByIdAndUpdate(user._id, {
      photoURL: null
    })

    res.status(200).json({
      status: "success",
      message: "Photo deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
 res.status(200).json({
   status: "success",
   data: {
     userDeleted: user.email,
   }
 });

  } catch (error) {
    next(error);
  }
};

exports.getShelters = async (req, res, next) => {
  try {
    const { city } = req.query;
    const query = { shelter: true };

    if (city) {
      query.city = city.toLowerCase();
    }

    const shelters = await User.find(query);

    res.status(200).json({
      status: "success",
      data: {
        shelters,
      },
    });
  } catch (err) {
    next(err);
  }
};


exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
