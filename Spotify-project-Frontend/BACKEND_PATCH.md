# Small backend fixes the frontend depends on

1. authmiddleware.js: add a middleware that lets BOTH roles through, and use it on the GET routes.

async function authAny(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
module.exports = { authArtist, authUser, authAny };

   music.routes.js: swap authMiddleware.authUser -> authMiddleware.authAny on the three GET routes.

2. music.model.js: change ref: 'User' to ref: 'user' (must match mongoose.model('user', ...)).

3. music.controller.js getAllMusics: 
   const musics = await musicModel.find().populate('artist', 'name');

4. auth.controller.js loginUser: add `return` before both res.status(401) calls.
   authmiddleware.js authUser: add `return` before res.status(401).

5. Create server.js if you have none:
   require('dotenv').config();
   const app = require('./src/app');
   const connectDB = require('./src/db/db');
   connectDB();
   app.listen(3000, () => console.log('Server running on port 3000'));
