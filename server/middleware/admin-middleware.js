export default function (req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return next(new Error(401, "User has no access."));
    } else {
      next();
    }
  } catch (err) {
    return next(new Error(401, "User has no access."));
  }
}
