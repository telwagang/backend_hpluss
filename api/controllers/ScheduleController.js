var distance = require('google-distance');
var async = require('async');
var apikey = "AIzaSyAPGVtAR8Ga93WLt53hEyq5oel_rfT-vhM";
distance.apiKey = apikey;
/**
 * ScheduleController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
function locate(slot, myLocation, callback) {
    var latitude = slot.latitude;
    var longitude = slot.longitude;

    var hospLocation = latitude + "," + longitude;

    distance.get({
        index: 1,
        origin: myLocation,
        destination: hospLocation
    }, function(err, data) {
        if (err)
            console.log(err);
        if (data) {
            var distance = data.distance;
            var nearslot = {
                value: data.distanceValue,
                duration: data.duration,
                distance: distance,
                destination: data.destination
            };

            callback(nearslot);
        }
    });
}

function compare(a, b) {
    if (a.value < b.value)
        return -1;
    if (a.value > b.value)
        return 1;
    return 0;
}

module.exports = {

    findSlot: function(req, res) {
        var formdata = req.params.all();
        console.log(formdata);
        if (formdata) {
            scheduleService.quicke(formdata, function(err, data) {
                if (err.error) { res.serverError({ 'error': 'something went wrong' }); }

                if (err.data) {
                    if (err.data.length === 0) {
                        res.send(err);
                    }
                    slotArray = [];
                    var latitude = formdata.latitude;
                    var longitude = formdata.longitude;
                    var origin = latitude + "," + longitude;
                    async.each(err.data, function(slot, callback) {

                        locate(slot, origin, function(data) {

                            if (data) {
                                var obj = {
                                    name: slot.name,
                                    time: slot.time,
                                    specialty: slot.specialty,
                                    day: slot.day,
                                    place: slot.place,
                                    latitude: slot.latitude,
                                    longitude: slot.longitude,
                                    date: slot.created,
                                    id: slot.id,
                                    distance: data.distance,
                                    duration: data.duration,
                                    destination: data.destination,
                                    value: data.value
                                };
                                slotArray.push(obj);
                                callback();
                            }
                        });

                    }, function(err) {
                        if (err) {
                            console.log(err);
                        } else {

                            slotArray.sort(compare);
                            console.log(slotArray);
                            res.send({ data: slotArray });
                        }
                    });

                }
            });
        }
    },
    slotCount: function(req, res) {
        var formdata = req.params.all();
        console.log(formdata);
        if (formdata) {
            scheduleService.quicke(formdata, function(err, data) {
                if (err.error) { res.serverError({ 'error': 'something went wrong' }); }

                if (err.data) { res.send({ data: err.data.length }); }
            });
        }
    },
    setSchedule: function(req, res) {
        var formdata = req.params.all();
        if (formdata) {
            scheduleService.setSchedule(formdata, function(resp) {
                if (resp.error) { res.send(resp); }

                if (resp.data) { res.send(resp); }
            });
        }
    },
    updateSchedule: function(req, res) {
        var formdata = req.params.all();

        if (formdata) {
            scheduleService.updateSchedule(formdata, function(error, data) {

            });
        }
    },
    pullData: function(req, res) {
        scheduleService.fill(function(error) {
            res.send({
                'error': error
            });
        });
    },
    filldistance: function(req, res) {
        scheduleService.givedistance(function(error) {
            res.send({ 'error': error });
        });
    },
    findTime: function(req, res) {
        var formdata = req.params.all();
        scheduleService.ML(formdata, function(data) {
            if (data.error) {
                console.log(data.error);
                callback({ erro: 'something went wrong' });
            }
            if (data.message) {
                console.log(data);
                callback(data);
            }
            if (data.data) {
                console.log(data);
            }
        })
    }
};