const { verifyUser } = require("../controllers/user");

userMock = {username: "test", password: 'test'}


it('Unit test for verify user', () => {
    expect(verifyUser(userMock))
    .toEqual({id:1,username:'test',role:'user'})
})

it('Unit test for verify user', () => {
    expect(verifyUser(userMock))
    .toEqual({id:1,username:'test',role:'user'})
})