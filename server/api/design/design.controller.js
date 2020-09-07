/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const Design = require('./design.model');

const APIError = require('../../helpers/APIError');
const httpStatus = require('http-status');
const STATUS = require('../../constants/status');

/**
 * Load design and append to req
 */
async function load(req, res, next, id) {
  // eslint-disable-next-line no-param-reassign
  req.design = await Design.findById(id);
  if (!req.design) {
    next(new APIError('Item not found', httpStatus.NOT_FOUND, true));
  }
  next();
}
/**
 * list design
 */
async function list(req, res, next) {
  try {
    const { limit = 500, skip = 0, sort, filter } = req.query;
    const designs = await Design.random();
    res.json(designs);
  } catch (e) {
    next(e);
  }
}
/**
 * create design
 */
// eslint-disable-next-line consistent-return
async function create(req, res, next) {
  try {
    // eslint-disable-next-line max-len
    const { name, code } = req.body;
    const existCode = await Design.findOne({ code });
    if (existCode) {
      const err = new APIError('Exist design with code');
      return next(err);
    }
    const design = new Design({
      // eslint-disable-next-line max-len
      name,
      code,
    });

    return design
      .save()
      .then((saveddesign) => {
        if (saveddesign) res.json(saveddesign);
        else res.transforemer.errorBadRequest('Can not create item');
      })
      .catch((e) => {
        next(e);
      });
  } catch (e) {
    next(e);
  }
}
/**
 * update design
 */
// eslint-disable-next-line consistent-return
async function update(req, res, next) {
  try {
    const { name, code } = req.body;
    const existCode = await Design.findOne({ code });
    if (existCode && code !== req.design.code) {
      const err = new APIError('Exist design with code');
      return next(err);
    }
    const design = req.design;
    design.name = name;
    design.code = code;

    return design
      .save()
      .then(async (result) => {
        res.json(result);
      })
      .catch((err) => {
        next(err);
      });
  } catch (e) {
    next(e);
  }
}

/**
 * Remove costEstimate.
 * @returns design
 */
function remove(req, res, next) {
  const design = req.design;
  design.status = STATUS.DELETED;
  design.code = '';

  design
    .save()
    .then((result) => {
      res.json({
        success: true,
        data: result,
      });
    })
    .catch((e) => next(e));
}

async function deletedList(req, res, next) {
  try {
    const { ids } = req.body;
    const arrDataDelete = ids.map(async (designId) => {
      const design = await Design.findById(designId);
      if (design) {
        design.status = STATUS.DELETED;
        design.code = '';
        return design.save();
      }
    });
    const deletedData = await Promise.all(arrDataDelete);
    res.json({
      success: true,
      data: deletedData,
    });
  } catch (e) {
    // console.log(e)
    next(e);
  }
}
function get(req, res) {
  res.json(req.design);
}

module.exports = {
  list,
  load,
  create,
  update,
  remove,
  get,
  deletedList,
};
