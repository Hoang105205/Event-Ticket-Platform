# Event Ticket Platform

A modern web app for browsing events and managing ticket purchases. The goal is to provide a clean attendee experience and a simple organizer workflow (events, ticket types, and basic reservations).

---

## ✨ Value Proposition

- **Simple & fast** ticket discovery and checkout.
- **Clear roles** for attendees and organizers.
- **Practical first:** focus on essential flows over heavy complexity.

## 🎯 Objectives

- Enable users to **find events and get tickets** with minimal steps.
- Provide a foundation for **organizer operations** (creating events, ticket categories) as the project evolves.

---

## 🧱 Tech Stack

**Frontend:** React + TypeScript (Vite)  
**Backend:** Java (Spring Boot)  
**Deployment:** Vercel (frontend) · Railway (backend) · Render (serverless database)  · Phase Two (KeyCloak server)  
**Auth:** Keycloak (OIDC)  
**Database:** PostgreSQL

---

## 📦 Features (Current & Planned)

### 🔐 Authentication (Keycloak)

- **Tokens:** ID Token (identity), Access Token (API), Refresh Token (renewal)
- **Session handling:** refresh rotation, token expiry handling, logout (token revocation)
- **Roles:** `attendee`, `organizer`, `staff`, `administrator` (managed in Keycloak; mapped to Spring Security authorities)
- **Security enforcement:** Spring Security (resource server) validates JWT; per-endpoint role limits
- **Account flows (via Keycloak):** hosted login, optional email verification, forgot password

### 🧭 User Flows (Brief)

**Attendee**
- Discover events (location/name filters) → view event detail → choose ticket type → checkout → receive order confirmation → access **e-tickets** with **QR code** in “My Tickets.
- Manage: cancel tickets; request refund/transfer *(planned)*.

**Organizer**
- Create event (metadata, schedule, venue) → define **ticket types** (price, quantity) → publish/draft event → adjust details.
- Advanced: promo codes, time-based pricing *(planned)*.

**Staff**
- Open **Check-in** tool → scan QR via camera → status → mark as used / reject (duplicate/expired/invalid).
- Resilience: offline queue & later sync *(planned)*; manual lookup by code.

**Administrator**
- View platform statistics (events, attendees) → manage users.
- Governance: audit logs, abuse/risk controls *(planned)*.
---

## 🧩 Additional Techniques

- **Tokens & Security:** JWT **access** and **refresh** tokens issued by **Keycloak** and enforced by **Spring Security**.  
- **Separation of concerns:** DTOs on the **server** and **TypeScript domain models** on the client to improve clarity, maintainability, and evolution of the API contract.
- **DTO ↔ Domain mapping (MapStruct)** to keep controllers slim and domain clean.
- **Pagination/Sorting/Filtering** conventions (`page`, `size`, `sort`, `q`).  
- **Role-based access control:** Per-endpoint **role limits** using **Spring Security** (RBAC) to restrict organizer/admin features.

---

## 🎬 Live Demo

**Preview:** https://event-ticket-platform.vercel.app/

---


