/**
 * Employee.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {

    attributes: {
        licenseNo: {
            type: "string"
        },
        firstName: {
            type: "string",
            required: true
        },
        lastName: {
            type: "string"
        },
        registrationNo: {
            type: "string",
            required: true
        },
        email: {
            type: "email",
            required: true
        },
        password: {
            type: "string",
            required: true
        },
        access_token: {
            type: "string"
        },
        hospital: {
            model: "hospital"
        },
        Resign: {
            type: "string",
        },
        specialty: {
            type: "string"
        },
        role: {
            model: "role"
        }
    },

    beforeCreate: function(employee, cb) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(employee.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    employee.password = hash;
                    cb();
                }
            });
        });
    },
    afterCreate: function(employee, next) {
        Role.findOrCreate({ name: 'staff' }, { name: 'staff' }).exec(function(error, role) {
            if (error) {
                return error;
            }
            if (role) {
                Employee.update({ id: employee.id }, { role: role }).exec(function(error, updated) {
                    if (error) {
                        return error;
                    }
                    return next;
                });
            }
        });
    }
};