# Todo List Management API — Endpoint Documentation

## Base URL

`http://localhost:3000/api`

## Authentication

Endpoint yang membutuhkan login menggunakan JWT melalui header:

`Authorization: Bearer <token>`

Endpoint integrasi eksternal menggunakan API Key melalui header:

`x-api-key: <API_KEY>`

Jangan pernah menaruh token atau API Key asli di dokumentasi publik.

---

## 1. Authentication

| Method | Endpoint | Deskripsi | Akses |
|---|---|---|---|
| POST | `/auth/register` | Registrasi pengguna | Publik |
| POST | `/auth/login` | Login pengguna | Publik |
| GET | `/auth/me` | Melihat profil sendiri | JWT |

## 2. Todos

| Method | Endpoint | Deskripsi | Akses |
|---|---|---|---|
| GET | `/todos` | Daftar todo dengan pencarian, filter, sorting, dan pagination | JWT |
| POST | `/todos` | Membuat todo | JWT |
| GET | `/todos/:id` | Melihat detail todo | JWT |
| PUT | `/todos/:id` | Memperbarui todo | JWT |
| DELETE | `/todos/:id` | Menghapus todo | JWT |
| PATCH | `/todos/:id/archive` | Mengarsipkan todo | JWT |

### Query Parameters untuk `GET /todos`

- `search`: mencari berdasarkan judul atau deskripsi.
- `status`: `pending`, `in_progress`, atau `completed`.
- `priority`: `low`, `medium`, atau `high`.
- `category`: ID kategori.
- `sortBy`: field pengurutan yang diizinkan.
- `order`: `asc` atau `desc`.
- `page`: nomor halaman.
- `limit`: jumlah data per halaman.
- `archived`: `true` atau `false`.

Contoh:

`GET /api/todos?status=pending&page=1&limit=10&order=desc`

## 3. Categories

| Method | Endpoint | Deskripsi | Akses |
|---|---|---|---|
| GET | `/categories` | Daftar kategori | JWT |
| POST | `/categories` | Membuat kategori | JWT |
| GET | `/categories/:id` | Detail kategori | JWT |
| PUT | `/categories/:id` | Memperbarui kategori | JWT |
| DELETE | `/categories/:id` | Menghapus atau mengarsipkan kategori | JWT |

## 4. Activity Logs

| Method | Endpoint | Deskripsi | Akses |
|---|---|---|---|
| GET | `/activity-logs` | Melihat log aktivitas milik sendiri | JWT |

Aktivitas yang wajib dicatat minimal meliputi pembuatan, pembaruan, dan penghapusan todo.

## 5. External Integration

Endpoint berikut digunakan oleh sistem eksternal tanpa login pengguna, tetapi wajib memakai API Key yang valid.

| Method | Endpoint | Deskripsi | Akses |
|---|---|---|---|
| GET | `/external/summary` | Ringkasan data todo | API Key |
| GET | `/external/activity-logs` | Log aktivitas sesuai filter yang diizinkan | API Key |

API Key harus disimpan di `.env`, diverifikasi oleh middleware, dan tidak dikirim melalui URL.

## 6. Standard Response

Contoh respons sukses:

    {
      "success": true,
      "message": "Data berhasil diambil",
      "data": []
    }

Contoh respons error:

    {
      "success": false,
      "message": "Data tidak ditemukan",
      "errors": []
    }

## 7. HTTP Status Codes

- `200 OK`: permintaan berhasil.
- `201 Created`: data berhasil dibuat.
- `400 Bad Request`: input tidak valid.
- `401 Unauthorized`: token atau API Key tidak valid.
- `403 Forbidden`: tidak memiliki izin.
- `404 Not Found`: data tidak ditemukan.
- `409 Conflict`: data bertentangan, misalnya email sudah terdaftar.
- `422 Unprocessable Entity`: validasi data gagal, jika digunakan oleh implementasi.
- `500 Internal Server Error`: kesalahan server.

## 8. Security and Data Rules

- Password disimpan dalam bentuk hash, bukan teks biasa.
- Password tidak boleh dikembalikan dalam respons API.
- Pengguna hanya dapat mengakses todo dan kategori yang menjadi haknya.
- Role `admin` harus diperiksa melalui middleware untuk endpoint khusus admin.
- Input harus divalidasi.
- Semua dokumen memiliki audit fields `created_by`, `updated_by`, `created_at`, `updated_at`, dan `archived`, dengan nilai yang sesuai untuk setiap jenis dokumen.
- Rahasia disimpan dalam `.env`; file `.env` tidak boleh di-commit ke Git.
- Penghapusan dan pengarsipan harus konsisten dengan aturan aplikasi.
