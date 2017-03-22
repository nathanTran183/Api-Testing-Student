import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import authCtrl from '../controllers/auth.controller';
import config from '../../config/env';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

/** POST /api/auth/register - Returns userdata and token if valid information is provided */
router.route('/register')
  .post(validate(paramValidation.register), authCtrl.register);

router.route('/')
  /** GET /api/auth - Returns list of Account if valid token is provided and role is true*/
  .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getList)

  /** POST /api/auth - add new account with permission */
  .post([validate(paramValidation.register), expressJwt({ secret: config.jwtSecret })], authCtrl.register);

/** need token returned by header. Role admin also */
router.route('/:accId')
  /** GET /api/auth/accId - Get account */
  .get(expressJwt({ secret: config.jwtSecret }), authCtrl.get)
  /** PUT /api/auth/accId - Update account */
  .put(expressJwt({ secret: config.jwtSecret }), authCtrl.update);

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
router.route('/random-number')
  .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getRandomNumber);

export default router;
