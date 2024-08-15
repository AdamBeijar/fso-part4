const userRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

userRouter.post('/', async (request, response) => {
    const body = request.body;

    if (body.password.length < 3) {
        return response.status(400).json({ error: 'password too short' });
    }

    if (body.username.length < 3) {
        return response.status(400).json({ error: 'username too short' });
    }

    if (body.name.length < 3) {
        return response.status(400).json({ error: 'name too short' });
    }

    allUsers = await User.find({});

    if (allUsers.find(user => user.username === body.username)) {
        return response.status(400).json({ error: 'username must be unique' });
    }

    const saltRounds = 10;

    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash: passwordHash,
    });

    const savedUser = await user.save();

    response.json(savedUser);
});

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs');
    response.json(users);
});

userRouter.delete('/:id', async (request, response) => {
    await User.findByIdAndDelete(request.params.id);
    response.status(204).end();
});

module.exports = userRouter;