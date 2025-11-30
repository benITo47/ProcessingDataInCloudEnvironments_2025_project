const adminAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization && authorization === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized: Invalid or missing password" });
  }
};

module.exports = adminAuth;
