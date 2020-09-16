/* eslint-disable no-undef */
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const { verifyUser } = require('../controllers/user');
const { verifyToken, generateAccessToken } = require('../services/auth');
const actions = require('../actions');
const helpers = require('../helpers');

describe('Unit tests', () => {
  user = { username: 'test', password: 'test' };
  let token;

  // eslint-disable-next-line no-return-assign
  beforeEach(async () => token = await helpers.readToken());

  describe('Verify User', () => {
    it('Unit test for verify user', () => {
      expect(verifyUser(user))
        .toEqual({ id: 1, username: 'test', role: 'user' });
    });
  });

  describe('Auth middleware', () => {
    // eslint-disable-next-line no-shadow
    let token;
    const user = { username: 'test', id: 1, role: 'user' };
    beforeEach(() => {
      token = generateAccessToken(user);
    });

    it('Should populate req.user with token', () => {
      const req = {
        headers: { authorization: `Bearer ${token.token}` },
      };
      const res = {};
      const next = jest.fn();

      verifyToken(req, res, next);

      expect(req.user).toMatchObject({
        username: expect.any(String),
        id: expect.any(Number),
        role: expect.any(String),
        iat: expect.any(Number),
        exp: expect.any(Number),
      });
    });

    it('Should return catch error from verifyToken', () => {
      try {
        const req = {
          headers: { authorization: `Bearer ${null}` },
        };
        const res = {};
        const next = jest.fn();

        verifyToken(req, res, next);
      } catch (e) {
        expect(next(e)).toEqual({
          error: e,
        });
      }
    });
  });

  describe('Consuming API', () => {
    it('readToken function reading token from file', async () => {
      await helpers.readToken().then((res) => {
        expect(res).toEqual(expect.any(String));
        expect(res.length).toBe(151);
      });
    });

    it('Should handle a readFile error from readToken', async () => {
      jest.spyOn(fs, 'readFile')
        .mockImplementation(() => { throw new Error('error'); });

      jest.spyOn(console, 'error')
        .mockImplementation();

      await helpers.readToken();

      expect(console.error).toHaveBeenCalled();

      jest.restoreAllMocks();
    });

    it('Should handle a refreshToken catch error', async () => {
      jest.spyOn(jwt, 'decode')
        .mockImplementation(() => { throw new Error('error'); });

      jest.spyOn(console, 'error')
        .mockImplementation();

      await helpers.refreshToken(token);

      expect(console.error).toHaveBeenCalled();

      jest.restoreAllMocks();
    });

    // it('Should handle a loginApi() in refreshToken if condition', async () => {

    //     const dateMock = jest.spyOn(Date, 'now').mockReturnValue(Infinity)

    //     jest.spyOn(actions, 'loginApi').mockReturnValue(token)

    //     await helpers.refreshToken(token);
    //     expect(dateMock).toBeCalled();

    // });

    it('Should handle a loginApi catch error', async () => {
      jest.spyOn(fs, 'writeFile')
        .mockImplementation(() => { throw new Error('error'); });

      jest.spyOn(console, 'error')
        .mockImplementation();

      await actions.loginApi();

      expect(console.error).toHaveBeenCalled();

      jest.restoreAllMocks();
    });
  });
});
