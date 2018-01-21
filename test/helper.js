 const request = require('supertest');
 const app = require('../app');
 const authenticatedUser = request.agent(app);

 exports.loginAs = async(credential) => {
     await authenticatedUser
         .post('/login')
         .send(credential)
         .expect('Location', '/threads')
         .expect(302)
     return authenticatedUser;
 };
