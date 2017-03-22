import APIError from './APIError';
import httpStatus from 'http-status';

function isAdmin(req, res, next) {
  if (req.user.status) {
    if (req.user.role) {
      next();
    } else {
      const error = new APIError("You don't have permission to access this page!",httpStatus.UNAUTHORIZED, true);
      return next(error);
    }
  } else {
    const error = new APIError("Your account is deactivated! Cannot access the system", httpStatus.UNAUTHORIZED, true);
    return next(error);
  }
};

function isLoggedIn(req, res, next){
  if (req.user.status) {
    next();
  } else {
    const error = new APIError("Your account is deactivated! Cannot access the system", httpStatus.UNAUTHORIZED, true);
    return next(error);
  }
}
export default { isAdmin, isLoggedIn }
