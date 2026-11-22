# Personal Task Manager API

A robust Spring Boot REST API for personal task management, featuring JWT authentication, strict task ownership, and advanced filtering.

## 📋 Features

- **Authentication:** User registration and login using JWT (JSON Web Tokens).
- **Task Management:** Full CRUD operations for tasks.
- **Ownership Security:** Users can only view, update, or delete their own tasks.
- **Advanced Querying:** Pagination, sorting, filtering by status and priority, and title search.
- **Validation & Error Handling:** Jakarta Bean Validation and global exception handling for consistent JSON error responses.
- **Documentation:** Interactive Swagger/OpenAPI UI.
- **Database Integration:** MySQL-compatible cloud database support.
- **Testing:** H2 database for testing.
- **Security:** Spring Security with JWT-based authentication.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Java 17 | Programming Language |
| Spring Boot 4.1.1 | Backend Framework |
| Spring Security | Authentication and Authorization |
| JWT (jjwt) | Token-based Authentication |
| Spring Data JPA | Database Operations |
| Hibernate | ORM |
| MySQL | Local Development Database |
| TiDB Cloud | Cloud Database |
| H2 Database | Testing |
| Maven | Build Management |
| Lombok | Boilerplate Code Reduction |
| Docker & Docker Compose | Containerization |
| Swagger / OpenAPI | API Documentation |

## 📁 Project Structure

```text
src/
├── main/
│   ├── java/
│   │   └── com/example/Todo/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── dto/
│   │       ├── entity/
│   │       ├── exception/
│   │       ├── repository/
│   │       ├── security/
│   │       └── service/
│   │
│   └── resources/
│       └── application.properties/
│
└── test/
    └── java/
```

## 🚀 Getting Started (Local Development)

### Prerequisites

- JDK 17 or higher
- Maven
- MySQL (running locally on port 3306)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Chaitanya6935/Task-Manager-Application.git
```

Navigate to the backend project directory.

```bash
cd Task-Manager-Application
```

### 2. Database Setup

Create a database named `TMA` in your local MySQL instance.

```sql
CREATE DATABASE TMA;
```

### 3. Configure Database Credentials

The application uses environment variables for database configuration.

Default local configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/TMA
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

For cloud database configuration, set the following environment variables:

```text
DB_URL=YOUR_DATABASE_JDBC_URL
DB_USERNAME=YOUR_DATABASE_USERNAME
DB_PASSWORD=YOUR_DATABASE_PASSWORD
```

### 4. Configure JWT Secret

Set a secure JWT secret using an environment variable.

```text
JWT_SECRET=YOUR_SECURE_RANDOM_SECRET
JWT_EXPIRATION=86400000
```

**Important:** Never commit database passwords, JWT secrets, or other sensitive credentials to GitHub.

### 5. Run the Application

Using Maven:

```bash
mvn spring-boot:run
```

Or using Maven Wrapper on Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend will start at:

```text
http://localhost:8080
```

## 📖 API Documentation

This project uses Swagger/OpenAPI for interactive API documentation.

After starting the application, access:

```text
http://localhost:8080/swagger-ui/index.html
```

API documentation can also be accessed through:

```text
http://localhost:8080/v3/api-docs
```

## 🔐 Authentication

The application uses JWT-based authentication.

### User Registration

```http
POST /users/register
```

### User Login

```http
POST /users/login
```

After successful login, the API returns an authentication token.

Use this token when accessing protected endpoints:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🧪 Testing

Run the test suite using:

```bash
mvn clean test
```

Or on Windows:

```powershell
.\mvnw.cmd clean test
```

H2 Database is used for testing.

## 🌐 Deployment

The application supports environment-based configuration for cloud deployment.

Required production environment variables:

| Variable | Description |
|---|---|
| `PORT` | Server port |
| `DB_URL` | Cloud database JDBC URL |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Secure JWT signing key |
| `JWT_EXPIRATION` | JWT expiration time |
| `SWAGGER_ENABLED` | Enable or disable Swagger |
| `SHOW_SQL` | Enable or disable SQL logging |

The application is configured to support deployment on cloud hosting platforms such as Render.

## 🔒 Security

- JWT-based authentication.
- Spring Security integration.
- Protected API endpoints.
- User-specific task ownership.
- Environment-based secret management.

## 👨‍💻 Author

**Chaitanya Shinde**

GitHub: [Chaitanya6935](https://github.com/Chaitanya6935)

---

⭐ If you find this project useful, consider giving it a star!