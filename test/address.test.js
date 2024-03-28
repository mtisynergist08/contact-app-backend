/** @format */

import {
  createTestAddress,
  createTestContact,
  createTestUser,
  getTestAddress,
  getTestContact,
  remove_user,
  removeAllTestAddresses,
  removeAllTestContacts,
} from "./test-utils.js";
import { app } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";

const supertest = require("supertest");

describe("POST /api/contacts/:contact_id/addresses", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await remove_user();
  });

  it("should be able to create address", async () => {
    const test_contact = await getTestContact();
    const response = await supertest(app)
      .post("/api/contacts/" + test_contact.id + "/addresses")
      .set("Authorization", "123456")
      .send({
        street: "Jalan 33",
        city: "Sungai Petani",
        province: "Kedah",
        country: "Malaysia",
        postal_code: "08000",
      });

    logger.info(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.street).toBe("Jalan 33");
    expect(response.body.data.city).toBe("Sungai Petani");
    expect(response.body.data.province).toBe("Kedah");
    expect(response.body.data.country).toBe("Malaysia");
    expect(response.body.data.postal_code).toBe("08000");
  });

  it("should be able to reject create address", async () => {
    const test_contact = await getTestContact();
    const response = await supertest(app)
      .post("/api/contacts/" + test_contact.id + "/addresses")
      .set("Authorization", "123456")
      .send({
        street: "Jalan 33",
        city: "Sungai Petani",
        province: "Kedah",
        country: "",
        postal_code: "",
      });

    logger.info(response.body);

    expect(response.status).toBe(400);
  });
});

describe("GET /api/contacts/:contact_id/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await remove_user();
  });

  it("should be able to get contact", async () => {
    const test_contact = await getTestContact();
    const test_address = await getTestAddress();
    const response = await supertest(app)
      .get("/api/contacts/" + test_contact.id + "/addresses/" + test_address.id)
      .set("Authorization", "123456");

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.street).toBe("Jalan PR1MA 33");
    expect(response.body.data.city).toBe("Sungai Petani");
    expect(response.body.data.province).toBe("Kedah");
    expect(response.body.data.country).toBe("Malaysia");
    expect(response.body.data.postal_code).toBe("08000");
  });

  it("should be reject if contact id not found", async () => {
    const test_contact = await getTestContact();
    const test_address = await getTestAddress();
    const response = await supertest(app)
      .get(
        "/api/contacts/" +
          (test_contact.id + 1) +
          "/addresses/" +
          test_address.id
      )
      .set("Authorization", "123456");

    expect(response.status).toBe(404);
  });

  it("should be reject if address id not found", async () => {
    const test_contact = await getTestContact();
    const test_address = await getTestAddress();
    const response = await supertest(app)
      .get(
        "/api/contacts/" +
          test_contact.id +
          "/addresses/" +
          (test_address.id + 1)
      )
      .set("Authorization", "123456");

    expect(response.status).toBe(404);
  });
});

describe("PUT /api/contacts/:contact_id/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await remove_user();
  });

  it("should be able to update address contact", async () => {
    const test_contact = await getTestContact();
    const test_address = await getTestAddress();
    const response = await supertest(app)
      .put("/api/contacts/" + test_contact.id + "/addresses/" + test_address.id)
      .set("Authorization", "123456")
      .send({
        street: "Jalan Residensi Puteri Jaya",
        city: "city",
        province: "province",
        country: "Malaysia",
        postal_code: "08001",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(test_address.id);
    expect(response.body.data.street).toBe("Jalan Residensi Puteri Jaya");
    expect(response.body.data.city).toBe("city");
    expect(response.body.data.province).toBe("province");
    expect(response.body.data.country).toBe("Malaysia");
    expect(response.body.data.postal_code).toBe("08001");
  });

  it("should reject if request invalid", async () => {
    const test_contact = await getTestContact();
    const test_address = await getTestAddress();
    const response = await supertest(app)
      .put("/api/contacts/" + test_contact.id + "/addresses/" + test_address.id)
      .set("Authorization", "123456")
      .send({
        street: "Jalan PR1MA 33 Residensi Puteri Jaya",
        city: "city",
        province: "province",
        country: "",
        postal_code: "",
      });

    expect(response.status).toBe(400);
  });

  it("should reject if address not found", async () => {
    const test_contact = await getTestContact();
    const test_address = await getTestAddress();
    const response = await supertest(app)
      .put(
        "/api/contacts/" +
          test_contact.id +
          "/addresses/" +
          (test_address.id + 1)
      )
      .set("Authorization", "123456")
      .send({
        street: "Jalan Residensi Puteri Jaya",
        city: "city",
        province: "province",
        country: "Malaysia",
        postal_code: "08000",
      });

    expect(response.status).toBe(404);
  });
});

describe("DELETE /api/contacts/:contact_id/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await remove_user();
  });

  it("should be able to remove contact", async () => {
    const testContact = await getTestContact();
    let testContactAddress = await getTestAddress();

    const response = await supertest(app)
      .delete(
        "/api/contacts/" +
          testContact.id +
          "/addresses/" +
          testContactAddress.id
      )
      .set("Authorization", "123456");

    expect(response.status).toBe(200);
    expect(response.body.data).toBe("OK");

    testContactAddress = await getTestAddress();
    expect(testContactAddress).toBeNull();
  });

  it("should reject if address is not found", async () => {
    const testContact = await getTestContact();
    let testContactAddress = await getTestAddress();

    const response = await supertest(app)
      .delete(
        "/api/contacts/" +
          testContact.id +
          "/addresses/" +
          (testContactAddress.id + 1)
      )
      .set("Authorization", "123456");

    expect(response.status).toBe(404);
  });

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();
    let testContactAddress = await getTestAddress();

    const response = await supertest(app)
      .delete(
        "/api/contacts/" +
          (testContact.id + 1) +
          "/addresses/" +
          testContactAddress.id
      )
      .set("Authorization", "123456");

    expect(response.status).toBe(404);
  });
});

describe("GET /api/contacts/:contact_id/addresses", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await remove_user();
  });

  it("should be able to list addresses", async () => {
    const testContact = await getTestContact();

    const response = await supertest(app)
      .get("/api/contacts/" + testContact.id + "/addresses")
      .set("Authorization", "123456");

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
  });

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();

    const response = await supertest(app)
      .get("/api/contacts/" + (testContact.id + 1) + "/addresses")
      .set("Authorization", "123456");

    expect(response.status).toBe(404);
  });
});
