 const request = require('supertest');
 const app = require('../app');
 const authenticatedUser = request.agent(app);
 const asyncWrapper = require('../helper/asyncWrapper')
 const mongoose = require('mongoose');
 mongoose.Promise = global.Promise;


 exports.loginAs = async (credential) => {
     await authenticatedUser
         .post('/login')
         .send(credential)
         .expect(302)
     return authenticatedUser;
 };


 exports.clearDb = async () => {
     for (var collection in mongoose.connection.collections) {
         await mongoose.connection.collections[collection].remove();
     }
 }
