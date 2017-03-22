import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/env';
import Account from '../models/account.model';

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  // Ideally you'll fetch this from the db
  Account.getByUsername(req.body.username)
    .then((account) => {
      if (account.status) {
        if (account.validatePassword(req.body.password)) {
          const token = jwt.sign({
            userId: account._id,
            role: account.role,
            status: account.status,
            expiresIn: config.expireTime
          }, config.jwtSecret);
          return res.json({
            token,
            user: account
          });
        } else {
          const err = new APIError('Password is not correct!', httpStatus.UNAUTHORIZED, true);
          return next(err);
        }
      } else {
        const err = new APIError('Your account is deactivated! Cannot login the system!', httpStatus.UNAUTHORIZED, true);
        return next(err);
      }
    })
    .catch(e => next(e));
}

/**
 * This is a protected route. Will get specify account only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function register(req, res, next) {
  Account.getByUsername(req.body.username)
    .then(() => {
      const err = new APIError('Username is already existed!', httpStatus.CONFLICT, true);
      return next(err);
    }, () => {
      const newAccount = new Account(req.body);
      newAccount.save()
        .then((savedAccount) => {
          const token = jwt.sign({
            userId: savedAccount._id,
            role: savedAccount.role,
            status: savedAccount.status,
            expiresIn: config.expireTime
          }, config.jwtSecret);
          return res.json({
            user: savedAccount,
            token,
          });
        })
        .catch(e => next(e));
    })
    .catch(e => next(e));
}

/**
 * This is a protected route. Will get specify account only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getProfile(req, res, next) {
  let accountId = req.user.userId;
  Account.getById(accountId)
    .then(account => res.json(account))
    .catch(err => res.json(err));
}

/**
 * This is a protected route. Will return list of accounts only if jwt token is provided in header
 * and user's account logged in is admin.
 * @param req
 * @param res
 * @returns {*}
 */
function getList(req, res) {
  const {limit = 50, skip = 0} = req.query;
  Account.list({limit, skip})
    .then(accounts => res.json({
      listAccount: accounts
    }))
    .catch(err => next(err));
}

/**
 * This is a protected route. Will get specify account only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function get(req, res, next) {
  if (req.user.role) {
    const id = req.param('accId');
    Account.getById(id)
      .then(account => res.json(account))
      .catch(err => next(err));
  } else {
    const err = new APIError('You don\'t have permission to access this page', httpStatus.UNAUTHORIZED, true);
    return next(err);
  }
}

/**
 * This is a protected route. Will get specify account only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function update(req, res, next) {
  const id = req.param('accId');
  if (req.user.role) {
    Account.getById(id)
      .then((account) => {
        const updatedAccount = account;
        updatedAccount.status = req.body.status;
        updatedAccount.updated_at = new Date();
        updatedAccount.save()
          .then(returnedAcc => res.json(returnedAcc))
          .catch(e => next(e));
      })
      .catch(err => next(err));
  } else {
    const err = new APIError('You don\'t have permission to access this page', httpStatus.UNAUTHORIZED, true);
    return next(err);
  }
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  console.log('-----------------------------');
  console.log(req.user);
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    num: Math.random() * 100
  });
}

export default {login, getRandomNumber, register, getProfile, getList, get, update};
