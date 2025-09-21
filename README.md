# Coding-Challenge---CSV-to-JSON-convertor-API

A simple Express.js API that lets users upload CSV files, stores the data in PostgreSQL, and provides the age distribution percentage on the console.
---
## Features

- Upload CSV file via HTML form
- Convert CSV rows to JSON and store in PostgreSQL
- Automatically creates `users` table if it doesn't exist
- Calculates age group distribution percentages
- Easy configuration with `.env` file

---

## Project Structure
new-project/
├── app.js 
├── dbconnection.js 
├── index.html
├── utils.js
├── uploads/
├── .env.example
├── package.json
├── package-lock.json
└── node_modules/
---

## Setup Instructions

1. **Clone the repository**

```bash
https://github.com/swaroop1512/Coding-Challenge---CSV-to-JSON-convertor-API.git
cd Coding-Challenge---CSV-to-JSON-convertor-API
```
2. **Install Dependencies**
   
```bash
npm install
```
  
3. **Configure environment variables**
   Copy .env.example to .env:
```bash
cp .env.example .env
```

  Edit .env with your PostgreSQL credentials:
  
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=mydb
    PORT=3000
    
4. **Run server**
```bash
npm start
```
5. **Open the following page and upload your csv file
```bash
http://localhost:3000
```
