/**
 * Appointment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {

    attributes: {

        patientId: {
            model: "person"
        },
        date: {
            type: "string"
        },
        time: {
            type: "datetime"
        },
        duration: {
            type: "string"
        },
        place: {
            type: "string"
        },
        note: {
            type: "string"
        },
        schedule: {
            model: "schedule"
        }
    },
    afterCreate: function(entry, cb) {
        sails.sockets.broadcast('appointment', entry.schedule.place, entry);
        cb();
    }
};