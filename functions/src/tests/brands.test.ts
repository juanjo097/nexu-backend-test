import request from "supertest";
import app from "../index";
import testEnv from "./setup";

describe("API Brands Routes", () => {
  it("GET /brands should return a 200 status", async () => {
    const response = await request(app).get("/brands");
    expect(response.status).toBe(200);
  });

  it("GET /brands/:id/models should return a 200 status", async () => {
    const response = await request(app).get("/brands/1/models");
    expect(response.status).toBe(200);
  });

  // in case that this test not pass... change the name of the brand
  // because the brand already exists but there is another test
  // that checks that
  it("should create a new brand", async () => {
    const newBrand = {name: "Tesla"};

    const response = await request(app)
      .post("/brands")
      .send(newBrand)
      .set("Accept", "application/json");
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(newBrand.name);
  });

  it("should return an error when creating a duplicate brand", async () => {
    const duplicateBrand = {name: "Tesla"};

    const response = await request(app)
      .post("/brands")
      .send(duplicateBrand)
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe("BRAND_ALREADY_EXISTS");
  });

  // in case that this test not pass... change the name of the model
  // because the model already exists but there is another test
  // that checks that
  it("should create a new brand", async () => {
    const newModel = {name: "A2", average_price: 350000};

    const response = await request(app)
      .post("/brands/2/models")
      .send(newModel)
      .set("Accept", "application/json");
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(newModel.name);
  });

  it("should return an error when creating a duplicate brand", async () => {
    const duplicatedModel = {name: "A2", average_price: 350000};

    const response = await request(app)
      .post("/brands/2/models")
      .send(duplicatedModel)
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe("MODEL_ALREADY_EXISTS");
  });

  afterAll(() => {
    testEnv.cleanup();
  });
});
