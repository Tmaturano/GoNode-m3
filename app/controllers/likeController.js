const mongoose = require('mongoose');

const Tweet = mongoose.model('Tweet');

module.exports = {
  async toggle(req, res, next) {
    try {
      const tweet = await Tweet.findById(req.params.id);
      if (!tweet) {
        return res.status(400).json({ error: 'Tweet doesn\'t exists' });
      }

      // checkinf if the user is the the tweet likes vector
      const liked = tweet.likes.indexOf(req.userId);

      // when indexOf returns -1 it means that no value was found
      if (liked === -1) {
        tweet.likes.push(req.userId); // add in the vector
      } else {
        tweet.likes.splice(liked, 1); // remove 1 item after the position of liked
      }

      await tweet.save();
      return res.json(tweet);
    } catch (err) {
      return next(err);
    }
  },
};
