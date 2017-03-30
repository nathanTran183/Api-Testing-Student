import Class from '../models/class.model';

/**
 * Create new class
 * @property {string} req.body.class_name - The name of class.
 * @property {number} req.body.year - The year of class.
 * @property {string} req.body.teacher_id - The id of teacher.
 * @returns {Class}
 */
function create(req, res, next) {
  const cla = new Class({
    class_name: req.body.class_name,
    year: req.body.year,
    teacher_id: req.body.teacher_id,
  });

  cla.save()
    .then(savedClass => res.json(savedClass))
    .catch(e => next(e));
}

/**
 * Get class list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {Class[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Class.list({ limit, skip })
    .then(classes => res.json(classes))
    .catch(e => next(e));
}

export default { list, create}
