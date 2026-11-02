
const swaggerJsdoc = require("swagger-jsdoc");

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
            _id: {
              type: "string",
              example: "6ad81d0f2ed4d44646b62e0a",
            },
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
            status: {
              type: "string",
              enum: ["pending", "in_progress", "completed"],
              default: "pending",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              default: "medium",
            },
            due_date: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            user: {
              type: "string",
              description: "ID pemilik Todo",
            },
            category: {
              type: "string",
              nullable: true,
              description: "ID kategori Todo",
            },
            created_by: {
              type: "string",
              description: "ID pembuat Todo",
            },
            updated_by: {
              type: "string",
              description: "ID pengguna yang terakhir memperbarui Todo",
            },
            archived: {
              type: "boolean",
              default: false,
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Category: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            name: {
              type: "string",
              example: "Sekolah",
            },
            description: {
              type: "string",
              example: "Kategori tugas sekolah",
            },
            user: {
              type: "string",
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
        },

        ActivityLog: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            user: {
              type: "string",
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
            },
            related_todo: {
              type: "string",
              nullable: true,
            },
            created_by: {
              type: "string",
              nullable: true,
            },
            updated_by: {
              type: "string",
              nullable: true,
            },
            archived: {
              type: "boolean",
              default: false,
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },

    paths: {
      "/api/auth/register": {
        post: {
          tags: ["Authentication"],
          summary: "Mendaftarkan pengguna baru",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
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
                },
              },
            },
          },
          responses: {
            201: { description: "Registrasi berhasil" },
            400: { description: "Data tidak valid" },
            409: { description: "Email sudah terdaftar" },
          },
        },
      },

      "/api/auth/login": {
        post: {
          tags: ["Authentication"],
          summary: "Login pengguna",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                    },
                    password: {
                      type: "string",
                      format: "password",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Login berhasil" },
            401: { description: "Email atau password salah" },
          },
        },
      },

      "/api/auth/me": {
        get: {
          tags: ["Authentication"],
          summary: "Mendapatkan profil pengguna",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Profil pengguna berhasil diambil" },
            401: { description: "Token tidak valid" },
          },
        },
      },

      "/api/todos": {
        get: {
          tags: ["Todos"],
          summary: "Mendapatkan daftar Todo",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "status",
              in: "query",
              schema: {
                type: "string",
                enum: ["pending", "in_progress", "completed"],
              },
              description: "Filter berdasarkan status",
            },
            {
              name: "category",
              in: "query",
              schema: { type: "string" },
              description: "Filter berdasarkan ID kategori",
            },
            {
              name: "search",
              in: "query",
              schema: { type: "string" },
              description: "Pencarian berdasarkan judul Todo",
            },
            {
              name: "archived",
              in: "query",
              schema: {
                type: "boolean",
                default: false,
              },
              description: "Menampilkan Todo aktif atau arsip",
            },
            {
              name: "sort",
              in: "query",
              schema: {
                type: "string",
                enum: [
                  "created_at",
                  "updated_at",
                  "due_date",
                  "title",
                  "priority",
                ],
                default: "created_at",
              },
              description: "Kolom pengurutan Todo",
            },
            {
              name: "order",
              in: "query",
              schema: {
                type: "string",
                enum: ["asc", "desc"],
                default: "desc",
              },
              description: "Urutan naik atau turun",
            },
            {
              name: "page",
              in: "query",
              schema: {
                type: "integer",
                minimum: 1,
                default: 1,
              },
              description: "Nomor halaman",
            },
            {
              name: "limit",
              in: "query",
              schema: {
                type: "integer",
                minimum: 1,
                maximum: 100,
                default: 10,
              },
              description: "Jumlah data per halaman",
            },
          ],
          responses: {
            200: {
              description: "Daftar Todo berhasil diambil",
            },
            400: {
              description: "Parameter query tidak valid",
            },
            401: {
              description: "Token tidak valid",
            },
          },
        },

        post: {
          tags: ["Todos"],
          summary: "Membuat Todo baru",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title"],
                  properties: {
                    title: {
                      type: "string",
                      maxLength: 150,
                      example: "Mengerjakan tugas sekolah",
                    },
                    description: {
                      type: "string",
                      example: "Menyelesaikan tugas backend",
                    },
                    status: {
                      type: "string",
                      enum: ["pending", "in_progress", "completed"],
                    },
                    priority: {
                      type: "string",
                      enum: ["low", "medium", "high"],
                    },
                    due_date: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                    category: {
                      type: "string",
                      nullable: true,
                      description: "ID kategori, opsional",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Todo berhasil dibuat",
            },
            400: {
              description: "Data Todo tidak valid",
            },
            401: {
              description: "Token tidak valid",
            },
          },
        },
      },

      "/api/todos/{id}": {
        get: {
          tags: ["Todos"],
          summary: "Mendapatkan detail Todo",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Detail Todo berhasil diambil" },
            404: { description: "Todo tidak ditemukan" },
          },
        },

        put: {
          tags: ["Todos"],
          summary: "Memperbarui Todo",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    status: {
                      type: "string",
                      enum: ["pending", "in_progress", "completed"],
                    },
                    priority: {
                      type: "string",
                      enum: ["low", "medium", "high"],
                    },
                    due_date: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                    category: {
                      type: "string",
                      nullable: true,
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Todo berhasil diperbarui" },
            400: { description: "Data tidak valid" },
            404: { description: "Todo tidak ditemukan" },
          },
        },

        delete: {
          tags: ["Todos"],
          summary: "Menghapus Todo",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Todo berhasil dihapus" },
            404: { description: "Todo tidak ditemukan" },
          },
        },
      },

      "/api/todos/{id}/archive": {
        patch: {
          tags: ["Todos"],
          summary: "Mengarsipkan Todo",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Todo berhasil diarsipkan" },
            404: { description: "Todo tidak ditemukan" },
          },
        },
      },

      "/api/categories": {
        get: {
          tags: ["Categories"],
          summary: "Mendapatkan daftar kategori",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Daftar kategori berhasil diambil" },
          },
        },

        post: {
          tags: ["Categories"],
          summary: "Membuat kategori baru",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name"],
                  properties: {
                    name: {
                      type: "string",
                      example: "Sekolah",
                    },
                    description: {
                      type: "string",
                      example: "Tugas sekolah",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Kategori berhasil dibuat" },
            400: { description: "Data kategori tidak valid" },
          },
        },
      },

      "/api/categories/{id}": {
        get: {
          tags: ["Categories"],
          summary: "Mendapatkan detail kategori",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Detail kategori berhasil diambil" },
            404: { description: "Kategori tidak ditemukan" },
          },
        },

        put: {
          tags: ["Categories"],
          summary: "Memperbarui kategori",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Kategori berhasil diperbarui" },
            404: { description: "Kategori tidak ditemukan" },
          },
        },

        delete: {
          tags: ["Categories"],
          summary: "Menghapus kategori",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Kategori berhasil dihapus" },
            404: { description: "Kategori tidak ditemukan" },
          },
        },
      },

      "/api/activity-logs": {
        get: {
          tags: ["Activity Logs"],
          summary: "Mendapatkan riwayat aktivitas",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Riwayat aktivitas berhasil diambil",
            },
            401: {
              description: "Token tidak valid",
            },
          },
        },
      },

      "/api/external/summary": {
        get: {
          tags: ["External"],
          summary: "Mendapatkan ringkasan Todo",
          security: [{ apiKeyAuth: [] }],
          responses: {
            200: {
              description: "Ringkasan berhasil diambil",
            },
            401: {
              description: "API Key tidak valid",
            },
          },
        },
      },

      "/api/external/activity-logs": {
        get: {
          tags: ["External"],
          summary: "Mendapatkan aktivitas melalui API Key",
          security: [{ apiKeyAuth: [] }],
          responses: {
            200: {
              description: "Riwayat aktivitas berhasil diambil",
            },
            401: {
              description: "API Key tidak valid",
            },
          },
        },
      },
    },
  },

  // Tetap memuat anotasi Swagger dari file routes jika ada.
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);
