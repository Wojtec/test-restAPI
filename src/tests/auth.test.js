const request = require('supertest');
const app = require('../app');
const { verifyToken, generateAccessToken } = require('../auth');

describe('Auth middleware', () => {
    
    let token;
    const user = {username: 'test', id: 1, role:"user"};
  
    beforeEach(() => {
        token = generateAccessToken(user);
    })

    it('should populate req.user with token', () => {

        const req = {
            headers: { authorization: 'Bearer ' + token.token }
        };
        const res ={};
        const next = jest.fn();

        verifyToken(req, res, next);

        expect(req.user).toMatchObject({
            username: expect.any(String),
            id: expect.any(Number),
            role: expect.any(String),
            iat: expect.any(Number),
            exp: expect.any(Number)
        })
    })
   
    it('should return catch error', () => {
      try{
        const req = {
            headers: { authorization: 'Bearer ' + null }
        };
        const res ={};
        const next = jest.fn();

        verifyToken(req, res, next);
      }catch(e){
        expect(next(e)).toEqual({
            error: e,
          });
      }
    })
})
