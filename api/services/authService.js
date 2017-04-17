/**
 * authService
 *
 * @description :: JSON Webtoken Service for sails
 * 
 *
 */

function checkEmployee(acces) {
    if (acces) {
        Employee.findOne({
                select: ['firstName', 'lastName', 'email', 'hospital.id', 'hospital.name', 'role.id', 'role.name'],
                where: {
                    access_token: acces
                }
            }).populate('role')
            .populate('hospital')
            .exec(function(error, data) {
                if (error) { return error; }

                if (data) { return data; } else { return "login in first "; }
            });
    }
    return null;
}

function checkPerson(acces) {
    if (acces) {
        Person.findOne({
                select: ['firstName', 'lastName', 'email', 'role.id', 'role.name'],
                where: {
                    access_token: acces
                }
            }).populate('role')
            .exec(function(error, data) {
                if (error) { return { 'error': error }; }

                if (data) { return { 'data': data }; } else { return { 'error': "login in first " }; }
            });
    }
    return null;
}

module.exports.processToken = function(access_token, isStaff, callback) {

    if (access_token) {
        if (isStaff) {
            var value = checkEmployee(access_token);

            if (value) {
                if (value.error) { callback(value); }

                if (value.data) { callback(value); }
            }


        } else {
            var valueperson = checkPerson(access_token);

            if (valueperson) {
                if (valueperson.error) { callback(valueperson); }

                if (valueperson.data) { callback(valueperson); }
            }

        }
    }
    callback({ 'error': 'login or create account' });
};