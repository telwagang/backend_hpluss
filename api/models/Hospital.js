/**
 * Hospital.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {

    attributes: {
        hospitalName: {
            type: "string",
            required: true
        },
        registrationNo: {
            type: "string",
            required: true
        },
        phoneNumber: {
            type: "string",
            required: true
        },
        employes: {
            collection: "employee",
            via: "hospital"
        },
        email: {
            type: "email",
            required: true
        },
        location: {
            type: "string",
            required: true
        },

        latitude: {
            type: "string",
            required: true
        },

        longitude: {
            type: "string",
            required: true
        },
        opening_hours: {
            type: "string",
            required: true
        },

        closing_hours: {
            type: "string",
            required: true
        },
        city: {
            type: "string",
            required: true

        }
    }
};