const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("./db/user"); 
require("dotenv").config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name',"photos"] 
},

async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value});
       
        if (user) {
            // If user exists, log them in
            return done(null, user);
        }
    
        else {
            // If user doesn't exist, create a new user and log them in
            const newUser = new User({
                email: profile.emails[0].value, 
                name: `${profile.name.givenName} ${profile.name.familyName}`,
                profile: profile.photos[0].value, 
                verified: true,
            });

            await newUser.save();
            return done(null, newUser);
        }
        
    } catch (error) {
        console.error('Error during Facebook authentication:', error);
        return done(error, null);
    }
}
));
