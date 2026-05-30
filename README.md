# 🏨 Hotel Room Reservation System

A smart, web-based hotel room reservation system designed to optimize room allocation and minimize travel time for guests. Built as a technical assessment for the Software Development Engineer role.

## 🚀 Live Demo

[**View Live Application Here**](https://HemachandRavulapalli.github.io/hotel-reservation/) 
*(Note: Link will be active once GitHub Pages deployment completes)*

## 📖 Problem Statement

A hotel has 97 rooms distributed across 10 floors (Floors 1-9 have 10 rooms each, Floor 10 has 7). The building features a lift/staircase on the left side. Travel times are defined as:
- **Horizontal travel**: 1 minute between adjacent rooms on the same floor.
- **Vertical travel**: 2 minutes per floor.

Guests can book up to 5 rooms at a time. The system must allocate rooms according to these priorities:
1. **Same Floor**: Priority is to keep all rooms on the same floor, minimizing the horizontal travel time between the first and last room.
2. **Multi-Floor Span**: If a single floor cannot accommodate the request, the system must allocate rooms across multiple floors to minimize the combined horizontal and vertical travel time.

## ✨ Features

- **Smart Allocation Algorithm**: Uses Dynamic Programming (DP) to find the absolute most efficient path (minimum travel time) when bookings span multiple floors, and sliding window for single-floor optimizations.
- **Dynamic Visualization**: Real-time visual representation of the 10-floor hotel grid.
- **Random Occupancy Generator**: Simulates a busy hotel by randomly occupying ~60% of the rooms, perfect for testing edge cases in the allocation algorithm.
- **Rich Aesthetics**: Modern, responsive UI with glassmorphism, dark mode styling, and smooth micro-animations.

## 🛠️ Technology Stack

This project was built deliberately with zero external dependencies to ensure maximum performance and zero overhead.
- **HTML5** for semantic structure
- **CSS3** (Vanilla) for advanced grid layouts and premium glassmorphic styling
- **JavaScript (ES6+)** for the complex booking algorithm and DOM manipulation

## 🧠 Algorithm Overview

To calculate the "Total Travel Time", the algorithm treats the hotel as a directed acyclic graph (DAG) where rooms are nodes.
- **Single-Floor Logic**: If enough contiguous rooms are available on one floor, the travel time is simply the index difference `(Max_Index - Min_Index)`.
- **Multi-Floor Fallback**: If spanning floors is necessary, the system executes a Dynamic Programming (DP) shortest-path algorithm across all available rooms. It calculates distances considering the path to the lift `(Index_A)`, the lift travel `(|Floor_A - Floor_B| * 2)`, and the path to the next room `(Index_B)`.

## 💻 How to Run Locally

Since this is a vanilla frontend application, no build steps or servers are required!

1. Clone this repository:
   ```bash
   git clone https://github.com/HemachandRavulapalli/hotel-reservation.git
   ```
2. Open the folder and double-click `index.html` to run it in any modern web browser.
