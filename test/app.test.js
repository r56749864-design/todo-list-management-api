jest.mock("../middleware/authMiddleware", () => {
  return (req, res, next) => {
    req.user = {
      id: "507f1f77bcf86cd799439011",
      role: "user",
    };
    next();
  };
});

const request = require("supertest");
const app = require("../app");

describe("GET /", () => {
  it("harus mengembalikan respons sukses", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Todo List Management API berhasil berjalan!"
    );
  });

  it("harus mengembalikan 404 untuk route yang tidak ditemukan", async () => {
    const response = await request(app).get("/route-tidak-ada");

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Route /route-tidak-ada tidak ditemukan"
    );
  });
});

describe("Validasi Todo", () => {
  it("harus menolak filter status yang tidak valid", async () => {
    const response = await request(app).get(
      "/api/todos?status=ngawur"
    );

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validasi input gagal.");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "status",
          message: "Filter status tidak valid",
        }),
      ])
    );
  });

  it("harus menolak page kurang dari 1", async () => {
    const response = await request(app).get(
      "/api/todos?page=0"
    );

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validasi input gagal.");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "page",
          message: "Page harus berupa angka minimal 1",
        }),
      ])
    );
  });

  it("harus menolak limit lebih dari 100", async () => {
    const response = await request(app).get(
      "/api/todos?limit=999"
    );

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validasi input gagal.");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "limit",
          message: "Limit harus antara 1 sampai 100",
        }),
      ])
    );
  });

  it("harus menolak kolom sorting yang tidak valid", async () => {
    const response = await request(app).get(
      "/api/todos?sort=kolom-ngawur"
    );

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validasi input gagal.");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "sort",
          message: "Kolom pengurutan tidak valid",
        }),
      ])
    );
  });

  it("harus menolak filter prioritas yang tidak valid", async () => {
    const response = await request(app).get(
      "/api/todos?priority=ngawur"
    );

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validasi input gagal.");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "priority",
          message: "Filter prioritas tidak valid",
        }),
      ])
    );
  });

  it("harus menolak urutan sorting yang tidak valid", async () => {
    const response = await request(app).get(
      "/api/todos?order=ngawur"
    );

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validasi input gagal.");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "order",
          message: "Order harus asc atau desc",
        }),
      ])
    );
  });

  it("harus menolak ID todo yang tidak valid", async () => {
    const response = await request(app).get(
      "/api/todos/abc"
    );

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validasi input gagal.");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "id",
          message: "ID todo tidak valid",
        }),
      ])
    );
  });
});

describe("Validasi JSON", () => {
  it("harus menolak JSON dengan format yang rusak", async () => {
    const response = await request(app)
      .post("/api/todos")
      .set("Content-Type", "application/json")
      .send('{"title":');

    expect(response.statusCode).toBe(400);
  });
});
