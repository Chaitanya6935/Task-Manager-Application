# Personal Task Manager API

A robust Spring Boot REST API for personal task management, featuring JWT authentication, strict task ownership, and advanced filtering.

## 📋 Features

- **Authentication:** User registration and login using JWT (JSON Web Tokens).
- **Task Management:** Full CRUD operations for tasks.
- **Ownership Security:** Users can only view, update, or delete their own tasks.
- **Advanced Querying:** Pagination, sorting, filtering (by status/priority), and title search.
- **Validation & Error Handling:** Comprehensive Jakarta Bean Validation and a global exception handler for consistent JSON error responses.
- **Documentation:** Interactive Swagger/OpenAPI UI.

## 🛠️ Technology Stack

- **Java 17**
- **Spring Boot 4.1.1**
- **Spring Security + JWT** (jjwt)
- **Spring Data JPA + Hibernate**
- **MySQL** (Development)
- **H2 Database** (Testing)
- **Maven**
- **Lombok**
- **Docker & Docker Compose** (Containerization)

## 🚀 Getting Started (Local Development)

### Prerequisites
- JDK 17+
- Maven
- MySQL (running locally on port 3306)

### 1. Database Setup
Create a database named `TMA` in your local MySQL instance.
```sql
CREATE DATABASE TMA;