const { Types } = require("mongoose");

const toObjId = (obj) => new Types.ObjectId(obj);

module.exports = { toObjId}