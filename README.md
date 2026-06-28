# ▶ FOCUS_OS v1.0

> *A pixel-art inspired, all-in-one productivity OS for deep work sessions.*

FOCUS OS adalah aplikasi produktivitas berbasis browser dengan desain retro pixel art. Dirancang untuk membantu lo tetap fokus dengan menggabungkan Pomodoro Timer, Streak Tracker, Media Player (Spotify & YouTube), dan Workspace (To-Do & Notes) dalam satu tampilan.

---

## ✨ Fitur

| Fitur | Deskripsi |
|---|---|
| ⏱ **Pomodoro Timer** | Timer fokus & istirahat yang bisa dikustomisasi durasinya. Notifikasi otomatis saat sesi selesai. |
| 🔥 **Streak Tracker** | Lacak konsistensi harian. Streak aktif jika lo menyelesaikan ≥2 sesi dalam sehari. Riwayat 7 hari ditampilkan. |
| 🎵 **Spotify Embed** | Paste URL playlist, track, atau album Spotify buat dimainkan langsung di dalam app. |
| 📺 **Dual YouTube Embed** | Muat **dua video YouTube sekaligus** secara berdampingan — cocok untuk kombinasi musik lofi + ambient sound. |
| 📝 **To-Do List** | Tambah, centang, dan hapus task. Auto-save ke localStorage. |
| 📓 **Notes** | Catatan bebas dengan auto-save ke localStorage. |
| 🤖 **Session Log Bar** | Ringkasan sesi hari ini: jumlah sesi, total menit fokus, dan hari streak. |

---

## 🚀 Cara Jalankan (Lokal)

> ⚠️ **Penting:** App ini **harus dijalankan via server lokal** (`http://localhost/`), bukan dengan klik ganda file HTML-nya langsung (`file:///`). Ini diperlukan agar fitur YouTube embed bisa berjalan tanpa error (YouTube membutuhkan header referrer yang valid).

### Opsi 1 — PHP (Direkomendasikan, cocok untuk pengguna Laravel/Herd)
```bash
php -S localhost:8000
```

### Opsi 2 — Python
```bash
python -m http.server 8000
```

### Opsi 3 — VS Code Live Server
Install ekstensi **Live Server** → klik kanan `index.html` → **Open with Live Server**.

Setelah server jalan, buka browser dan akses:
```
http://localhost:8000
```

---

## 📺 Cara Pakai Dual YouTube Embed

1. Klik card **🎵 MEDIA** → pilih tab **YOUTUBE**.
2. Paste link YouTube di **Input 1** (contoh: musik lofi) dan **Input 2** (contoh: suara hujan).
3. Klik **LOAD** — kedua video akan tampil berdampingan.

**Format URL yang didukung:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- Langsung Video ID: `dQw4w9WgXcQ`

> 💡 **Tip:** Tidak semua video YouTube bisa di-embed (tergantung setting pemilik channel). Kalau muncul error, coba video lain. Untuk cek: klik kanan video di YouTube → cari opsi **"Copy embed code"**.

**Contoh kombinasi rekomendasi:**
- 🎵 Lofi Girl — `https://www.youtube.com/watch?v=jfKfPfyJRdk`
- 🌧 Rain + Thunder — `https://www.youtube.com/watch?v=BHACKCNDMW8`

---

## 🛠️ Tech Stack

- **Pure HTML, CSS, JavaScript** — Zero dependencies, zero frameworks.
- **Fonts:** [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) + [DM Mono](https://fonts.google.com/specimen/DM+Mono) via Google Fonts.
- **Storage:** `localStorage` untuk persistensi data (sesi, streak, to-do, notes, URL media).
- **YouTube IFrame API** — untuk embed player dengan error handling proper.
- **Spotify Embed** — via iframe embed resmi Spotify.

---

## 📁 Struktur

```
focusapp/
└── index.html   # Single-file app — semua HTML, CSS, dan JS dalam satu file
```

---

## 📸 Preview

> *Pixel art, retro OS aesthetic. Built for grinders.*

---

*Made with ☕ — FOCUS OS v1.0*
