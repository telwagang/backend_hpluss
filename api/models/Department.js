/**
 * Department.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {

    attributes: {
        departmentId: {
            type: "string",
            primaryKey: true,
            required: true
        },
        name: {
            type: "string",
            required: true
        },
        description: {
            type: "string"
        },
        building: {
            type: "string",
            required: true
        }
    }
};