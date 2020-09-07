// eslint-disable-next-line new-cap
const router = require('../../../node_modules/express').Router();
const designCtrl = require('./design.controller');

router
.route('/')
.get(designCtrl.list)
.post(designCtrl.create)
.delete(designCtrl.deletedList);

router
.route('/:designId')
.get(designCtrl.get)
.delete(designCtrl.remove)
.put(designCtrl.update);
router.param('designId', designCtrl.load);


module.exports = router;