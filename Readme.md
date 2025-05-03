# 🏫 School Management System

This is a full-stack web application built using **Django (backend)** and **React (frontend)**. It allows students, teachers, and the headmaster to interact through feedback and instructions with proper role-based access.

---

## 🔧 Tech Stack

* **Frontend:** React, Tailwind CSS
* **Backend:** Django, Django REST Framework
* **Authentication:** JWT Token (access stored in localStorage)

---

## 📦 Features

### 🔐 Authentication

* User registration and login with token generation
* Profiles: `Student`, `Teacher`, `Headmaster`
* Role-based navbar and dashboard

### 🧑‍🎓 Student

* Can post feedback to teachers and headmaster
* Can view instructions given by teachers

### 👩‍🏫 Teacher

* Can post instructions to students
* Can only view student feedback

### 🧑‍🏫 Headmaster

* Can post instructions
* Can see both feedback and instructions

### 🧠 Admin Panel

* View all users, feedback, and instructions
* Manage permissions

---

## 🖥️ Frontend Setup

1. Clone the repo

   ```bash
   git clone https://github.com/Yash7776/School
   cd School/frontend
   ```
