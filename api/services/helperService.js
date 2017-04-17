/**
 * helperService
 *
 * @description :: JSON Webtoken Service for sails
 * 
 *
 */

function remove_duplicates_safe(arr) {
    var seen = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
        if (!(arr[i] === ' ')) {
            if (!(arr[i].specialty in seen)) {
                ret_arr.push(arr[i].specialty);
                seen[arr[i].specialty] = true;
            }
        }
    }
    return ret_arr;
}

function remove_duplicates_safe_place(arr) {
    var seen = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
        if (!(arr[i].place in seen)) {
            ret_arr.push(arr[i].place);
            seen[arr[i].place] = true;
        }
    }
    return ret_arr;
}

module.exports.listSpecialty = function(callback) {
    var query = Doctors.find({ select: ['specialty'] });

    query.exec(function(error, data) {
        if (error) { callback({ 'error': error }); }

        if (data) {
            var ordered = remove_duplicates_safe(data);
            callback({ 'data': ordered });
        }
    });
};

module.exports.listHospitals = function(callback) {
    var query = Hospital.find({ select: ['hospitalName', 'latitude', 'longitude'] });

    query.exec(function(error, data) {
        if (error) { callback({ 'error': error }); }

        if (data) { callback({ 'data': data }); }
    });
};

module.exports.listPlaces = function(callback) {
    var query = Day.find({ select: ['place'] });

    query.exec(function(error, data) {
        if (error) { callback({ 'error': error }); }

        if (data) {
            var cleansed = remove_duplicates_safe_place(data);
            callback({ 'data': cleansed });
        }
    });
};

module.exports.findTime = function(time, callback) {
    var d = new Date(time);
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var n = weekday[d.getDay()];
    console.log(n);
    if (n == 'undefined') {
        callback('');
    }
    callback(n);
};