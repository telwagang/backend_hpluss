var http = require('http');
var async = require('async');
var _ = require('lodash');
/**
 * scheduleService
 *
 * @description :: JSON Webtoken Service for sails
 * 
 *
 */

//var distance = require('google-distance');
/*var apikey = "AIzaSyAPGVtAR8Ga93WLt53hEyq5oel_rfT-vhM";
distance.apiKey = apikey;*/


function getday(v, callback) {
    var datas;

}

function firstcall(doctor, formdata, dayss) {
    list = new Array();
    var d = 0;
    var l = doctor.length;
    console.log(l);
    // loop each doctor 
    for (var i = 0; i < l; i++) {
        var doc = doctor[i];


        Day.find({
            owner: doc.id
        }).exec(function(error, data) {
            if (error) { console.log(error); }
            if (data) {
                if (data.length != 0) {
                    //build the list for slots 
                    var c = data.length;
                    console.log(c);
                    for (var j = 0; j < c; j++) {
                        var da = data[j];
                        var schedule = {
                            name: doc.name,
                            specialty: doc.specialty,
                            day: da.day,
                            place: da.place,
                            time: da.time,
                            longitude: da.longitude,
                            latitude: da.latitude
                        };

                        Schedule.findOrCreate(schedule).exec(function(error, data) {
                            if (error) { console.log(error); }
                            if (data) { console.log(data); }
                        });



                    }
                }
            }
        });
        console.log(list);
    }
    console.log(list);
    return { data: list };
}

function secondcall(data, doc, list) {

    var c = data.length;
    for (var j = 0; j < c; j++) {
        var da = data[j];
        var schedule = {
            name: doc.name,
            specialty: doc.specialty,
            day: da.day,
            place: da.place,
            time: da.time,
            longitude: da.longitude,
            latitude: da.latitude
        };

        Schedule.findOrCreate(schedule).exec(function(error, data) {
            if (error) { console.log(error); }
            if (data) { console.log(data); }
        });


        console.log("yes");
    }
    return list;
}
module.exports.ScheduleSet = function(formdata, callback) {
    if (formdata) {
        Appointment.findOrCreate({
            patientId: formdata.id,
            date: formdata.date,
            time: formdata.time,
            note: formdata.note,
            duration: formdata.duration,
            schedule: formdata.id
        }).exec(function(error, schedule) {
            if (error) { callback({ 'error': error.message }); }

            if (schedule) { callback({ data: schedule }); }
        });

    } else {
        callback({ 'error': "this is empty" });
    }
};
module.exports.updateAppointment = function(formdata, callback) {
    if (formdata) {
        return addAppointment(formdata);
    }
    callback({ 'error': "this is empty" });
};
module.exports.quicke = function(formdata, callback) {
    var dayss = "";

    helperService.findTime(formdata.day, function(time) {
        dayss = time;
    });
    Schedule.find({
        where: {
            specialty: { "contains": formdata.specialty },
            day: { "contains": dayss },
            time: { "contains": formdata.time }
        }
    }).exec(function(error, data) {
        if (error) { console.log(error); }
        if (data) {
            console.log(data.length);
            callback({ data: data });
        }
    });
};


module.exports.updateSchedule = function(formdata, callback) {
    Doctors.findOrCreate({
        name: formdata.name,
        specialty: formdata.specialty
    }).exec(function(error, doctor) {
        if (error) {
            // callback(error);
            console.log(error);
        }
        if (doctor) {
            async.forEach(formdata.days,
                function(v, k, cb) {
                    Day.findOrCreate({
                        day: v.day,
                        place: v.place,
                        owner: doctor.id
                    }).exec(function(err, day) {
                        if (err) callback({
                            'error': err
                        });
                    });
                },
                function(err) {
                    if (err) console.log(err);
                });
        } else {
            callback('i dnt man!!');
        }
    });
};

module.exports.fill = function(Callback) {

    var options = {
        host: 'localhost',
        port: 8081,
        path: '/scrape'
    };
    place = [{
            place: 'sliema',
            latitude: 35.910470,
            longitude: 14.504192
        },
        {
            place: 'Burmarrad',
            latitude: 35.933609,
            longitude: 14.415929
        },
        {
            place: 'Zabbar',
            latitude: 35.877736,
            longitude: 14.538693
        },
        {
            place: 'Zebbug',
            latitude: 35.872362,
            longitude: 14.443036
        }
    ];


    var req = http.get(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));

        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function(chunk) {
            // You can process streamed parts here...
            // updateSchedule(chunk);
            bodyChunks.push(chunk);
        }).on('end', function() {
            var body = Buffer.concat(bodyChunks);
            // console.log('BODY: ' + body);
            var eachbody = JSON.parse(body);
            times = ['morning', 'afternoon', 'earlymorning', 'evenning'];


            async.forEachOf(eachbody, function(value, key, callback) {
                    Doctors.findOrCreate({
                        name: value.name,
                        specialty: value.specialty
                    }).exec(function(error, doc) {
                        if (error) {
                            // callback(error);
                            console.log(error);
                        }
                        if (doc) {
                            async.forEachOf(value.days,
                                function(v, k, cb) {
                                    var d = _.random(0, 3);

                                    var tim = times[d];
                                    var p;
                                    if (v.place === 'Zebbug') {
                                        p = place[3];
                                    } else if (v.place === 'Zabbar') {
                                        p = place[2];
                                    } else if (v.place === 'Burmarrad') {
                                        p = place[1];
                                    } else if (v.place === 'Sliema') {
                                        p = place[0];
                                    }

                                    console.log(p);
                                    Day.findOrCreate({
                                        day: v.day,
                                        place: v.place,
                                        time: tim,
                                        owner: doc.id,
                                        latitude: p.latitude,
                                        longitude: p.longitude
                                    }).exec(function(err, da) {
                                        if (err) {
                                            cb({
                                                'error': err
                                            });
                                        }
                                        var schedule = {
                                            name: doc.name,
                                            specialty: doc.specialty,
                                            day: da.day,
                                            place: da.place,
                                            time: da.time,
                                            longitude: da.longitude,
                                            latitude: da.latitude
                                        };

                                        Schedule.findOrCreate(schedule).exec(function(error, data) {
                                            if (error) { console.log(error); }
                                            if (data) { console.log(data); }
                                        });

                                    });
                                },
                                function(err) {
                                    if (err) console.log(err);
                                    //doctor.book.add(dy.id);
                                    doctor.day.save(function(err) {
                                        if (err) cb(err);
                                        cb("itWorked");
                                    });
                                });
                        } else {
                            callback('i dnt man!!');
                        }
                    });
                },
                function(err) {
                    if (err) console.error(err.message);
                    // configs is now a map of JSON data

                    givedistance(function(data) {
                        cb();
                    });
                    console.log("done ");
                });
        });
    });
    req.on('error', function(e) {
        console.log('ERROR: ' + e.message);
    });
};

module.exports.givedistance = function(callback) {

    place = [{
            place: 'sliema',
            latitude: 35.910470,
            longitude: 14.504192
        },
        {
            place: 'Burmarrad',
            latitude: 35.933609,
            longitude: 14.415929
        },
        {
            place: 'Zabbar',
            latitude: 35.877736,
            longitude: 14.538693
        },
        {
            place: 'Zebbug',
            latitude: 35.872362,
            longitude: 14.443036
        }
    ];

    async.each(place, function(p, callback) {

        Day.update({ place: p.place }, { latitude: p.latitude, longitude: p.longitude }).exec(function(error, day) {
            if (error) { console.log(error); }
        });
        callback();
    }, function(err) {
        if (err) {
            console.log(err);

        } else {
            callback({ done: "done" });
        }
    });
};

module.exports.appointment = function(callback) {

};
module.exports.ML = function(formdata, callback) {

var request = require('request');

var uri = 'http://localhost:5400/predict/' + formdata.day + '/' + formdata.place + '/' + formdata.specialty + '/' + formdata.time;

request.get(uri, cb);

function cb(error, response, body) {
if (error) {
    console.log(error);
} else {
    console.log('STATUS: ' + response.statusCode);
    console.log('HEADERS: ' + response.headers);
    console.log(body);
}

}

function checkIfTime() {
Appointment.find({
    date: formdata.date,
    schedule: formdata.id
}).populate('Person', {

    patientId: formdata.patient

}).exec(checkIfCallback);

}

function checkIfCallback(error, data) {
if (error) { callback({ 'error': error }); }
if (data) {
    callback({ 'message': 'you book this already' });
} else {
    prevousTime();
}
}

function prevousTime() {
Appointment.findOne({
    where: { place: formdata.place },
    sort: 'date DESC'
}).populate('Schedule', {
    schedule: formdata.id
}).exec(prevousTimeCallback);
}

function prevousTimeCallback(error, data) {
if (error) { callback({ 'error': error }); }
if (data) {




} else {

}
}

function period() {
var periods = [{
    earlymorning: {
        start: "7:00",
        end: "9:00"
    },
    morning: {
        start: "9:00",
        end: "12:00"
    },
    afternoon: {
        start: "12:00",
        end: "16:00"
    },
    evenning: {
        start: "16:00",
        end: "20:00"
    }
}]
}
/*var req = http.get(options + data, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));

        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function(chunk) {
            bodyChunks.push(chunk);
        }).on('end', function() {
            var body = Buffer.concat(bodyChunks);
            // console.log('BODY: ' + body);
            var eachbody = JSON.parse(body);

            console.log(eachbody);
*/




{
if (error) { callback({ 'error': error }); }
if (data) {
    if (data.schedule) {

    }
} else {}
});
}
});
}).on('error', function(error) {
console.log(error);
});
}); * /
};