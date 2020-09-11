const request = require('supertest');
const app = require('../app');
const { verifyToken, generateAccessToken } = require('../auth');

describe('auth middleware', () => {
    const user = {username: 'test', id: 1, role:"user"};
    const payloadFromToken =  {
        username: expect.any(String),
        id: expect.any(Number),
        role: expect.any(String),
        iat: expect.any(Number),
        exp: expect.any(Number)
      }

    it('should populate req.user with token', () => {

        const {token} = generateAccessToken(user)
        const req = {
            headers: { authorization: 'Bearer ' + token }
        };
        const res ={};
        const next = jest.fn();
        verifyToken(req, res, next);

        expect(req.user).toMatchObject(payloadFromToken)
    })
})