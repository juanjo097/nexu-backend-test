import request from "supertest";
import app from "../index";
import testEnv from "./setup";

describe("API Models Routes", () => {
  it("GET /models should return a 200 status", async () => {
    const response = await request(app).get(
      "/models?greater=380000&lower=400000"
    );
    expect(response.status).toBe(200);
  });

  it("should create a new brand", async () => {
    const newAvgPrice = {average_price: 261500};

    const response = await request(app)
      .put("/models/7")
      .send(newAvgPrice)
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body.average_price).toBe(newAvgPrice.average_price);
  });

  afterAll(() => {
    testEnv.cleanup();
  });
});
