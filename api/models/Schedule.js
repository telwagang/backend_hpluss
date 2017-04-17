 /**
  * Schedule.js
  *
  * @description :: TODO: You might write a short summary of how this model works and what it represents here.
  * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
  */

 module.exports = {

     attributes: {
         number: {
             type: 'integer',
             autoIncrement: true,
             unique: true
         },
         doctorId: {
             model: "doctors"
         },
         hospital: {
             model: "hospital"
         },
         day: {
             type: "string",
             enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
         },
         timefrom: {
             type: "date"
         },
         timeto: {
             type: "date"
         },
         building: {
             type: "string"
         }
     }
 };