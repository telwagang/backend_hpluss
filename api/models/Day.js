/**
 * Day.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        owner: {
            model: "doctors"
        },
        day: {
            type: "string"
        },
        place: {
            type: "string"
        },
        time: {
            type: "string"
        },
        latitude: {
            type: "string"
        },
        longitude: {
            type: "string"
        }
    }
};