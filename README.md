# 🧭 GPS Map navigation for games with editor and SA-MP integration

An interactive web-based navigation editor for **San Andreas Multiplayer (SA-MP)**. Designed for precise path editing with support for map overlays, draggable nodes, Bezier curves, and live JSON output — ready to be processed by a Java backend or exported to SA-MP's Pawn scripting language. Including REST API Java server for data processing and pathfinding and PAWN filterscript for SA-MP server integration.

---

## 🚀 Stack Overview

- 🧩 Frontend: TypeScript + HTML5 Canvas + Vite
- ☕ Backend (Planned): Java API for processing and pathfinding
- 🔧 Export Target: SA-MP navigation in Pawn
- 📦 Build Tool: `npx vite`

---

## ✨ Map editor features

- 🖼️ Load or preload map images
- ➕ Add nodes with `CTRL + Click`
- ✋ Move nodes using `SHIFT + Drag`
- 🎯 Define reference points
- 📐 Bezier curve edge support
- 🔍 Zoom and pan
- ⚙️ Live JSON output
- 🧭 Designed specifically for SA-MP
- 🛠️ Support for Java-based export API and Pawn path generation
- 👥 Contributor tracking (AGPLv3)
- 🧑‍💻 Free to use under AGPLv3 (must share code in production use)
# Installation

## Prerequisities

#### For editor

* Node JS

#### For API server

* Java 21
* Maven 3.8.7

#### For SAMP server

* SA-MP Server 0.3.7

## Running editor

- Navigate to `/path_editor` folder
- `npm install` to install dependencies
- `npx vite` to run local development
- go to [localhost:5173](localhost:5173)

## Roadmap

- Finish editor (50% done)
- Build API (Path finding, JSON map data consumer)
- Create filterscript in PAWN for SA-MP server


## License

[AGPL-3.0](https://choosealicense.com/licenses/agpl-3.0/)

