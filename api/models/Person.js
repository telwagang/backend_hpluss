var bcrypt = require('bcryptjs');

/**
 * Person.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        title: {
            type: "string"
        },
        firstName: {
            type: "string",
            required: true
        },
        lastName: {
            type: "string"
        },
        password: {
            type: "string",
            required: true
        },
        phone: {
            type: "string",
            required: true
        },
        email: {
            type: "email",
            required: true
        },
        access_token: {
            type: "string"

        },
        idCard: {
            type: "string",

        },
        imei: {
            type: "string",
            required: true
        },
        gender: {
            type: "string",
            enum: ['famale', 'male'],
            required: true
        },
        dateOfBirth: {
            type: 'date'

        },
        contactEmergency: {
            type: "string"

        },
        device: {
            collection: "device",
            via: "owner"
        },

        role: {
            model: "role"
        },
        patient: {
            collection: "patient",
            via: "person"
        }

    },


    beforeCreate: function(person, cb) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(person.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    person.password = hash;
                    cb();
                }
            });
        });
    },

    afterCreate: function(person, next) {
        Role.findOrCreate({ name: 'client' }, { name: 'client' }).exec(function(error, role) {
            if (error) {
                return error;
            }
            if (role) {
                Person.update({ id: person.id }, { role: role }).exec(function(error, updated) {
                    if (error) {
                        return error;
                    }
                    return next;
                });
            }
        });
    }
};