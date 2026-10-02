# 🎵 STREAMIFY – Music Streaming & Collaborative Social Platform

A modern full-stack music streaming platform built with **React**, **TypeScript**, **Tailwind CSS**, **Node.js**, **Express.js**, **MongoDB**, **Socket.IO**, and **Clerk**.

---

## 🌟 Pitch Highlights

- **Secure Authentication**: Integrated with Clerk for seamless authentication, session management, and role-based access control (`admin` / `user`).
- **RESTful API Architecture**: Modular, high-throughput Express.js backend for catalog streaming, playlist CRUD, analytics, and play tracking.
- **Real-Time Collaborative Listening**: WebSockets powered by Socket.IO for live room chat, online listener presence, and instant listening party sync (`Listen Along`).
- **Responsive UI / UX**: Modern dark-mode interface built with React 19, TypeScript, Lucide Icons, glassmorphism, and Tailwind CSS design tokens.
- **Production MongoDB Persistence**: No mock data — real Mongoose schemas for songs, albums, playlists, users, and chat messages.
- **Audio Streaming Engine**: Zero-download web streaming with persistent playback, time scrubbing, volume/mute control, shuffle, repeat, and animated equalizer waves.

---

## 🛠️ Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, Zustand, Axios, Socket.IO Client, Clerk |
| **Backend** | Node.js, Express.js (ES Modules), Socket.IO, Mongoose, MongoDB, express-fileupload, Cloudinary SDK |
| **Database** | MongoDB Community Server / MongoDB Atlas |

---

## 🏗️ Architecture & Core Modules

### 🎧 Audio Streaming & Player Bar
- Fixed bottom player that persists across all routes without re-rendering or audio interruptions.
- Smooth seeking, duration formatting, volume with instant mute, and animated equalizer bars.
- Automatically increments song play metrics in MongoDB upon streaming.

### 👥 Collaborative Listening Room (Socket.IO)
- Real-time room chat with live online listeners counter.
- One-click track sharing with embedded playable track cards directly inside the chat feed.
- "Sync Track" listening party: any user can broadcast their current playback, allowing friends to "Listen Along" in unison.

### 📚 Custom Playlists & Library
- Create, edit, and delete custom playlists with descriptions.
- Quick-add any song to existing playlists via modal.
- Play whole playlists with automated queue management.

### 🛡️ Curator & Admin Portal
- Real-time MongoDB metrics: Total Songs, Total Albums, Registered Listeners, Total Platform Streams.
- Publish and upload songs with title, artist, genre, duration, and audio/cover files or web URLs.
- Delete and manage catalog tracks in real time.
- Instant role switcher in the sidebar to test both Admin and Listener modes.

---

## 📡 RESTful API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/songs` | Retrieve catalog tracks |
| `GET` | `/api/songs/featured` | Retrieve 6 randomized featured tracks |
| `GET` | `/api/songs/made-for-you` | Retrieve 4 curated recommendation tracks |
| `GET` | `/api/songs/trending` | Retrieve top played tracks |
| `GET` | `/api/songs/search?q=:query` | Search tracks by title, artist, or genre |
| `POST` | `/api/songs/:id/play` | Increment play count in MongoDB |
| `GET` | `/api/albums` | Retrieve all albums with populated tracks |
| `GET` | `/api/albums/:albumId` | Get album details with populated song tracks |
| `GET` | `/api/playlists/user` | Retrieve user-owned and public playlists |
| `GET` | `/api/playlists/:id` | Get single playlist with track list |
| `POST` | `/api/playlists` | Create a new custom playlist |
| `POST` | `/api/playlists/add-song` | Add track to playlist |
| `DELETE` | `/api/playlists/:id/songs/:songId` | Remove track from playlist |
| `DELETE` | `/api/playlists/:id` | Delete playlist |
| `GET` | `/api/users/messages/:receiverId` | Retrieve real chat message history from MongoDB |
| `GET` | `/api/stats` | Aggregated platform telemetry from MongoDB |
| `POST` | `/api/admin/songs` | Publish and upload new track |
| `DELETE` | `/api/admin/songs/:id` | Remove song from catalog |

---

## ⚡ Socket.IO Event Engine

| Event | Direction | Purpose |
|---|---|---|
| `get_online_users` | Server -> Client | Broadcast active online user count & IDs |
| `send_message` | Client -> Server | Send room chat message with optional track attachment |
| `receive_message` | Server -> Client | Broadcast message in real time to connected listeners |
| `party_sync_track` | Client -> Server | Host broadcasts currently playing song to the lounge |
| `party_sync_received` | Server -> Client | Prompts all listeners with 1-click "Listen Along" sync |

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Seed Database
```bash
npm --prefix backend run seed
```

### 3. Start Both Servers Concurrently
```bash
npm run dev
```

Open your browser at:
👉 **`http://localhost:5173`** (API at `http://localhost:5000`)

### 4. Build for Production
```bash
npm run build:frontend
```

---

## 📄 License
MIT License. Built for full-stack excellence.
