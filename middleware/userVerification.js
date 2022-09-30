const jwt = require("jsonwebtoken");

// seperate token gen and cookie creation to seperated funcs
const generateAccessTokenCookie = (req, res, user) => {
  const accessToken = jwt.sign(
    { email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: `5s` }
  );

  // Replace with LocalStorage or Context
  res.cookie("accessToken", accessToken, {
    maxAge: 900000, // 15 min
    httpOnly: false,
  });

  res.setHeader("Authorization", accessToken);
  res.setHeader("Access-Control-Expose-Headers", "Authorization");
};

const generateRefreshTokenCookie = (req, res, user) => {
  const refreshToken = jwt.sign(
    { email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: `60s`,
    }
  );
  res.cookie("refreshToken", refreshToken, {
    /* maxAge: 900000, */ httpOnly: true,
  });
  return refreshToken;
};

const genAccessTokenByRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json("No token provided");

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decodedUser) => {
      if (err) return res.status(403).json("refresh token is expired");

      generateAccessTokenCookie(req, res, decodedUser);
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
  generateAccessTokenCookie,
  generateRefreshTokenCookie,
};
