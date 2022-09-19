const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

// seperate token gen and cookie creation to seperated funcs
const generateAccessTokenCookie = (req, res, user) => {
  const seconds = "15";
  const milisec = 1000 * Number(seconds);
  const accessToken = jwt.sign(
    { email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: `${seconds}s`,
    }
  );
  res.cookie("accessToken", accessToken, {
    maxAge: milisec,
    httpOnly: true,
  });
};

const generateRefreshTokenCookie = (req, res, user) => {
  const seconds = "60";
  const milisec = 1000 * Number(seconds);
  const refreshToken = jwt.sign(
    { email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: `${seconds}s`,
    }
  );
  // res.cookie("refreshToken", refreshToken, { maxAge: milisec, httpOnly: true });
  res.cookie("refreshToken", refreshToken, { maxAge: 900000, httpOnly: true });
  return refreshToken;
};

const isRefTokenExist = async (refreshToken) => {
  const user = await UserModel.findOne({ refreshToken: refreshToken });
  if (!user) return res.status(404).json("User already logged out");
};

const genAccessTokenByRefreshToken = (req, res, next) => {
  // const refreshToken = req.body.token;
  console.log("req.cookies", req.cookies);
  console.log("req.cookies.refreshToken", req.cookies.refreshToken);
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json("No token provided");

  // isRefTokenExist(refreshToken);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    // req.user = user;
    generateAccessTokenCookie(req, res, user);
  });
  req.user = user;
  next();
};

const verifyUser = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) return res.status(401).json("No token provided");

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    if (err) genAccessTokenByRefreshToken(req, res, next);
    req.user = user;
    next();
  });
};

async function almogVerifyUser(req, res, next) {
  try {
    if (req.cookies.token) {
      const decoded = jwt.verify(req.cookies.token, cookieSecret);
      if (Date.now() - new Date(decoded.created) > TEN_MINUTES) {
        const user = await verifyToken(decoded);
        const { cookieToken } = await setAuthCookie(user);
        res.cookie("token", cookieToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 30,
        });
        next();
      } else {
        req.user = decoded;
        next();
      }
    } else if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = await jwt.verify(token, tokenSecret);
      req.user = decoded;
      next();
    } else {
      throw new Error("Invalid token");
    }
  } catch (e) {
    return res.status(401).json({ message: "you are not authorized" }).end();
  }
}

module.exports = {
  verifyUser,
  genAccessTokenByRefreshToken,
  generateAccessTokenCookie,
  generateRefreshTokenCookie,
};
