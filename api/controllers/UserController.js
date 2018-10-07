var bcrypt = require('bcryptjs');
var randtoken = require('rand-token');
var jwt = require('jsonwebtoken');
/**
 * personController
 *
 * @description :: Server-side logic for managing persons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

//var cert = fs.readFileSync('private.key');

function auth(email, password, callback) {
    if (email && password) {

        Person.findOne({
                select: ['firstName', 'lastName', 'password', 'role'],
                where: { email: email }
            })
            .populate('role')
            .exec(function(err, person) {
                if (err) {
                    callback({ 'message': err });
                } else {
                    if (!person || typeof person === 'undefined') {
                        callback({ 'message': 'Could not find person, sorry.' });
                    } else {
                        bcrypt.compare(password, person.password, function(err, realuser) {
                            if (!realuser) {
                                callback({ 'message': 'Invalid Password' });
                            } else {
                                var token = randtoken.generate(20);
                                person.access_token = token;
                                person.save(
                                    function(err) {
                                        console.log(err);
                                    }
                                );
                                if (!person.role || typeof person.role == 'undefined') {
                                    callback({ 'error': 'no role' });
                                }
                                var returnperson = {
                                    id: person.id,
                                    name: person.firstName,
                                    email: email,
                                    role: person.role
                                };

                                callback({ user: returnperson, token: jwToken.issue({ access_token: person.access_token }) });
                            }
                        });
                    }
                }
            });
    } else {
        callback({ 'message': 'Please fill all fields' });
    }
}
module.exports = {

    getUser: function(req, res) {
        if (req.param("imei") && req.param("access_token") && req.param("phone")) {
            Person.findOne({ access_token: req.param("access_token") }).exec(function(err, person) {
                if (person) {
                    var owner = person.personId;
                    Device.findOne({ imei: req.param("imei") }).exec(function(err, device) {
                        if (err) {
                            //TODO: Handle the error from this query
                        }
                        if (device) {
                            if (device.owner === owner) {
                                Person.findOne({ phone: req.param("phone") }).exec(function(error, foundUser) {
                                    if (error) {
                                        //TODO: Handle the error from this query
                                        res.send(error);
                                    }
                                    if (foundUser) {
                                        var gotUser = { name: foundUser.name, email: foundUser.email, id: foundUser.id, phone: foundUser.phone };
                                        res.send(gotUser);
                                    }
                                });
                            } else {
                                res.forbidden({ 'forbidden': 'Access Denied' });
                            }
                        }
                    });
                } else {
                    res.forbidden({ 'forbidden': 'Access Denied' });
                }
            });
        } else if (req.session.Person && req.param("access_token") && req.param("phone")) {
            if (req.session.Person.access_token === req.param("access_token")) {
                Person.findOne({ phone: req.param("phone") }).exec(function(error, user) {
                    if (error) {
                        //TODO: Handle the error from this query
                    }
                    if (user) {
                        var foundUser = { name: user.name, email: user.email, id: user.personId, phone: user.phone };
                        res.send(foundUser);
                    }
                });
            } else {
                res.send("Access token does not match");
            }
        } else {
            res.send("Not enough params");
        }

    },

    get: function(req, res) {
        if (req.session.user && req.param("access_token")) {
            if (req.session.user.access_token === req.param("access_token")) {
                var owner = req.session.user.personId;
                res.send(req.session.user);

            }
        } else if (req.param("access_token") && req.param("imei")) {
            Person.findOne({
                access_token: req.param("access_token")
            }).exec(function(err, user) {
                if (user) {
                    var owner = user.personId;
                    Device.findOne({
                        imei: req.param("imei")
                    }).exec(function(err, device) {
                        if (device) {
                            if (device.owner === owner) {
                                res.send(user);
                            } else {
                                res.forbidden({
                                    'forbidden': 'Access Denied'
                                });
                            }
                        } else {
                            res.forbidden({
                                'forbidden': 'Access Denied'
                            });
                        }
                    });
                } else {
                    res.forbidden({
                        'forbidden': 'Access Denied'
                    });
                }
            });
        } else {
            res.forbidden({
                'forbidden': 'Access Denied'
            });
        }
    },

    list: function(req, res) {
        if (req.session.user && req.param("access_token")) {
            if (req.session.user.access_token === req.param("access_token")) {
                var role = req.session.user.role;
                if (role.name === "admin") {
                    Person.find().exec(function(error, users) {
                        if (error) res.send(error);
                        if (users) {
                            res.send(users);
                        }
                    });
                } else {

                    res.forbidden({
                        'forbidden': 'Access Denied'
                    });

                }


            }
        } else {
            res.forbidden({
                'forbidden': 'Access Denied'
            });
        }

    },

    logout: function(req, res) {
        if (req.param("imei") && req.param("access_token")) {
            Person.findOne({ access_token: access_token }).exec(function(err, user) {
                if (user) {
                    Device.findOne({ imei: "imei" }).exec(function(err, device) {
                        if (device) {
                            device.owner.remove();
                            user.access_token.remove();
                            res.send({ 'logout': 'User has been logged out' });
                        } else {
                            res.forbidden("Access Denied");
                        }
                    });
                } else {
                    res.send("User must be logged in to perform this");
                }
            });
        } else if (req.session.user && req.param("access_token")) {
            if (req.session.user.access_token === req.param("access_token")) {
                console.log(req.session.user.access_token);
                console.log(req.param("access_token"));
                req.session.destroy(function(error) {
                    if (!error) {
                        res.send({ 'logout': 'User has been logged out' });
                    }
                });
            }
        } else {
            res.forbidden({ 'forbidden': 'Access Denied' });
        }
    },

    create: function(req, res) {
        var formdata = req.params.all();
        console.log(formdata);

        Person.findOrCreate({
                phone: formdata.phone,
                email: formdata.email
            },
            formdata
        ).exec(function(err, user) {
            if (err) {
                console.log(err);
            }

            if (user) {
                res.send({
                    'user': user
                });
            }


        });


    },

    login: function(req, res) {

        var formdata = req.params.all();
        console.log(formdata);
        var imei = "";
        if (formdata.imei) {
            imei = formdata.imei;
        }
        var phone = formdata.phone;
        var email = formdata.email;
        var password = formdata.password;
        //check if imei exist and its a phone
        if (imei !== "") {
            Device.findOne({
                imei: imei
            }).exec(function(err, device) {
                if (device) {
                    Person.findOne({
                        device: device
                    }).exec(function(err, user) {
                        if (user) {
                            auth(email, password, function(data) {
                                if (data) {
                                    res.send(data);
                                } else {
                                    res.forbidden({
                                        "forbidden": "Access Denied"
                                    });
                                }
                            });
                        } else {

                            Person.update({
                                phone: phone
                            }, {
                                device: device
                            }).exec(function(err, updated) {
                                if (err) {
                                    res.send(err);
                                }
                                if (updated) {
                                    auth(phone, password, function(data) {
                                        if (data) {
                                            console.log(data.email);
                                            res.send(data);
                                        } else {
                                            res.forbidden({
                                                "forbidden": "Access Denied"
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    res.forbidden({
                        "forbidden": "Access Denied"
                    });
                }
            });
        } else {

            //No Imei its a webapp
            auth(email, password, function(data) {
                if (data) {
                    if (data.message) { res.send(data); } else {
                        req.session.user = data.user;
                        console.log("user: " + data.user.name);
                        res.send(data);
                    }
                } else {
                    res.forbidden({
                        "forbidden": "Access Denied"
                    });
                }
            });
        }

    }

};