const jwt = require("jsonwebtoken");

// seperate token gen and cookie creation to seperated funcs
const generateAccessTokenHeader = (req, res, user) => {
  const accessToken = jwt.sign(
    { email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: `5s` }
  );

  res.setHeader("Authorization", accessToken);
  res.setHeader("Access-Control-Expose-Headers", "Authorization");
};

const generateRefreshTokenCookie = (req, res, user) => {
  const refreshToken = jwt.sign(
    { email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: `15m`,
    }
  );

  res.cookie("refreshToken", refreshToken, {
    // Is age really needed when we limited the token expiration date?
    maxAge: 900000, // 15 min
    httpOnly: true,
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
