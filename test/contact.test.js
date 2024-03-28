import {
    createTestContact,
    createTestContactMany,
    createTestUser,
    getTestContact,
    remove_user,
    removeAllTestContacts
} from "./test-utils.js";
import {app} from "../src/application/web.js";
import {logger} from "../src/application/logging.js";

const supertest = require('supertest');

describe('POST /api/contacts', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeAllTestContacts();
        await remove_user();
    });

    it('should be able to create contact', async () => {
        const results = await supertest(app)
            .post('/api/contacts')
            .set('Authorization', '123456')
            .send({
                first_name: 'Tarmizi',
                last_name: 'Ismail',
                email: 'tarmizi@me.com',
                phone: '08123456789'
            });

        expect(results.status).toBe(200);
        expect(results.body.data.id).toBeDefined();
        expect(results.body.data.first_name).toBe('Tarmizi');
        expect(results.body.data.last_name).toBe('Ismail');
        expect(results.body.data.email).toBe('tarmizi@me.com');
        expect(results.body.data.phone).toBe('08123456789');
    });

    it('should reject with invalid input', async () => {
        const results = await supertest(app)
            .post('/api/contacts')
            .set('Authorization', '123456')
            .send({
                first_name: '',
                last_name: '',
                email: 'tarmizi',
                phone: '08123456789555616156565686116'
            });

        expect(results.status).toBe(400);
        expect(results.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts/:contact_id', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContacts();
        await remove_user();
    });

    it('should be able to get contact', async () => {
        const test_contact = await getTestContact();
        const response = await supertest(app)
            .get('/api/contacts/' + test_contact.id)
            .set('Authorization', '123456');

        logger.info('error', response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(test_contact.id);
        expect(response.body.data.first_name).toBe(test_contact.first_name);
        expect(response.body.data.last_name).toBe(test_contact.last_name);
        expect(response.body.data.email).toBe(test_contact.email);
        expect(response.body.data.phone).toBe(test_contact.phone);

    });
});

describe('PUT /api/contacts/:contact_id', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContacts();
        await remove_user();
    });

    it('should be able to update contact', async () => {
        const test_contact = await getTestContact();

        const response = await supertest(app)
            .put('/api/contacts/' + test_contact.id)
            .set('Authorization', '123456')
            .send({
                first_name: 'Tarmizi',
                last_name: 'Ismail',
                email: 'tarmizi@me.com',
                phone: '08123456789'
            });

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(test_contact.id);
        expect(response.body.data.first_name).toBe('Tarmizi');
        expect(response.body.data.last_name).toBe('Ismail');
        expect(response.body.data.email).toBe('tarmizi@me.com');
        expect(response.body.data.phone).toBe('08123456789');
    })
});

describe('DELETE /api/contacts/:contact_id', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContacts();
        await remove_user();
    });

    it('should be able to delete contact', async () => {
        let testContact = await getTestContact();
        const response = await supertest(app)
            .delete('/api/contacts/' + testContact.id)
            .set('Authorization', '123456');

        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK");

        testContact = await getTestContact();
        expect(testContact).toBeNull();
    })
});

describe('GET /api/contacts', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContactMany();
    });

    afterEach(async () => {
        await removeAllTestContacts();
        await remove_user();
    });

    it('should be able to search contact without parameter', async () => {
        const response = await supertest(app)
            .get('/api/contacts')
            .set('Authorization', '123456');

        logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(10);
        expect(response.body.paging.page).toBe(1);
        expect(response.body.paging.total_page).toBe(2);
        expect(response.body.paging.total_item).toBe(15);
    });

    it('should be able to search contact page 2', async () => {
        const response = await supertest(app)
            .get('/api/contacts')
            .query({page: 2})
            .set('Authorization', '123456');

        logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(5);
        expect(response.body.paging.page).toBe(2);
        expect(response.body.paging.total_page).toBe(2);
        expect(response.body.paging.total_item).toBe(15);
    });

    it('should be able to search by name', async () => {
        const response = await supertest(app)
            .get('/api/contacts')
            .query({name: 'Tarmizi 1'})
            .set('Authorization', '123456');

        logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(6);
        expect(response.body.paging.page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.total_item).toBe(6);

    });

    it('should be able to search by email', async () => {
        const response = await supertest(app)
            .get('/api/contacts')
            .query({email: 'tarmizi1@me.com'})
            .set('Authorization', '123456');

        logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.total_item).toBe(1);

    });

    it('should be able to search by phone', async () => {
        const response = await supertest(app)
            .get('/api/contacts')
            .query({phone: '081234567891'})
            .set('Authorization', '123456');

        logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(6);
        expect(response.body.paging.page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.total_item).toBe(6);

    });

});