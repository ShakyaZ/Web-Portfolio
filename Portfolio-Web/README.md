# Immersive 3D Portfolio

A high-performance, portfolio designed for cybersecurity professionals. This project features a sophisticated user experience driven by immersive 3D backgrounds, fluid scroll-linked animations, and a professional "boot-sequence" entry.

## 🚀 Features

### **1. Cinematic 3D Environment**
- **Dynamic Background:** A custom Three.js grid system with shifting perspectives and orbital rings.
- **Architectural Shield:** A central 3D shield component that acts as a visual anchor throughout the entire experience.
- **Interactive Parallax:** Real-time mouse-tracking tilt effects that add physical depth to the hero content.

### **2. Advanced Scroll-Linked Animations**
- **Liquid Glide:** Powered by GSAP and ScrollTrigger with high-inertia "scrub" (5.0) for an ultra-smooth, weighted feel.
- **Diagonal Spatial Flow:** The shield travels along complex diagonal paths across 8 distinct sections, moving behind and in front of content dynamically.
- **Adaptive Z-Indexing:** Intelligent layering that allows the 3D visual to switch between being a background element and a foreground focal point (e.g., in the About section).

### **3. Optimized Entry Experience**
- **Transparent Boot Loader:** A minimalist initialization sequence that reveals the 3D scene while loading assets.
- **Synchronized Reveal:** A slow, 3.5-second cinematic glide that transitions the shield from the center of the screen to its hero position.
- **Staggered Content Entry:** Call-to-action buttons, names, and titles slide in gracefully after the background is fully initialized.

### **4. Universal Compatibility**
- **Fully Responsive:** Custom animation paths for Mobile, Tablet, and Desktop using `gsap.matchMedia`.
- **Performance Focused:** Uses hardware-accelerated transforms (`force3D`, `will-change`) to ensure smooth 60FPS performance even during rapid scrolling.
- **Scroll Lock:** Prevents user navigation during the intro sequence for a perfectly controlled narrative reveal.

## 🛠️ Tech Stack

- **Core:** HTML5, Vanilla CSS3, Modern JavaScript (ES6+)
- **3D Engine:** [Three.js](https://threejs.org/) (r134)
- **Animation Suite:** [GSAP](https://greensock.com/gsap/) (ScrollTrigger, MatchMedia)
- **Fonts:** Inter, Roboto Mono (Google Fonts)

## 📂 Project Structure

```text
├── CSS/
│   ├── style.css    # Core design system & layout
│   └── boot.css     # Intro sequence styling
├── JS/
│   ├── three-bg.js  # Three.js scene & orbit logic
│   ├── script.js    # Master GSAP timeline & scroll logic
│   └── boot.js      # Intro sequence controller
└── index.html       # Main entry point
```

## 🔧 Installation & Usage

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/portfolio-web.git
   ```
2. **Open `index.html`:**
   Simply open the file in any modern web browser. No build steps or local servers are strictly required, though a local server (like VS Code Live Server) is recommended for the best experience.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with focus on high-end UI/UX and 3D performance.**
