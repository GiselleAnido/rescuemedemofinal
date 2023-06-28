const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const {authError}= require("./../middleware/errorHandlers")
const User = require("./../models/userModel");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      shelter: req.body.shelter,
      photoURL: req.body.photoURL,
      city: req.body.city
    });

    const token = signToken(newUser._id);

     res.cookie("jwt", token, {
       expiresIn: new Date(
         Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
       ),
       httpOnly: true,
       secure: process.env.NODE_ENV === "production",
       
     });

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return authError("Please provide email and password");
    } //no email or password gives error

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return authError("Invalid email password combination");
    } // no user or incorrect password gives error, password check on userModel

    const token = signToken(user._id);
 res.cookie("jwt", token, {
   expiresIn: new Date(
     Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
   ),
   httpOnly: true,
   secure:true,
   sameSite: "None",
 });

    res.status(200).json({
      status: "success",
      token,
      user
    });
    
  } catch (err) {
  
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    
    res.clearCookie("jwt", {
      httpOnly: true,
     
    });

    res.status(200).json({
      message: "success",
      statusCode: 200,
      data: "Logged out",
    });
  } catch (err) {
    next(err);
  }
};

//gives access to registered users

exports.protect = async (req, res, next) => {
  try {
     let token;

     // Check if token exists in cookies
    console.log(token)

     if (req.cookies && req.cookies.jwt || req.cookies.__cf_bm) {
       token = req.cookies.jwt || req.cookies.__cf_bm;
     }
    console.log(token);

    //check that there is a token

    if (!token) {
      return next(new Error("No token provided"));
    }

    //verify method jwt, (args: token to be decoded and secret key), made it as promise instead of callback

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //check that user still exits and hasn't been deleted

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new Error("The user belonging to this token does no longer exist.")
      );
    }

    //check if the password has been changed after the token was created

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new Error("Password recently changed"));
    }


    req.user = currentUser;

    next();

  } catch (err) {
    next(err)
  }
};

exports.updatePassword = async (req, res, next) => {
   console.log(req.user._id);
  try { 


    const user = await User.findById(req.user._id).select("+password");
  
    if (!(await user.correctPassword(req.body.currentPassword, user.password)))
    {
      return next(new Error ("Wrong current password"))
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.password;
    await user.save()

    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token
    })

  } catch (err) {
    next(err)
  }
}