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

/** POST /api/auth/addAccount - Returns userdata and token if valid information is provided and valid token */
router.route('/addAccount')
  .post([validate(paramValidation.register), expressJwt({ secret: config.jwtSecret })], authCtrl.register);

/** GET /api/auth/listAccount - Returns list of Account if valid token is provided */
router.route('/listAccount')
  .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getListAccount);

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
router.route('/random-number')
  .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getRandomNumber);

export default router;
