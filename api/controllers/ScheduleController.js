/**
 * ScheduleController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {

    findSlot: function(req, res) {
        var formdata = req.params.all();
        console.log(formdata);
        if (formdata) {
            scheduleService.slots(formdata, function(err, data) {
                if (err.error) { res.serverError({ 'error': 'something went wrong' }); }

                if (err.data) { res.send(err); }
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
    }
};