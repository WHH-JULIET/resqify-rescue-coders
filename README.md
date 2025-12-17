# 🛡️ ResQify — Personal Safety App  
**Mobile-First | Real-Time Protection | Intelligent Emergency Response**

ResQify is a mobile-first personal safety application built to deliver **instant emergency assistance**, **live location tracking**, and **trusted contact coordination**, with a strong focus on **women and minors**.

Unlike typical safety apps, ResQify prioritizes **clarity, reliability, and immediate action** — ensuring safety features are never hidden behind confusing UI.

---

## 📱 Project Overview

| Attribute | Details |
|--------|--------|
| App Type | Personal Safety Application |
| Target Users | Women, Minors, Trusted Contacts |
| Core Focus | SOS, Live Tracking, Smart Permissions |
| UI Principle | Zero Confusion During Emergencies |
| License | MIT |

---

## 🌟 Core Features

| Feature | Description |
|------|-------------|
| 📱 Mobile-First | Designed exclusively for mobile devices |
| 🎨 Aura UI | Subtle character-based light aura background |
| 🚨 One-Tap SOS | Instant emergency activation |
| 🗺️ Live Maps | Real-time location with dynamic filters |
| 🔐 Smart Permissions | Enabled only when required |
| 👩‍👧 Minor Safety | Locked, non-negotiable protection rules |

---

## 🎨 Global UI Rules

| Rule | Behavior |
|----|---------|
| Aura Background | Light aura rays on every screen |
| Theme-Based | Aura color adapts to selected character |
| Touch Safe | Background never blocks interactions |
| Scroll Safe | All pages fully scrollable |
| Button Safety | No hidden action buttons |

✅ **All action buttons are always visible and clickable**

---

## 🗺️ Maps & Navigation

Powered by **Google Maps API** using `@vis.gl/react-google-maps`.

### 🔍 Map Filters

| Filter | Behavior |
|-----|----------|
| 🚓 Police | Nearby police stations |
| 🏥 Hospitals | Nearby hospitals |
| 🛟 Safe Zones | User-defined safe places |
| 👥 Best Friends | Live moving friend locations |

### 📍 Marker Interaction

When a marker is tapped:

| Info | Action |
|----|--------|
| Place Name | 📞 Call |
| Type | 🧭 Navigate |
| Distance | Displayed |

---

## 👥 Best Friend Mode (Critical Feature)

A **single toggle** that controls the entire safety system.

| State | Behavior |
|----|---------|
| 🔴 OFF | Permissions inactive |
| 🟢 ON | All required permissions enabled |
| 📍 Live Tracking | Continuous real-time location |
| 🧭 Map | Moving friend icon visible |

❗ No duplicated switches. No confusion.

---

## 🔐 Permissions System

Permissions are **never always-on** and activate only when required.

| Permission | Default | Activated When |
|---------|--------|----------------|
| 🔔 Notifications | OFF | SOS / Best Friend Mode |
| 📞 Calls | OFF | SOS / Best Friend Mode |
| 📍 Location | OFF | SOS / Best Friend Mode |
| 🎤 Audio | OFF | SOS |
| 🎥 Video | OFF | SOS |

---

## 🧒 Minor Safety Rule (STRICT)

**Condition**
``ts
isMinor === true &&
relationship === "Mother"


**Enforced Behavior**

| Rule | Status |
|----|--------|
| Best Friend Mode | 🟢 Always ON |
| Toggle | 🔒 Locked |
| Permissions | ✅ Enabled |
| Live Location | 📍 Always ON |
| Disable Allowed | ❌ Until age ≥ 18 |

This ensures **uninterrupted safety for minors**.

---

## ⚙️ Settings Architecture

| Feature | Placement |
|------|----------|
| Best Friend Mode | Settings (Main) |
| Permissions | Settings (Main) |
| Auto SOS | Separate Section |
| Safety Check-ins | Separate Section |

❌ No duplicated toggles  
❌ No confusing nested menus  

---

## 🚨 SOS & Emergency Flow

| Step | Behavior |
|----|---------|
| SOS Triggered | Permissions enabled instantly |
| Live Location | Starts immediately |
| Trusted Contacts | Notified |
| Audio / Video | Activated if enabled |

⚡ Designed for **zero-delay response**

---

## 🧱 Tech Stack

| Technology | Purpose |
|--------|--------|
| ⚡ Vite | Fast build & development |
| ⚛️ React + TypeScript | Application logic |
| 🎨 Tailwind CSS | Styling |
| 🧩 shadcn/ui | UI components |
| 🗺️ Google Maps API | Location services |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Run Locally

```bash
npm install
npm run dev


Runs with hot reload and mobile-friendly preview.

🌐 Deployment
Method	Action
Lovable	Share → Publish
Custom Domain	Project → Settings → Domains
🧠 Design Philosophy

“Safety should never be hidden behind bad UI.”

ResQify prioritizes:

Visibility

Reliability

Real-world logic

Zero UI confusion during emergencies
