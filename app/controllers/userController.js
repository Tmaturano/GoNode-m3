
const mongoose = require('mongoose');

const User = mongoose.model('User');

const Tweet = mongoose.model('Tweet');

module.exports = {
  async information(req, res, next) {
    try {
      const user = await User.findById(req.userId);
      const tweetCount = await Tweet.find({ user: user.id }).count();

      return res.json({
        user,
        tweetCount,
        followersCount: user.followers.length,
        following: user.following.length,
      });
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    try {
      const id = req.userId;

      const {
        name,
        userName,
        password,
        confirmPassword,
      } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Password doesn\'t match' });
      }

      // the third parameter new: true, means that mongoose will return
      // the updated document.
      const user = await User.findByIdAndUpdate(id, { name, userName }, { new: true });

      // the findByIdAndUpdate and other mongoose methods don't activate the hook in the user model,
      // so it was needfull to call it manually to execute the hook
      if (password) {
        user.password = password;
        await user.save();
      }

      return res.json(user);
    } catch (err) {
      return next(err);
    }
  },
};
