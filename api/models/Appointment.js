/**
 * Appointment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {

    attributes: {

        docotorId: {
            type: "string",
            required: true
        },
        disease: {
            type: "string"
        },
        detail: {
            type: "string"
        },
        dateOfAppointment: {
            type: 'date',
            required: true
        },
        time: {
            type: 'string',
            required: true,
            enum: ['mornning', 'afternoon', 'evenning']
        },
        patientId: {
            model: "Patient"
        },
        schedule: {
            model: "schedule"
        }
    }
};