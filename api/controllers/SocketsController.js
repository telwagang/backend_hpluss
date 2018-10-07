/**
 * SocketsrController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {

    getAppointments: function(req, res) {
        if (req.isSocket) {
            console.log(req);
            Appointment.watch(req.socket);
            console.log('User subscribed to ' + req.socket.id);
        } else if (req.isSocket && req.method === 'POST') {
            var data = req.pamars.all();
            scheduleService.updateAppointment(data, function(result) {
                if (result.error) { res.error(result.error); }
                if (result.data) { res.send(result); }
            });
        }
        console.log(req);
    },
    Appointments: function(req, res) {
        if (!req.isSocket) {
            return res.badRequest();
        }

        sails.sockets.join(req.socket, 'appointment');

        return res.ok();
    }

};