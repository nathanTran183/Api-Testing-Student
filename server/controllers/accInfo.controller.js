import AccountInfo from '../models/accountInfo.model';

/**
 * Create new class
 * @property {string} req.body.class_name - The name of class.
 * @property {number} req.body.year - The year of class.
 * @property {string} req.body.teacher_id - The id of teacher.
 * @returns {AccountInfo}
 */
function create(req, res, next) {
  const info = new AccountInfo({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    address: req.body.address,
    gender: req.body.gender,
    degree: req.body.degree,
    account_id: req.body.account_id,
  });
  info.date_of_birth = new Date(req.body.date_of_birth);

  console.log(info);
  return res.json(info);
  /*info.save()
    .then(savedClass => res.json(savedClass))
    .catch(e => next(e));*/
}

/**
 * Get Info list.
 * @property {number} req.query.skip - Number of info to be skipped.
 * @property {number} req.query.limit - Limit number of info to be returned.
 * @returns {AccountInfo[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  AccountInfo.list({ limit, skip })
    .then(infoList => res.json(infoList))
    .catch(e => next(e));
}

export default { list, create}
