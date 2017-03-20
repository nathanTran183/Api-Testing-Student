import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/env';
import Account from '../models/account.model';
// sample user, used for authentication
const user = {
  username: 'admin',
  password: '123123'
};

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
      if (account.validatePassword(req.body.password)) {
        const token = jwt.sign({ user: account }, config.jwtSecret);
        return res.json({
          token: token,
          user: account
        });
      } else {
        const err = new APIError('Password is not correct!', httpStatus.UNAUTHORIZED, true);
        return next(err);
      }
    })
    .catch(e => next(e));
}
 
function register(req, res, next) {
  Account.getByUsername(req.body.username)
    .then((account) => {
      const err = new APIError('Username is already existed!', httpStatus.CONFLICT, true);
      return next(err);
    }, (err) => {
      var newAccount = new Account(req.body);
      // newAccount.password = newAccount.generateHash(newAccount.password);
      newAccount.save()
        .then(savedAccount => {
          const token = jwt.sign({ user: newAccount }, config.jwtSecret);
          return res.json({
            token: token,
            user: savedAccount
          })
        })
        .catch(e => next(e));
    })
    .catch(e => next(e));
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    token: req.headers.authorization.split(' ')[1],
    user: req.user,
    num: Math.random() * 100
  });
}

export default { login, getRandomNumber, register };
