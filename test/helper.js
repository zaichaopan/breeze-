 const request = require('supertest');
 const app = require('../app');
 const authenticatedUser = request.agent(app);
 const asyncWrapper = require('../helper/asyncWrapper')

 exports.loginAs =async(credential) => {
     await authenticatedUser
         .post('/login')
         .send(credential)
         .expect(302)
     return authenticatedUser;
 }
