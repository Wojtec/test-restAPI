const request = require('supertest');
const app = require('../app');
 
let TOKEN = '';

describe('Endpoints tests', () => {

    describe('GET /api/v1/login', () => {

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

    describe('GET /api/v1/policies', () => {

        it('Should return all policies 10 by default',async (done) => {
            expect.assertions(2)
            const res = await request(app)
            .get("/api/v1/policies")
            .set("Authorization", 'Bearer ' + TOKEN)
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(10);

           done();
        })

        it('Should return 401 Unauthorized error.',async (done) => {
            expect.assertions(1)
            const res = await request(app)
            .get("/api/v1/policies")
            .set("Authorization", 'Bearer ' + "")
            expect(res.status).toBe(401)

           done();
        })

        it('Should return 401 Unauthorized error.Token is not valid',async (done) => {
            expect.assertions(1)
            const res = await request(app)
            .get("/api/v1/policies")
            .set("Authorization", 'Bearer ' + "aaa")
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

    describe('GET /api/v1/policies/:id', () => {

        it('Should return policie by id',async (done) => {
            const id = '5a72ae47-d077-4f74-9166-56a6577e31b9';
            expect.assertions(2)
            const res = await request(app)
            .get(`/api/v1/policies/${id}`)
            .set("Authorization", 'Bearer ' + TOKEN)
            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({
                id: expect.any(String),
                clientId: expect.any(String),
                amountInsured: expect.any(String),
                email: expect.any(String),
                inceptionDate: expect.any(String),
                installmentPayment: expect.any(Boolean),
                })

           done();
        })

        it('Should return 401 Unauthorized',async (done) => {
            const id = '5a72ae47-d077-4f74-9166-56a6577e31b9';
            expect.assertions(1)
            const res = await request(app)
            .get(`/api/v1/policies/${id}`)
            .set("Authorization", 'Bearer ' + 'asd')
            expect(res.status).toBe(401)
            
           done();
        })

        it('Should return 404 Not Found error',async (done) => {
            const id = '5a72ae47-d077-4f74-9166-56a6577e3';
            expect.assertions(1)
            const res = await request(app)
            .get(`/api/v1/policies/${id}`)
            .set("Authorization", 'Bearer ' + TOKEN)
            expect(res.status).toBe(404)
            
           done();
        })

    })

    describe('GET /api/v1/clients', () => {

        it('Should return 10 elements by default and status 200',async (done) => {
            expect.assertions(2)
            const res = await request(app)
            .get('/api/v1/clients')
            .set("Authorization", 'Bearer ' + TOKEN)
            expect(res.body.length).toBe(10)
            expect(res.status).toBe(200)
            
           done();
        })

        it('Should return elements limited by query string',async (done) => {
            const limit = 5;
            expect.assertions(2)
            const res = await request(app)
            .get(`/api/v1/clients?limit=${limit}`)
            .set("Authorization", 'Bearer ' + TOKEN)
            expect(res.body.length).toBe(limit)
            expect(res.status).toBe(200)
            
           done();
        })

        it('Should return elements by name query string',async (done) => {
            const name = "Barnett";
            expect.assertions(2)
            const res = await request(app)
            .get(`/api/v1/clients?name=${name}`)
            .set("Authorization", 'Bearer ' + TOKEN)
            expect(res.status).toBe(200)
            expect(res.body).toEqual(expect.any(Array))

           done();
        })

        it('Should return elements by name and limit query string',async (done) => {
            const name = "Barnett";
            const limit = 5;
            expect.assertions(2)
            const res = await request(app)
            .get(`/api/v1/clients?name=${name}&limit=${limit}`)
            .set("Authorization", 'Bearer ' + TOKEN)
            expect(res.status).toBe(200)
            expect(res.body).toEqual(expect.any(Array))

           done();
        })

        it('Should return 401 unauthorized error',async (done) => {
            const name = "Barnett";
            const limit = 5;
            expect.assertions(1)
            const res = await request(app)
            .get(`/api/v1/clients?name=${name}&limit=${limit}`)
            expect(res.status).toBe(401)
            
           done();
        })
    })

    describe('GET /api/v1/clients/:id', () => {

        it("Should return client's details by id",async (done) => {
            expect.assertions(3)
            const res = await request(app)
            .get('/api/v1/clients/a3b8d425-2b60-4ad7-becc-bedf2ef860bd')
            .set("Authorization", 'Bearer ' + TOKEN)
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(1)
            expect(res.body).toEqual(expect.any(Array))

           done();
        })

        it("Should return 401 unauthorized error",async (done) => {
            expect.assertions(1)
            const res = await request(app)
            .get('/api/v1/clients/a3b8d425-2b60-4ad7-becc-bedf2ef860bd')
            expect(res.status).toBe(401)
    
           done();
        })

        it("Should return 404 not Found error",async (done) => {
            expect.assertions(1)
            const res = await request(app)
            .get('/api/v1/clients/a3b8d425-2b60-4ad7-becc-bedf2e')
            .set("Authorization", 'Bearer ' + TOKEN)
            expect(res.status).toBe(404)

           done();
        })

    })

    describe('GET /api/v1/clients/:id', () => {

        it("Should return client's policies",async (done) => {
            expect.assertions(2)
            const res = await request(app)
            .get('/api/v1/clients/a3b8d425-2b60-4ad7-becc-bedf2ef860bd/policies')
            .set("Authorization", 'Bearer ' + TOKEN)
            expect(res.status).toBe(200)
            expect(res.body).toEqual(expect.any(Array))

           done();
        })

        it("Should return 401 unauthorized error",async (done) => {
            expect.assertions(1)
            const res = await request(app)
            .get('/api/v1/clients/a3b8d425-2b60-4ad7-becc-bedf2ef860bd/policies')
            expect(res.status).toBe(401)

           done();
        })

        it("Should return 404 not Found error",async (done) => {
            expect.assertions(1)
            const res = await request(app)
            .get('/api/v1/clients/a3b8d425-2b60-4ad7-becc-bedf2ef860bd/poicies')
            expect(res.status).toBe(404)

           done();
        })
    })
    
})