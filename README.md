# 🌌 MeterFlow | The Future of Usage-Based API Billing

> **Precision Metering. Real-time Observability. Seamless Billing.**

MeterFlow is a high-performance API billing platform featuring a premium neural design. Scale your API business with millisecond-accurate usage tracking and glassmorphic observability.

---

## 🛠️ Tech Stack & Tools

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

---

## ✨ Key Features

### 🔐 Advanced Key Management
Implement secure, encrypted API key provisioning with granular permissions and automated rotation.
![API Key Management](docs/assets/api_keys.png)

### 📊 Real-time Usage Observability
Track every request with millisecond precision. Visualize usage patterns through high-performance interactive charts.

### 💳 Usage-Based Billing Engine
Dynamic pricing models including tiered usage, prepaid credits, and pay-as-you-go billing, all managed through a refined "Aurora" light theme.
![Billing & Analytics](docs/assets/billing.png)

### 🚀 Neural Dashboard
A state-of-the-art administrative interface featuring:
- **Glassmorphism Design System**: Ultra-modern UI with translucent elements.
- **Neural Network Backgrounds**: Dynamic, AI-inspired visual effects.
- **Micro-interactions**: Fluid transitions and hover states for a premium feel.

---

## 🛠️ Technical Architecture

### **Backend (FastAPI)**
- **Framework**: High-performance FastAPI with asynchronous handlers.
- **Security**: Robust JWT-based authentication and scoped API key validation.
- **Database**: SQLite with optimized schema for high-concurrency event logging.
- **Middleware**: Custom billing middleware for transparent request metering.

### **Frontend (React + Vite)**
- **Foundation**: React 18+ with Vite for ultra-fast HMR.
- **Styling**: Pure Vanilla CSS for maximum flexibility and performance.
- **State Management**: Context API for global application state.
- **Visuals**: Lucide Icons and custom-crafted CSS animations.

---

## 🏁 Getting Started

### **Prerequisites**
- Python 3.9+
- Node.js 18+
- npm or yarn

### **Backend Setup**
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Initialize the database:
   ```bash
   python init_db.py
   python seed.py
   ```
5. Run the server:
   ```bash
   python run.py
   ```

### **Frontend Setup**
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔮 Roadmap & Future Tooling
- [ ] **Stripe Integration**: For automated invoice generation and payments.
- [ ] **Redis Caching**: To handle high-volume request metering with ultra-low latency.
- [ ] **Prometheus/Grafana**: For advanced system-level monitoring.
- [ ] **Dockerization**: For seamless cloud-native deployments.
- [ ] **Webhook Support**: To notify clients of usage milestones.

---

## 🛡️ License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<p align="center">
  Built with 💜 by <a href="https://github.com/abhiramvsmg">abhiramvsmg</a>
</p>
