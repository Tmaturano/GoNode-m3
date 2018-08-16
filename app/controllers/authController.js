const mongoose = require('mongoose');
const sendMail = require('../services/mailer');

const User = mongoose.model('User');

module.exports = {
  async signin(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      if (!await user.compareHash(password)) {
        return res.status(400).json({ error: 'Invalid Password' });
      }

      return res.json({
        user,
        token: user.generateToken(),
      });
    } catch (err) {
      return next(err);
    }
  },

  async signup(req, res, next) {
    try {
      const { email, userName } = req.body;

      if (await User.findOne({ $or: [{ email }, { userName }] })) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const user = await User.create(req.body);

      // running the email service in background
      sendMail({
        from: 'Thiago Maturana <tmatu@teste.com>',
        to: user.email,
        subject: `Welcome to Twitter Like, ${user.name}!`,
        template: 'auth/register',
        context: {
          name: user.name,
          userName: user.userName,
        },
      });

      return res.json({
        user,
        token: user.generateToken(),
      });
    } catch (err) {
      return next(err);
    }
  },
};
