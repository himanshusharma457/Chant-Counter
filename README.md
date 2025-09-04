# Chant Counter Application

A full-stack web application for tracking and managing chant counts with community statistics.

## Overview

**Backend**: Spring Boot 2.7.18 REST API (Java 8, MySQL)  
**Frontend**: Angular 16 with Material Design UI

## Features

- ✨ Create user profiles with unique IDs
- 📊 Track daily chant counts  
- 📈 View individual user statistics
- 🌍 Monitor community-wide totals
- 📱 Responsive Material Design interface

## Application Flow

1. **Landing Page** → User enters the application
2. **User Type Selection** → Choose existing user or create new
3. **Home Dashboard** → View statistics and manage chants
4. **Add Chant** → Record daily chant counts

## Quick Setup

### Prerequisites
- Java 8 JDK
- MySQL Server (8.0+)
- Node.js 18+ & npm

### Database Setup
```powershell
mysql -u root -p -e "CREATE DATABASE chantdb;"
```

### Backend (Port 8080)
```powershell
cd .\chant-backend
.\mvnw.cmd spring-boot:run
```

### Frontend (Port 4200)
```powershell
cd .\chant-frontend
npm install
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/create` | Create new user |
| POST | `/api/chants/add` | Add chant entry |
| GET | `/api/chants/user/{id}/total` | Get user total |
| GET | `/api/chants/total` | Get community total |
| GET | `/api/chants/usersCounts` | Get all users' counts |

## Database Configuration

Update `chant-backend/src/main/resources/application.properties` if needed:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/chantdb
spring.datasource.username=root
spring.datasource.password=MySQL@123
```

## Project Structure

```
├── chant-backend/          # Spring Boot API
│   ├── controller/         # REST endpoints
│   ├── service/           # Business logic
│   ├── entity/            # Database entities
│   └── dto/               # Data transfer objects
├── chant-frontend/         # Angular SPA
│   ├── components/        # UI components
│   └── services/          # API integration
└── README.md
```

## Tech Stack

**Backend**: Spring Boot, MySQL, JPA/Hibernate, Maven  
**Frontend**: Angular 16, Material Design, TypeScript, RxJS

---

**Repository**: Chant-Counter  
**Maintainer**: himanshusharma457
