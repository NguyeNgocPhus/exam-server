const mongoose = require('mongoose');

const designSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    requirement: [{ item: String }],
  },
  { collection: 'designs', timestamps: true },
);

designSchema.statics = {
  async get(id) {
    const design = await this.findById(id);
    return design;
  },

  async random() {
    const design = await this.find();
    return design;
  },

  async list({ skip = 0, limit = 500, sort = { createdAt: -1 }, filter = {} }) {
    const data = await this.find(filter)
      .sort(sort)
      .skip(+skip)
      .limit(+limit)
      .populate('userID', 'name studentId phone class email')
      .exec();
    const count = await this.find(filter).count();
    return { data, count, limit, skip };
  },
};

module.exports = mongoose.model('Design', designSchema);
