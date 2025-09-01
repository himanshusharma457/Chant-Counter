## Chant (backend + frontend)

This repository contains two projects:

- `chant-backend` — Spring Boot (Java 8) REST backend (WAR packaging)
- `chant-frontend` — Angular 16 frontend (development server)

This README explains how to configure a local MySQL database, run the backend and frontend on Windows (PowerShell), and quick API test examples.

---

## Checklist

- [x] Explain how to configure MySQL and create the `chantdb` database
- [x] Show how to run the backend (uses Maven wrapper)
- [x] Show how to run the frontend (npm / Angular CLI)
- [x] Provide troubleshooting tips and quick curl examples

---

## Prerequisites

- Java 8 (JDK 1.8)
- Git (optional)
- MySQL server (accessible on localhost:3306 or update DB URL)
- Node.js + npm (for frontend)
- On Windows use PowerShell for the commands below

If you don't have Maven installed, this project includes the Maven Wrapper (`mvnw.cmd`) so you can build without installing Maven globally.

## Database setup (MySQL)

1. Start your local MySQL server.
2. Create the database used by the application (defaults shown in `application.properties`):

```powershell
mysql -u root -pMySQL@123 -e "CREATE DATABASE IF NOT EXISTS chantdb;"
```

If you use a different username/password or host/port, update `chant-backend/src/main/resources/application.properties` accordingly:

- `spring.datasource.url` (jdbc url)
- `spring.datasource.username`
- `spring.datasource.password`

By default the project currently uses:

- URL: `jdbc:mysql://localhost:3306/chantdb?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`
- Username: `root`
- Password: `MySQL@123`

Note: The backend was updated to use the MySQL Connector/J 8.x driver and the `com.mysql.cj.jdbc.Driver` driver class with `org.hibernate.dialect.MySQL8Dialect`.

## Backend (Spring Boot)

Location: `chant-backend`

Build and run using the Maven Wrapper on Windows (PowerShell):

```powershell
cd .\chant-backend
.\mvnw.cmd clean install -DskipTests
.\mvnw.cmd spring-boot:run
```

If `mvnw.cmd` fails because of execution policy, run PowerShell as Administrator or execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

The application starts on port 8080 by default (`server.port` in `application.properties`). On first run Hibernate will create the tables (`users`, `chants`) when `spring.jpa.hibernate.ddl-auto=update`.

### Notes

- If you don't have MySQL on `localhost:3306`, update `spring.datasource.url` in `chant-backend/src/main/resources/application.properties`.
- If Maven is installed globally you may run `mvn clean install` instead of the wrapper.

## Frontend (Angular)

Location: `chant-frontend`

Install packages and run the development server:

```powershell
cd .\chant-frontend
npm install
npm start
```

The dev server typically runs on `http://localhost:4200`. The frontend calls the backend API endpoints (default: `http://localhost:8080/api/...`). If you changed backend port or host, update the API base URL in `chant-frontend/src/app/services/api.service.ts`.

If `node` or `npm` are not found, install Node.js from https://nodejs.org/ and ensure it is on your PATH.

## Quick API examples

Replace `localhost:8080` with your backend host/port if different.

- Create user:

```powershell
curl -X POST "http://localhost:8080/api/users/create" -H "Content-Type: application/json" -d '{"userid":"9876543210"}'
```

- Add chant:

```powershell
curl -X POST "http://localhost:8080/api/chants/add" -H "Content-Type: application/json" -d '{"userid":"9876543210","date":"2025-08-28","count":10}'
```

- Get user total:

```powershell
curl "http://localhost:8080/api/chants/user/9876543210/total"
```

- Get community total:

```powershell
curl "http://localhost:8080/api/chants/total"
```

## Recent changes / fixes

- Updated `chant-backend`:
  - MySQL connector bumped to 8.x in `pom.xml` and driver class changed to `com.mysql.cj.jdbc.Driver`.
  - Hibernate dialect updated to `MySQL8Dialect`.

- Fixed frontend button stuck on "Saving...":
  - File: `chant-frontend/src/app/components/home/home.component.ts`
  - Summary: `isLoading` flag is now set to `false` after success paths so the UI no longer remains in the loading state after a successful save.

## Troubleshooting

- Backend fails to start / DB connection errors:
  - Check MySQL is running and the credentials/URL in `application.properties` are correct.
  - Check for port conflicts on 8080.

- `mvn` or `mvnw.cmd` not found / execution policy errors:
  - Use the included `mvnw.cmd` from the `chant-backend` folder. Adjust PowerShell execution policy if necessary.

- Frontend `npm`/`node` missing:
  - Install Node.js and npm, then run `npm install` from `chant-frontend`.

## Next steps (suggested)

- Run end-to-end tests manually to verify API + UI flows.
- Add a small README in each subproject (`chant-backend/README.md` and `chant-frontend/README.md`) if you want more granularity.

---

If you want, I can also:

- Add a small Postman collection or a shell script with the example curl commands.
- Add application-specific environment variables support (externalized `application.properties`).
