# Chant Counter Application

A full-stack web application for tracking and managing chant counts with community statistics.

## Project Overview

This repository contains two main components:

- **`chant-backend`** — Spring Boot 2.7.18 REST API backend (Java 8, WAR packaging)
- **`chant-frontend`** — Angular 16 single-page application with Material Design UI

The application allows users to:
- Create user profiles with unique IDs
- Track daily chant counts
- View individual user statistics
- Monitor community-wide chant totals
- Visualize data through an intuitive web interface

This README provides comprehensive setup instructions for Windows PowerShell environments.

---

## ✅ Setup Checklist

- [x] Configure MySQL database and create the `chantdb` schema
- [x] Set up Java 8 development environment
- [x] Install Node.js and npm for Angular frontend
- [x] Configure backend with Maven wrapper
- [x] Set up Angular development server
- [x] Test API endpoints and UI integration

---

## 🛠️ Prerequisites

- **Java Development Kit 8** (JDK 1.8) - Required for Spring Boot backend
- **MySQL Server** (8.0+) - Database server accessible on localhost:3306
- **Node.js** (16+) and **npm** - For Angular frontend development
- **Git** (optional) - For version control
- **Windows PowerShell** - All commands below are PowerShell-compatible

> **Note**: This project includes Maven Wrapper (`mvnw.cmd`), so Maven installation is not required.

## 🗄️ Database Setup (MySQL)

### 1. Start MySQL Server
Ensure your MySQL server is running on `localhost:3306`.

### 2. Create Database
```powershell
mysql -u root -pMySQL@123 -e "CREATE DATABASE IF NOT EXISTS chantdb;"
```

### 3. Database Configuration
The application uses these default connection settings (defined in `chant-backend/src/main/resources/application.properties`):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/chantdb?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=MySQL@123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

### 4. Custom Configuration
If you use different credentials or host/port, update the following properties:
- `spring.datasource.url` - JDBC connection URL
- `spring.datasource.username` - Database username  
- `spring.datasource.password` - Database password

> **Technical Details**: 
> - Uses MySQL Connector/J 8.0.33 driver
> - Hibernate dialect: `MySQL8Dialect`
> - DDL mode: `update` (auto-creates tables on first run)

## 🚀 Backend Setup (Spring Boot)

**Location**: `chant-backend`

### Build and Run
```powershell
cd .\chant-backend
.\mvnw.cmd clean install -DskipTests
.\mvnw.cmd spring-boot:run
```

### PowerShell Execution Policy (if needed)
If `mvnw.cmd` fails due to execution policy restrictions:

```powershell
# Run as Administrator or execute:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Application Details
- **Server Port**: 8080 (configurable via `server.port`)
- **Base API Path**: `/api`
- **Auto-DDL**: Tables (`users`, `chants`) are created automatically on first run
- **Logging**: Debug level enabled for development

### Alternative Maven Commands
If you have Maven installed globally:
```powershell
mvn clean install
mvn spring-boot:run
```

## 🎨 Frontend Setup (Angular)

**Location**: `chant-frontend`

### Install Dependencies and Run
```powershell
cd .\chant-frontend
npm install
npm start
```

### Application Details
- **Development Server**: `http://localhost:4200`
- **Framework**: Angular 16.2.0
- **UI Library**: Angular Material 16.2.14
- **API Integration**: HTTP client connects to backend at `http://localhost:8080/api`

### Key Features
- Responsive Material Design interface
- Real-time chant tracking
- User management
- Community statistics dashboard
- Form validation and error handling

### Configuration
If you changed the backend host/port, update the API base URL in:
`chant-frontend/src/app/services/api.service.ts`

```typescript
private baseUrl = 'http://localhost:8080/api';
```

### Node.js Installation
If `node` or `npm` commands are not found:
1. Download Node.js from https://nodejs.org/
2. Install and ensure it's added to your PATH
3. Restart PowerShell and retry the commands

## 🔌 API Documentation

Replace `localhost:8080` with your backend host/port if different.

### User Management

**Create User**
```powershell
curl -X POST "http://localhost:8080/api/users/create" -H "Content-Type: application/json" -d '{"userid":"9876543210"}'
```

### Chant Management

**Add Chant Entry**
```powershell
curl -X POST "http://localhost:8080/api/chants/add" -H "Content-Type: application/json" -d '{"userid":"9876543210","date":"2025-09-01","count":108}'
```

**Get User Total Chants**
```powershell
curl "http://localhost:8080/api/chants/user/9876543210/total"
```

**Get Community Total Chants**
```powershell
curl "http://localhost:8080/api/chants/total"
```

**Get All Users' Chant Counts**
```powershell
curl "http://localhost:8080/api/chants/usersCounts"
```

### Test Endpoint

**Health Check**
```powershell
curl "http://localhost:8080/test/hello"
```

### API Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ }
}
```

## 📋 Recent Updates & Features

### Backend Improvements
- **Database**: Upgraded to MySQL Connector/J 8.0.33 with `com.mysql.cj.jdbc.Driver`
- **Hibernate**: Updated to use `MySQL8Dialect` for better MySQL 8+ compatibility
- **Validation**: Added Spring Boot Validation starter for request validation
- **Lombok**: Integrated for reduced boilerplate code
- **API**: New endpoint `/api/chants/usersCounts` for comprehensive user statistics

### Frontend Enhancements  
- **UI Framework**: Full Angular Material integration with modern components
- **UX**: Fixed loading state management - buttons no longer remain stuck on "Saving..."
- **Responsiveness**: Improved mobile and desktop layouts
- **Error Handling**: Enhanced user feedback and validation messages

### Configuration
- **Custom Properties**: Added configurable validation rules in `application.properties`
- **Logging**: Debug-level logging enabled for development and troubleshooting
- **CORS**: Configured for local development environment

## 🔧 Troubleshooting

### Backend Issues

**Database Connection Errors**
- ✅ Verify MySQL server is running on `localhost:3306`
- ✅ Check credentials in `application.properties` are correct
- ✅ Ensure `chantdb` database exists
- ✅ Test connection: `mysql -u root -pMySQL@123 -e "SHOW DATABASES;"`

**Port 8080 Already in Use**
```powershell
# Find process using port 8080
netstat -ano | findstr :8080
# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Maven/Build Issues**
- ✅ Ensure Java 8 is installed: `java -version`
- ✅ Use included Maven wrapper: `.\mvnw.cmd --version`
- ✅ Clear Maven cache: `.\mvnw.cmd clean`
- ✅ Skip tests if needed: `.\mvnw.cmd install -DskipTests`

**PowerShell Execution Policy**
```powershell
# Check current policy
Get-ExecutionPolicy
# Set policy for current user
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Frontend Issues

**Node.js/npm Not Found**
1. Download Node.js from https://nodejs.org/ (LTS version recommended)
2. Install and restart PowerShell
3. Verify installation: `node --version` and `npm --version`

**npm Install Failures**
```powershell
# Clear npm cache
npm cache clean --force
# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules, package-lock.json
# Reinstall dependencies
npm install
```

**Port 4200 Already in Use**
```powershell
# Run on different port
ng serve --port 4201
# Or kill existing process
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

**API Connection Issues**
- ✅ Ensure backend is running on `http://localhost:8080`
- ✅ Check browser console for CORS or network errors
- ✅ Verify API base URL in `api.service.ts`
- ✅ Test backend endpoints directly with curl/Postman

### General Development Tips

**Full Application Reset**
```powershell
# Backend - clean rebuild
cd .\chant-backend
.\mvnw.cmd clean install -DskipTests

# Frontend - fresh dependencies
cd ..\chant-frontend
Remove-Item -Recurse -Force node_modules
npm install
```

**Log Analysis**
- Backend logs: Check console output when running `mvnw.cmd spring-boot:run`
- Frontend logs: Open browser Developer Tools (F12) → Console tab
- Database logs: Enable in MySQL configuration if needed

## 🚀 Next Steps & Enhancements

### Immediate Tasks
- [ ] Run comprehensive end-to-end testing of all API endpoints
- [ ] Test UI workflows and data validation
- [ ] Verify database schema and data integrity
- [ ] Performance testing with sample data

### Suggested Improvements
- [ ] **Documentation**: Create detailed API documentation with Swagger/OpenAPI
- [ ] **Testing**: Add unit tests and integration tests for both backend and frontend
- [ ] **Security**: Implement user authentication and authorization
- [ ] **Deployment**: Add Docker configuration for containerized deployment
- [ ] **Monitoring**: Add application health checks and metrics
- [ ] **CI/CD**: Set up automated build and deployment pipelines

### Development Tools
- **Postman Collection**: API endpoint testing and documentation
- **Environment Variables**: Externalized configuration management
- **Database Migration**: Flyway or Liquibase for schema versioning
- **Code Quality**: ESLint, Prettier, SonarQube integration

### Production Considerations
- Configure production database settings
- Set up reverse proxy (nginx/Apache)
- Implement proper logging and monitoring
- Add SSL/TLS certificates
- Configure backup and disaster recovery

---

## 📞 Support & Contribution

For questions, issues, or contributions:
1. Check the troubleshooting section above
2. Review application logs for specific error messages
3. Test API endpoints individually to isolate issues
4. Ensure all prerequisites are properly installed

**Repository**: Chant-Counter  
**Maintainer**: himanshusharma457  
**Current Branch**: main
