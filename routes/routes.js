const express = require("express");
const Router = express.Router();

const { authenticateUser,
    follow,
    unfollow,
    userProfile,
    getComment: addComment,
    all_posts,
    deletePost,
    unlike,
    like,
    getPost,
    addPost,
    register } = require("../controllers/controllers");

Router.route("/register").post(register)

Router.route("/authenticate").post(authenticateUser);

Router.route("/follow/:id").post(follow);

Router.route("/unfollow/:id").post(unfollow);

Router.route("/user").get(userProfile);

Router.route("/posts").post(addPost);

Router.route("/posts/:id")
    .delete(deletePost)
    .get(getPost);

Router.route("/like/:id").post(like);

Router.route("/unlike/:id").post(unlike);

Router.route("/comment/:id").post(addComment);

Router.route("/all_posts").get(all_posts);

module.exports = Router;