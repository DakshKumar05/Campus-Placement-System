# Campora – Campus Placement Management System

A full-stack web application designed to streamline campus placement drives for both students and placement cell administrators.

---

## 📌 Overview

**Campora** connects graduating students with recruiting companies. It features role-separated portals for students and placement cell administrators, automated eligibility filtering, interactive application tracking with selection round timelines, and pre-seeded realistic placement data.

---

## 🛠️ Tech Stack

### Backend
- **Java 21** & **Spring Boot 4.0**
- **Spring Data JPA** & **Hibernate**
- **H2 In-Memory Database** (with Web Console enabled)
- **RESTful API** architecture with role-based access control (`X-User-Id` header verification)

### Frontend
- **React 18** bootstrapped with **Vite**
- **React Router 6** (with `RequireRole` route guards)
- **State Management**: React Context (`PlacementContext`, `ToastContext`) + 10 custom hooks
- **Styling**: Global CSS + CSS Modules
- **Interactive UI**: Animated counters, live search & filtering, CSV export, timeline flowcharts

---

## ✨ Key Features

### 🎓 Student Portal
- **Profile Management**: Maintain academic records (CGPA, active backlogs, graduation year, branch, technical skills).
- **Job Board**: Browse opportunities categorized by Product, FinTech, IT Services, Consulting, Core, and Startups.
- **Eligibility Engine**: Real-time eligibility checking based on branch and criteria with visual indicators.
- **1-Click Application**: Apply directly with automated duplicate and eligibility validation.
- **Selection Timeline**: Visual round-by-round status tracking (e.g., Online Assessment → Technical Interview → HR Round → Offer).
- **CSV Export**: One-click download of personal applications and records.

### 🛡️ Admin Portal
- **Role-Guarded Access**: Secure access via dedicated Admin credentials (`ADMIN01`).
- **Placement Cell Dashboard**: Real-time overview of drive metrics, application volumes, and department statistics.
- **Task Management**: Review and resolve pending approvals (company registrations, job postings, student verification, offer letter dispatch).

### 📊 Seeded Database
The system pre-populates with rich, realistic data on startup:
- **18 Top Companies** (23 job postings) including Google, Microsoft, Amazon, Meta, Netflix, JPMorgan Chase, Goldman Sachs, Visa, Deloitte, TCS, Infosys, Wipro, Bosch, Siemens, L&T, Razorpay, CRED, and Zerodha.
- **~100 Students** across CSE, IT, ECE, EEE, MECH, and AI & DS branches with realistic CGPAs, graduation years, and skillsets.
- **470+ Job Applications** generated via deterministic eligibility and tier-based logic.

---

## 📁 Project Structure

```
Campus-Placement-System/
├── pom.xml                               # Maven project configuration
├── src/main/
│   ├── java/com/campus/placement/
│   │   ├── CampusPlacementApplication.java  # Spring Boot entry point
│   │   ├── DataLoader.java                  # Initial database seed runner
│   │   ├── User.java / UserRepository.java
│   │   ├── Student.java / StudentRepository.java
│   │   ├── JobPosting.java / JobPostingRepository.java
│   │   ├── JobApplication.java / JobApplicationRepository.java
│   │   ├── ApplicationRound.java / ApplicationRoundRepository.java
│   │   ├── AdminTask.java / AdminTaskRepository.java
│   │   ├── PlacementService.java            # Business logic layer
│   │   ├── PlacementController.java         # REST API endpoints
│   │   └── AccessDeniedException.java       # HTTP 403 handling
│   └── resources/
│       └── application.properties           # Server & H2 DB configuration
└── campus-placement-react/                  # React + Vite frontend
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx                          # Route definitions & guards
        ├── pages/                           # 9 routed views
        ├── components/                      # Reusable UI components
        ├── context/                         # Placement & Toast contexts
        ├── hooks/                           # Custom React hooks
        └── data/api.js                      # Backend API client
```

---

## 🚀 Getting Started

### Prerequisites
- **Java JDK 21+**
- **Maven 3.8+**
- **Node.js 18+** & **npm**

---

### 1. Start the Backend

Navigate to the project root:

```bash
mvn spring-boot:run
```

Or open the project in **IntelliJ IDEA** / **Eclipse** and run `CampusPlacementApplication.java`.

The backend starts at `http://localhost:8080`.

- **H2 Database Console**: `http://localhost:8080/h2-console`
  - **JDBC URL**: `jdbc:h2:mem:multiplicationdb`
  - **User Name**: `sa`
  - **Password**: *(leave blank)*

---

### 2. Start the Frontend

In a separate terminal, navigate to the React directory:

```bash
cd campus-placement-react
npm install
npm run dev
```

Open your browser at `http://localhost:5173`.

Vite is configured to automatically proxy `/api` requests to the Spring Boot backend on port 8080.

---

## 🔑 Demo Credentials

| Role | Alias / Register No. | Description |
|---|---|---|
| **Student** | `RA2211026010123` | Default student profile (Daksh P., CSE) |
| **Student** | Any register number | New student registration with blank profile |
| **Admin** | `ADMIN01` | Placement Cell Administrator account |

---

## 📡 REST API Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/login` | Authenticate or register a student/admin |
| `GET` | `/api/jobs` | List all active job postings |
| `GET` | `/api/students/{userId}` | Get student profile details |
| `PUT` | `/api/students/{userId}` | Update student profile |
| `GET` | `/api/applications/user/{userId}` | List applications for a specific student |
| `POST` | `/api/applications/{userId}/{jobId}` | Submit a job application |
| `GET` | `/api/applications/{id}/rounds` | Get selection round timeline for an application |
| `GET` | `/api/admin/tasks` | Get all admin review queues |
| `POST` | `/api/admin/tasks/{id}/resolve` | Resolve an admin task queue item |

---

## 📄 License

This project is developed for educational and campus placement tracking purposes.

