import TokenService from "../service/token-service.js";
export default function (req, res, next) {
  try {
    const autorizationHeader = req.headers.authorization;

    if (!autorizationHeader) {
      return next(new Error(401, "User is't authirized"));
    }

    const accessToken = autorizationHeader.split(" ")[1];

    if (!accessToken) {
      return next(new Error(401, "User is't authirized"));
    }

    const userData = TokenService.validateAccessToken(accessToken);

    if (!userData) {
      return next(new Error(401, "User is't authirized"));
    }

    req.user = userData;
    next();
  } catch (err) {
    return next(new Error(401, "User is't authirized"));
  }
}
