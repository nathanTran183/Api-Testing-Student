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

  // Idea here was to show how jwt works with simplicity
  if (req.body.username === user.username && req.body.password === user.password) {
    const token = jwt.sign({
      username: user.username
    }, config.jwtSecret);
    return res.json({
      token,
      username: user.username
    });
  }

  const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
  return next(err);
}

function register(req, res, next) {
  Account.getByUsername(req.body.username)
    .then((account) => {
      const err = new APIError('Username is already existed!', httpStatus.CONFLICT, true);
      return next(err);
    }, (err) => {
      var newAccount = new Account(req.body);
      newAccount.password = newAccount.generateHash(newAccount.password);
      newAccount.save()
        .then(savedAccount => res.json(savedAccount))
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
