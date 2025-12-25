import { BookOpen, Sliders, Monitor, BarChart3, Zap, Keyboard, Atom, Shield, Globe, Database, Play, Download, Share2, Settings, Target, Activity, CheckCircle, AlertTriangle, Table, FileText, TrendingUp, Image } from 'lucide-react';

export const documentationData = {
    "getting-started": {
        title: "Getting Started",
        icon: BookOpen,
        image: "/images/docs/simulator_full.png",
        content: [
            {
                type: "text",
                heading: "Welcome to the Time Dilation Particle Simulator",
                body: "Welcome to the Time Dilation Particle Simulator, a cutting-edge web-based physics simulation tool designed to demonstrate one of the most profound predictions of Einstein's Special Theory of Relativity: time dilation. This simulator allows you to visualize and quantify how time literally slows down for particles traveling at speeds approaching the speed of light. Whether you are a student, educator, or physics enthusiast, this tool provides an interactive and intuitive way to explore relativistic physics concepts that would normally require access to a particle accelerator facility."
            },
            {
                type: "alert",
                variant: "info",
                title: "Educational Purpose",
                body: "This simulator was developed as part of the CERN Beamline for Schools (BL4S) 2025 competition proposal. It serves as both a proof-of-concept for our proposed experiment and as an educational tool for high school and undergraduate students studying Special Relativity."
            },
            {
                type: "text",
                heading: "Understanding the Core Physics",
                body: "At the heart of this simulator lies Einstein's groundbreaking insight: time is not absolute. For an observer in the laboratory frame (that's you, watching the particles on screen), a clock moving at high speed appears to tick more slowly than a stationary clock. This effect becomes dramatic at relativistic speeds—velocities exceeding 90% of the speed of light. The mathematical relationship governing this phenomenon is expressed through the Lorentz factor (γ), which tells us exactly how much time slows down for a moving object."
            },
            {
                type: "math",
                heading: "The Lorentz Factor",
                code: "\\gamma = \\frac{1}{\\sqrt{1 - \\beta^2}}"
            },
            {
                type: "text",
                body: "Where β (beta) represents the ratio of the particle's velocity to the speed of light (v/c). When a particle travels at 99% of c, its Lorentz factor γ ≈ 7.09, meaning time passes roughly 7 times slower for that particle compared to the laboratory. At 99.9% of c, γ ≈ 22.4. The simulator calculates these values in real-time based on your configured momentum."
            },
            {
                type: "steps",
                heading: "Quick Start Guide",
                items: [
                    { title: "1. Select Your Particle", desc: "Choose between Pion (π⁺), Kaon (K⁺), or Muon (μ⁺) from the Particle section. Each has different mass and lifetime properties that dramatically affect the results. Pions are the lightest and most commonly used in time dilation experiments." },
                    { title: "2. Configure Beam Momentum", desc: "Use the Momentum slider to set the kinetic energy of your beam, measured in GeV/c (Giga-electron-volts per speed of light). Higher momentum means faster particles, higher γ, and more observable time dilation. The standard T9 beamline at CERN operates at 1-15 GeV/c." },
                    { title: "3. Set Beam Intensity", desc: "Adjust the Intensity slider to control how many particles are simulated per run. More particles (10,000+) give statistically meaningful results with smaller error bars, but simulations take longer. Start with 1,000 for quick exploration." },
                    { title: "4. Adjust Beamline Length", desc: "Use the Beamline Length slider to set the distance over which you're tracking particle survival. Longer beamlines allow more particles to decay, making the time dilation effect easier to observe. The T9 beamline at CERN is approximately 15 meters." },
                    { title: "5. Configure Detectors", desc: "Toggle the Scintillator, Cherenkov, and TOF End detectors to simulate real experimental apparatus. Each detector type serves a different purpose in particle identification and timing measurements." },
                    { title: "6. Run the Simulation", desc: "Click the blue 'Run Simulation' button (or press Spacebar) to start. Watch the 3D visualization as particles traverse the beamline. Some will decay into daughter particles (visible as red flashes), while others survive to the end." },
                    { title: "7. Analyze Results", desc: "After the simulation completes, click 'View Results' to open the Results Modal. Compare your simulated survival rate against the theoretical prediction. If time dilation is real, they should match closely!" }
                ]
            },
            {
                type: "text",
                heading: "What You Will Learn",
                body: "By using this simulator, you will gain hands-on understanding of: (1) How particle momentum relates to velocity and the Lorentz factor. (2) Why unstable particles appear to live longer when moving at high speeds. (3) How exponential decay works and what 'decay length' means physically. (4) How real particle physics experiments are designed and analyzed. (5) The statistical nature of quantum mechanical decay processes."
            },
            {
                type: "alert",
                variant: "tip",
                title: "Pro Tip: Compare Particles",
                body: "Try running simulations with the same momentum but different particle types. Notice how Kaons (heavier, shorter τ) have lower survival rates than Pions at the same momentum. This beautifully demonstrates how proper lifetime affects observable decay rates even when relativistic effects are identical."
            }
        ]
    },
    "control-panel": {
        title: "Control Panel Reference",
        icon: Sliders,
        image: "/images/docs/simulator_full.png",
        content: [
            {
                type: "text",
                heading: "Control Panel Overview",
                body: "The Control Panel is your command center for configuring every aspect of the particle simulation. Located on the right side of the simulator interface, it provides intuitive controls organized into collapsible sections. Each section contains related parameters that affect the physics simulation, 3D visualization, or experimental apparatus configuration. This reference guide documents every control in exhaustive detail."
            },
            {
                type: "text",
                heading: "Header Section",
                body: "At the top of the Control Panel, you'll find the header displaying 'Experiment Setup' with a brief description. The header includes a gradient background in CERN blue colors (#0033A0 to #3498DB) that visually indicates you're in the configuration mode. Below the title is the 'Open Full Control Center' button, which opens a comprehensive modal with additional advanced settings not shown in the sidebar."
            },
            {
                type: "grid",
                heading: "Active Configuration Display",
                items: [
                    { title: "Particle Indicator", desc: "Shows the currently selected particle with its symbol (π⁺, K⁺, μ⁺) and color. Provides quick visual confirmation of your choice.", icon: Atom },
                    { title: "Momentum & Length", desc: "Displays the current beam momentum (e.g., '8.0 GeV/c') and beamline length (e.g., '15m beamline') for quick reference.", icon: Zap },
                    { title: "β (Beta)", desc: "Real-time display of particle velocity as a fraction of c. Values close to 1.0000 indicate highly relativistic speeds.", icon: Activity },
                    { title: "γ (Gamma)", desc: "The Lorentz factor calculated from momentum. Higher values mean more time dilation. γ=56 means the particle's clock runs 56x slower.", icon: TrendingUp },
                    { title: "P(surv)", desc: "Expected survival probability based on current configuration. Green indicates >50% survival, red indicates <50%.", icon: CheckCircle }
                ]
            },
            {
                type: "text",
                heading: "Particle Selection Section",
                body: "The Particle section lets you choose between three particle species. Each particle chip displays the symbol, name, and selection state. Click any chip to switch particles. The physics engine automatically recalculates all derived quantities (β, γ, decay length) based on the particle's rest mass and proper lifetime."
            },
            {
                type: "table",
                heading: "Available Particle Species",
                columns: ["Particle", "Symbol", "Mass (MeV/c²)", "Proper Lifetime τ₀ (ns)", "Primary Decay Mode", "Typical Color"],
                rows: [
                    ["Charged Pion", "π⁺", "139.57", "26.03", "π⁺ → μ⁺ + νμ", "Blue/Purple"],
                    ["Charged Kaon", "K⁺", "493.68", "12.38", "K⁺ → μ⁺ + νμ or π⁺ + π⁰", "Green"],
                    ["Positive Muon", "μ⁺", "105.66", "2196.98", "μ⁺ → e⁺ + νe + ν̄μ", "Red/Orange"]
                ]
            },
            {
                type: "text",
                heading: "Beam Parameters Section",
                body: "The Beam Parameters section contains two critical sliders that control the kinematic properties of your particle beam."
            },
            {
                type: "list",
                items: [
                    { term: "Momentum Slider (0.5 - 15.0 GeV/c)", desc: "Controls the momentum of the beam particles. Higher momentum means higher velocity (closer to c), higher Lorentz factor γ, and more dramatic time dilation effects. The relationship is p = γmv, or equivalently, γ = √(1 + (p/mc)²). At 8 GeV/c with pions, γ ≈ 56, meaning the pion's internal clock runs 56x slower than laboratory time." },
                    { term: "Intensity Slider (100 - 50,000 particles)", desc: "Sets the number of particles simulated per run. Higher intensity provides better statistics (smaller error bars on survival curves) but increases computation time. For exploratory runs, use 1,000. For publication-quality results, use 10,000-50,000. The simulator uses Monte Carlo methods, so statistical fluctuations decrease as √N." }
                ]
            },
            {
                type: "alert",
                variant: "warning",
                title: "Performance Consideration",
                body: "Simulating 50,000 particles at once may cause performance slowdowns on older devices or mobile browsers. If the simulation feels sluggish, reduce intensity to 10,000. The 3D visualization is optimized, but JavaScript physics calculations are computationally intensive."
            },
            {
                type: "text",
                heading: "Beamline Section",
                body: "The Beamline section configures the physical apparatus along which particles travel."
            },
            {
                type: "list",
                items: [
                    { term: "Length Slider (5 - 100 m)", desc: "Sets the total length of the simulated beamline in meters. Longer beamlines give particles more time to decay, making survival statistics more dramatic. The T9 test beam at CERN is ~15m, but the simulator allows you to explore hypothetical longer beamlines. Decay probability follows P(decay) = 1 - exp(-L/(γβcτ₀))." },
                    { term: "TOF Start Detector", desc: "Always enabled (disabled toggle). This is the starting point of timing measurements, located at position 0m. Records the timestamp when each particle enters the beamline." },
                    { term: "Scintillator Detector", desc: "Toggleable plastic scintillator detector. Scintillators emit light when a charged particle passes through. Used for particle counting and triggering. Position is configurable in advanced settings." },
                    { term: "Cherenkov Detector", desc: "Toggleable Cherenkov radiation detector. Cherenkov detectors identify particle types based on the angle of light emission, which depends on particle velocity. Faster particles (higher β) produce wider Cherenkov cones." },
                    { term: "TOF End Detector", desc: "Toggleable Time-of-Flight endpoint detector. Combined with TOF Start, allows direct measurement of particle velocity by timing how long it takes to traverse the beamline. v = distance / time." }
                ]
            },
            {
                type: "text",
                heading: "Physics Section",
                body: "The Physics section contains toggles that control fundamental physics processes in the simulation."
            },
            {
                type: "list",
                items: [
                    { term: "Enable Decay Toggle", desc: "Master switch for particle decay physics. When ON (green), particles will spontaneously decay according to their proper lifetime τ₀ and Lorentz factor γ. When OFF (gray), particles are treated as stable and survival rate will be 100%. Turning decay off is useful for verifying that the simulation correctly propagates particles without decay." }
                ]
            },
            {
                type: "text",
                heading: "Footer Action Buttons",
                body: "The bottom of the Control Panel contains the primary action buttons for running simulations and exporting data."
            },
            {
                type: "grid",
                heading: "Action Buttons",
                items: [
                    { title: "Run Simulation", desc: "Primary button (Play icon). Starts Monte Carlo simulation with current settings. Keyboard shortcut: Spacebar. Button shows 'Running...' with spinning icon during execution.", icon: Play },
                    { title: "View Results", desc: "Appears after simulation completes (green border). Shows survival percentage. Click to open Results Modal with decay curves and statistics.", icon: BarChart3 },
                    { title: "CSV Export", desc: "Downloads simulation results as comma-separated values file. Includes event ID, momentum, β, γ, TOF, survival status, and decay position for each particle.", icon: Download },
                    { title: "JSON Export", desc: "Downloads simulation results as JSON file. Same data as CSV but in structured JavaScript Object Notation format for programmatic analysis.", icon: FileText },
                    { title: "Share", desc: "Generates a shareable link with your current configuration encoded in the URL parameters. Others can open the link to load your exact settings.", icon: Share2 }
                ]
            }
        ]
    },
    "3d-scene": {
        title: "3D Visualization Engine",
        icon: Monitor,
        image: "/images/docs/simulator_running.png",
        content: [
            {
                type: "text",
                heading: "Understanding the 3D Scene",
                body: "The 3D Visualization Engine is the heart of the simulator's user experience. Powered by Three.js WebGL rendering, it provides a real-time, interactive visualization of particle physics that would normally be invisible to the naked eye. The scene renders thousands of particle trajectories, decay events, detector elements, and measurement overlays in a scientifically accurate spatial representation of a beamline experiment."
            },
            {
                type: "text",
                heading: "Scene Layout",
                body: "The 3D scene is oriented with the beam propagation direction (positive Z-axis) moving from left to right. The beam originates at Z=0 (left side) and travels toward the detectors at the end of the beamline (right side). The floor grid represents 1m × 1m squares for spatial reference. The camera is initially positioned above and to the side of the beamline, providing an isometric-like view of the entire apparatus."
            },
            {
                type: "grid",
                heading: "Visual Elements in the Scene",
                items: [
                    { title: "Particle Beam", desc: "Lines streaming from left to right represent individual particle trajectories. Color matches selected particle (blue for pions, green for kaons, red for muons). Opacity indicates survival probability at that position.", icon: Zap },
                    { title: "Decay Vertices", desc: "Red flash points or small spheres indicate where a particle spontaneously decayed. In reality, the particle converts into daughter particles (e.g., π⁺ → μ⁺ + νμ). The simulator may show daughter trajectories at sharp angles.", icon: Atom },
                    { title: "Detector Planes", desc: "Semi-transparent rectangles perpendicular to the beam represent detector elements. Colors match detector type: blue (TOF), green (Scintillator), purple (Cherenkov). Labels appear on hover.", icon: Shield },
                    { title: "Beamline Tube", desc: "Faint cylindrical outline represents the vacuum beampipe. Particles travel inside this tube. Displayed to give spatial context and indicate beamline boundaries.", icon: Target },
                    { title: "Floor Grid", desc: "1m × 1m grid on the floor (Y=0 plane) provides scale reference. Useful for estimating decay positions and detector placements. Grid extends beyond beamline for context.", icon: Globe },
                    { title: "Axis Markers", desc: "Small colored arrows at origin indicate X (red), Y (green), Z (blue) axes. Z is beam direction, Y is vertical, X is transverse.", icon: Activity }
                ]
            },
            {
                type: "text",
                heading: "Camera Controls",
                body: "The camera can be freely manipulated using standard orbit controls. These controls allow you to inspect the beamline from any angle, zoom in on specific features, or get a bird's eye view of the entire experiment."
            },
            {
                type: "list",
                items: [
                    { term: "Orbit / Rotate", desc: "Left-click and drag to rotate the camera around the scene center (beamline midpoint). This is the primary way to change viewing angle. The camera maintains its distance from the center while you rotate." },
                    { term: "Pan / Move", desc: "Right-click and drag (or Shift + Left-click) to pan the camera laterally. This moves the entire view left/right/up/down without changing the viewing angle. Useful for focusing on specific detectors." },
                    { term: "Zoom In/Out", desc: "Scroll wheel (or pinch gesture on touchscreens) to zoom closer or further from the scene. Zooming happens toward/away from the camera's look-at point (scene center by default)." },
                    { term: "Reset View", desc: "Double-click anywhere in the 3D scene to reset the camera to the default viewing position. Useful if you've navigated to a strange angle and want to start over." }
                ]
            },
            {
                type: "text",
                heading: "Overlay Information Panels",
                body: "While the 3D scene renders particle physics, several overlay panels provide real-time numerical data. These panels are 'heads-up displays' (HUDs) positioned at fixed screen locations, providing context without obstructing the visualization."
            },
            {
                type: "list",
                items: [
                    { term: "Active Particle Display (Top-Left)", desc: "Shows the currently selected particle name and simulation status (READY, SIMULATING, COMPLETE). Updates in real-time during simulation runs." },
                    { term: "Live Parameters Panel (Bottom-Left)", desc: "Displays all current beam and physics parameters: Particle (symbol), Mass, Momentum (p), Intensity, Beamline length, β (v/c), γ (Lorentz factor), τ_lab (laboratory lifetime), λ (decay length), P(survive), and B-field (if enabled). Updates when you change sliders or settings." },
                    { term: "Detector Readout (Bottom-Left during simulation)", desc: "Shows real-time detector activity as bar graphs. TOF, Scintillator, Cherenkov, and end-TOF channels display signal strength as particles pass through. Provides visual feedback that the simulation is running." },
                    { term: "Status Indicator (Bottom-Right)", desc: "Simple text display showing simulation status: READY (yellow), SIMULATING (green flashing), COMPLETE (blue). Helps you know when it's safe to adjust parameters." }
                ]
            },
            {
                type: "text",
                heading: "Expand/Collapse Mode",
                body: "The 3D scene can be expanded to full width by clicking the Maximize icon (⛶) in the top-right corner of the scene. When expanded, the Control Panel slides off-screen, giving you a maximized view of the particle visualization. Click the Minimize icon (⊟) to restore the split-screen layout. Useful when presenting or inspecting fine details of the visualization."
            },
            {
                type: "alert",
                variant: "tip",
                title: "Performance Mode",
                body: "If the 3D visualization is laggy, try reducing Beam Intensity to 1,000 particles. The render loop is optimized, but drawing 50,000 lines with shadows and effects can stress older GPUs. The physics calculations run independently of rendering, so results are unaffected by visual performance."
            }
        ]
    },
    "results-analysis": {
        title: "Results & Analysis",
        icon: BarChart3,
        image: "/images/docs/results_curves.png",
        content: [
            {
                type: "text",
                heading: "Understanding the Results Modal",
                body: "After running a simulation, clicking 'View Results' opens the Results Modal—a comprehensive analysis dashboard that presents your data in multiple formats. The modal contains four tabs: Decay Curves, Statistics, Raw Data, and Analysis Notes. Each tab serves a different analytical purpose, from visual interpretation to quantitative validation to data export."
            },
            {
                type: "text",
                heading: "Decay Curves Tab",
                body: "The Decay Curves tab displays the primary scientific output: a graph of Survival Fraction vs. Distance. This exponential decay curve is the direct evidence of time dilation. The X-axis represents distance along the beamline (0 to beamline length in meters). The Y-axis represents the fraction of particles that have survived (not decayed) by that distance, ranging from 1.0 (100%) at the start to some lower value at the end."
            },
            {
                type: "math",
                heading: "Exponential Decay Law",
                code: "N(x) = N_0 \\cdot e^{-x / \\lambda}"
            },
            {
                type: "text",
                body: "Where N(x) is the number of surviving particles at distance x, N₀ is the initial number, and λ (lambda) is the decay length. The decay length is the characteristic distance over which the particle population drops to 1/e ≈ 36.8% of its original value. Crucially, λ = γβcτ₀, where γ and β are the relativistic factors and τ₀ is the proper lifetime. Time dilation increases γ, which increases λ, which means particles travel further before decaying."
            },
            {
                type: "list",
                items: [
                    { term: "Theoretical Curve (Solid Line)", desc: "The colored line (matching particle color) shows the analytically predicted survival fraction based on the decay length formula. This is what Special Relativity predicts." },
                    { term: "Simulated Data (Shaded Area)", desc: "The shaded region under the curve represents the Monte Carlo simulation results. Each particle was individually tracked and decayed probabilistically. The area should closely match the theoretical line." },
                    { term: "λ Annotation", desc: "Below the chart, the decay length λ is displayed (e.g., '523.7 m'). This tells you the characteristic distance scale. If λ >> beamline length, most particles survive. If λ << beamline length, most particles decay." }
                ]
            },
            {
                type: "text",
                heading: "Statistics Tab",
                body: "The Statistics tab provides numerical metrics that quantify the simulation results and their agreement with theory."
            },
            {
                type: "grid",
                heading: "Key Statistics",
                items: [
                    { title: "Survival Rate", desc: "Percentage of particles that survived the entire beamline without decaying. This is the primary metric. Compare against 'vs X% theory' shown below.", icon: CheckCircle },
                    { title: "Mean Gamma (γ)", desc: "Average Lorentz factor across all simulated particles. Higher γ means more time dilation. Particles with momentum spread will have a distribution of γ values.", icon: TrendingUp },
                    { title: "Mean Beta (β)", desc: "Average velocity as fraction of c. Values like 0.99997 indicate particles traveling at 99.997% of light speed. Directly determines time dilation magnitude.", icon: Activity },
                    { title: "Mean TOF", desc: "Average Time-of-Flight in nanoseconds. This is the laboratory-frame time for particles to traverse the beamline. Real experiments measure this directly.", icon: Zap }
                ]
            },
            {
                type: "text",
                heading: "Chi-Squared Validation",
                body: "At the top of the Statistics tab, a summary box indicates whether results are 'Consistent with Theory' (green checkmark) or show 'Deviation Detected' (orange warning). This is based on a simplified chi-squared statistical test comparing observed survival rate to theoretical prediction. If the difference is within 2 standard deviations (95% confidence), the results are considered consistent. Larger deviations may indicate systematic effects, misconfiguration, or (in a real experiment) new physics!"
            },
            {
                type: "text",
                heading: "Raw Data Tab",
                body: "The Raw Data tab provides event-by-event information in table format. Each row represents a single simulated particle. Columns include: Event ID (unique identifier), Momentum (GeV/c with spread), β (velocity), γ (Lorentz factor), TOF (nanoseconds), and Status (Survived or Decayed @ X.XXm). The table is scrollable and shows the first N events. Full data can be exported using the JSON or CSV buttons."
            },
            {
                type: "text",
                heading: "Analysis Notes Tab",
                body: "The Analysis Notes tab provides a text editor with a pre-generated analysis template. The template automatically populates with your simulation configuration and key results. Use this space to record observations, hypotheses, and conclusions. Notes can be copied to clipboard for use in reports or lab notebooks. This feature encourages scientific thinking and documentation practices."
            },
            {
                type: "text",
                heading: "Exporting Data",
                body: "Multiple export options allow you to save and share your results:"
            },
            {
                type: "list",
                items: [
                    { term: "Save PNG", desc: "Downloads the Decay Curves graph as a high-resolution PNG image file. Useful for including in presentations, papers, or reports. The image includes axes, legend, and is suitable for publication." },
                    { term: "CSV Data", desc: "Downloads all event data as a comma-separated values file. Compatible with Excel, Google Sheets, Python (pandas), R, and other analysis tools. Columns: eventId, momentum, beta, gamma, tof, survived, decayPosition." },
                    { term: "JSON Data", desc: "Downloads the complete results object as a JSON file. Includes all events, statistics, configuration, and metadata. Ideal for programmatic analysis or archiving. Structure is self-documenting." }
                ]
            }
        ]
    },
    "physics-background": {
        title: "Physics Background",
        icon: Atom,
        content: [
            {
                type: "text",
                heading: "Special Relativity: The Theory",
                body: "Albert Einstein published his Special Theory of Relativity in 1905, fundamentally changing our understanding of space and time. The theory rests on two postulates: (1) The laws of physics are the same in all inertial reference frames, and (2) The speed of light in vacuum is the same for all observers, regardless of the motion of the light source. These seemingly simple statements have profound consequences, including time dilation, length contraction, and the equivalence of mass and energy (E = mc²)."
            },
            {
                type: "text",
                heading: "Time Dilation Explained",
                body: "Time dilation is perhaps the most counterintuitive prediction of Special Relativity. It states that a clock moving relative to an observer will appear to tick more slowly than a clock at rest with respect to that observer. This is not an illusion or measurement error—it is a fundamental property of spacetime. The faster an object moves relative to you, the slower its internal clock runs from your perspective."
            },
            {
                type: "math",
                heading: "Time Dilation Formula",
                code: "t' = \\gamma \\cdot t_0 = \\frac{t_0}{\\sqrt{1 - v^2/c^2}}"
            },
            {
                type: "text",
                body: "Where t' is the dilated time (laboratory time), t₀ is the proper time (time measured in the particle's rest frame), v is the velocity of the moving object, c is the speed of light, and γ is the Lorentz factor. For everyday speeds (walking, cars, planes), γ ≈ 1.0000000001, so time dilation is imperceptible. But for particles in accelerators traveling at 0.999999+ c, γ can exceed 1000, making time dilation dramatic and easily measurable."
            },
            {
                type: "text",
                heading: "Evidence from Cosmic Rays",
                body: "One of the first experimental confirmations of time dilation came from cosmic ray muons. Muons are produced in the upper atmosphere when cosmic rays collide with air molecules. Muons have a proper lifetime of ~2.2 microseconds, meaning they should travel only ~660 meters before decaying (at the speed of light). Yet we detect abundant muons at sea level, 20+ kilometers below their creation point. How? Time dilation. From the muon's perspective, only ~2.2 μs passes. But from our Earth-bound perspective, the muon's internal clock runs slowly, and it lives long enough to reach us."
            },
            {
                type: "text",
                heading: "Pion Decay Physics",
                body: "Charged pions (π⁺ and π⁻) are unstable particles produced abundantly in particle accelerators. With a proper lifetime of τ₀ = 26.03 nanoseconds, a pion at rest would travel only 7.8 meters at light speed before decaying. But at 8 GeV/c momentum, γ ≈ 57, extending the laboratory lifetime to τ_lab = γ × τ₀ ≈ 1,484 ns. This means the pion's decay length λ = βc × τ_lab ≈ 445 meters—long enough to traverse an entire beamline with substantial survival probability."
            },
            {
                type: "math",
                heading: "Decay Length Formula",
                code: "\\lambda = \\gamma \\beta c \\tau_0"
            },
            {
                type: "text",
                heading: "Calculating Beta and Gamma",
                body: "Given a particle's momentum (p) and rest mass (m), we can calculate its velocity (β) and Lorentz factor (γ) using relativistic kinematics:"
            },
            {
                type: "math",
                heading: "Relativistic Kinematics",
                code: "\\beta = \\frac{p}{\\sqrt{p^2 + m^2}},  \\gamma = \\sqrt{1 + (p/m)^2}"
            },
            {
                type: "text",
                body: "Note that these formulas use natural units where c = 1. In SI units, you would include factors of c. The simulator uses MeV/c² for mass and GeV/c for momentum, which are standard in particle physics. The built-in calculations handle all unit conversions automatically."
            },
            {
                type: "text",
                heading: "The Exponential Decay Law",
                body: "Particle decay is a probabilistic quantum mechanical process. While we cannot predict exactly when a specific particle will decay, we can describe the statistical behavior of large ensembles. The probability of decay follows an exponential distribution, leading to the exponential survival curve you see in results. The decay constant is λ = 1/τ_lab, where τ_lab is the laboratory-frame lifetime (τ_lab = γτ₀)."
            },
            {
                type: "math",
                heading: "Survival Probability",
                code: "P(x) = e^{-x / (\\gamma \\beta c \\tau_0)}"
            },
            {
                type: "alert",
                variant: "info",
                title: "Historical Note",
                body: "The first precise measurements of pion and kaon lifetimes were made in the 1950s using cloud chambers and emulsion detectors. Today, the Particle Data Group (PDG) maintains the authoritative database of particle properties, with lifetimes measured to nanosecond precision at facilities worldwide."
            }
        ]
    },
    "statistics-tab": {
        title: "Understanding Statistics",
        icon: BarChart3,
        image: "/images/docs/results_stats.png",
        content: [
            {
                type: "text",
                heading: "Interpreting Simulation Statistics",
                body: "The Statistics tab in the Results Modal provides quantitative metrics that allow you to validate your simulation against theoretical predictions. Understanding these statistics is essential for proper scientific analysis. This section explains each metric, its physical meaning, and how to interpret its value."
            },
            {
                type: "text",
                heading: "Survival Rate",
                body: "The Survival Rate is the fraction of particles that traversed the entire beamline without decaying, expressed as a percentage. This is calculated as (Survived / Total) × 100%. A survival rate of 85.2% means 85.2% of your initial particles reached the end detector intact. The theoretical prediction (shown below as 'vs X% theory') is calculated from the exponential decay law using the exact γβcτ₀ decay length. If observed and theoretical values are close (within a few percent), Special Relativity is confirmed in your simulation."
            },
            {
                type: "text",
                heading: "Mean Gamma (γ)",
                body: "The Mean Gamma is the average Lorentz factor across all simulated particles. Even when you set a specific momentum, the simulator applies a Gaussian momentum spread (typically σ = 1-3% of p) to mimic real beamlines. This results in a distribution of γ values. The mean γ is reported as a summary statistic. Higher γ values indicate stronger time dilation effects. For pions at 8 GeV/c, expect γ ≈ 56-58 depending on spread."
            },
            {
                type: "text",
                heading: "Mean Beta (β)",
                body: "The Mean Beta is the average velocity as a fraction of the speed of light. For highly relativistic particles, β is very close to 1.0. Values like 0.99983 indicate particles traveling at 99.983% of light speed. The difference from 1 (i.e., 1 - β) determines how quickly γ grows. Note that even small changes in β at high velocities correspond to large changes in γ due to the denominator of the Lorentz factor approaching zero."
            },
            {
                type: "text",
                heading: "Mean TOF (Time of Flight)",
                body: "The Mean TOF is the average time in nanoseconds for particles to traverse the beamline from TOF Start to TOF End detector. For a 15-meter beamline with particles at β = 0.999, the expected TOF is approximately L / (βc) = 15 / (0.999 × 3×10⁸) ≈ 50 ns. Real experiments measure TOF with sub-nanosecond precision using photomultiplier tubes and high-speed electronics."
            },
            {
                type: "text",
                heading: "Event Statistics Summary",
                body: "The bottom of the Statistics tab shows a three-column summary: Total Events (number simulated), Survived (made it to the end), and Decayed (disappeared along the way). These raw counts are the basis for the survival rate calculation. With higher intensity (more events), statistical fluctuations decrease, making survival rates more precise."
            },
            {
                type: "alert",
                variant: "warning",
                title: "Statistical Uncertainty",
                body: "Due to the random nature of Monte Carlo simulation, running the same configuration twice will give slightly different results. The statistical uncertainty scales as 1/√N, where N is the number of particles. With 10,000 particles, expect ~1% statistical variation in survival rates. With 100 particles, expect ~10% variation. Always use sufficient intensity for reliable conclusions."
            }
        ]
    },
    "raw-data": {
        title: "Raw Data Export",
        icon: Table,
        image: "/images/docs/results_data.png",
        content: [
            {
                type: "text",
                heading: "Event-by-Event Data",
                body: "The Raw Data tab provides access to individual particle event data. Each row in the table represents one simulated particle, containing all the kinematic properties and outcome of that particle's journey through the beamline. This granular data enables advanced analysis, custom plotting, and verification of simulation correctness."
            },
            {
                type: "table",
                heading: "Data Columns",
                columns: ["Column", "Type", "Units", "Description"],
                rows: [
                    ["Event ID", "Integer", "—", "Unique identifier for each particle (0, 1, 2, ...)"],
                    ["Momentum", "Float", "GeV/c", "Actual momentum of this particle (includes Gaussian spread)"],
                    ["β", "Float", "(dimensionless)", "Velocity as fraction of c. Range: 0 to 1, typically >0.99 for relativistic particles."],
                    ["γ", "Float", "(dimensionless)", "Lorentz factor. Related to β by γ = 1/√(1-β²). Typical values: 10-100."],
                    ["TOF", "Float", "ns", "Time-of-Flight from start to end detector. NaN if particle decayed before reaching end."],
                    ["Status", "Enum", "—", "'Survived' or 'Decayed @ X.XXm' (position of decay in meters)."]
                ]
            },
            {
                type: "text",
                heading: "Using Exported Data",
                body: "Exported CSV files can be opened in Microsoft Excel, Google Sheets, LibreOffice Calc, or any text editor. For programmatic analysis, Python (with pandas), R, or Julia provide powerful tools. Example Python code to load data:"
            },
            {
                type: "code",
                heading: "Python Analysis Example",
                language: "python",
                code: "import pandas as pd\nimport matplotlib.pyplot as plt\n\n# Load exported data\ndf = pd.read_csv('simulation_results.csv')\n\n# Filter survived particles\nsurvived = df[df['survived'] == True]\n\n# Plot gamma distribution\nplt.hist(df['gamma'], bins=50)\nplt.xlabel('Lorentz Factor γ')\nplt.ylabel('Count')\nplt.title('Gamma Distribution')\nplt.show()"
            },
            {
                type: "text",
                heading: "JSON Structure",
                body: "The JSON export contains more information than CSV, including configuration metadata, summary statistics, and the full event array. The structure is: { config: {...}, stats: {...}, events: [...], curveData: [...] }. This format is ideal for archiving complete simulation states or building custom visualization tools."
            }
        ]
    },
    "keyboard-shortcuts": {
        title: "Keyboard Shortcuts",
        icon: Keyboard,
        content: [
            {
                type: "text",
                heading: "Efficient Workflow",
                body: "Power users can operate the simulator entirely via keyboard shortcuts. These shortcuts are designed for rapid iteration: adjust parameters, run simulation, analyze results, repeat. Memorizing a few key combinations will significantly speed up your exploration of particle physics."
            },
            {
                type: "table",
                heading: "Keyboard Reference",
                columns: ["Key", "Action", "Notes"],
                rows: [
                    ["Space", "Run Simulation", "Equivalent to clicking 'Run Simulation' button. Disabled while simulation is running."],
                    ["R", "Reset Parameters", "Restores all settings to default values. Useful for starting fresh."],
                    ["1", "Select Pion", "Switches active particle to Pion (π⁺)."],
                    ["2", "Select Kaon", "Switches active particle to Kaon (K⁺)."],
                    ["3", "Select Muon", "Switches active particle to Muon (μ⁺)."],
                    ["Enter", "Open Results", "Opens Results Modal if simulation has completed."],
                    ["Escape", "Close Modal", "Closes any open modal (Results, Control Room)."],
                    ["F", "Toggle Fullscreen (3D)", "Expands/collapses the 3D view."],
                    ["?", "Show Help", "Opens this documentation page."]
                ]
            },
            {
                type: "alert",
                variant: "tip",
                title: "Workflow Example",
                body: "Press 1 (Pion) → Space (Run) → Enter (Results) → Escape (Close) → 2 (Kaon) → Space (Run) → Enter (Compare). This sequence lets you rapidly compare particle types in under 30 seconds."
            }
        ]
    },
    "troubleshooting": {
        title: "Troubleshooting",
        icon: AlertTriangle,
        content: [
            {
                type: "text",
                heading: "Common Issues and Solutions",
                body: "This section addresses frequently encountered problems and their solutions. If you experience issues not covered here, please open an issue on our GitHub repository or contact the student development team."
            },
            {
                type: "text",
                heading: "Simulation Won't Start",
                body: "If clicking 'Run Simulation' does nothing, check: (1) Is the button disabled (grayed out)? It disables during an active run. (2) Open browser developer console (F12 → Console) for JavaScript errors. (3) Try refreshing the page. (4) Ensure JavaScript is enabled in your browser."
            },
            {
                type: "text",
                heading: "3D Scene is Black/Blank",
                body: "A blank 3D scene usually indicates WebGL issues. (1) Check if your browser supports WebGL at get.webgl.org. (2) Try a different browser (Chrome, Firefox, Edge). (3) Update your graphics drivers. (4) Disable browser extensions that might block WebGL (ad blockers sometimes interfere). (5) Try hardware acceleration: Chrome → Settings → System → 'Use hardware acceleration when available'."
            },
            {
                type: "text",
                heading: "Performance is Slow/Laggy",
                body: "If the simulator stutters or animation is choppy: (1) Reduce Beam Intensity to 1,000 particles. (2) Close other browser tabs consuming GPU/CPU. (3) Use Chrome or Edge—they have superior WebGL performance. (4) Disable unnecessary detectors in the Beamline section. (5) Avoid running on battery power (some laptops throttle GPU on battery)."
            },
            {
                type: "text",
                heading: "Results Don't Match Theory",
                body: "If your simulated survival rate differs significantly from the theoretical prediction: (1) Check if 'Enable Decay' is ON in the Physics section. If OFF, survival will be 100%. (2) Verify you're comparing the right particle type and momentum. (3) Run with higher intensity (10,000+) to reduce statistical fluctuations. (4) Small discrepancies (1-2%) are expected due to Monte Carlo statistics."
            },
            {
                type: "text",
                heading: "Export Not Working",
                body: "If CSV/JSON downloads fail: (1) Check if your browser allows pop-ups and downloads from this site. (2) Try a different export format (if CSV fails, try JSON). (3) Ensure the simulation has actually completed (results exist). (4) Check browser console for errors. (5) As a workaround, copy data from the Raw Data tab table."
            },
            {
                type: "text",
                heading: "Mobile Device Issues",
                body: "The simulator is optimized for desktop browsers but works on modern mobile devices. For best mobile experience: (1) Use landscape orientation. (2) Reduce particle intensity to 1,000 or less. (3) Avoid running while charging (prevents thermal throttling). (4) Use the latest version of Chrome or Safari."
            }
        ]
    }
};
