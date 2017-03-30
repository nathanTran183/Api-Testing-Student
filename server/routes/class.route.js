import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import classCtrl from '../controllers/class.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/classes - Get list of class */
  .get(classCtrl.list)

  /** POST /api/users - Create new class */
  .post(validate(paramValidation.createClass), classCtrl.create);


export default router;
