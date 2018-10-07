/**
 * HelperController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var num = 0;
module.exports = {
    getListSpecialty: function(req, res) {
        num++;
        console.log(num);
        helperService.listSpecialty(function(data) {
            // console.log(data);
            if (data.error) { res.notFound(data.error); }

            if (data.data) { res.send(data); }
        });
    },
    getListHospital: function(req, res) {
        helperService.listHospitals(function(data) {
            if (data.error) { res.notFound(data.error); }

            if (data.data) { res.send(data); }
        });
    },
    getListPlaces: function(req, res) {
        helperService.listPlaces(function(data) {
            if (data.error) { res.notFound(data.error); }

            if (data.data) { res.send(data); }
        });
    }
};