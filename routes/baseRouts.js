const userRoutes = require("./userRoutes");
const postRoutes = require("./postRoutes");
const sharedPostRoutes = require("./sharedPostRoutes");

// פונקציה שתאגד את כל הראוטים הראשיים
// של האפליקציה
exports.routesInit = (app) => {
  app.use("/userRoutes", userRoutes);
  app.use("/postRoutes", postRoutes);
  app.use("/sharedPostRoutes", sharedPostRoutes);

  // אם כותבים ראוט או קובץ שלא קיים בפאבליק
  // שיציג שגיאה 404
  app.get("*", (req, res) => {
    res.status(404).json({ msg_error: "Url not found, 404!" });
  });
};
