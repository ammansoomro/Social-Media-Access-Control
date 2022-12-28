var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')

app.use(cors())

urlencodedParser = bodyParser.urlencoded({ extended: false })
jsonParser = bodyParser.json()

// connect to mysql db
var mysql = require('mysql');
const { urlencoded } = require('body-parser');
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'isproj'
});

var tokendict = {};

get_privacy = (num) => {
    if (num == 0) {
        return "public";
    }
    else if (num == 1) {
        return "friends";
    }
    else if (num == 2) {
        return "closefriends";
    }
    else if (num == 3) {
        return "bestfriends";
    }
    else if (num == 4) {
        return "private";
    }
}

get_privacy_num = (privacy) => {
    if (privacy == "public") {
        return 0;
    }
    else if (privacy == "friends") {
        return 1;
    }
    else if (privacy == "closefriends") {
        return 2;
    }
    else if (privacy == "bestfriends") {
        return 3;
    }
    else if (privacy == "private") {
        return 4;
    } else {
        return -1;
    }
}

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to db!");
});

generateToken = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 128; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

app.get('/', function (req, res) {
    res.send('Hello World');
});


app.post('/login', jsonParser, function (req, res) {
    try {
        // get username and password from request
        var username = req.body.username;
        var password = req.body.password;
        //var password = req.query.password;
        // check if username exists in db
        connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [
            username,
            password
        ], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                // get user id
                var userid = results[0].userId;
                token = generateToken();
                tokendict[token] = userid;
                console.log({ token: token });
                res.send({ token: token });
            } else {
                // if username does not exist give error
                res.status(404);
                res.send({ error: "Username or password is incorrect" });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

app.post('/getYourFriends', jsonParser, function (req, res) {
    try {
        // get token from request
        var token = req.body.token;
        // check if token exists in dictionary
        if (token in tokendict) {
            // if token exists, get id from dictionary
            var id = tokendict[token];
            // get friends from db
            connection.query('SELECT * FROM friends join user on friends.toUser = user.userID Where fromUser = ?', [id], function (error, results, fields) {
                if (error) throw error;
                // send friends to client in json format
                // send only username and if and friendGroup
                var friends = [];
                for (var i = 0; i < results.length; i++) {
                    var friend = {
                        username: results[i].userName,
                        friendGroup: results[i].friendGroup,
                        friendId: results[i].toUser
                    }
                    friends.push(friend);
                }
                res.send(friends);
            });
        } else {
            // if token does not exist error
            res.status(404);
            res.send('relogin');
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

app.post('/getYourProfile', jsonParser, function (req, res) {
    try {
        // get token from request
        var token = req.body.token;
        // check if token exists in dictionary
        if (token in tokendict) {
            // if token exists, get id from dictionary
            var id = tokendict[token];
            // get profile from db
            connection.query("SELECT * FROM user join posts on user.userid = posts.posterid where user.userid = ? order by postDate DESC", [id], (error, results, fields) => {
                if (error) throw error;
                // send profile to client in json format
                // send only username and if and friendGroup
                posts = [];
                profile = {};
                for (var i = 0; i < results.length; i++) {
                    var post = {
                        postId: results[i].postId,
                        poster: results[i].userName,
                        postContent: results[i].postContent,
                        postDate: results[i].postDate,
                        posterId: results[i].posterId,
                        postPrivacy: get_privacy(results[i].postPrivacy)
                    }
                    posts.push(post);
                }
                connection.query("SELECT * FROM user join friends on user.userid = friends.fromUser WHERE userid = ?", [id], async (error, results, fields) => {
                    friends = [];
                    for (var i = 0; i < results.length; i++) {
                        var username = await new Promise((resolve, reject) => {
                            connection.query('SELECT * from user where userid=?', [results[i].toUser], function (error, results, fields) {
                                if (error) throw error;
                                resolve(results[0].userName);
                            });
                        });
                        var friend = {
                            username: username,
                            friendGroup: results[i].friendGroup,
                            friendshipId: results[i].friendshipId
                        }
                        friends.push(friend);
                    }
                    connection.query("SELECT * FROM user WHERE userid = ?", [id], async (error, results, fields) => {
                        profile = {
                            username: results[0].userName,
                            email: results[0].email,
                            userId: results[0].userId,
                            DOB: results[0].DoB,
                            emailPrivacy: get_privacy(results[0].emailPrivacy),
                            DOBPrivacy: get_privacy(results[0].DoBPrivacy),
                            friendshipPrivacy: get_privacy(results[0].friendshipPrivacy),
                            posts: posts,
                            friends: friends
                        }
                        res.send(profile);
                    });
                });

            });
        } else {
            // if token does not exist error
            res.status(404);
            res.send({ error: "relogin" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

app.post('/createPost', jsonParser, function (req, res) {
    try {
        // get token from request
        var token = req.body.token;
        // check if token exists in dictionary
        if (token in tokendict) {
            // if token exists, get id from dictionary
            var id = tokendict[token];
            // get profile from db
            var postContent = req.body.postContent;
            var postPrivacy = get_privacy_num(req.body.postPrivacy);
            var postDate = new Date();
            if (postPrivacy != null) {
                connection.query("INSERT INTO posts (postContent, postPrivacy, postDate, posterId) VALUES (?, ?, ?, ?)", [
                    postContent,
                    postPrivacy,
                    postDate,
                    id
                ], (error, results, fields) => {
                    if (error) throw error;
                    res.send({ success: "Post created" });
                });
            } else {
                res.status(404);
                res.send({ error: "Invalid privacy" });
            }
        } else {
            // if token does not exist error
            res.status(404);
            res.send({ error: "relogin" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

app.post('/getProfile', jsonParser, async function (req, res) {
    try {
        // get token from request
        var token = req.body.token;
        // check if token exists in dictionary
        if (token in tokendict) {
            // if token exists, get id from dictionary
            var requesterid = tokendict[token];
            // get profile from db
            var username = req.body.username;
            var userId = await new Promise(function (resolve, reject) {
                connection.query("SELECT * FROM user WHERE userName = ?", [username], (error, results, fields) => {
                    if (error) throw error;
                    resolve(results[0].userId);
                });
            });
            // get what group you are in with this person
            var friendGroup = await new Promise(function (resolve, reject) {
                connection.query("SELECT * FROM friends join user on user.userid = friends.toUser WHERE fromUser = ? AND toUser = ?", [
                    userId,
                    requesterid
                ], (error, results, fields) => {
                    if (error) throw error;
                    if (results.length > 0) {
                        resolve(results[0].friendGroup);
                    } else {
                        resolve("public");
                    }
                });
            });
            posts = await new Promise(function (resolve, reject) {
                connection.query("SELECT * FROM user join posts on user.userid = posts.posterid where user.userName = ? order by postDate DESC", [username], (error, results, fields) => {
                    if (error) throw error;
                    // send only username and if and friendGroup
                    p = []
                    for (var i = 0; i < results.length; i++) {
                        var postPrivacy = results[i].postPrivacy;
                        if (get_privacy_num(friendGroup) >= postPrivacy || postPrivacy == 0) {
                            var post = {
                                postContent: results[i].postContent,
                                postDate: results[i].postDate,
                                postPrivacy: get_privacy(results[i].postPrivacy)
                            }
                            p.push(post);
                        }
                    }
                    resolve(p);
                });
            });
            connection.query("SELECT * FROM user WHERE userName = ?", [username], async (error, results, fields) => {
                if (error) throw error;
                var emailPrivacy = results[0].emailPrivacy;
                var email = null;
                if (get_privacy_num(friendGroup) >= emailPrivacy || emailPrivacy == 0) {
                    email = results[0].email;
                }
                var DoBPrivacy = results[0].DoBPrivacy;
                var DoB = null;
                if (get_privacy_num(friendGroup) >= DoBPrivacy || DoBPrivacy == 0) {
                    DoB = results[0].DoB;
                }
                var friendshipPrivacy = results[0].friendshipPrivacy;
                friends = [];
                if (get_privacy_num(friendGroup) >= friendshipPrivacy || friendshipPrivacy == 0) {
                    friends = await new Promise(function (resolve, reject) {
                        connection.query("SELECT * FROM friends join user on user.userid = friends.toUser WHERE fromUser = ?", [userId], (error, results, fields) => {
                            if (error) throw error;
                            f = []
                            for (var i = 0; i < results.length; i++) {
                                var friend = {
                                    username: results[i].userName,
                                    friendGroup: results[i].friendGroup
                                }
                                f.push(friend);
                            }
                            resolve(f);
                        });
                    });
                }
                var profile = {
                    username: results[0].userName,
                    email: email,
                    DOB: DoB,
                    friends: friends,
                    posts: posts
                }
                res.send(profile);
            });
        } else {
            // if token does not exist error
            res.status(404);
            res.send({ error: "relogin" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

app.post('/register', jsonParser, function (req, res) {
    try {
        // get username and password from request
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
        var DoB = req.body.DoB;

        // check if username exists in db
        connection.query("SELECT * FROM user WHERE userName = ?", [username], (error, results, fields) => {
            if (error) throw error;
            if (results.length > 0) {
                // if username exists, error
                res.status(404);
                res.send({ error: "Username already exists" });
            } else {
                // if username does not exist, add to db
                connection.query("INSERT INTO user (userName, password, email, DoB) VALUES (?, ?, ?, ?)", [
                    username,
                    password,
                    email,
                    DoB
                ], (error, results, fields) => {
                    if (error) throw error;
                    res.send({ success: "User created" });
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

app.post('/listFriendRequests', jsonParser, async function (req, res) {
    try {
        // get token from request
        var token = req.body.token;
        // check if token exists in dictionary
        if (token in tokendict) {
            // if token exists, get id from dictionary
            var me = tokendict[token];
            // get friend requests from db
            var friendRequests = await new Promise(function (resolve, reject) {
                connection.query("select * from request join user on request.fromRequest = user.userid where toRequest = ?", [me], (error, results, fields) => {
                    if (error) throw error;
                    f = []
                    for (var i = 0; i < results.length; i++) {
                        var friendRequest = {
                            username: results[i].userName,
                            userId: results[i].userId,
                            requestId: results[i].requestId
                        }
                        f.push(friendRequest);
                    }
                    resolve(f);
                });
            });
            res.send(friendRequests);
        } else {
            // if token does not exist error
            res.status(404);
            res.send({ error: "relogin" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

function checkFriendship(me, toSendTo) {
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM friends WHERE fromUser = ? AND toUser = ?", [me, toSendTo], (error, results, fields) => {
            if (error) throw error;
            if (results.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

function checkRequest(me, toSendTo) {
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM request WHERE fromRequest = ? AND toRequest = ?", [me, toSendTo], (error, results, fields) => {
            if (error) throw error;
            if (results.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

app.post('/sendFriendRequest', jsonParser, async function (req, res) {
    try {
        // get token from request
        var token = req.body.token;
        // check if token exists in dictionary
        if (token in tokendict) {
            // if token exists, get id from dictionary
            var me = tokendict[token];
            var toSendTo = req.body.toUsername;
            // get user id from username
            toSendTo = await new Promise(function (resolve, reject) {
                connection.query("SELECT * FROM user WHERE userName = ?", [toSendTo], (error, results, fields) => {
                    if (error) throw error;
                    if (results.length > 0) {
                        resolve(results[0].userId);
                    } else {
                        resolve(-1);
                    }
                });
            });
            if (toSendTo == -1) {
                res.send({ error: "User does not exist" });
                res.status(404);
            }else if (me == toSendTo) {
                res.send({ error: "Cannot send friend request to self" });
                res.status(404);
            } else if (await checkFriendship(me, toSendTo)) {
                res.send({ error: "Already friends" });
                res.status(404);
            } else if (await checkRequest(me, toSendTo)) {
                res.send({ error: "Already sent request" });
                res.status(404);
            } else {
                connection.query("INSERT INTO request (fromRequest, toRequest) VALUES (?, ?)", [
                    me,
                    toSendTo
                ], (error, results, fields) => {
                    if (error) throw error;
                    res.send({ success: "Friend request sent" });
                });
            }
        } else {
            // if token does not exist error
            res.send({ error: "relogin" });
            res.status(404);
        }
    } catch (err) {
        res.status(500).end();
        console.log(err);
    }
});

app.post('/acceptFriendRequest', jsonParser, async function (req, res) {
    try {
        // get token from request
        var token = req.body.token;
        // check if token exists in dictionary
        if (token in tokendict) {
            // if token exists, get id from dictionary
            var me = tokendict[token];
            var requestId = req.body.requestId;
            // get request from db
            var request = await new Promise(function (resolve, reject) {
                connection.query("SELECT * FROM request WHERE requestId = ? AND toRequest = ?", [requestId, me], (error, results, fields) => {
                    if (error) throw error;
                    if (results.length > 0) {
                        resolve(results[0]);
                    } else {
                        res.status(404);
                        res.send({ error: "Request does not exist" });
                    }
                });
            });
            connection.query("DELETE FROM request WHERE requestId = ?", [requestId], (error, results, fields) => {
                if (error) throw error;
            });
            connection.query("INSERT INTO friends (fromUser, toUser) VALUES (?, ?)", [
                request.fromRequest,
                request.toRequest
            ], (error, results, fields) => {
                if (error) throw error;
                connection.query("INSERT INTO friends (fromUser, toUser) VALUES (?, ?)", [
                    request.toRequest,
                    request.fromRequest
                ], (error, results, fields) => {
                    if (error) throw error;
                    res.send({ success: "Friend request accepted" });
                });
            });
        } else {
            // if token does not exist error
            res.status(404);
            res.send({ error: "relogin" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

app.post('/declineFriendRequest', jsonParser, async function (req, res) {
    try {
        // get token from request
        var token = req.body.token;
        // check if token exists in dictionary
        if (token in tokendict) {
            // if token exists, get id from dictionary
            var me = tokendict[token];
            var requestId = req.body.requestId;
            // get request from db
            var request = await new Promise(function (resolve, reject) {

                connection.query("SELECT * FROM request WHERE requestId = ? AND toRequest = ?", [requestId, me], (error, results, fields) => {
                    if (error) throw error;
                    if (results.length > 0) {
                        resolve(results[0]);
                    } else {
                        res.status(404);
                        res.send({ error: "Request does not exist" });
                    }
                });
            });
            connection.query("DELETE FROM request WHERE requestId = ?", [requestId], (error, results, fields) => {
                if (error) throw error;
                res.send({ success: "Friend request declined" });
            });
        } else {
            // if token does not exist error
            res.status(404);
            res.send({ error: "relogin" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

app.post('/changeFriendship', jsonParser, async function (req, res) {
    try {
        // get token from request
        var token = req.body.token;
        // check if token exists in dictionary
        if (token in tokendict) {
            // if token exists, get id from dictionary
            var me = tokendict[token];
            var friendToChangeUserName = req.body.friendToChange;
            var groupToChangeTo = req.body.group;
            var friendToChangeId = await new Promise(function (resolve, reject) {
                connection.query("SELECT * FROM user WHERE userName = ?", [friendToChangeUserName], (error, results, fields) => {
                    if (error) throw error;
                    if (results.length > 0) {
                        resolve(results[0].userId);
                    } else {
                        res.status(404);
                        res.send({ error: "User does not exist" });
                    }
                });
            });

            if (await checkFriendship(me, friendToChangeId)) {
                if (groupToChangeTo == "unfriend") {
                    connection.query("DELETE FROM friends WHERE fromUser = ? AND toUser = ?", [
                        me,
                        friendToChangeId
                    ], (error, results, fields) => {
                        if (error) throw error;
                        connection.query("DELETE FROM friends WHERE fromUser = ? AND toUser = ?", [
                            friendToChangeId,
                            me
                        ], (error, results, fields) => {
                            if (error) throw error;
                            res.send({ success: "Friendship changed" });
                        });
                    });
                } else {
                    if (get_privacy_num(groupToChangeTo) == -1) {
                        res.status(404);
                        res.send({ error: "Group does not exist" });
                    }
                    connection.query("UPDATE friends SET friendgroup = ? WHERE fromUser = ? AND toUser = ?", [
                        groupToChangeTo,
                        me,
                        friendToChangeId
                    ], (error, results, fields) => {
                        if (error) throw error;
                        res.send({ success: "Friendship changed" });
                    });
                }
            } else {
                res.status(404);
                res.send({ error: "Friendship does not exist" });
            }
        } else {
            // if token does not exist error
            res.status(404);
            res.send({ error: "relogin" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

function checkPost(userId, postId) {
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM posts WHERE postId = ? AND posterId = ?", [postId, userId], (error, results, fields) => {
            if (error) throw error;
            if (results.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

app.post("/changePostPrivacy", jsonParser, async function (req, res) {
    try {
        // get token from request
        var token = req.body.token;
        // check if token exists in dictionary
        if (token in tokendict) {
            // if token exists, get id from dictionary
            var me = tokendict[token];
            var postId = req.body.postId;
            var privacy = req.body.postPrivacy;
            if (get_privacy_num(privacy) == -1) {
                res.status(404);
                res.send({ error: "Privacy does not exist" });
            } else {
                if (await checkPost(me, postId)) {
                    connection.query("UPDATE posts SET postPrivacy = ? WHERE postId = ?", [
                        get_privacy_num(privacy),
                        postId
                    ], (error, results, fields) => {
                        if (error) throw error;
                        res.send({ success: "Post privacy changed" });
                    });
                } else {
                    res.status(404);
                    res.send({ error: "Post does not exist" });
                }
            }

        } else {
            // if token does not exist error
            res.status(404);
            res.send({ error: "relogin" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

app.post("/changeProfilePrivacy", jsonParser, async function (req, res) {
    try {
        // get token from request
        var token = req.body.token;
        // check if token exists in dictionary
        if (token in tokendict) {
            // if token exists, get id from dictionary
            var me = tokendict[token];
            var whatToChange = req.body.whatToChange;
            var privacy = req.body.privacy;
            if (get_privacy_num(privacy) == -1) {
                res.status(404);
                res.send({ error: "Privacy does not exist" });
            } else {
                if (whatToChange == "DoB" || whatToChange == "DOB") {
                    connection.query("UPDATE user SET DoBPrivacy = ? WHERE userId = ?", [
                        get_privacy_num(privacy),
                        me
                    ], (error, results, fields) => {
                        if (error) throw error;
                        res.send({ success: "Profile privacy changed" });
                    });
                } else if (whatToChange == "email") {
                    connection.query("UPDATE user SET emailPrivacy = ? WHERE userId = ?", [
                        get_privacy_num(privacy),
                        me
                    ], (error, results, fields) => {
                        if (error) throw error;
                        res.send({ success: "Profile privacy changed" });
                    });
                } else if (whatToChange == "friendship") {
                    connection.query("UPDATE user SET friendshipPrivacy = ? WHERE userId = ?", [
                        get_privacy_num(privacy),
                        me
                    ], (error, results, fields) => {
                        if (error) throw error;
                        res.send({ success: "Profile privacy changed" });
                    });
                } else {
                    res.status(404);
                    res.send({ error: "What to change does not exist" });
                }
            }

        } else {
            // if token does not exist error
            res.status(404);
            res.send({ error: "relogin" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});



var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
});