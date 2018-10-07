/**
 * AdminController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    create: function(req, res) {
        if (req.params.all('imei')) {
            Device.findOne({
                imei: req.param('imei')
            }).exec(function(err, device) {

                if (err) {
                    res.send({ "error": err });
                }
                if (!device) {
                    Device.create({
                        imei: req.param('imei')
                    }).exec(function(err, created) {
                        if (created) {
                            res.send({
                                "created": created
                            });
                        }
                    });
                } else {
                    res.send({ "created": device });
                }
            })


        } else {
            res.forbidden({
                'forbidden': 'Access Denied'
            });
        }

    },
    login: function(req, res) {
        var formdata = req.pamas.all();
        console.log(formdata);

        if(FormData) {
            res.BadRequest({"error": "error"});
        }
        
        Employee.findOne({
            where:{email: formdata.email}
        })
        .populate('role')
        .exec(function(err, employee){
            if(err){
                res.error({"Messgae": "count not find Elpy"});
            } else if()
            {
                if(!per)
            }
            
        })


    },
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
    get: function(req, res) {
        if (req.params.all('imei')) {
            Device.findOne({
                imei: req.param('imei')
            }).exec(function(err, device) {
                if (device) {
                    res.send(device);
                } else {
                    res.send(404);
                }
            });
        } else {
            res.forbidden({
                'forbidden': 'Access Denied'
            });
        }
    }
};