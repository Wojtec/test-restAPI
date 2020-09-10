const request = require('supertest');
const app = require('../app');
 
let TOKEN = '';

describe('/api/v1/policies', () => {

    describe('/api/v1/login', () => {

        it('Should return token',async (done) => {
            expect.assertions(1)
            const res = await request(app)
            .post("/api/v1/login")
            .set('Accept', 'application/json')
            .send({username:"test",password:"test"})
            expect(res.status).toBe(200);
            TOKEN = res.body.token;
            done()
            
        })
    })

    describe('Get /', () => {

        it('Should return all policies',async (done) => {
            console.log(TOKEN);
            expect.assertions(1)
            const res = await request(app)
            .get("/api/v1/policies")
            .set("Authorization", 'Bearer ' + TOKEN)

            expect(res.status).toBe(200);
            done()
        })
    })
})