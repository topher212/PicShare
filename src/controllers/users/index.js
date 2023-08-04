const postUser = require("./postUser");
const deleteUser = require("./deleteUser");
const loginUser = require("./loginUser");
const seeUserProfile = require("../users/seeUserProfile");
const addNewAvatar = require("./addNewAvatar");
const editUser = require("./editUser");

module.exports = {
  postUser,
  deleteUser,
  loginUser,
  addNewAvatar,
  seeUserProfile,
  editUser
};
