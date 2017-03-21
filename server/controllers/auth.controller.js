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
      if (account.validatePassword(req.body.password)) {
        const token = jwt.sign({
          userId: account._id,
          role: account.role,
          expiresIn: config.expireTime
        }, config.jwtSecret);
        return res.json({
          token,
          user: account
        });
      }
      const err = new APIError('Password is not correct!', httpStatus.UNAUTHORIZED, true);
      return next(err);
    })
    .catch(e => next(e));
}

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

function getListAccount(req, res, next) {
  if (req.user.role) {
    const { limit = 50, skip = 0 } = req.query;
    Account.list({ limit, skip })
      .then(accounts => res.json({
        listAccount: accounts
      }))
      .catch(err => next(err));
  } else {
    const err = new APIError('You don\'t have permission to access this page', httpStatus.NOT_ACCEPTABLE, true);
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

export default { login, getRandomNumber, register, getListAccount };
