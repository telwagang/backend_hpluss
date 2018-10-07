/**
 * jwToken
 *
 * @description :: JSON Webtoken Service for sails
 * @help        :: See https://github.com/auth0/node-jsonwebtoken & http://sailsjs.org/#!/documentation/concepts/Services
 */

var
    jwt = require('jsonwebtoken'),
    tokenSecret = "theworldIsDarkplace9212323";

// Generates a token from supplied payload
module.exports.issue = function(payload) {
    return jwt.sign(
        payload,
        tokenSecret
    );
};

// Verifies token on a request
module.exports.verify = function(token, callback) {
    return jwt.verify(
        token, // The token to be verified
        tokenSecret, // Same token we used to sign
        {}, // No Option, for more see 
        callback //Pass errors or decoded token to callback
    );
};