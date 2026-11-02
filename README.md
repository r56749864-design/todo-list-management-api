# Todo List Management API

REST API untuk mengelola daftar tugas (Todo), kategori, autentikasi pengguna, dan riwayat aktivitas.

Project ini dibangun menggunakan **Node.js, Express.js, MongoDB Atlas, dan Mongoose**, dilengkapi dokumentasi Swagger UI, autentikasi JWT, API Key, serta pengujian otomatis.

## Live Demo

**Base URL:**

https://todo-list-management-api-one.vercel.app

**Swagger UI:**

https://todo-list-management-api-one.vercel.app/api-docs

**GitHub Repository:**

https://github.com/r56749864-design/todo-list-management-api

API sudah di-deploy menggunakan Vercel dan dapat diuji melalui Swagger UI.

## Fitur Utama

- Registrasi dan login pengguna menggunakan JWT.
- Autentikasi dan otorisasi pengguna.
- CRUD Todo (Create, Read, Update, Delete).
- Pengelolaan kategori Todo.
- Filter berdasarkan status dan kategori.
- Pencarian Todo berdasarkan judul.
- Sorting ASC dan DESC.
- Pagination daftar Todo dan Activity Logs.
- Pengarsipan Todo.
- Pencatatan aktivitas pengguna melalui Activity Logs.
- Penyimpanan snapshot Todo saat create, update, archive, dan delete.
- Endpoint eksternal menggunakan API Key.
- API Key khusus demo untuk pengujian mentor.
- Validasi request menggunakan Express Validator.
- Dokumentasi interaktif menggunakan Swagger UI.
- Pengujian otomatis menggunakan Jest dan Supertest.
- Deployment menggunakan Vercel.

## Teknologi yang Digunakan

| Teknologi | Kegunaan |
|---|---|
| Node.js | Runtime JavaScript |
| Express.js | Framework REST API |
| MongoDB Atlas | Database |
| Mongoose | Object Data Modeling |
| JWT | Autentikasi pengguna |
| bcryptjs | Hashing password |
| express-validator | Validasi request |
| dotenv | Environment variables |
| swagger-jsdoc | Pembuatan dokumentasi OpenAPI |
| swagger-ui-express | Tampilan Swagger UI |
| Jest | Testing framework |
| Supertest | Pengujian HTTP endpoint |
| Vercel | Deployment |

## Persyaratan

Sebelum menjalankan project secara lokal, pastikan sudah tersedia:

- Node.js dan npm.
- Git.
- Akun MongoDB Atlas.
- MongoDB connection string.
- Environment variables yang diperlukan.

## Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/r56749864-design/todo-list-management-api.git
cd todo-list-management-api
```

### 2. Instal Dependensi

```bash
npm install
```

### 3. Konfigurasi Environment Variables

Buat file `.env` di direktori utama project.

```env
PORT=3000
MONGODB_URI=isi_connection_string_mongodb
JWT_SECRET=isi_jwt_secret
EXTERNAL_API_KEY=isi_api_key_produksi
DEMO_API_KEY=isi_api_key_demo
```

**Penjelasan:**

| Variabel | Fungsi |
|---|---|
| `PORT` | Port server lokal |
| `MONGODB_URI` | Connection string MongoDB Atlas |
| `JWT_SECRET` | Secret untuk JWT |
| `EXTERNAL_API_KEY` | API Key utama |
| `DEMO_API_KEY` | API Key khusus pengujian |

Ganti seluruh nilai placeholder dengan konfigurasi yang sesuai.

**Penting:** Jangan mengunggah file `.env`, JWT Secret, password database, atau API Key ke GitHub.

### 4. Jalankan Server

```bash
npm start
```

Atau:

```bash
node server.js
```

Jika script pengembangan tersedia:

```bash
npm run dev
```

Alamat server lokal:

- API: http://localhost:3000
- Swagger UI: http://localhost:3000/api-docs

## Dokumentasi Endpoint API

### 1. Authentication

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/auth/register` | Registrasi pengguna baru |
| POST | `/api/auth/login` | Login dan mendapatkan JWT |
| GET | `/api/auth/me` | Mengambil profil pengguna |

Endpoint yang dilindungi JWT menggunakan header:

```http
Authorization: Bearer <JWT_TOKEN>
```

Token didapatkan setelah login berhasil.

### 2. Todos

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/todos` | Membuat Todo |
| GET | `/api/todos` | Mengambil daftar Todo |
| GET | `/api/todos/:id` | Mengambil detail Todo |
| PUT | `/api/todos/:id` | Memperbarui Todo |
| DELETE | `/api/todos/:id` | Menghapus Todo |
| PATCH | `/api/todos/:id/archive` | Mengarsipkan Todo |

Seluruh endpoint Todo menggunakan autentikasi JWT.

#### Contoh Membuat Todo

**Endpoint:**

```http
POST /api/todos
```

**Request Body:**

```json
{
  "title": "Belajar REST API",
  "description": "Mengerjakan tugas backend",
  "status": "pending",
  "priority": "medium"
}
```

#### Filter, Search, Sorting, dan Pagination

Endpoint `GET /api/todos` menyediakan parameter berikut:

| Parameter | Keterangan |
|---|---|
| `status` | Filter berdasarkan status |
| `category` | Filter berdasarkan ID kategori |
| `search` | Pencarian berdasarkan judul |
| `archived` | Filter Todo aktif atau arsip |
| `sort` | Kolom pengurutan |
| `order` | Urutan ASC atau DESC |
| `page` | Nomor halaman |
| `limit` | Jumlah data per halaman |

Pilihan parameter `sort`:

- `created_at`
- `updated_at`
- `due_date`
- `title`
- `priority`

Pilihan parameter `order`:

- `asc` — urutan naik.
- `desc` — urutan turun.

**Contoh request:**

```http
GET /api/todos?sort=created_at&order=desc&page=1&limit=10
```

Contoh pencarian:

```http
GET /api/todos?search=belajar&status=pending
```

### 3. Categories

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/categories` | Membuat kategori |
| GET | `/api/categories` | Mengambil daftar kategori |
| GET | `/api/categories/:id` | Mengambil detail kategori |
| PUT | `/api/categories/:id` | Memperbarui kategori |
| DELETE | `/api/categories/:id` | Menghapus kategori |

Endpoint kategori menggunakan autentikasi JWT.

### 4. Activity Logs

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/activity-logs` | Mengambil riwayat aktivitas |

Endpoint ini menggunakan autentikasi JWT dan mendukung pagination.

**Contoh request:**

```http
GET /api/activity-logs?page=1&limit=10
```

**Contoh struktur pagination:**

```json
{
  "pagination": {
    "total": 7,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### Snapshot Activity Logs

Activity Logs mencatat aktivitas pengguna dan menyimpan snapshot data Todo.

Snapshot merupakan salinan kondisi Todo saat aktivitas dilakukan, sehingga riwayat perubahan tetap dapat diperiksa.

Aktivitas yang mendukung snapshot:

| Action | Keterangan |
|---|---|
| `todo_created` | Snapshot saat Todo dibuat |
| `todo_updated` | Snapshot setelah Todo diperbarui |
| `todo_archived` | Snapshot setelah Todo diarsipkan |
| `todo_deleted` | Snapshot data Todo saat dihapus |

**Contoh Activity Log:**

```json
{
  "action": "todo_created",
  "description": "Membuat todo: Tes Snapshot",
  "snapshot": {
    "title": "Tes Snapshot",
    "description": "Menguji snapshot Activity Log",
    "status": "pending",
    "priority": "medium",
    "due_date": null,
    "category": null,
    "archived": false
  }
}
```

Saat Todo diperbarui, Activity Log baru menyimpan snapshot kondisi terbaru tanpa mengubah snapshot aktivitas sebelumnya.

Saat Todo dihapus, Activity Log tetap menyimpan snapshot sehingga riwayat data masih dapat diperiksa.

**Hasil pengujian manual:**

| Aktivitas | Hasil |
|---|---|
| Create Todo | Berhasil |
| Update Todo | Berhasil |
| Archive Todo | Berhasil |
| Delete Todo aktif | Berhasil |

**Catatan:** Pada pengujian, DELETE terhadap Todo yang sudah diarsipkan menghasilkan respons `Todo tidak ditemukan`. Penghapusan Todo aktif berhasil dan menghasilkan snapshot `todo_deleted`.

### 5. External API

External API menggunakan autentikasi API Key melalui header `x-api-key`.

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/external/summary` | Mengambil ringkasan Todo |
| GET | `/api/external/activity-logs` | Mengambil riwayat aktivitas |

**Header:**

```http
x-api-key: <API_KEY>
```

Endpoint eksternal dapat diakses menggunakan API Key utama atau API Key demo yang telah dikonfigurasi pada server.

## API Key Demo untuk Mentor

Project menyediakan **API Key khusus demo** yang terpisah dari API Key utama.

API Key demo digunakan agar mentor atau penguji dapat mencoba endpoint eksternal tanpa mengetahui API Key produksi.

**Status pengujian:**

| Endpoint | HTTP Status |
|---|---|
| `GET /api/external/summary` | 200 OK |
| `GET /api/external/activity-logs` | 200 OK |

Kedua endpoint sudah berhasil diuji menggunakan API Key demo.

### Cara Mendapatkan API Key Demo

API Key demo diberikan kepada mentor atau penguji **secara pribadi oleh pengembang**.

Nilai API Key tidak dicantumkan pada README publik untuk mencegah penyalahgunaan.

### Cara Menggunakan API Key Demo di Swagger

1. Buka https://todo-list-management-api-one.vercel.app/api-docs
2. Klik tombol **Authorize**.
3. Cari bagian `apiKeyAuth`.
4. Masukkan **nilai API Key demo**, bukan nama variabel `DEMO_API_KEY`.
5. Klik **Authorize**.
6. Klik **Close**.
7. Buka bagian **External API**.
8. Pilih `GET /api/external/summary`.
9. Klik **Try it out**.
10. Klik **Execute**.

Jika API Key valid, endpoint akan mengembalikan respons **200 OK**.

Lakukan langkah yang sama untuk:

```http
GET /api/external/activity-logs
```

### Contoh Penggunaan cURL

```bash
curl -X GET \
  "https://todo-list-management-api-one.vercel.app/api/external/summary" \
  -H "x-api-key: <API_KEY_DEMO>"
```

Ganti `<API_KEY_DEMO>` dengan nilai API Key demo yang diberikan oleh pengembang.

### Keamanan API Key

- API Key utama disimpan pada `EXTERNAL_API_KEY`.
- API Key demo disimpan pada `DEMO_API_KEY`.
- Keduanya dikonfigurasi melalui Environment Variables.
- API Key produksi tidak dibagikan kepada penguji.
- API Key demo diberikan secara pribadi.
- API Key demo dapat dirotasi atau dinonaktifkan setelah pengujian selesai.

**Catatan keamanan:** API Key demo saat ini mengizinkan akses ke endpoint eksternal yang sama dengan API Key utama. Karena itu, key demo tetap harus dijaga kerahasiaannya.

## Pengujian Otomatis

Project menggunakan Jest dan Supertest untuk pengujian API.

Jalankan:

```bash
npm test
```

Pengujian otomatis mencakup beberapa skenario, seperti:

- Respons halaman utama.
- Penanganan endpoint yang tidak ditemukan.
- Validasi parameter Todo.
- Penanganan ID tidak valid.
- Penanganan JSON dengan format yang salah.

Selain pengujian otomatis, endpoint juga diuji secara manual melalui Swagger UI.

## Deployment Vercel

Project telah di-deploy menggunakan Vercel.

**Production URL:**

https://todo-list-management-api-one.vercel.app

**Swagger UI:**

https://todo-list-management-api-one.vercel.app/api-docs

Environment Variables yang diperlukan pada Vercel:

```env
MONGODB_URI=<MONGODB_CONNECTION_STRING>
JWT_SECRET=<JWT_SECRET>
EXTERNAL_API_KEY=<PRODUCTION_API_KEY>
DEMO_API_KEY=<DEMO_API_KEY>
```

Seluruh nilai rahasia disimpan melalui pengaturan Environment Variables di Vercel, bukan di source code.

Setelah perubahan kode atau environment variables, lakukan deployment ulang jika diperlukan.

## Struktur Project

```text
todo-list-api/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── test/
├── utils/
├── validators/
├── app.js
├── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

Struktur folder dapat berbeda sesuai perkembangan implementasi project.

## Catatan Keamanan

- Jangan commit file `.env`.
- Jangan membagikan password MongoDB.
- Jangan membagikan JWT Secret.
- Jangan membagikan API Key produksi.
- Jangan menyimpan token JWT pengguna di repository.
- Gunakan HTTPS pada deployment.
- Simpan API Key demo secara aman.
- Rotasi atau nonaktifkan API Key demo setelah proses penilaian selesai.
- Batasi akses MongoDB Atlas sesuai kebutuhan deployment.

## Kesimpulan

Todo List Management API menyediakan fitur pengelolaan Todo, kategori, autentikasi JWT, filter, sorting, pagination, pengarsipan, serta pencatatan aktivitas dengan snapshot.

API dilengkapi dokumentasi Swagger UI dan endpoint eksternal menggunakan API Key.

Pengujian manual telah membuktikan bahwa snapshot berhasil tersimpan pada aktivitas create, update, archive, dan delete Todo aktif. Kedua endpoint External API juga berhasil diuji menggunakan API Key demo.

Project dapat diakses melalui deployment Vercel dan repository GitHub.
