# Boids Simulation

A simple interactive Boids simulation in JavaScript. Boids are artificial life programs, developed by Craig Reynolds, that simulate the flocking behavior of birds.

## Features
- Real-time, interactive boid simulation in the browser
- Adjustable parameters (separation, alignment, cohesion, speed, etc.) via sliders
- Click to add new boids
- Responsive canvas

## Demo
Open `public/index.html` in your browser to run the simulation locally.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (for dependency management, if needed)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/samromeu/boids.git
   cd boids
   ```
2. (Optional) Install dependencies if you want to use a local server:
   ```sh
   npm install
   ```

## Usage

### Run Locally
You can simply open `public/index.html` in your web browser.

Or, to serve with a local server (recommended for some browser security policies):
```sh
npx serve public
```
Or use any static server of your choice.

### Controls
- **Click** on the canvas to add a new boid at the mouse position.
- Use the sliders to adjust flocking parameters in real time.
- Press the "Reset" button to restore default parameters.

## Project Structure
```
public/
  ├── boids.js        # Main simulation logic
  └── index.html      # Main HTML file
main.js               # (Optional) Node.js entry point
package.json          # Project metadata and dependencies
```

## License
MIT 