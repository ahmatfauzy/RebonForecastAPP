# Standar Penulisan Kode

Panduan ini menjadi acuan saat menambah atau mengubah kode di ProjectForecast. Jika ada keputusan khusus untuk sebuah fitur, dokumentasikan alasannya di dekat kode atau pada dokumentasi fitur terkait.

## Prinsip umum

- Utamakan kode yang jelas, sederhana, dan mudah ditinjau. Hindari abstraksi sebelum ada kebutuhan yang nyata.
- Satu modul sebaiknya memiliki satu tanggung jawab utama. Pisahkan kode berdasarkan domain/fitur ketika ukuran atau perubahan bersama mulai sulit dikelola.
- Beri nama berdasarkan maksud dan domain, bukan detail implementasi sementara.
- Hindari duplikasi logika dan konstanta. Ekstrak kode bersama jika memang ada lebih dari satu pemakai.
- Jangan memasukkan rahasia, token, kredensial, atau data sensitif ke source code maupun log.

## Struktur monorepo

- `apps/web`: antarmuka React SPA dan kode yang hanya dipakai browser.
- `apps/server`: aplikasi FastAPI dan kode yang hanya dipakai backend.
- `packages/`: paket workspace yang digunakan lintas aplikasi atau layak dipelihara secara mandiri. Setiap paket harus punya nama, tujuan, dan batas dependensi yang jelas.
- Jangan mengimpor langsung source internal dari aplikasi lain. Kode lintas workspace diekspor melalui paket di `packages/` atau kontrak API yang terdokumentasi.
- Hindari dependensi siklik antar paket. Paket bersama tidak boleh bergantung pada `apps/web` atau `apps/server`.
- Simpan konfigurasi dan dokumentasi pada lingkup paling sempit yang memakainya; konfigurasi bersama berada di root.

## Frontend: React dan TypeScript

### Gaya dan tipe

- Gunakan TypeScript untuk seluruh kode aplikasi. Pertahankan pemeriksaan `strict`; jangan melemahkannya untuk menghindari perbaikan tipe.
- Hindari `any`. Jika bentuk data belum diketahui, gunakan `unknown` dan validasi sebelum digunakan.
- Gunakan `type` atau `interface` dengan konsisten untuk bentuk data. Ekspor tipe publik dari entry point paketnya.
- Gunakan nama `PascalCase` untuk komponen dan tipe, `camelCase` untuk fungsi, variabel, dan properti, serta `UPPER_SNAKE_CASE` hanya untuk konstanta global yang benar-benar konstan.
- Komponen React harus berfokus pada satu bagian UI atau perilaku. Pindahkan logika domain yang kompleks ke hook atau modul terpisah.
- Gunakan TanStack Router dengan file-based routing di `apps/web/src/routes/`. Buat route baru per halaman/segmen URL, dan gunakan `Link`/API router untuk navigasi internal.
- Gunakan props bertipe dan nama props yang menjelaskan perilakunya. Hindari boolean props beruntun jika membuat komponen sulit dipahami.
- Utamakan elemen HTML semantik dan kontrol yang dapat diakses keyboard. Form input harus memiliki label yang terhubung.

### Pengelompokan kode

- Kelompokkan kode berdasarkan fitur/domain ketika aplikasi mulai memiliki beberapa fitur. Komponen yang hanya dipakai satu fitur diletakkan dekat fitur tersebut.
- Komponen bersama hanya diletakkan di area bersama jika benar-benar dipakai lintas fitur.
- Pisahkan akses HTTP dari komponen UI. Tangani status memuat, berhasil, kosong, dan gagal secara eksplisit.
- Jangan menaruh rahasia di frontend. Semua nilai yang dibundel ke SPA dapat dilihat pengguna.

## Backend: Python dan FastAPI

### Gaya dan tipe

- Ikuti PEP 8 dan konfigurasi Ruff pada `apps/server/pyproject.toml` (panjang baris 100, target Python 3.11).
- Gunakan `snake_case` untuk modul, fungsi, variabel, dan atribut; `PascalCase` untuk class; `UPPER_SNAKE_CASE` untuk konstanta.
- Tambahkan type annotation pada fungsi, terutama batas API, service, dan utilitas yang dipakai lintas modul.
- Gunakan model Pydantic untuk validasi request dan response. Jangan menerima payload bebas tanpa alasan.
- Route handler mengurus protokol HTTP dan validasi batas. Letakkan aturan domain pada service bila kompleksitasnya tumbuh; hindari membuat lapisan abstraksi tanpa kebutuhan.
- Gunakan dependency injection FastAPI untuk resource dan konteks request yang memang perlu dibagi.

### API dan error

- Kelompokkan endpoint berdasarkan domain di bawah `app/api/`, dan gunakan prefix serta tag yang konsisten.
- Tetapkan response schema, status code, dan perilaku error untuk endpoint baru.
- Jangan mengembalikan traceback atau detail internal kepada klien. Catat konteks yang aman di log server dan kirim pesan error yang berguna tanpa membocorkan data sensitif.
- Validasi input di batas sistem. Jangan mengandalkan validasi frontend sebagai perlindungan backend.
- Pertahankan bentuk response yang konsisten; perubahan yang mematahkan kontrak perlu dikoordinasikan dengan pemakai API.

## Kontrak API dan `packages/`

- Definisikan tipe bersama frontend di paket yang relevan di `packages/`; ekspor melalui entry point publik paket.
- Tipe TypeScript tidak memvalidasi data runtime. Tetap validasi response yang tidak tepercaya saat diterima aplikasi.
- Backend Python dan frontend TypeScript tidak berbagi tipe secara otomatis. Untuk kontrak lintas bahasa, jadikan OpenAPI dari FastAPI sebagai sumber API dan hasilkan atau validasi tipe klien dari spesifikasi tersebut ketika kebutuhan muncul.
- Jangan mengedit `packages/contracts/src/openapi.json` atau `src/generated/api.d.ts` secara manual. Ubah model/route FastAPI, lalu jalankan `bun run api:generate`; CI memeriksa bahwa hasilnya sudah diperbarui.
- Jangan mempertahankan definisi kontrak ganda secara manual tanpa mekanisme sinkronisasi atau pemeriksaan.
- Perubahan kontrak harus memperbarui endpoint, skema, tipe/klien, dan dokumentasi yang terpengaruh dalam satu perubahan yang dapat ditinjau.

## Dependensi dan konfigurasi

- Gunakan **Bun** untuk dependensi JavaScript/TypeScript dan workspace. Jangan gunakan npm, pnpm, atau yarn pada repo ini.
- Gunakan **uv** untuk dependensi Python. Jangan gunakan pip sebagai workflow instalasi atau pengelolaan dependensi proyek.
- Perbarui manifest dan lockfile terkait bersama-sama: `package.json` dengan `bun.lock`, serta `apps/server/pyproject.toml` dengan `apps/server/uv.lock`.
- Bedakan dependensi runtime dan pengembangan. Hapus dependensi yang tidak lagi dipakai.
- Baca konfigurasi dari environment. Sediakan nilai contoh aman dalam `.env.example` bila fitur membutuhkan environment variable; jangan commit `.env`.
- Validasi konfigurasi saat aplikasi mulai agar kesalahan konfigurasi terlihat lebih awal.

## Perubahan dan pemeliharaan

- Perubahan harus tetap berada dalam lingkup yang jelas. Hindari refactor besar yang tidak diperlukan untuk fitur atau perbaikan yang sedang dikerjakan.
- Perbarui README atau dokumen di `docs/` saat perilaku, setup, arsitektur, atau keputusan penting berubah.
- Hapus kode mati dan komentar usang. Komentar sebaiknya menerangkan alasan atau batasan, bukan mengulang apa yang sudah jelas dari kode.
- Jangan mencatat data pribadi, token, header autentikasi, atau isi payload sensitif.
- Sebelum perubahan diajukan, jalankan pemeriksaan yang sesuai dengan area yang diubah dan jelaskan hasilnya dalam deskripsi perubahan.
