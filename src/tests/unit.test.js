const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const { verifyUser } = require("../controllers/user");
const actions = require("../actions");
const helpers = require('../helpers');

describe('Unit tests', () => {

    user = {username: "test", password: 'test'}
    let token;

    beforeEach( async () => token = await helpers.readToken())

    describe('Verify User', () => {

        it('Unit test for verify user', () => {
            expect(verifyUser(user))
            .toEqual({id:1,username:'test',role:'user'})
        })
    })

    describe('Consuming API', () => {

    
        it('readToken function reading token from file', async () => {
            expect.assertions(2);
                await helpers.readToken().then(res => {
                    expect(res).toEqual(expect.any(String))
                    expect(res.length).toBe(151)
                })

        })

        it('Should handle a readFile error from readToken', async () => {

            jest.spyOn(fs, 'readFile')
             .mockImplementation(() => { throw new Error('error'); });

            jest.spyOn(console, 'error')
             .mockImplementation();

            await helpers.readToken();

            expect(console.error).toHaveBeenCalled();

            jest.restoreAllMocks();

          });

        it('refreshToken function checking if token is still valid', async () => {

            expect.assertions(2);
                await helpers.refreshToken(token).then(res => {
                    expect(res).toEqual(expect.any(String))
                    expect(res.length).toBe(151)

                })

        })

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
    })

})
