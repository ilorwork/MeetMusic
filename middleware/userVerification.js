const jwt = require("jsonwebtoken");

// seperate token gen and cookie creation to seperated funcs
const generateAccessTokenHeader = (req, res, user) => {
  const accessToken = jwt.sign(
    { email: user.email, _id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  res.setHeader("Authorization", accessToken);
  res.setHeader("Access-Control-Expose-Headers", "Authorization");
};

const generateRefreshTokenCookie = (req, res, user) => {
  const refreshToken = jwt.sign(
    { email: user.email, _id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "24h",
    }
  );

  res.cookie("refreshToken", refreshToken, {
    // Is age really needed when we limited the token expiration date?
    maxAge: 60 * 60 * 25 * 1000, // 25 hours
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
};

const genAccessTokenByRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json("No token provided");

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decodedUser) => {
      if (err) return res.status(403).json("refresh token is expired");

      generateAccessTokenHeader(req, res, decodedUser);
      req.user = decodedUser;
      next();
    }
  );
};

const verifyUser = (req, res, next) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) return res.status(401).json("No token provided");

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decodedUser) => {
      if (err) genAccessTokenByRefreshToken(req, res, next);
      else {
        req.user = decodedUser;
        next();
      }
    }
  );
};

module.exports = {
  verifyUser,
  generateAccessTokenHeader,
  generateRefreshTokenCookie,
};
