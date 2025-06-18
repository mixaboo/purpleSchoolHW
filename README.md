# Purple School Practice Project

This is a project for practice with purpleSchool.  
In the end, it will be a simple AirBnb-like service.

---

## The first task (01/07/2025)

✅ 1. Create a project using NestJS  
✅ 2. Create a Schedule module with infrastructure, basic service and controller  
✅ 3. Create a Room module with infrastructure, basic service and controller  
✅ 4. Push it to personal GitLab  

---

## The second task (04/07/2025)

✅ 1. Connect MongoDB to my project  
✅ 2. Create CRUD operations for Schedule and Room modules with some restrictions:  
   ✅ — You cannot create more than one reservation for one room on the same day  
   ✅ — For simplicity of booking, use only date without time  
   ✅ — The room entry has data: number, type, view from the window, soft-delete field  
   ✅ — The schedule entry has data: roomId, date, status of booking  

---

## The third task (05/07/2025)

✅ 1. Make e2e-tests for all CRUD operations in two modules  
✅ 2. Tests should be positive and failure  

---

## The fourth task (08/07/2025)

✅ 1. Add class-transformer and class-validator to the project, activate validation in controllers  
✅ 2. Add validation to all DTOs files  
✅ 3. Remake tests with custom messages  
✅ 4. Add more tests for checking validation  

---

## The fifth task (12/07/2025)

✅ 1. Create a new module Users (data: email, password, name, phone, role (admin/user))  
✅ 2. Create a new module Auth (method login, register)  
✅ 3. Add JWT authorization: with guards, strategy.  
✅ 4. Some methods are available only for admins, some only for users. DOC: https://docs.nestjs.com/security/authorization  

---

## The sixth task (16/07/2025)

✅ 1. Create a method with a report from MongoDB: how much reservation has every room in a chosen month

---
