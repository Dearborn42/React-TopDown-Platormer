import passport from 'passport';

export default function login(req, res){
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })(req, res);
}
