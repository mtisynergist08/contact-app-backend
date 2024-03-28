/** @format */


import {app} from "../src/application/web.js";
import {logger} from "../src/application/logging.js";
import {createTestUser, getUser, remove_user} from "./test-utils.js";
import bcrypt from "bcrypt";

const supertest = require('../node_modules/supertest');

describe('POST /api/users', function () {

    afterEach(async () => {
        await remove_user();
    })
    it('should be able to register a new user', async function () {
        const response = await supertest(app)
            .post('/api/users')
            .send({
                username: 'Tarmizi',
                password: 'test123',
                name: 'Tarmizi Ismail'
            });

        logger.info(response.body);

        expect(response.status).toBe(201);
        expect(response.body.data.username).toBe('Tarmizi');
        expect(response.body.data.name).toBe('Tarmizi Ismail');
        expect(response.body.data.password).toBeUndefined();
    })

    it('should be able to failed to register', async function () {
        const response = await supertest(app)
            .post('/api/users')
            .send({
                username: '',
                password: '',
                name: ''
            });

        expect(response.status).toBe(400);

        logger.info(response.body);

        expect(response.body.errors).toBeDefined();
    })

    it('should be failed user already exists', async function () {
        let response = await supertest(app)
            .post('/api/users')
            .send({
                username: 'Tarmizi',
                password: 'test123',
                name: 'Tarmizi Ismail'
            });

        logger.info(response.body);

        expect(response.status).toBe(201);
        expect(response.body.data.username).toBe('Tarmizi');
        expect(response.body.data.name).toBe('Tarmizi Ismail');
        expect(response.body.data.password).toBeUndefined();

        response = await supertest(app)
            .post('/api/users')
            .send({
                username: 'Tarmizi',
                password: 'test123',
                name: 'Tarmizi Ismail'
            });

        logger.info(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    })
})

describe('POST /api/users/login', function () {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await remove_user();
    })

    it('should be able to login user', async function () {
        const response = await supertest(app)
            .post('/api/users/login')
            .send({
                username: 'Tarmizi',
                password: '123456'
            });

        logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.token).toBeDefined();
        expect(response.body.data.token).not.toBe("123456");
    });

    it('should reject login if request is invalid', async function () {
        const response = await supertest(app)
            .post('/api/users/login')
            .send({
                username: '',
                password: ''
            });

        logger.info(response.body);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject login if password wrong', async function () {
        const response = await supertest(app)
            .post('/api/users/login')
            .send({
                username: 'Tarmizi',
                password: 'salah123'
            });

        logger.info(response.body);

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject login if username wrong', async function () {
        const response = await supertest(app)
            .post('/api/users/login')
            .send({
                username: 'Salah',
                password: 'salah123'
            });

        logger.info(response.body);

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
});

describe('GET /api/users/current', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await remove_user();
    });

    it('should be able to get current user', async function () {
        const response = await supertest(app)
            .get('/api/users/current')
            .set('Authorization', '123456');

        logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe('Tarmizi');
        expect(response.body.data.name).toBe('Tarmizi Ismail');
    });

    it('should reject if token is invalid', async () => {
        const response = await supertest(app)
            .get('/api/users/current')
            .set('Authorization', 'salah');

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
});

describe('PATCH /api/users/current', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await remove_user();
    });

    it('should be able to update current user', async function () {
        const response = await supertest(app)
            .patch('/api/users/current')
            .set('Authorization', '123456')
            .send({
                name: 'Fairuh',
                password: 'rahsiala'
            });

        logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe('Tarmizi');
        expect(response.body.data.name).toBe('Fairuh');

        const user = await getUser();
        expect(await bcrypt.compare('rahsiala', user.password)).toBe(true);
    });
});

describe('DELETE /api/users/logout', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await remove_user();
    });

    it('should be able to logout current user', async () => {
        const response = await supertest(app)
            .delete('/api/users/logout')
            .set('Authorization', '123456');

        logger.info(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK");

        const user = await getUser();
        expect(user.token).toBe(null);
    });

    it('should reject logout if token is invalid', async () => {
        const response = await supertest(app)
            .delete('/api/users/logout')
            .set('Authorization', 'salah');

        logger.info(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
})