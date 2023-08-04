const postUser = require("./postUser");
const deleteUser = require("./deleteUser");
const loginUser = require("./loginUser");
const seeUserProfile = require("../users/seeUserProfile");
const addAndChangeAvatar = require("./addAndChangeAvatar");
const editUser = require("./editUser");

module.exports = {
  postUser,
  deleteUser,
  loginUser,
  addAndChangeAvatar,
  seeUserProfile,
  editUser
};
