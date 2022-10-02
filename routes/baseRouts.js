const userRoutes = require("./userRoutes");
const postRoutes = require("./postRoutes");
// const sharedPostRoutes = require("./sharedPostRoutes");

// All main routes of the application
exports.routesInit = (app) => {
  app.use("/users", userRoutes);
  app.use("/postRoutes", postRoutes);
  // app.use("/sharedPostRoutes", sharedPostRoutes);

  // Handle case of request to any wrong route
  app.use("", (req, res) => {
    res
      .status(404)
      .json({ msg_error: `Url: ${res.req.originalUrl} not found` });
  });
};
