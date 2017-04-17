/**
 * ScheduleController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */



module.exports = {

    //Creates new Hospital

    createHospital: function(req, res) {
        var formData = req.params.all();

        Hospital.findOne({
            registrationNo: formData.registrationNo
        }).exec(function(err, hospital) {
            if (hospital) {
                res.send({
                    'message': 'Hospital already exists'
                });
            } else {
                Hospital.create(formData).exec(function(err, created) {
                    if (created) {
                        var hospital_created = {
                            name: created.HospitalName,
                            email: created.email,
                            city: created.city
                        };
                        res.send({
                            'message': hospital_created
                        });
                    } else if (err) {
                        res.send({
                            'error': err
                        });
                    } else {
                        //TODO: Some error occurred
                    }
                });
            }
        });
    },
    //Creates new employee 

    createEmployee: function(req, res) {
        var formData = req.params.all();

        Employee.findOne({
            registrationNo: formData.registrationNo,
            firstaName: formData.firstaName,
            lastName: formData.lastName
        }).exec(function(err, employee) {
            if (employee) {

                res.send({
                    'message': 'employee already exists'
                });

            } else {

                Employee.findOne({
                    access_token: token
                }).exec(function(err, employee) {
                    if (err) {
                        res.send({
                            'massage': 'You dont have '
                        });
                    }
                    if (employee.role == "system") {
                        Employee.create(formData).exec(function(err, created) {
                            if (created) {
                                var employee_created = {
                                    name: created.name,
                                    email: created.email,
                                    city: created.city
                                };
                                res.send({
                                    'message': employee_created
                                });
                            } else if (err) {
                                res.send({
                                    'error': err
                                });
                            } else {
                                //TODO: Some error occurred
                            }
                        });
                    } else {
                        res.forbidden({
                            "Forbidden": "you dont have the enough clearance!"
                        });

                    }
                });
            }
        });
    },

    //Signs in the employee using the given credentials

    login: function(req, res) {
        auth(req.param("email"), req.param("password"), function(data) {
            if (data) {
                req.session.employee = data.employee;
                res.send(data);
            } else {
                res.forbidden({
                    "Forbidden": "Access Denied!"
                });
            }

        });
    },

    //logout employee
    logout: function(req, res) {
        if (req.session.employee && req.param("access_token")) {
            if (req.session.employee.access_token === req.param("access_token")) {
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

    //Gets the logged in employee 

    get: function(req, res) {
        if (req.session.employee && req.param("access_token")) {
            if (req.session.employee.access_token === req.param("access_token")) {
                var owner = req.session.employee.id;
                res.send(req.session.employee);

            }
        }
    },

    //Retrieves all the Hospital with the particular name

    searchEmploye: function(req, res) {
        var name = req.param('name');
        employee.findOne({
            'firstName': name
        }).exec(function(err, pharm) {
            if (err) {
                res.send({
                    'error': err
                });
            }
            if (pharm) {
                Hospital.findOne({ id: pharm.hospital }).exec(function(err, hosp) {
                    if (hosp) {
                        Department.findOne({ id: pharm.depId }).exec(function(err, depart) {
                            var employee = {
                                firstName: pharm.firstName,
                                lastName: pharm.lastName,
                                registrationNo: pharm.registrationNo,
                                email: pharm.email,
                                specialty: pharm.specialty,
                                hospital: hospital,
                                department: depart
                            };
                            res.send({
                                'employee': employee
                            });
                        });
                    }
                });

            }
        });
    },

    //Lists all the registered Hospital to the admin

    listEmployee: function(req, res) {
        if (req.session.user && req.param("access_token")) {
            if (req.session.user.access_token === req.param("access_token")) {
                var role = req.session.user.role;
                if (role.name === "admin") {
                    employee.find().exec(function(error, Hospital) {
                        if (error) res.send(error);
                        if (Hospital) {
                            res.send({
                                'Hospital': Hospital
                            });
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
    listHospital: function(req, res) {
        if (req.session.employee && req.param("access_token")) {
            if (req.session.user.access_token === req.param("access_token")) {
                var role = req.session.user.role;
                if (role.name === "admin") {
                    Hispotal.find().exec(function(error, Hospital) {
                        if (error) res.send(error);
                        if (Hospital) {
                            res.send({
                                'Hospital': Hospital
                            });
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
    MinListHospital: function(req, res) {
        Hospital.find({ select: ['HospitalName', ''] })
    },
    getNearHospital: function(req, res) {
        if (req.param('access_token') && req.param('imei')) {
            User.findOne({
                access_token: req.param("access_token")
            }).exec(function(err, user) {
                if (user) {
                    var owner = user.id;
                    Device.findOne({
                        imei: req.param("imei")
                    }).exec(function(err, device) {
                        if (device) {
                            if (device.owner === owner) {

                                var latitude = req.param('latitude');
                                var longitude = req.param('longitude');
                                var employeeArray = new Array();

                                var origin = latitude + "," + longitude;

                                employee.find().exec(function(err, Hospital) {
                                    if (err) {
                                        res.send({
                                            "error": err
                                        });
                                    }

                                    if (Hospital) {
                                        async.each(Hospital, function(employee, callback) {

                                            locate(employee, origin, function(data) {

                                                if (data) {
                                                    var obj = { name: data.employee.name, email: data.employee.email, location: data.employee.location, phone: data.employee.phone, latitude: data.employee.latitude, longitude: data.employee.longitude, date: data.employee.created, opening_hours: data.employee.opening_hours, closing_hours: data.employee.closing_hours, id: data.employee.id, distance: data.distance };
                                                    employeeArray.push(obj);
                                                    callback();
                                                }
                                            });

                                        }, function(err) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                employeeArray.sort(compare);
                                                res.send(employeeArray);
                                            }
                                        });

                                    }
                                });

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

    }



};