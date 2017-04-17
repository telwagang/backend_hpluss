 /**
  * Patient.js
  *
  * @description :: TODO: You might write a short summary of how this model works and what it represents here.
  * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
  */

 module.exports = {

     attributes: {

         person: {
             model: "person",
             unique: true
         },
         weight: {
             type: 'integer',
             required: true
         },
         region: {
             type: 'integer',
             required: true
         },
         national: {
             type: 'integer',
             required: true
         },
         personalDisease: {
             type: 'integer',
             required: true
         },
         bloodtype: {
             type: 'integer',
             required: true
         },
         appointment: {
             collection: "appointment",
             via: "patientId"

         }

     }
 };