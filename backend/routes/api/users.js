import { Router } from 'express';
import User from '../../models/UsersModel.js';
import jwt from 'jsonwebtoken';
import { secret, auth } from '../../config/passport.js';

const router = Router();

router.get('/', auth, (req, res) => {
    User.find({}, function (err, usersInfo) {
        if (err) {
            return res.status(500).send({ err });
        }
        return res.status(200).send(usersInfo);
    })
});

router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    if (!username) {
        return res.status(400).send({ err: "Please enter your username" });
    }
    if (!password) {
        return res.status(400).send({ err: "Please enter your password" });
    }
    const newUser = new User({
        username: username,
        password: password
    });
    newUser.save(function (err, model) {
        if (err) {
            return res.status(400).send({ err: 'username already existed, please use another username' });
        }
        return res.status(201).send(model);
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username) {
        return res.status(400).send({ err: "Please enter your username" });
    }
    if (!password) {
        return res.status(400).send({ err: "Please enter your password" });
    }
    User.findOne({ username: username }, function (err, userModel) {
        if (err) {
            return res.status(400).send(err);
        }
        if (!userModel) {
            return res.status(400).send({ err: 'Please enter a valid username or password' });
        }

        return userModel.comparePassword(password, function (err, isMatch) {
            if (err) {
                return res.status(400).send(err);
            }
            if (!isMatch) {
                return res.status(401).send({ err: 'Please enter a valid username or password' });
            }
            const payload = { id: userModel._id };
            const token = jwt.sign(payload, secret);
            return res.send({ token });
        });
    });
});

export default router;