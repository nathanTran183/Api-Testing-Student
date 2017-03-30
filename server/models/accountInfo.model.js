import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const AccountInfoSchema = new mongoose.Schema({
  first_name:{
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  date_of_birth:{
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  gender: {
    type: Boolean,
    required: true
  },
  degree: {
    type: String,
    required: true,
  },
  user_id:{
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
    required: true,
    unique: true
  },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
AccountInfoSchema.method({
});

/**
 * Statics
 */
AccountInfoSchema.statics = {
  /**
   * Get Account Infomation
   * @param {ObjectId} id - The objectId of AccountInfo.
   * @returns {Promise<AccountInfo, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((cla) => {
        if (cla) {
          return cla;
        }
        const err = new APIError('No such info exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List AccountInfo in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of AccountInfo to be skipped.
   * @param {number} limit - Limit number of AccountInfo to be returned.
   * @returns {Promise<AccountInfo[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .populate('user_id')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }
};

/**
 * @typedef AccountInfo
 */
export default mongoose.model('AccountInfo', AccountInfoSchema);
