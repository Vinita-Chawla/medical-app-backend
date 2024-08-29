const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const userModel = require("./db/user")
require("dotenv").config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
    passReqToCallback: true
},
async (request, accessToken, refreshToken, profile, done) => {
    try {
        // Check if the user already exists in the database
        let existingUser = await userModel.findOne({ email: profile.emails[0].value });
        
        if (existingUser) {
            // If user exists, log them in
            return done(null, existingUser);
        } else {
            // If user doesn't exist, create a new user and log them in
            const newUser = new userModel({
                name: profile.displayName,
                email: profile.emails[0].value,
                profile: profile.photos[0].value ,
                verified: true, 
            });

            await newUser.save();
            return done(null, newUser);
        }
    } catch (error) {
        return done(error, null);
    }
}
));
