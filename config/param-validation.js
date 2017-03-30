import Joi from 'joi';

export default {

  /**
   * Validate student information
   * @method: createUser, updateUser
   */
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  /**
   * Validate account information
   * @method: login, register, changePass
   */
  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().min(6).required(),
    }
  },

  // POST /api/auth/register
  register: {
    body: {
      username: Joi.string().required(),
      email: Joi.string().email(),
      password: Joi.string().min(6).required(),
    }
  },

  //PUT /api/auth/changePass
  changePass: {
    body: {
      currentPass: Joi.string().min(6).required(),
      newPass: Joi.string().min(6).required(),
      retypePass: Joi.string().min(6).required(),
    }
  },

  /**
   * Validate class information
   * @method: createClass
   */
  //POST /api/classes/
  createClass: {
    body: {
      class_name: Joi.string().required(),
      year: Joi.number().integer().min(2000).max(2017),
      teacher_id:  Joi.string().required(),
    }
  },

  /**
   * Validate teacher information
   * @method: createAccInfo
   */
  //POST /api/accInfo
  createAccInfo: {
    body: {
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      date_of_birth: Joi.string().required(),
      address: Joi.string().min(10).required(),
      gender: Joi.boolean().required(),
      degree: Joi.string().required(),
      account_id: Joi.string().required(),
    }
  },
};
