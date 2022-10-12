const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, Posts, Comment } = require("../models/models");

const authenticateUser = (req, res) => {
    //email password
    const { email, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (err) {
            res.status(500).send("Server Error");
        }
        else if (!user) {
            res.status(404).send("User not found");
        }
        else {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    res.status(500).send("Server Error");
                }
                else if (!result) {
                    res.status(401).send("Invalid Password");
                }
                else {
                    const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
                    res.status(200).json({ token: accessToken });
                }
            });
        }
    })
}

const follow = (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1]; //assuming token is sent as Bearer <token>
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).send("Invalid Token");
        }
        else {
            User.findOne({ username: decoded.username }, (err, user) => {
                if (err) {
                    res.status(500).send("Server Error");
                }
                else if (!user) {
                    res.status(404).send("User not found");
                }
                else {
                    User.findById(req.params.id, (err, userToFollow) => {
                        if (err) {
                            res.status(500).send("Server Error");
                        }
                        else if (!userToFollow) {
                            res.status(404).send("User not found");
                        }
                        else {
                            user.following.push(userToFollow.username);
                            userToFollow.followers.push(user.username);
                            user.save();
                            userToFollow.save();
                            res.status(200).send("Followed");
                        }
                    });
                }
            });
        }
    })
}

const unfollow = (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1]; //assuming token is sent as Bearer <token>
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).send("Invalid Token");
        }
        else {
            User.findOne({ username: decoded.username }, (err, user) => {
                if (err) {
                    res.status(500).send("Server Error");
                }
                else if (!user) {
                    res.status(404).send("User not found");
                }
                else {
                    User.findById(req.params.id, (err, userToFollow) => {
                        if (err) {
                            res.status(500).send("Server Error");
                        }
                        else if (!userToFollow) {
                            res.status(404).send("User not found");
                        }
                        else {
                            // user.following.push(userToFollow.username);
                            // userToFollow.followers.push(user.username);
                            user.following = user.following.filter((username) => username !== userToFollow.username);
                            userToFollow.followers = userToFollow.followers.filter((username) => username !== user.username);
                            user.save();
                            userToFollow.save();
                            res.status(200).send("Unfollowed");
                        }
                    });
                }
            });
        }
    })
}

const userProfile = (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1]; //assuming token is sent as Bearer <token>
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).send("Invalid Token");
        }
        else {
            User.findOne({ username: decoded.username }, (err, user) => {
                if (err) {
                    res.status(500).send("Server Error");
                }
                else if (!user) {
                    res.status(404).send("User not found");
                }
                else {
                    followersCount = user.followers.length;
                    followingCount = user.following.length;
                    const { username } = user;
                    res.status(200).json({
                        username,
                        followersCount,
                        followingCount
                    });
                }
            });
        }
    })
}

const deletePost = (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1]; //assuming token is sent as Bearer <token>
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).send("Invalid Token");
        }
        else {
            Posts.findById(req.params.id, (err, post) => {
                if (err) {
                    res.status(500).send("Server Error");
                }
                else if (!post) {
                    res.status(404).send("Post not found");
                }
                else {
                    if (post.username === decoded.username) {
                        post.delete();
                        res.status(200).send("Post deleted");
                    }
                    else {
                        res.status(401).send("Unauthorized");
                    }
                }
            });
        }
    })
}

const getPost = (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1]; //assuming token is sent as Bearer <token>
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).send("Invalid Token");
        }
        else {
            Posts.findById(req.params.id, (err, post) => {
                if (err) {
                    res.status(500).send("Server Error");
                }
                else if (!post) {
                    res.status(404).send("Post not found");
                }
                else {
                    console.log(post._id);
                    data = {
                        id: post._id,
                        numberOfLikes: post.likedBy.length,
                        numberOfComments: post.comments.length,
                    }
                    res.status(200).json(data);
                }
            });
        }
    })
}

const like = (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1]; //assuming token is sent as Bearer <token>
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).send("Invalid Token");
        }
        else {
            Posts.findById(req.params.id, (err, post) => {
                if (err) {
                    res.status(500).send("Server Error");
                }
                else if (!post) {
                    res.status(404).send("Post not found");
                }
                else {
                    post.likedBy.push(decoded.username);
                    post.save();
                    res.status(200).send("Liked");
                }
            });
        }
    })
}

const unlike = (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1]; //assuming token is sent as Bearer <token>
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).send("Invalid Token");
        }
        else {
            Posts.findById(req.params.id, (err, post) => {
                if (err) {
                    res.status(500).send("Server Error");
                }
                else if (!post) {
                    res.status(404).send("Post not found");
                }
                else {
                    console.log(post.likedBy);
                    if(!post.likedBy.includes(decoded.username)){
                        return res.status(400).send("Bad Request");
                    }
                    post.likedBy = post.likedBy.filter((username) => username !== decoded.username);
                    post.save();
                    res.status(200).send("Unliked");
                }
            });
        }
    })
}

const addComment = (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1]; //assuming token is sent as Bearer <token>
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).send("Invalid Token");
        }
        else {
            Posts.findById(req.params.id, (err, post) => {
                if (err) {
                    res.status(500).send("Server Error");
                }
                else if (!post) {
                    res.status(404).send("Post not found");
                }
                else {
                    const { comment } = req.body;
                    commented = new Comment({
                        comment,
                        username: decoded.username,
                    });
                    commented.save((err, comment) => {
                        if (err) {
                            res.status(500).send("Server Error");
                        }
                        else {
                            post.comments.push(comment._id);
                            post.save();
                            res.status(200).json({"comment_id": comment._id});
                        }
                    });
                }
            });
        }
    })
}

const all_posts = (req, res) => {       //Remove Async Behavior: Callback hell
    const accessToken = req.headers.authorization.split(" ")[1]; //assuming token is sent as Bearer <token>
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).send("Invalid Token");
        }
        else {
             Posts.find({ username: decoded.username }).sort({ Date: -1 }).exec((err, posts) => {
                if (err) {
                    res.status(500).send("Server Error");
                }
                else {
                    myPosts = [];
                    posts.forEach((post) => {
                        allComments = [];
                        post.comments.forEach((comment) => {          //Remove Async Behavior from here
                            Comment.findById(comment, (err, foundComment) => {
                                if (err) {
                                    res.status(500).send("Server Error");
                                }
                                else {
                                    // console.log(foundComment);
                                    allComments.push(foundComment.comment);
                                    console.log(allComments);
                                }
                            });
                            console.log(allComments);
                            myPosts.push({
                                _id: post._id,
                                title: post.title,
                                desc: post.description,
                                created_at: post.uploadTime,
                                likes: post.likedBy.length,
                                comments: allComments,
                            });
                        });
                    });
                    if(myPosts.length == 0){
                        res.status(200).json({
                            message: "No posts found"
                        });
                        return;
                    }
                    res.status(200).json(myPosts);
                }
            });
        }
    })
}

const addPost = (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1]; //assuming token is sent as Bearer <token>
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).send("Invalid Token");
        }
        else {
            console.log(decoded.username);
            User.findOne({ username: decoded.username }, (err, user) => {
                if (err) {
                    res.status(500).send("Server Error");
                }
                else if (!user) {
                    res.status(404).send("User not found");
                }
                else {
                    const { title, description } = req.body;
                    const post = new Posts({
                        title,
                        description,
                        username: decoded.username,
                        uploadTime: new Date().getFullYear(),
                        likedBy: [],
                        comments: [],
                    });
                    post.save((err, post) => {
                        if (err) {
                            res.status(500).send("Server Error");
                        }
                        else {
                            //include post ID in post
                            User.findOne({ username: decoded.username }, (err, user) => {
                                if (err) {
                                    res.status(500).send("Server Error");
                                }
                                else if (!user) {
                                    res.status(404).send("User not found");
                                }
                                else {
                                    user.posts.push(post._id);
                                    user.save();
                                    res.status(200).json(post);
                                }
                            });
                        }
                    });
                }
            });
        }
    })
}

const register = (req,res) => {
    const { username, password, email } = req.body;
    hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({
        username,
        password: hashedPassword,
        email,
        followers: [],
        following: [],
    });
    user.save((err, user) => {
        if (err) {
            res.status(500).send("Server Error");
        }
        else {
            res.status(200).json(user);
        }
    });
}

module.exports = {
    authenticateUser,
    follow,
    unfollow,
    userProfile,
    deletePost,
    getPost,
    like,
    unlike,
    getComment: addComment,
    all_posts,
    addPost,
    register
}