import type { Request } from "express";
import passport, { DoneCallback } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import config from 'config';

import User from "../models/user.model";

const GOOGLE_CLIENT_ID: string = config.get('googleClientId');
const GOOGLE_CLIENT_SECRET: string = config.get('googleClientSecret');

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${config.get('selfUrl')}/google/callback`,
    passReqToCallback: true,
},
async function(_req: Request, _accessToken: string, _refreshToken: string, profile: any, done: DoneCallback) {
    try {
        const givenName = profile.given_name.split(" ");
        const familyName = profile.family_name.toLowerCase();
        let username = 'g_';
        let givenNameInitials = "";

        for (let i = 0; i < givenName.length; i++) {
            givenNameInitials += givenName[i][0].toLowerCase();
        }

        const randomNumbers = Array.from({ length: 4 }, () => String(Math.floor(Math.random() * (9 - 0 + 1)) + 0)).join('');

        username += givenNameInitials + familyName + randomNumbers;

        const emailCheck = await User.findOne({ where: { googleId: null, email: profile.email }})

        if (emailCheck) {
            return done(null, {})
        }

        const _user = await User.findOrCreate({ 
            where: { googleId: profile.id }, 
            defaults: {
                googleId: profile.id,
                firstName: profile.given_name,
                lastName: profile.family_name,
                username,
                email: profile.email
            } ,
            returning: true
        })

        const user: User = _user[0].dataValues
        
        return done(null, user);
    }
    catch(error: any) {
        return done(error, null);
    }
}));
