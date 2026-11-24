# Rinsky Order App (@rinsky_id)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsabanilahir%2Frinsky)

Aplikasi pencatatan pesanan mobile khusus untuk **@rinsky_id (Rinsky Snack & Cake)**. Dirancang untuk memudahkan penjual kue mencatat pesanan harian, rekap produksi dapur, mencetak faktur/invoice, serta memantau status pembayaran (Lunas / DP / Belum Bayar) langsung dari layar HP.

---

## 🚀 Deploy ke Vercel (1-Klik)

Klik tombol di bawah untuk langsung men-deploy aplikasi ini ke Vercel secara gratis:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsabanilahir%2Frinsky)

Setelah di-deploy ke Vercel, buka link `https://...` di Google Chrome HP Android Anda, lalu tekan **Titik Tiga ➔ "Instal Aplikasi"** untuk memasangnya langsung ke daftar aplikasi HP Anda!

---

## ✨ Fitur Utama

1. **Smart Paste (Input Kilat dari Chat WhatsApp)**
   - Cukup salin teks pesanan dari chat WhatsApp / buku catatan, sistem otomatis mengekstrak tanggal, jam pengiriman, nama pemesan, lokasi, dan rincian kuenya.
2. **Deteksi Nama Singkatan Kue (Alias Matcher)**
   - Mengenali singkatan kue secara otomatis: `Sosol` ➔ Sosis solo, `Ragout` ➔ Risol Ragout, `Mercon` ➔ Risol Mercon, `Brownis milo` ➔ Brownis Cup, `Ketan serundeng` ➔ Ketan srundeng, `Martabak mix` ➔ Martabak manis, `Talam` ➔ Kue talam, `Lemper` ➔ Lemper ayam.
3. **Rekap Dapur Produksi (Kitchen Board)**
   - Merangkum total fisik kue yang wajib dibuat pada hari tersebut (termasuk isi nampan dan dus).
   - Dilengkapi checklist dapur dan tombol **"Kirim Rekap ke WA Dapur"**.
4. **Faktur / Invoice Resmi & Pelacakan Pembayaran**
   - Nomor Faktur otomatis, kop usaha `@rinsky_id`, tabel rincian item, dan stempel status visual (Lunas / DP / Belum Bayar).
   - Tombol **Cetak / Download PDF** dan tombol **Kirim Faktur ke WhatsApp**.
5. **Master Pricelist & Omset Harian**
   - Daftar harga resmi Snack Asin, Manis, dan Tradisional yang bisa diedit atau ditambah kapan saja.
   - Perhitungan total omset harian, uang masuk, dan piutang.

---

## 🛠️ Menjalankan Secara Lokal

```bash
# Install dependensi
npm install

# Jalankan server lokal
npm run dev

# Build untuk produksi
npm run build
```
