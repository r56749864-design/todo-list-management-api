
# PRE-PRODUCTION
## Todo List Management API

### 1. Resource User
Collection: users

| Field | Tipe | Keterangan |
|---|---|---|
| name | String | Nama pengguna |
| email | String | Email unik pengguna |
| password | String | Password yang disimpan dalam bentuk hash |
| role | String | Hak akses user atau admin |
| created_by | ObjectId | Referensi pembuat data, bisa kosong |
| updated_by | ObjectId | Referensi pengguna yang memperbarui |
| archived | Boolean | Status arsip |
| created_at | Date | Waktu pembuatan |
| updated_at | Date | Waktu pembaruan |

### 2. Resource Todo
Collection: todos

| Field | Tipe | Keterangan |
|---|---|---|
| title | String | Judul tugas |
| description | String | Deskripsi tugas |
| status | String | pending, in_progress, completed |
| priority | String | low, medium, high |
| due_date | Date | Tenggat tugas, opsional |
| user | ObjectId | Pemilik Todo |
| category | ObjectId | Referensi kategori |
| created_by | ObjectId | Pembuat data |
| updated_by | ObjectId | Pengguna yang memperbarui |
| archived | Boolean | Status arsip |
| created_at | Date | Waktu pembuatan |
| updated_at | Date | Waktu pembaruan |

### 3. Resource Category
Collection: categories

| Field | Tipe | Keterangan |
|---|---|---|
| name | String | Nama kategori |
| description | String | Deskripsi kategori |
| user | ObjectId | Pemilik kategori |
| created_by | ObjectId | Pembuat data |
| updated_by | ObjectId | Pengguna yang memperbarui |
| archived | Boolean | Status arsip |
| created_at | Date | Waktu pembuatan |
| updated_at | Date | Waktu pembaruan |

### 4. Resource Activity Log
Collection: activitylogs

| Field | Tipe | Keterangan |
|---|---|---|
| user | ObjectId | Pengguna terkait, bisa kosong |
| action | String | Jenis aktivitas |
| description | String | Keterangan aktivitas |
| related_todo | ObjectId | Referensi Todo terkait |
| created_by | ObjectId | Pembuat log, bisa kosong |
| updated_by | ObjectId | Pengguna yang memperbarui log, bisa kosong |
| archived | Boolean | Status arsip |
| created_at | Date | Waktu pembuatan |
| updated_at | Date | Waktu pembaruan |

### 5. Relasi Antar-Resource

- User dapat memiliki banyak Todo.
- User dapat memiliki banyak Category.
- Category dapat digunakan oleh banyak Todo milik pemilik yang sama.
- Activity Log mencatat aktivitas pengguna dan dapat terhubung ke Todo.
- Relasi antar dokumen menggunakan ObjectId dan referensi Mongoose.

### 6. Teknologi

- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB Atlas
- ODM: Mongoose
- Autentikasi: JSON Web Token (JWT)
- Validasi: express-validator
- Konfigurasi environment: dotenv
- Password hashing: bcryptjs
