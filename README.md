# Todo List Management API

REST API untuk mengelola daftar tugas (*Todo*), kategori, autentikasi pengguna, dan riwayat aktivitas. Project ini dibangun menggunakan Node.js, Express.js, MongoDB Atlas, dan Mongoose.

## Fitur Utama

- Registrasi dan login pengguna menggunakan JSON Web Token (JWT).
- Autentikasi dan otorisasi pengguna.
- CRUD Todo: membuat, membaca, memperbarui, dan menghapus tugas.
- Pengelolaan kategori Todo.
- Filter, pencarian, pengurutan, dan pagination.
- Pengarsipan Todo.
- Pencatatan aktivitas melalui Activity Logs.
- Endpoint eksternal yang dilindungi API Key.
- Validasi request menggunakan Express Validator.
- Dokumentasi API interaktif menggunakan Swagger UI.
- Pengujian otomatis menggunakan Jest dan Supertest.

## Teknologi

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Autentikasi:** JSON Web Token (JWT)
- **Password hashing:** bcryptjs
- **Validasi:** express-validator
- **Konfigurasi lingkungan:** dotenv
- **Dokumentasi API:** swagger-jsdoc dan swagger-ui-express
- **Testing:** Jest dan Supertest

## Persyaratan

Sebelum menjalankan project, pastikan kamu sudah memiliki:

- Node.js dan npm.
- Akun MongoDB Atlas dengan cluster yang dapat diakses.
- Git, jika ingin melakukan clone repository.

## Instalasi

### 1. Clone repository

Ganti `<URL_REPOSITORY>` dengan URL repository GitHub project ini.

```bash
git clone <URL_REPOSITORY>
cd todo-list-api
```

Jika project sudah tersedia di komputer, buka terminal pada folder project tanpa perlu melakukan clone.

### 2. Instal dependensi

```bash
npm install
```

### 3. Konfigurasi environment

Buat file `.env` di direktori utama project dengan konfigurasi berikut:

```env
PORT=3000
MONGODB_URI=isi_connection_string_mongodb
JWT_SECRET=isi_secret_jwt
EXTERNAL_API_KEY=isi_api_key_rahasia
```

Ganti semua nilai contoh dengan konfigurasi milik sendiri. Pastikan connection string MongoDB benar dan IP yang digunakan diizinkan melalui pengaturan Network Access MongoDB Atlas.

**Penting:** Jangan mengunggah file `.env`, password database, JWT, atau API Key ke repository publik. Gunakan `.env.example` dengan nilai placeholder jika ingin membagikan contoh konfigurasi.

### 4. Jalankan server

Mode normal:

```bash
npm start
```

Atau jalankan langsung:

```bash
node server.js
```

Mode pengembangan dengan Node.js yang mendukung `--watch`:

```bash
npm run dev
```

Jika konfigurasi berhasil, server akan berjalan pada:

- API: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api-docs`

## Endpoint API

### Authentication

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/api/auth/register` | Registrasi pengguna |
| POST | `/api/auth/login` | Login pengguna |
| GET | `/api/auth/me` | Melihat profil pengguna yang login |

### Todo

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/api/todos` | Membuat Todo |
| GET | `/api/todos` | Mengambil daftar Todo |
| GET | `/api/todos/:id` | Mengambil detail Todo |
| PUT | `/api/todos/:id` | Memperbarui Todo |
| DELETE | `/api/todos/:id` | Menghapus Todo |
| PATCH | `/api/todos/:id/archive` | Mengarsipkan Todo |

Endpoint daftar Todo mendukung fitur filter, pencarian, pengurutan, dan pagination sesuai parameter yang tersedia pada implementasi API.

### Categories

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/api/categories` | Membuat kategori |
| GET | `/api/categories` | Mengambil daftar kategori |
| GET | `/api/categories/:id` | Mengambil detail kategori |
| PUT | `/api/categories/:id` | Memperbarui kategori |
| DELETE | `/api/categories/:id` | Menghapus atau mengarsipkan kategori sesuai implementasi |

### Activity Logs

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/activity-logs` | Mengambil riwayat aktivitas |

### External API

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/external/summary` | Mengambil ringkasan Todo |
| GET | `/api/external/activity-logs` | Mengambil riwayat aktivitas dengan pagination |

Periksa dokumentasi Swagger UI untuk melihat detail request, parameter, format respons, dan skema autentikasi setiap endpoint.

## Autentikasi dan Keamanan

### JWT

Untuk endpoint yang memerlukan autentikasi pengguna, sertakan header berikut:

```http
Authorization: Bearer <JWT_TOKEN>
```

Ganti `<JWT_TOKEN>` dengan token yang diperoleh melalui proses login.

### External API Key

Untuk endpoint eksternal, sertakan header:

```http
x-api-key: <API_KEY>
```

Ganti `<API_KEY>` dengan nilai `EXTERNAL_API_KEY` yang dikonfigurasi pada file `.env`.

Jangan bagikan token atau API Key kepada orang lain. Untuk deployment, gunakan secret yang kuat dan konfigurasi environment yang aman.

## Pengujian

Jalankan pengujian otomatis dengan:

```bash
npm test
```

Pengujian yang tersedia mencakup respons halaman utama, penanganan route yang tidak ditemukan, validasi parameter Todo, ID yang tidak valid, dan JSON dengan format yang rusak.

Pengujian endpoint secara manual juga dapat dilakukan menggunakan Postman, sesuai koleksi dan konfigurasi yang tersedia pada project.

## Struktur Project

```text
todo-list-api/
├── config/          # Konfigurasi database dan Swagger
├── controllers/     # Controller untuk menangani request
├── middleware/      # Logger dan penanganan error
├── models/          # Model dan schema database
├── routes/          # Definisi endpoint API
├── services/        # Logika bisnis
├── test/            # Pengujian otomatis
├── utils/           # Fungsi utilitas
├── validators/      # Validasi request
├── app.js           # Konfigurasi aplikasi Express
├── server.js        # Entry point server
├── .env.example     # Contoh konfigurasi tanpa secret
├── .gitignore       # File dan folder yang diabaikan Git
├── package.json     # Metadata dan dependensi project
└── README.md        # Dokumentasi project
```

## Catatan

- Nama file dan struktur folder di atas perlu disesuaikan jika berbeda dari isi repository sebenarnya.
- Dokumentasi lengkap endpoint tersedia melalui Swagger UI saat server berjalan.
- Jangan commit `node_modules/`, `.env`, atau data rahasia ke repository.