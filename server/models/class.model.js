import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const ClassSchema = new mongoose.Schema({
  class_name:{
    type: String,
    required: true
  },
  year:{
    type: Number,
    required: true
  },
  teacher_id:{
    type: mongoose.Schema.ObjectId,
    ref: 'AccountInfo',
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
ClassSchema.method({
});

/**
 * Statics
 */
ClassSchema.statics = {
  /**
   * Get class
   * @param {ObjectId} id - The objectId of class.
   * @returns {Promise<Class, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((cla) => {
        if (cla) {
          return cla;
        }
        const err = new APIError('No such class exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List classes in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of classes to be skipped.
   * @param {number} limit - Limit number of classes to be returned.
   * @returns {Promise<Class[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .populate({
        path: 'teacher_id',
        populate: ({
          path: 'account_id'
        }),
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }
};

/**
 * @typedef Class
 */
export default mongoose.model('Class', ClassSchema);
