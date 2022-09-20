const jwt = require("jsonwebtoken");

// seperate token gen and cookie creation to seperated funcs
const generateAccessTokenCookie = (req, res, user) => {
  const accessToken = jwt.sign(
    { email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: `5s`,
    }
  );
  console.log("generating new access token");
  res.cookie("accessToken", accessToken, {
    maxAge: 900000,
    httpOnly: true,
  });
};

const generateRefreshTokenCookie = (req, res, user) => {
  const refreshToken = jwt.sign(
    { email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: `60s`,
    }
  );
  res.cookie("refreshToken", refreshToken, { maxAge: 900000, httpOnly: true });
  return refreshToken;
};

const genAccessTokenByRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json("No token provided");

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    generateAccessTokenCookie(req, res, user);
    req.user = user;
  });
  next();
};

const verifyUser = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) return res.status(401).json("No token provided");

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) genAccessTokenByRefreshToken(req, res, next);
    else {
      req.user = user;
      next();
    }
  });
};

module.exports = {
  verifyUser,
  genAccessTokenByRefreshToken,
  generateAccessTokenCookie,
  generateRefreshTokenCookie,
};
