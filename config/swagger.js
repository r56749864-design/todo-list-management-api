
const swaggerJsdoc = require("swagger-jsdoc");

const id = {
  type: "string",
  example: "6ad81d0f2ed4d44646b62e0a",
};

const dateTime = {
  type: "string",
  format: "date-time",
};

const status = {
  type: "string",
  enum: ["pending", "in_progress", "completed"],
};

const priority = {
  type: "string",
  enum: ["low", "medium", "high"],
};

const bearer = [{ bearerAuth: [] }];
const apiKey = [{ apiKeyAuth: [] }];

const pathId = {
  name: "id",
  in: "path",
  required: true,
  description: "ID data",
  schema: { type: "string" },
};

const response = (description) => ({ description });

const jsonBody = (properties, required = []) => ({
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        ...(required.length ? { required } : {}),
        properties,
      },
    },
  },
});

const todoFields = {
  title: {
    type: "string",
    maxLength: 150,
    example: "Belajar membuat REST API",
  },
  description: {
    type: "string",
    maxLength: 2000,
    example: "Mempelajari Node.js dan Express",
  },
  status,
  priority,
  due_date: {
    ...dateTime,
    nullable: true,
  },
  category: {
    type: "string",
    nullable: true,
    description: "ID kategori, opsional",
  },
};

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Todo List Management API",
      version: "1.0.0",
      description:
        "Dokumentasi REST API untuk pengelolaan Todo, kategori, autentikasi, dan aktivitas pengguna.",
    },

    servers: [
      {
        url: "/",
        description: "Current Server (Auto Detect / Vercel)",
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "Autentikasi dan akun pengguna",
      },
      {
        name: "Todos",
        description: "Pengelolaan daftar tugas",
      },
      {
        name: "Categories",
        description: "Pengelolaan kategori Todo",
      },
      {
        name: "Activity Logs",
        description: "Riwayat aktivitas pengguna",
      },
      {
        name: "External",
        description: "Endpoint eksternal menggunakan API Key",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Masukkan token JWT dari endpoint login.",
        },
        apiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "Masukkan API Key untuk endpoint eksternal.",
        },
      },

      schemas: {
        Todo: {
          type: "object",
          properties: {
            _id: id,
            ...todoFields,
            user: id,
            created_by: id,
            updated_by: id,
            archived: {
              type: "boolean",
              default: false,
            },
            created_at: dateTime,
            updated_at: dateTime,
          },
        },

        Category: {
          type: "object",
          properties: {
            _id: id,
            name: {
              type: "string",
              example: "Sekolah",
            },
            description: {
              type: "string",
              example: "Kategori tugas sekolah",
            },
            user: id,
            created_at: dateTime,
            updated_at: dateTime,
          },
        },

        ActivityLog: {
          type: "object",
          properties: {
            _id: id,
            user: {
              ...id,
              nullable: true,
            },
            action: {
              type: "string",
              enum: [
                "todo_created",
                "todo_updated",
                "todo_deleted",
                "todo_archived",
                "category_created",
                "category_updated",
                "category_deleted",
                "user_registered",
                "user_login",
              ],
            },
            description: {
              type: "string",
              maxLength: 500,
              example: "Membuat Todo baru",
            },
            related_todo: {
              ...id,
              nullable: true,
            },
            snapshot: {
              type: "object",
              nullable: true,
              description:
                "Salinan data saat aktivitas terjadi, jika disimpan oleh backend.",
              additionalProperties: true,
              example: {
                title: "Belajar membuat REST API",
              },
            },
            created_by: {
              ...id,
              nullable: true,
            },
            updated_by: {
              ...id,
              nullable: true,
            },
            archived: {
              type: "boolean",
              default: false,
            },
            created_at: dateTime,
            updated_at: dateTime,
          },
        },
      },
    },

    paths: {
      "/api/auth/register": {
        post: {
          tags: ["Authentication"],
          summary: "Mendaftarkan pengguna baru",
          requestBody: jsonBody(
            {
              name: {
                type: "string",
                example: "Ahmad",
              },
              email: {
                type: "string",
                format: "email",
                example: "ahmad@example.com",
              },
              password: {
                type: "string",
                format: "password",
                example: "password123",
              },
            },
            ["name", "email", "password"]
          ),
          responses: {
            201: response("Registrasi berhasil"),
            400: response("Data tidak valid"),
            409: response("Email sudah terdaftar"),
          },
        },
      },

      "/api/auth/login": {
        post: {
          tags: ["Authentication"],
          summary: "Login pengguna",
          requestBody: jsonBody(
            {
              email: {
                type: "string",
                format: "email",
              },
              password: {
                type: "string",
                format: "password",
              },
            },
            ["email", "password"]
          ),
          responses: {
            200: response("Login berhasil"),
            401: response("Email atau password salah"),
          },
        },
      },

      "/api/auth/me": {
        get: {
          tags: ["Authentication"],
          summary: "Mendapatkan profil pengguna",
          security: bearer,
          responses: {
            200: response("Profil berhasil diambil"),
            401: response("Token tidak valid"),
          },
        },
      },

      "/api/todos": {
        get: {
          tags: ["Todos"],
          summary: "Mendapatkan daftar Todo",
          description:
            "Mendukung filter archived true/false, sorting menggunakan order asc/desc, atau awalan minus pada sort untuk descending.",
          security: bearer,
          parameters: [
            {
              name: "status",
              in: "query",
              description: "Filter berdasarkan status",
              schema: status,
            },
            {
              name: "category",
              in: "query",
              description: "Filter berdasarkan ID kategori",
              schema: { type: "string" },
            },
            {
              name: "search",
              in: "query",
              description: "Pencarian berdasarkan judul Todo",
              schema: { type: "string" },
            },
            {
              name: "archived",
              in: "query",
              required: false,
              description:
                "Filter status arsip: true untuk Todo yang diarsipkan, false untuk Todo aktif.",
              schema: {
                type: "boolean",
                enum: [true, false],
                default: false,
              },
            },
            {
              name: "sort",
              in: "query",
              description:
                "Kolom pengurutan. Gunakan awalan minus (-) untuk descending. Contoh: -created_at atau -title.",
              schema: {
                type: "string",
                enum: [
                  "created_at",
                  "updated_at",
                  "due_date",
                  "title",
                  "priority",
                  "-created_at",
                  "-updated_at",
                  "-due_date",
                  "-title",
                  "-priority",
                ],
                default: "created_at",
              },
              example: "-created_at",
            },
            {
              name: "order",
              in: "query",
              description:
                "Arah pengurutan untuk sort tanpa awalan minus. asc = naik, desc = turun.",
              schema: {
                type: "string",
                enum: ["asc", "desc"],
                default: "desc",
              },
            },
            {
              name: "page",
              in: "query",
              description: "Nomor halaman",
              schema: {
                type: "integer",
                minimum: 1,
                default: 1,
              },
            },
            {
              name: "limit",
              in: "query",
              description: "Jumlah data per halaman",
              schema: {
                type: "integer",
                minimum: 1,
                maximum: 100,
                default: 10,
              },
            },
          ],
          responses: {
            200: response("Daftar Todo berhasil diambil"),
            400: response("Parameter query tidak valid"),
            401: response("Token tidak valid"),
          },
        },

        post: {
          tags: ["Todos"],
          summary: "Membuat Todo baru",
          security: bearer,
          requestBody: jsonBody(todoFields, ["title"]),
          responses: {
            201: response("Todo berhasil dibuat"),
            400: response("Data Todo tidak valid"),
            401: response("Token tidak valid"),
          },
        },
      },

      "/api/todos/{id}": {
        get: {
          tags: ["Todos"],
          summary: "Mendapatkan detail Todo",
          security: bearer,
          parameters: [pathId],
          responses: {
            200: response("Detail Todo berhasil diambil"),
            404: response("Todo tidak ditemukan"),
          },
        },

        put: {
          tags: ["Todos"],
          summary: "Memperbarui Todo",
          security: bearer,
          parameters: [pathId],
          requestBody: jsonBody(todoFields),
          responses: {
            200: response("Todo berhasil diperbarui"),
            400: response("Data tidak valid"),
            404: response("Todo tidak ditemukan"),
          },
        },

        delete: {
          tags: ["Todos"],
          summary: "Menghapus Todo",
          security: bearer,
          parameters: [pathId],
          responses: {
            200: response("Todo berhasil dihapus"),
            404: response("Todo tidak ditemukan"),
          },
        },
      },

      "/api/todos/{id}/archive": {
        patch: {
          tags: ["Todos"],
          summary: "Mengarsipkan Todo",
          security: bearer,
          parameters: [pathId],
          responses: {
            200: response("Todo berhasil diarsipkan"),
            404: response("Todo tidak ditemukan"),
          },
        },
      },

      "/api/categories": {
        get: {
          tags: ["Categories"],
          summary: "Mendapatkan daftar kategori",
          security: bearer,
          responses: {
            200: response("Daftar kategori berhasil diambil"),
            401: response("Token tidak valid"),
          },
        },

        post: {
          tags: ["Categories"],
          summary: "Membuat kategori baru",
          security: bearer,
          requestBody: jsonBody(
            {
              name: {
                type: "string",
                example: "Sekolah",
              },
              description: {
                type: "string",
                example: "Tugas sekolah",
              },
            },
            ["name"]
          ),
          responses: {
            201: response("Kategori berhasil dibuat"),
            400: response("Data kategori tidak valid"),
          },
        },
      },

      "/api/categories/{id}": {
        get: {
          tags: ["Categories"],
          summary: "Mendapatkan detail kategori",
          security: bearer,
          parameters: [pathId],
          responses: {
            200: response("Detail kategori berhasil diambil"),
            404: response("Kategori tidak ditemukan"),
          },
        },

        put: {
          tags: ["Categories"],
          summary: "Memperbarui kategori",
          security: bearer,
          parameters: [pathId],
          requestBody: jsonBody({
            name: { type: "string" },
            description: { type: "string" },
          }),
          responses: {
            200: response("Kategori berhasil diperbarui"),
            400: response("Data tidak valid"),
            404: response("Kategori tidak ditemukan"),
          },
        },

        delete: {
          tags: ["Categories"],
          summary: "Menghapus kategori",
          security: bearer,
          parameters: [pathId],
          responses: {
            200: response("Kategori berhasil dihapus"),
            404: response("Kategori tidak ditemukan"),
          },
        },
      },

      "/api/activity-logs": {
        get: {
          tags: ["Activity Logs"],
          summary: "Mendapatkan riwayat aktivitas",
          description:
            "Mengambil riwayat aktivitas pengguna. Dukungan parameter pagination harus sesuai implementasi backend.",
          security: bearer,
          parameters: [
            {
              name: "page",
              in: "query",
              description: "Nomor halaman",
              schema: {
                type: "integer",
                minimum: 1,
                default: 1,
              },
            },
            {
              name: "limit",
              in: "query",
              description: "Jumlah data per halaman",
              schema: {
                type: "integer",
                minimum: 1,
                maximum: 100,
                default: 10,
              },
            },
          ],
          responses: {
            200: {
              description: "Riwayat aktivitas berhasil diambil",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: {
                        type: "boolean",
                        example: true,
                      },
                      data: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/ActivityLog",
                        },
                      },
                    },
                    additionalProperties: true,
                  },
                },
              },
            },
            400: response("Parameter tidak valid"),
            401: response("Token tidak valid"),
            500: response("Terjadi kesalahan server"),
          },
        },
      },

      "/api/external/summary": {
        get: {
          tags: ["External"],
          summary: "Mendapatkan ringkasan Todo",
          security: apiKey,
          responses: {
            200: response("Ringkasan berhasil diambil"),
            401: response("API Key tidak valid"),
          },
        },
      },

      "/api/external/activity-logs": {
        get: {
          tags: ["External"],
          summary: "Mendapatkan aktivitas melalui API Key",
          security: apiKey,
          responses: {
            200: response("Riwayat aktivitas berhasil diambil"),
            401: response("API Key tidak valid"),
          },
        },
      },
    },
  },

  apis: [],
};

module.exports = swaggerJsdoc(options);
