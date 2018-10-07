/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/

    '/': {
        view: 'homepage'
    },

    /***************************************************************************
     *                                                                          *
     * Custom routes here...                                                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the custom routes above, it   *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *                                                                          *
     ***************************************************************************/
    'POST /user/register': 'UserController.create',
    'POST /device': 'DeviceController.create',
    'POST /user/login': 'UserController.login',
    'POST /system/register/hospital': 'SystemController.createHospital',
    'POST /system/register/employee': 'SystemController.createEmployee',
    'POST /system/login': 'SystemController.login',
    'POST /system/logout': 'SystemController.logout',
    'GET /system/employee/list': 'SystemController.listEmployee',
    'GET /system/hospital/list': 'SystemController.listHospital',
    'GET /employee': 'SystemController.get',
    'GET /users': 'UserController.list',
    'GET /device': 'DeviceController.get',
    'GET /user': 'UserController.get',
    'GET /logout/:access_token': 'UserController.logout',
    'GET /schedule/fill': 'ScheduleController.pullData',
    'POST /schedule/search': 'ScheduleController.findSlot',
    'POST /schedule/quick': 'ScheduleController.slotCount',
    'POST /schedule/findtime': 'ScheduleController.findTime',
    'GET  /schedule/setappointment': 'ScheduleController.setSchedule',
    'GET /helper/getspecialty': 'HelperController.getListSpecialty',
    'GET /helper/gethospitals': 'HelperController.getListHospital',
    'GET /helper/getplace': 'HelperController.getListPlaces',
    'GET /helper/distance': 'ScheduleController.filldistance',
    /**
     * sockects
     */
    'GET /sockect/getappointment': 'SocketsController.getAppointments'
};