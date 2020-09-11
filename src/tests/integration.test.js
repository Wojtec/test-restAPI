const request = require('supertest');
const app = require('../app');
const { verifyToken } = require('../auth');
 
let TOKEN = '';

describe('Endpoints tests', () => {

    describe('/api/v1/login', () => {

        it('Should return token',async (done) => {
            expect.assertions(2)
            const res = await request(app)
            .post("/api/v1/login")
            .set('Accept', 'application/json')
            .send({username:"test",password:"test"})
            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({
                token: expect.any(String),
                type: expect.any(String),
                expiresIn: expect.any(Number)
                })
          
            TOKEN = res.body.token;
            done()
            
        })

        it('Should return 401 username or password not valid',async (done) => {
            expect.assertions(1)
            const res = await request(app)
            .post("/api/v1/login")
            .set('Accept', 'application/json')
            .send({username:"te",password:"te"})
            expect(res.status).toBe(401)           
            done()
            
        })


    })

    describe('/api/v1/policies', () => {

        it('Should return all policies 10 by default',async (done) => {
            expect.assertions(2)
            const res = await request(app)
            .get("/api/v1/policies")
            .set("Authorization", 'Bearer ' + TOKEN)
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(10);
           done();
        })

        it('Should return 401 Unauthorized error. Bad token',async (done) => {
            expect.assertions(1)
            const res = await request(app)
            .get("/api/v1/policies")
            .set("Authorization", 'Bearer ' + "asdad")
            expect(res.status).toBe(401)
           done();
        })

        it('Should return policies limited by query string',async (done) => {
            const limit = 5;
            expect.assertions(2)
            const res = await request(app)
            .get(`/api/v1/policies?limit=${limit}`)
            .set("Authorization", 'Bearer ' + TOKEN)
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(limit);
           done();
        })

        it('Should return policies matched to object schema',async (done) => {
            expect.assertions(2)
            const res = await request(app)
            .get(`/api/v1/policies`)
            .set("Authorization", 'Bearer ' + TOKEN)
            expect(res.status).toBe(200)
            expect(res.body).toContainEqual({
                id: expect.any(String),
                amountInsured: expect.any(String),
                email: expect.any(String),
                inceptionDate: expect.any(String),
                installmentPayment: expect.any(Boolean)
                })
           done();
        })

    })
})