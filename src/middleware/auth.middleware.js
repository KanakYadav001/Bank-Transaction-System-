const jwt = require("jsonwebtoken");
const UserModel = require("../model/user.model");
const BlacklistModel = require("../model/blacklist.model");
async function AuthMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token Not Found Please Login Or Register First",
    });
  }
 const IsBlackListed = await BlacklistModel.findOne({ token: token })

 if(IsBlackListed){ 
    return res.status(401).json({
        message : "Token is BlackListed Please Login Again"
    })
 }

  try {
    const decoaded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoaded.id);

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Unauthorized Invalid Token !!",
    });
  }
}

async function AuthSystemUser(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token Not Found Please Login OR Register",
    });
  }
  const IsBlackListed = await BlacklistModel.findOne({ token: token })

 if(IsBlackListed){ 
    return res.status(401).json({
        message : "Token is BlackListed Please Login Again"
    })
 }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "Invalid User !! ",
      });
    }
    req.user = user;

    return next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token!!",
    });
  }
}
module.exports = { AuthMiddleware, AuthSystemUser };
