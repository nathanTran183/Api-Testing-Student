import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import accInfoCtrl from '../controllers/accInfo.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/classes - Get list of class */
  .get(accInfoCtrl.list)

  /** POST /api/users - Create new class */
  .post(validate(paramValidation.createAccInfo), accInfoCtrl.create);


export default router;
