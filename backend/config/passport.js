import passport from 'passport'; 
import passportJWT from 'passport-jwt'; 
import User from '../models/UsersModel.js'; 

const { Strategy, ExtractJwt } = passportJWT;

const secret = 'abcfsrthffreregr';

const options = { 
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
    secretOrKey: secret 
};

const strategy = new Strategy(options, function (payload, next) { 
    User.findOne({ _id: payload.id }, function (err, result) { 
        if (err) {
            return next(err); 
        }
        return next(null, result); 
    }); 
});
const auth = passport.authenticate('jwt', { session: false });
passport.use(strategy);

export default passport; 
export { secret }; 
export { auth };