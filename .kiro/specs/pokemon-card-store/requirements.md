# Requirements Document

## Introduction

Website toko kartu Pokemon adalah platform e-commerce yang memungkinkan pengguna untuk menjelajahi, mencari, dan membeli kartu Pokemon. Sistem dibangun dengan arsitektur layanan terpisah: frontend menggunakan Next.js dan backend menggunakan Laravel dengan arsitektur Modular Monolith. Komunikasi antara frontend dan backend dilakukan melalui REST API. Platform ini mencakup manajemen produk (kartu Pokemon), keranjang belanja, proses checkout, manajemen pesanan, serta panel admin untuk pengelolaan toko.

## Glossary

- **Frontend**: Aplikasi Next.js yang menangani antarmuka pengguna dan berinteraksi dengan backend melalui REST API.
- **Backend**: Aplikasi Laravel dengan arsitektur Modular Monolith yang menyediakan REST API untuk seluruh logika bisnis.
- **API**: REST API yang disediakan oleh Backend untuk dikonsumsi oleh Frontend.
- **Catalog_Module**: Modul Backend yang menangani data kartu Pokemon, kategori, dan set kartu.
- **Cart_Module**: Modul Backend yang menangani keranjang belanja pengguna.
- **Order_Module**: Modul Backend yang menangani pembuatan dan manajemen pesanan.
- **User_Module**: Modul Backend yang menangani autentikasi, profil, dan manajemen pengguna.
- **Payment_Module**: Modul Backend yang menangani integrasi dan pemrosesan pembayaran.
- **Admin_Module**: Modul Backend yang menangani operasi administratif toko.
- **Guest**: Pengguna yang belum melakukan login.
- **Customer**: Pengguna yang sudah terdaftar dan login.
- **Admin**: Pengguna dengan hak akses administratif penuh.
- **Pokemon_Card**: Produk berupa kartu Pokemon dengan atribut nama, set, kondisi, rarity, harga, dan stok.
- **Cart**: Keranjang belanja yang menyimpan daftar Pokemon_Card yang dipilih Customer sebelum checkout.
- **Order**: Catatan transaksi pembelian yang dibuat setelah Customer menyelesaikan checkout.
- **Set**: Seri penerbitan kartu Pokemon (contoh: Base Set, Sword & Shield).
- **Rarity**: Tingkat kelangkaan kartu Pokemon (contoh: Common, Uncommon, Rare, Ultra Rare).
- **Kondisi**: Kondisi fisik kartu (contoh: Mint, Near Mint, Excellent, Good, Poor).
- **JWT_Token**: Token autentikasi berbasis JSON Web Token yang digunakan untuk mengamankan akses API.
- **Stock_Snapshot**: Salinan data stok yang direkam pada saat Order dibuat, tidak terpengaruh perubahan stok setelahnya.
- **Price_Snapshot**: Salinan harga satuan Pokemon_Card yang direkam pada saat Order dibuat, tidak terpengaruh perubahan harga setelahnya.

---

## Requirements

### Requirement 1: Autentikasi dan Manajemen Akun Pengguna

**User Story:** Sebagai pengunjung toko, saya ingin mendaftar dan login ke akun saya, sehingga saya dapat melakukan pembelian dan melacak pesanan saya.

#### Acceptance Criteria

1. WHEN seorang Guest mengirimkan data registrasi dengan email berformat valid, nama sepanjang 1–100 karakter, dan password sepanjang 8–128 karakter, THE User_Module SHALL membuat akun baru dan mengembalikan JWT_Token dengan masa berlaku 24 jam.
2. WHEN seorang Guest mengirimkan email dan password yang terdaftar, THE User_Module SHALL mengembalikan JWT_Token yang valid dengan masa berlaku 24 jam beserta data profil pengguna (nama, email).
3. IF seorang Guest mengirimkan email yang sudah terdaftar saat registrasi, THEN THE User_Module SHALL mengembalikan response HTTP 422 dengan pesan error yang menyatakan email sudah digunakan.
4. IF seorang Guest mengirimkan kredensial yang tidak valid saat login, THEN THE User_Module SHALL mengembalikan response HTTP 401 dengan pesan error autentikasi generik tanpa mengungkapkan detail spesifik field yang salah.
5. WHEN seorang Customer melakukan logout, THE User_Module SHALL menambahkan JWT_Token yang aktif ke daftar token yang tidak valid (blacklist) sehingga token tersebut tidak dapat digunakan kembali.
6. WHEN seorang Customer memperbarui data profil dengan nama sepanjang 1–100 karakter dan/atau email berformat valid, THE User_Module SHALL menyimpan perubahan dan mengembalikan data profil terbaru.
7. IF seorang Customer mengirimkan data profil yang tidak valid (nama kosong, email tidak berformat valid, atau password kurang dari 8 karakter) saat memperbarui profil, THEN THE User_Module SHALL mengembalikan response HTTP 422 dengan pesan error yang mengindikasikan field yang bermasalah.
8. WHEN seorang Guest atau Customer mengirimkan data akun, THE User_Module SHALL memvalidasi format email menggunakan standar RFC 5322 sebelum menyimpan data.
9. THE User_Module SHALL menyimpan password dalam bentuk hash menggunakan algoritma bcrypt dengan cost factor minimal 12.

---

### Requirement 2: Katalog Kartu Pokemon

**User Story:** Sebagai pengunjung toko, saya ingin menelusuri dan mencari kartu Pokemon yang tersedia, sehingga saya dapat menemukan kartu yang ingin saya beli.

#### Acceptance Criteria

1. THE Catalog_Module SHALL menyediakan endpoint yang mengembalikan daftar Pokemon_Card yang aktif (tidak dinonaktifkan) dengan paginasi default 20 item per halaman, menyertakan metadata paginasi (halaman saat ini, total item, total halaman).
2. WHEN seorang pengguna meminta daftar kartu dengan parameter filter (nama, set, rarity, kondisi, harga_min, harga_max), THE Catalog_Module SHALL mengembalikan daftar Pokemon_Card aktif yang memenuhi semua filter yang diberikan dengan paginasi default 20 item per halaman.
3. IF seorang pengguna mengirimkan parameter filter yang tidak valid (misalnya harga_min bukan angka, atau rarity yang tidak dikenali), THEN THE Catalog_Module SHALL mengembalikan response HTTP 422 dengan pesan error yang mengidentifikasi parameter yang tidak valid.
4. WHEN seorang pengguna meminta detail satu Pokemon_Card berdasarkan ID-nya, THE Catalog_Module SHALL mengembalikan data lengkap kartu tersebut termasuk nama, set, rarity, kondisi, harga, stok, deskripsi, dan status ketersediaan.
5. IF seorang pengguna meminta detail Pokemon_Card dengan ID yang tidak ditemukan atau sudah dinonaktifkan, THEN THE Catalog_Module SHALL mengembalikan response HTTP 404 dengan pesan error yang deskriptif.
6. WHEN seorang pengguna mengirimkan kata kunci pencarian dengan minimal 1 karakter, THE Catalog_Module SHALL mengembalikan daftar Pokemon_Card aktif yang namanya mengandung kata kunci tersebut secara case-insensitive dengan paginasi default 20 item per halaman.
7. THE Catalog_Module SHALL menyediakan endpoint yang mengembalikan daftar semua Set yang aktif beserta jumlah Pokemon_Card aktif di setiap Set.
8. THE Catalog_Module SHALL menyediakan endpoint yang mengembalikan daftar semua nilai Rarity yang tersedia.
9. WHILE stok sebuah Pokemon_Card bernilai 0, THE Catalog_Module SHALL menyertakan field `is_available: false` dalam setiap response yang memuat kartu tersebut.

---

### Requirement 3: Keranjang Belanja

**User Story:** Sebagai Customer, saya ingin menambahkan kartu Pokemon ke keranjang belanja saya, sehingga saya dapat membeli beberapa kartu sekaligus dalam satu transaksi.

#### Acceptance Criteria

1. WHEN seorang Customer menambahkan Pokemon_Card ke Cart dengan jumlah antara 1 dan stok yang tersedia (inklusif), THE Cart_Module SHALL menyimpan item tersebut ke Cart Customer dan mengembalikan isi Cart terbaru.
2. WHEN seorang Customer menambahkan Pokemon_Card yang sudah ada di Cart, THE Cart_Module SHALL menambahkan jumlah yang diminta ke jumlah yang sudah ada; IF total jumlah melebihi stok yang tersedia, THEN THE Cart_Module SHALL mengembalikan response HTTP 422 dengan pesan error yang menyertakan jumlah stok yang tersedia.
3. IF seorang Customer menambahkan Pokemon_Card dengan jumlah yang melebihi stok yang tersedia (sebagai penambahan pertama), THEN THE Cart_Module SHALL mengembalikan response HTTP 422 dengan pesan error yang menyertakan jumlah stok yang tersedia saat ini.
4. IF seorang Customer menambahkan Pokemon_Card dengan ID yang tidak ditemukan atau sudah dinonaktifkan, THEN THE Cart_Module SHALL mengembalikan response HTTP 404 dengan pesan error yang deskriptif.
5. IF seorang pengguna yang belum login mencoba mengakses endpoint Cart, THEN THE Cart_Module SHALL mengembalikan response HTTP 401.
6. WHEN seorang Customer memperbarui jumlah item di Cart menjadi nilai antara 1 dan stok yang tersedia (inklusif), THE Cart_Module SHALL memperbarui jumlah item tersebut dan mengembalikan isi Cart terbaru beserta total harga yang diperbarui.
7. IF seorang Customer memperbarui jumlah item di Cart dengan nilai yang melebihi stok yang tersedia, THEN THE Cart_Module SHALL mengembalikan response HTTP 422 dengan pesan error yang menyertakan jumlah stok yang tersedia saat ini.
8. WHEN seorang Customer menghapus item dari Cart, THE Cart_Module SHALL menghapus item tersebut dan mengembalikan isi Cart terbaru.
9. WHEN seorang Customer meminta isi Cart, THE Cart_Module SHALL mengembalikan semua item beserta harga satuan saat ini, jumlah, subtotal per item, dan total keseluruhan Cart.
10. IF seorang Customer mengurangi jumlah item Cart menjadi 0, THEN THE Cart_Module SHALL menghapus item tersebut dari Cart secara otomatis dan mengembalikan isi Cart terbaru tanpa item tersebut.

---

### Requirement 4: Proses Checkout dan Pembuatan Pesanan

**User Story:** Sebagai Customer, saya ingin menyelesaikan pembelian kartu Pokemon yang ada di keranjang saya, sehingga saya dapat menerima kartu yang saya pesan.

#### Acceptance Criteria

1. WHEN seorang Customer melakukan checkout dengan Cart yang tidak kosong dan alamat pengiriman yang valid (nama penerima 1–100 karakter, alamat jalan tidak kosong, kota tidak kosong, kode pos 5–10 digit angka), THE Order_Module SHALL membuat Order baru dengan status "pending_payment" dan mengembalikan data Order beserta ID Order.
2. WHEN sebuah Order dibuat, THE Order_Module SHALL mengurangi stok setiap Pokemon_Card yang dipesan sesuai jumlah yang dipesan secara atomik dalam satu database transaction.
3. WHEN sebuah Order berhasil dibuat, THE Cart_Module SHALL mengosongkan Cart Customer secara otomatis.
4. IF seorang Customer melakukan checkout dengan Cart yang kosong, THEN THE Order_Module SHALL mengembalikan response HTTP 422 dengan pesan error yang menyatakan Cart kosong.
5. IF seorang Customer melakukan checkout dengan alamat pengiriman yang tidak lengkap atau tidak valid, THEN THE Order_Module SHALL mengembalikan response HTTP 422 dengan pesan error yang mengidentifikasi field alamat yang bermasalah, dan Cart tidak berubah.
6. IF stok salah satu Pokemon_Card di Cart tidak mencukupi saat checkout dilakukan, THEN THE Order_Module SHALL membatalkan seluruh pembuatan Order, mengembalikan pesan error HTTP 422 yang menyebutkan nama kartu yang stoknya tidak mencukupi beserta stok yang tersedia, dan Cart tetap tidak berubah.
7. THE Order_Module SHALL menyimpan Price_Snapshot harga satuan setiap Pokemon_Card pada saat Order dibuat, sehingga perubahan harga setelah Order dibuat tidak memengaruhi total Order.
8. WHEN seorang Customer meminta daftar Order miliknya, THE Order_Module SHALL mengembalikan semua Order Customer tersebut beserta status, tanggal dibuat, dan ringkasan item (nama kartu, jumlah, harga satuan Price_Snapshot).
9. WHEN seorang Customer meminta detail Order berdasarkan ID Order yang dimilikinya, THE Order_Module SHALL mengembalikan data lengkap Order termasuk semua item, Price_Snapshot, total, status, dan informasi pengiriman.
10. IF seorang Customer meminta detail Order yang bukan miliknya, THEN THE Order_Module SHALL mengembalikan response HTTP 403.
11. IF seorang Customer meminta detail Order dengan ID yang tidak ditemukan, THEN THE Order_Module SHALL mengembalikan response HTTP 404 dengan pesan error yang deskriptif.

---

### Requirement 5: Pemrosesan Pembayaran

**User Story:** Sebagai Customer, saya ingin membayar pesanan saya menggunakan metode pembayaran yang tersedia, sehingga proses pembelian saya dapat diselesaikan.

#### Acceptance Criteria

1. WHEN seorang Customer yang terautentikasi menginisiasi pembayaran untuk Order miliknya yang berstatus "pending_payment", THE Payment_Module SHALL membuat sesi pembayaran di payment gateway dan mengembalikan URL pembayaran atau referensi transaksi.
2. IF seorang Customer mencoba menginisiasi pembayaran untuk Order yang bukan miliknya, THEN THE Payment_Module SHALL mengembalikan response HTTP 403.
3. WHEN payment gateway mengirimkan konfirmasi pembayaran berhasil (webhook/callback), THE Payment_Module SHALL memverifikasi keaslian notifikasi dan memperbarui status Order menjadi "paid".
4. IF payment gateway mengirimkan notifikasi pembayaran gagal, THEN THE Payment_Module SHALL mempertahankan status Order sebagai "pending_payment" dan mencatat alasan kegagalan serta apakah pembayaran dapat dicoba ulang.
5. IF seorang Customer mencoba menginisiasi pembayaran untuk Order yang sudah berstatus "paid", THEN THE Payment_Module SHALL mengembalikan response HTTP 409 dengan pesan error yang menyatakan Order sudah dibayar.
6. WHEN sebuah Order berstatus "pending_payment" selama lebih dari 24 jam tanpa pembayaran yang berhasil, THE Payment_Module SHALL memperbarui status Order menjadi "expired".
7. WHEN status Order diubah menjadi "expired", THE Payment_Module SHALL mengembalikan stok setiap Pokemon_Card yang dipesan sesuai jumlah yang dipesan secara atomik.
8. THE Payment_Module SHALL mencatat setiap transaksi pembayaran dengan timestamp, jumlah yang sama dengan total Order, status, dan referensi dari payment gateway.

---

### Requirement 6: Manajemen Produk oleh Admin

**User Story:** Sebagai Admin, saya ingin mengelola katalog kartu Pokemon di toko, sehingga informasi produk selalu akurat dan terkini.

#### Acceptance Criteria

1. WHEN seorang Admin menambahkan Pokemon_Card baru dengan nama (tidak kosong), set (ID Set yang valid), kondisi (salah satu dari: Mint, Near Mint, Excellent, Good, Poor), rarity (salah satu dari nilai Rarity yang tersedia), harga (lebih dari 0), dan stok (lebih dari atau sama dengan 0), THE Admin_Module SHALL menyimpan Pokemon_Card baru ke database dengan status aktif dan mengembalikan data kartu yang baru dibuat.
2. WHEN seorang Admin memperbarui data Pokemon_Card yang ada dengan nilai field yang valid (sesuai batasan C1), THE Admin_Module SHALL menyimpan perubahan dan mengembalikan data Pokemon_Card terbaru.
3. IF seorang Admin mengirimkan data Pokemon_Card baru atau pembaruan dengan nilai yang tidak valid (harga ≤ 0, stok < 0, kondisi tidak dikenali, atau rarity tidak dikenali), THEN THE Admin_Module SHALL mengembalikan response HTTP 422 dengan pesan error yang mengidentifikasi field yang tidak valid.
4. IF seorang Admin mencoba memperbarui atau menonaktifkan Pokemon_Card dengan ID yang tidak ditemukan, THEN THE Admin_Module SHALL mengembalikan response HTTP 404 dengan pesan error yang deskriptif.
5. WHEN seorang Admin menonaktifkan Pokemon_Card, THE Admin_Module SHALL mengatur flag `is_active` menjadi false sehingga kartu tidak muncul di Catalog_Module, tanpa menghapus data dari database.
6. IF seorang pengguna yang bukan Admin mencoba mengakses endpoint Admin_Module, THEN THE Admin_Module SHALL mengembalikan response HTTP 403.
7. WHEN seorang Admin memperbarui stok Pokemon_Card, THE Admin_Module SHALL mencatat perubahan stok (nilai sebelum dan sesudah) beserta timestamp ISO 8601 dan ID Admin yang melakukan perubahan.
8. THE Admin_Module SHALL menyediakan endpoint untuk mengelola data Set, termasuk membuat (dengan nama Set yang unik dan tidak kosong), memperbarui, dan menonaktifkan Set.
9. WHEN seorang Admin meminta ringkasan data toko dengan parameter start_date dan end_date dalam format ISO 8601, THE Admin_Module SHALL mengembalikan total produk aktif, total Order per status, dan total pendapatan dari Order berstatus "paid" dalam rentang waktu tersebut.

---

### Requirement 7: Manajemen Pesanan oleh Admin

**User Story:** Sebagai Admin, saya ingin memantau dan mengelola semua pesanan yang masuk, sehingga saya dapat memproses pengiriman dan menangani masalah pesanan.

#### Acceptance Criteria

1. WHEN seorang Admin meminta daftar semua Order, THE Admin_Module SHALL mengembalikan semua Order dari semua Customer dengan paginasi default 20 item per halaman dan kemampuan filter berdasarkan status (salah satu dari: pending_payment, paid, processing, shipped, delivered, cancelled, expired).
2. WHEN seorang Admin memperbarui status Order mengikuti alur transisi yang valid (pending_payment → paid → processing → shipped → delivered), THE Order_Module SHALL menyimpan status baru beserta timestamp ISO 8601 pembaruan.
3. IF seorang Admin mencoba memperbarui status Order ke status yang tidak valid dalam alur transisi yang ditentukan, THEN THE Order_Module SHALL mengembalikan response HTTP 422 dengan pesan error yang menyebutkan transisi yang valid dari status saat ini.
4. WHEN seorang Admin mengubah status Order menjadi "shipped", THE Order_Module SHALL mewajibkan dan menyimpan nomor resi pengiriman yang tidak kosong dan tidak melebihi 100 karakter.
5. IF seorang Admin mengirimkan nomor resi yang kosong atau melebihi 100 karakter saat mengubah status ke "shipped", THEN THE Order_Module SHALL mengembalikan response HTTP 422 dengan pesan error validasi nomor resi.
6. WHEN seorang Admin membatalkan Order dengan status "pending_payment" atau "paid", THE Order_Module SHALL memperbarui status Order menjadi "cancelled" dan mengembalikan stok setiap Pokemon_Card yang dipesan secara atomik.
7. IF seorang Admin mencoba membatalkan Order yang berstatus selain "pending_payment" atau "paid", THEN THE Order_Module SHALL mengembalikan response HTTP 422 dengan pesan error yang menyebutkan status yang dapat dibatalkan.

---

### Requirement 8: Komunikasi Frontend-Backend

**User Story:** Sebagai Developer, saya ingin Frontend dan Backend berkomunikasi secara aman dan terstandarisasi melalui REST API, sehingga kedua layanan dapat dikembangkan dan di-deploy secara independen.

#### Acceptance Criteria

1. THE Backend SHALL menyediakan semua endpoint dalam format REST API yang menggunakan HTTP verbs yang semantik (GET untuk baca, POST untuk buat, PUT/PATCH untuk perbarui, DELETE untuk hapus) dengan response dalam format JSON dan Content-Type: application/json.
2. THE Backend SHALL mengimplementasikan CORS yang membatasi akses hanya dari origin Frontend yang dikonfigurasi melalui environment variable, dengan metode yang diizinkan: GET, POST, PUT, PATCH, DELETE, OPTIONS.
3. WHEN request ke endpoint yang memerlukan autentikasi diterima tanpa JWT_Token yang valid, THE Backend SHALL mengembalikan response HTTP 401 dengan body `{"message": "Unauthenticated"}`.
4. THE Backend SHALL memvalidasi semua input request; IF validasi gagal, THEN THE Backend SHALL mengembalikan response HTTP 422 dengan struktur `{"message": "...", "errors": {"field_name": ["pesan error"]}}`.
5. THE Frontend SHALL menyimpan JWT_Token di httpOnly cookie dengan atribut SameSite=Strict dan Secure=true untuk mencegah akses dari JavaScript di sisi klien dan serangan CSRF.
6. WHEN JWT_Token yang dikirimkan Frontend sudah kedaluwarsa, THE Backend SHALL mengembalikan response HTTP 401 dengan body `{"message": "Token expired", "code": "token_expired"}` sehingga Frontend dapat meminta Customer untuk login ulang.
7. THE Backend SHALL mengembalikan semua response error dalam format yang konsisten: `{"message": "string deskripsi error", "errors": {"field": ["detail"]}}` di mana field `errors` bersifat opsional untuk error non-validasi.
8. THE Backend SHALL menyediakan endpoint health check (GET /api/health) yang mengembalikan response HTTP 200 dengan status koneksi database, sehingga sistem monitoring dapat memverifikasi ketersediaan layanan.
