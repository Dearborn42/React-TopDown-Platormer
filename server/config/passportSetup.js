import  {Strategy as LocalStrategy} from 'passport-local'
// import *Mongoose modle* from './your-path';

export default (passport) => {
  passport.use(new LocalStrategy(
    {usernameField : 'email', passwordField: 'password', session: true, passReqToCallback: false}, 
    async (email, password, done)=> { 
      // your login logic
      // return done(*error*, *account found*, *option information*);
    })
  )
  passport.serializeUser((user, done) => {
    // done(null, *own unique identifier*);
  });
      
  // passport.deserializeUser((*identifier*, done) => {
    // *Mongoose modle*.findOne({*identifier*}).then((err, user) => {
      // done(user, err);
    // })
  // }); 
}