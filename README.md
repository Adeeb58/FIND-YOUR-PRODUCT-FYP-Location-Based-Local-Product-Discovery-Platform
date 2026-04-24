<div align="center">
  

  # 🛒 Find Your Product (FYP)

  **Location-Based Local Product Discovery Platform**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

  <p align="center">
    A premium, comprehensive MERN stack platform designed to bridge the gap between local vendors and consumers through dynamic, location-aware product discovery.
  </p>
</div>

<hr />

## ✨ Features

- 📍 **Location-Based Proximity Search**: Integrated mapping to discover products and local businesses within a customizable radius.
- 🧑‍💼 **Multi-Role Workflows**: Three dedicated, secure interfaces for **Customers**, **Vendors**, and **Administrators**.
- 🏪 **Comprehensive Vendor Portal**: A powerful dashboard for vendors to manage storefronts, track inventory, and process orders in real-time.
- 🛒 **End-to-End Shopping Experience**: Seamless product discovery, cart management, and seamless checkout flows.
- ⚡ **Premium User Experience**: Built with modern UI paradigms featuring micro-animations, glassmorphism, and responsive design across all devices.

## 🛠️ Architecture & Tech Stack

Find Your Product is built using a modern decoupled architecture:

### Frontend
- **Core Engine**: React 19 optimized by Vite
- **Styling System**: Tailwind CSS v4, Radix UI Primitives
- **Interaction Design**: Framer Motion for highly fluid micro-animations
- **Data Fetching & Caching**: TanStack React Query
- **Location & Mapping**: React Leaflet & Google Maps API Integrations

### Backend
- **Server Framework**: Node.js & Express.js architecture
- **Data Persistence**: MongoDB powered by Mongoose (NoSQL)
- **Security**: Stateless JSON Web Tokens (JWT) & bcryptjs encryption

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- Git

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Adeeb58/FIND-YOUR-PRODUCT-FYP-Location-Based-Local-Product-Discovery-Platform.git
   cd FIND-YOUR-PRODUCT-FYP-Location-Based-Local-Product-Discovery-Platform
   ```

2. **Install Application Dependencies**
   ```bash
   # Install Frontend Packages
   npm install

   # Install Backend Packages
   cd server
   npm install
   ```

3. **Environment Configuration**
   Copy the provided example environment files and update them with your own credentials:
   ```bash
   # Root Directory (Frontend)
   cp .env.example .env

   # Server Directory (Backend)
   cp server/.env.example server/.env
   ```
   > **Note**: For `.env`, configure the API base URLs and mapping keys. For `server/.env`, ensure you supply a valid `MONGO_URI` and a secure `JWT_SECRET`.

4. **Launch the Application**
   Open two terminal windows to run both servers concurrently:
   
   **Terminal 1 (Backend API):**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 (Frontend Client):**
   ```bash
   npm run dev
   ```

## 📄 Project Documentation & Report

For detailed architectural diagrams, literature review, and comprehensive study results, please refer to the capstone report:
👉 [**`FYP_Capstone_Report.pdf`**](./FYP_Capstone_Report.pdf) located in the repository root.

---

<div align="center">
  <sub>Built with ❤️ for a seamless local shopping experience.</sub>
</div>
