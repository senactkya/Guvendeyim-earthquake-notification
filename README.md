# <Güvendeyim - Deprem Bildirim Uygulaması>

> **Project Overview / Proje Özeti**
> Briefly describe what your project does and the problem it solves. 
> *Projenizin ne işe yaradığını ve hangi sorunu çözdüğünü kısaca açıklayın.*
> Example / Örnek: *A modern, responsive web application for managing personal tasks. / Kişisel görevleri yönetmek için modern ve duyarlı bir web uygulaması.*

---

## 📋 Table of Contents / İçindekiler

1. [Features / Özellikler](#-features--özellikler)
2. [Installation and Setup / Kurulum ve Ayarlar](#-installation-and-setup--kurulum-ve-ayarlar)
3. [Usage and Commands / Kullanım ve Komutlar](#-usage-and-commands--kullanim-ve-komutlar)
4. [Configuration / Konfigürasyon](#-configuration--konfigürasyon)
5. [Architecture and Design / Mimari ve Tasarım](#-architecture-and-design--mimari-ve-tasarim)
6. [API Reference / API Referansı](#-api-reference--api-referansı)
7. [Testing / Testler](#-testing--testler)
8. [Deployment / Dağıtım](#-deployment--dağıtım)
9. [Contributing / Katkıda Bulunma](#-contributing--katkıda-bulunma)
10. [License / Lisans](#-license--lisans)
11. [Credits / Teşekkürler](#-credits--teşekkürler)
12. [Personal Details / Kişisel Bilgiler](#-personal-details--kişisel-bilgiler)
13. [Changelog / Değişiklik Günlüğü](#-changelog--değişiklik-günlüğü)

---

## ✨ Features / Özellikler

*Guidance: List the core features of your application. / Rehber: Uygulamanızın temel özelliklerini listeleyin.*

- **User Authentication / Kullanıcı Doğrulama:** Secure login and registration using JWT. / JWT kullanarak güvenli giriş ve kayıt.
- **Real-time Updates / Gerçek Zamanlı Güncellemeler:** WebSocket integration. / WebSocket entegrasyonu.
- **Responsive Design / Duyarlı Tasarım:** Fully mobile-compatible UI. / Tamamen mobil uyumlu arayüz.

---

## 🚀 Installation and Setup / Kurulum ve Ayarlar

*Guidance: Provide step-by-step instructions to get the development environment running. / Rehber: Geliştirme ortamını çalıştırmak için adım adım talimatlar verin.*

### Prerequisites / Ön Koşullar

- [Node.js](https://nodejs.org/) (v16.x or higher / veya üzeri)
- [npm](https://www.npmjs.com/) (v8.x or higher / veya üzeri)
- [MongoDB](https://www.mongodb.com/) (v5.x or higher / veya üzeri)

### Steps / Adımlar

1. **Clone the repository / Depoyu klonlayın:**
   ```bash
   git clone <your_github_url>
   cd <repository_folder>
   ```

2. **Install dependencies / Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Set up environment variables / Çevresel değişkenleri ayarlayın:**
   ```bash
   cp .env.example .env
   ```

4. **Run the development server / Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

---

## 💻 Usage and Commands / Kullanım ve Komutlar

*Guidance: Provide examples of how to use the project or common scripts. / Rehber: Projenin nasıl kullanılacağına dair örnekler veya yaygın komutlar verin.*

- `npm run dev`: Starts the development server. / Geliştirme sunucusunu başlatır.
- `npm run build`: Builds the app for production. / Uygulamayı canlı ortam (production) için derler.
- `npm run start`: Runs the production build. / Derlenmiş uygulamayı başlatır.

---

## ⚙️ Configuration / Konfigürasyon

*Guidance: Detail the environment variables. / Rehber: Çevresel değişkenleri detaylandırın.*

| Variable / Değişken | Description / Açıklama                           | Example / Örnek               |
|---------------------|--------------------------------------------------|-------------------------------|
| `PORT`              | Port number / Sunucu portu                       | `3000`                        |
| `DATABASE_URL`      | Database connection / Veritabanı bağlantısı      | `mongodb://localhost:27017/db`|
| `JWT_SECRET`        | Security key for JWT / JWT için güvenlik anahtarı| `supersecret`                 |

---

## 🏗️ Architecture and Design / Mimari ve Tasarım

*Guidance: Explain the high-level architecture. / Rehber: Üst düzey mimariyi açıklayın.*

### Technology Stack / Teknoloji Yığını
- **Frontend:** React.js, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB

---

## 🔌 API Reference / API Referansı

*Guidance: Document the endpoints. / Rehber: Uç noktaları belgelendirin.*

### `GET /api/v1/users`
Retrieves a list of users. / Kullanıcı listesini getirir.

**Response / Yanıt:**
```json
{
  "success": true,
  "data": []
}
```

---

## 🧪 Testing / Testler

*Guidance: Explain how to run tests. / Rehber: Testlerin nasıl çalıştırılacağını açıklayın.*

To run the test suite / Testleri çalıştırmak için:
```bash
npm run test
```

---

## 📦 Deployment / Dağıtım

*Guidance: Provide deployment steps. / Rehber: Dağıtım adımlarını sağlayın.*

1. Build the application / Uygulamayı derleyin:
   ```bash
   npm run build
   ```
2. Start with PM2 / PM2 ile başlatın:
   ```bash
   pm2 start npm --name "<app_name>" -- start
   ```

---

## 🤝 Contributing / Katkıda Bulunma

*Guidance: Outline how others can contribute. / Rehber: Diğerlerinin nasıl katkıda bulunabileceğini belirtin.*

1. Fork the project. / Projeyi forklayın.
2. Create your branch / Dalınızı oluşturun: `git checkout -b feature/MyFeature`
3. Commit changes / Değişiklikleri kaydedin: `git commit -m 'Add MyFeature'`
4. Push to the branch / Dalınıza gönderin: `git push origin feature/MyFeature`
5. Open a Pull Request. / Pull Request açın.

---

## 📄 License / Lisans

This project is licensed under the MIT License. / Bu proje MIT Lisansı ile lisanslanmıştır.

---

## 🙌 Credits / Teşekkürler

*Guidance: Acknowledge resources or people. / Rehber: Kaynaklara veya kişilere teşekkür edin.*

- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- Special thanks to my professor. / Profesörüme özel teşekkürler.

---

## 👤 Personal Details / Kişisel Bilgiler

*Guidance: Fill in your personal details. / Rehber: Kişisel bilgilerinizi doldurun.*

- **GitHub Link:** [Github Link](https://github.com/senactkya/Guvendeyim-earthquake-notification)
- **Student Number / Öğrenci Numarası:** 24010501050
- **Full Name / Ad Soyad:** Senanur Çetükkaya

---

## 🔄 Changelog / Değişiklik Günlüğü

- **v1.0.0** - **25.06.2026**
  - Initial release. / İlk sürüm.
