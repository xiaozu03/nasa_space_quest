# nasa_space_quest
Crews onboard the International Space Station have many unique opportunities! They witness breathtaking Earth views from the station’s cupola—known as “the window to the world...” 

# NASA Astronaut Journey

An immersive web-based astronaut training experience that simulates key aspects of space mission operations through interactive missions and 3D visualizations.

![NASA Astronaut Training](https://img.shields.io/badge/NASA-Astronaut%20Training-blue?style=for-the-badge&logo=nasa)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?style=for-the-badge&logo=vite)

## 🚀 Overview

NASA Astronaut Journey is an educational web application that provides users with an interactive astronaut training experience. The application features three main missions that simulate real astronaut training scenarios, complete with physics-based movement, mission objectives, and educational content about space exploration.

## ✨ Features

### 🎯 Interactive Missions
- **Mission 1: Neutral Buoyancy Lab Training** - Underwater training simulation with bubble effects and hatch operations
- **Mission 2: Microgravity Handling** - Zero-gravity tool manipulation and repair operations
- **Mission 3: Cupola Earth Observation** - Climate change observation from the International Space Station

### 🎮 Immersive Experience
- **Physics-based movement** with realistic underwater and zero-gravity physics
- **Interactive 3D models** of spacecraft, equipment, and celestial bodies
- **Sound effects** for thrusters, tool operations, and mission feedback
- **Visual effects** including bubble particles, motion trails, and environmental animations

### 📚 Educational Content
- **Mission insights** with real NASA facts and space exploration knowledge
- **Interactive learning** through hands-on mission completion
- **Certificate generation** upon completing all training missions

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.2 with Hooks
- **Build Tool**: Vite 7.1
- **3D Graphics**: WebGL with custom Canvas rendering
- **Styling**: Inline CSS with responsive design
- **Audio**: Web Audio API for sound effects

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/astronaut-journey.git
   cd astronaut-journey
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173/`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 🎮 How to Play

### Mission 1: NBL Training
- **Objective**: Complete hatch operations and equipment repairs
- **Controls**: Arrow keys or WASD for movement
- **Features**: Underwater physics, bubble effects, and hatch operation simulations

### Mission 2: Microgravity Handling
- **Objective**: Stabilize floating tools in repair zones
- **Controls**: Mouse drag for tool manipulation
- **Features**: Zero-gravity physics, tool stabilization challenges

### Mission 3: Cupola Observation
- **Objective**: Observe Earth and identify climate change indicators
- **Features**: Interactive Earth model, observation point collection

## 📁 Project Structure

```
astronaut-journey/
├── public/                 # Static assets
│   ├── *.glb              # 3D models
│   ├── *.mp3              # Sound effects
│   ├── *.svg              # Vector images
│   └── *.jpg/.png         # Textures and backgrounds
├── src/
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   ├── index.css          # Global styles
│   └── assets/            # Application assets
└── vite.config.js         # Vite configuration
```

## 🎨 Customization

### Adding New Missions
1. Create a new mission function in `App.jsx` following the existing pattern
2. Add mission-specific physics, graphics, and interaction logic
3. Update the mission selection UI

### Modifying Visual Effects
- **Bubble particles**: Adjust parameters in the `physTick` function
- **Movement physics**: Modify constants in mission-specific physics functions
- **3D models**: Replace GLB files in the `public/` directory

### Adding Sound Effects
1. Add audio files to `public/` directory
2. Reference them in mission components using `useRef` and `Audio` objects

## 🌟 Educational Value

This project demonstrates:
- Real astronaut training procedures
- Physics of microgravity and neutral buoyancy
- International Space Station operations
- Climate change observation from space
- Problem-solving in constrained environments

## 🤝 Contributing

We welcome contributions to enhance the educational experience:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is for educational purposes. NASA branding and imagery are used under fair use for educational demonstration.

## 🙏 Acknowledgments

- NASA for inspiration and educational content
- React and Vite communities for excellent development tools
- 3D model creators for the space assets

## 📞 Support

For questions or support:
- Open an issue on GitHub
- Check the documentation in the code comments
- Review existing mission implementations for reference

---

**Experience space exploration from your browser!** 🚀✨

*This project is an educational demonstration and is not affiliated with NASA.*
