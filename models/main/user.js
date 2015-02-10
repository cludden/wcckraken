'use strict';
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    crypto = require('../../lib/crypto');

var User = function() {
    
    // Define schema
    var schema = mongoose.Schema({
        first: String,
        last: String,
        email: {type: String, unique: true},
        password: String,
        roles: [String]
    });
    
    // Replace plaintext passwords with a hashed version prior to save
    schema.pre('save', function(next) {
        
        // prevent double hash
        if (!this.isModified('password')) {
            next();
            return;
        }
        
        // encrypt password using bcrypt
        var hash = bcrypt.hashSync(this.password, crypto.getLevel());
        
        // replace plaintext password with hash
        this.password = hash;
        next();
    });
    
    // Compare plaintext password against a user's hashed password
    schema.methods.passwordMatches = function (password) {
        return bcrypt.compareSync(password, this.password);
    }
};