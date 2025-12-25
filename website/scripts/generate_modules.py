import json
import os

# Structure: Level -> Chapters -> Subtopics

def create_subtopic(id, title, type, content=None, quiz=None, task=None, flashcard=None):
    return {
        "id": id,
        "title": title,
        "type": type, # text, case_study, task, quiz, flashcard
        "content": content,
        "quiz": quiz,
        "task": task,
        "flashcard": flashcard
    }

# --- BEGINNER LEVEL ---
beginner_chapters = [
    {
        "title": "1. The Building Blocks of the Universe",
        "description": "Introduction to the fundamental particles: Quarks, Leptons, and Bosons.",
        "icon": "Atom",
        "subtopics": [
            ("1.1.1", "What is Matter?", "text", "Matter is anything that has mass and takes up space. But deep down, it's made of particles."),
            ("1.1.2", "The Atom vs The Particle", "text", "Atoms are made of protons, neutrons, and electrons. Elementary particles cannot be split further."),
            ("1.1.3", "Meet the Quarks", "text", "Quarks come in 6 flavors: Up, Down, Charm, Strange, Top, Bottom. Protons = uud."),
            ("1.1.4", "Meet the Leptons", "text", "Leptons include the Electron and the ghostly Neutrino. They don't feel the strong force."),
            ("1.1.5", "Interactive: Proton Builder", "case_study", "Case Study: How Rutherford discovered the nucleus."),
            ("1.1.6", "Force Carriers (Bosons)", "text", "Forces are exchanged by particles: Photons (EM), Gluons (Strong), W/Z (Weak)."),
            ("1.1.7", "Simulator Task: Identify Particles", "task", "Go to the Simulator, click 'Particle Selection' and find the Pion (u-dbar)."),
            ("1.1.8", "Quiz: Particle Families", "quiz", {"q": "Which is a lepton?", "a": ["Electron", "Proton", "Neutron"], "correct": 0}),
            ("1.1.9", "Flashcards: Symbols", "flashcard", {"front": "Symbol for Photon", "back": "gamma (γ)"}),
            ("1.1.10", "Summary & Review", "text", "You now know the cast of characters for the universe.")
        ]
    },
    {
        "title": "2. Forces of Nature",
        "description": "Gravity, Electromagnetism, Strong and Weak forces.",
        "icon": "Zap",
        "subtopics": [
            ("1.2.1", "The Four Fundamental Forces", "text", "Gravity, EM, Strong, Weak. Gravity is surprisingly the weakest!"),
            ("1.2.2", "Gravity: The Shaper", "text", "Dominate at large scales, negligible in particle physics."),
            ("1.2.3", "Electromagnetism: The Binder", "text", "Holds atoms together. Infinite range."),
            ("1.2.4", "Strong Force: The Glue", "text", "Binds quarks into protons. Very short range."),
            ("1.2.5", "Weak Force: The Transformer", "text", "Responsible for radioactive decay. Changes quark flavor."),
            ("1.2.6", "Case Study: Beta Decay", "case_study", "How a neutron turns into a proton via Weak force."),
            ("1.2.7", "Simulator Task: Decay Mode", "task", "Turn 'Decay' on/off in Physics settings. See how particles disappear (Weak force at play)."),
            ("1.2.8", "Quiz: Forces", "quiz", {"q": "Which force holds the nucleus together?", "a": ["Gravity", "Strong", "EM"], "correct": 1}),
            ("1.2.9", "Flashcards: Force Carriers", "flashcard", {"front": "Gluon", "back": "Strong Force Carrier"}),
            ("1.2.10", "Grand Unification?", "text", "Physicists hope to merge these forces into one.")
        ]
    },
    {
        "title": "3. The Speed of Light",
        "description": "Why 'c' is the cosmic speed limit.",
        "icon": "FastForward",
        "subtopics": [
            ("1.3.1", "Light Speed Defined", "text", "c = 299,792,458 m/s exactly."),
            ("1.3.2", "The Universal Constant", "text", "It's the same for everyone, moving or still."),
            ("1.3.3", "Case Study: Michelson-Morley", "case_study", "The failed experiment that proved the ether didn't exist."),
            ("1.3.4", "Nothing Go Faster?", "text", "Infinite energy is needed to reach c for mass."),
            ("1.3.5", "Simulator Task: Maximum Velocity", "task", "Slide momentum to max. Observe Beta (v/c). It never hits 1.0."),
            ("1.3.6", "Tachyons?", "text", "Hypothetical properties of faster-than-light particles."),
            ("1.3.7", "Light in Media", "text", "Light slows down in glass/water. c/n."),
            ("1.3.8", "Quiz: Value of c", "quiz", {"q": "Speed of light is approx?", "a": ["300,000 km/s", "300 m/s", "Sound speed"], "correct": 0}),
            ("1.3.9", "Flashcards: c", "flashcard", {"front": "Can massive particles reach c?", "back": "No, infinite energy required."}),
            ("1.3.10", "Looking Back in Time", "text", "Light takes time to travel. We see stars as they were.")
        ]
    },
    {
        "title": "4. Special Relativity Intro",
        "description": "Time slows down, Length shrinks.",
        "icon": "Clock",
        "subtopics": [
            ("1.4.1", "Einstein's Big Idea", "text", "Physics is the same in all inertial frames."),
            ("1.4.2", "Time Dilation Concept", "text", "Moving clocks run slow. t' = gamma * t."),
            ("1.4.3", "The Twin Paradox", "case_study", "One twin travels to space, returns younger."),
            ("1.4.4", "Length Contraction", "text", "Moving rulers look short. L' = L / gamma."),
            ("1.4.5", "Mass Increase", "text", "Moving objects get heavier. m = gamma * m0."),
            ("1.4.6", "Simulator Task: Gamma Factor", "task", "Set particle to Pion, Momentum 8GeV. Check the 'Gamma' gauge. It's > 1."),
            ("1.4.7", "Simultaneity", "text", "Events simultaneous to you are not for a moving observer."),
            ("1.4.8", "Quiz: Time Dilation", "quiz", {"q": "A moving clock...?", "a": ["Speeds up", "Slows down", "Stops"], "correct": 1}),
            ("1.4.9", "Flashcards: Gamma", "flashcard", {"front": "Gamma at rest", "back": "1.0"}),
            ("1.4.10", "Why don't we see it?", "text", "Effect is tiny at everyday speeds.")
        ]
    },
    {
        "title": "5. Particle Accelerators",
        "description": "How we make particles go fast.",
        "icon": "Disc", # Cyclotron shape
        "subtopics": [
            ("1.5.1", "Why Accelerate?", "text", "To probe small scales (high energy = short wavelength)."),
            ("1.5.2", "Electric Fields", "text", "E-fields push charged particles. F = qE."),
            ("1.5.3", "Magnetic Fields", "text", "B-fields steer particles. F = qvB."),
            ("1.5.4", "Linear Accelerators (Linacs)", "text", "Straight line acceleration."),
            ("1.5.5", "Cyclotrons", "case_study", "Lawrence's spiral machine."),
            ("1.5.6", "Synchrotrons (LHC)", "text", "Giant rings. LHC is 27km long."),
            ("1.5.7", "Simulator Task: Beamline", "task", "The 'Beamline Length' slider represents our linear path. Change it to 50m."),
            ("1.5.8", "Quiz: Steering", "quiz", {"q": "Which field turns the particle?", "a": ["Electric", "Magnetic", "Gravity"], "correct": 1}),
            ("1.5.9", "Flashcards: LHC", "flashcard", {"front": "LHC Location", "back": "CERN (Geneva)"}),
            ("1.5.10", "Future Colliders", "text", "FCC, ILC - bigger is better.")
        ]
    },
    {
        "title": "6. Particle Detectors 101",
        "description": "Seeing the invisible.",
        "icon": "Eye",
        "subtopics": [
            ("1.6.1", "Interaction with Matter", "text", "Particles ionize atoms as they pass through."),
            ("1.6.2", "Tracking Detectors", "text", "Connect the dots to find the path."),
            ("1.6.3", "Calorimeters", "text", "Stop the particle to measure Energy."),
            ("1.6.4", "Scintillators", "text", "Flashes of light when hit."),
            ("1.6.5", "Case Study: Bubble Chambers", "case_study", "Old school photography of tracks."),
            ("1.6.6", "Modern Silicon Detectors", "text", "Like a giant camera sensor."),
            ("1.6.7", "Simulator Task: Detector Toggle", "task", "Toggle 'Scintillator' and 'Cherenkov' in the Control Panel. See them appear/disappear."),
            ("1.6.8", "Quiz: Detectors", "quiz", {"q": "What measures Energy?", "a": ["Tracker", "Calorimeter", "Magnet"], "correct": 1}),
            ("1.6.9", "Flashcards: Ionization", "flashcard", {"front": "Charged particle passing gas", "back": "Removes electrons (Ionization)"}),
            ("1.6.10", "The Trigger", "text", "Deciding when to take the photo.")
        ]
    },
    {
        "title": "7. The Standard Model",
        "description": "The Periodic Table of Physics.",
        "icon": "Grid",
        "subtopics": [
            ("1.7.1", "Generations of Matter", "text", "3 generations. We are mostly Gen 1."),
            ("1.7.2", "Quark Colors", "text", "Not real colors! Charge for Strong force."),
            ("1.7.3", "Hadrons: Baryons vs Mesons", "text", "Baryon (qqq), Meson (q q-bar)."),
            ("1.7.4", "The Higgs Boson", "case_study", "The 2012 discovery that completed the model."),
            ("1.7.5", "Antimatter", "text", "Identical mass, opposite charge."),
            ("1.7.6", "Neutrinos", "text", "Tiny mass, travel through Earth."),
            ("1.7.7", "Simulator Task: The Mesons", "task", "Select Pion and Kaon. Both are mesons. Note their quark content in the data table."),
            ("1.7.8", "Quiz: Hadrons", "quiz", {"q": "A proton is a...", "a": ["Baryon", "Meson", "Lepton"], "correct": 0}),
            ("1.7.9", "Flashcards: Higgs", "flashcard", {"front": "Higgs Field", "back": "Gives mass to particles"}),
            ("1.7.10", "What's Missing?", "text", "Gravity, Dark Matter not included.")
        ]
    },
    {
        "title": "8. Radioactivity",
        "description": "Alpha, Beta, Gamma radiation.",
        "icon": "Radio",
        "subtopics": [
            ("1.8.1", "Unstable Nuclei", "text", "Too many protons/neutrons leads to instability."),
            ("1.8.2", "Alpha Decay", "text", "Emitting a Helium nucleus."),
            ("1.8.3", "Beta Decay", "text", "Neutron -> Proton + Electron + Neutrino."),
            ("1.8.4", "Gamma Decay", "text", "Emitting a photon to relax energy."),
            ("1.8.5", "Half-Life Concept", "text", "Time for 50% to decay."),
            ("1.8.6", "Case Study: Carbon Dating", "case_study", "Using C-14 to date bones."),
            ("1.8.7", "Simulator Task: Survival Rate", "task", "Look at 'Survival' gauge. It relates to how many particles haven't decayed yet."),
            ("1.8.8", "Quiz: Shielding", "quiz", {"q": "Stops Alphas?", "a": ["Paper", "Lead", "Concrete"], "correct": 0}),
            ("1.8.9", "Flashcards: Beta", "flashcard", {"front": "Beta particle is an...", "back": "Electron or Positron"}),
            ("1.8.10", "Safety", "text", "Radiation dose and protection.")
        ]
    },
    {
        "title": "9. A History of CERN",
        "description": "From WWII ruins to the LHC.",
        "icon": "Globe",
        "subtopics": [
            ("1.9.1", "Founding 1954", "text", "Science for Peace in Europe."),
            ("1.9.2", "The PS (Proton Synchrotron)", "text", "Built in 1959, still running today!"),
            ("1.9.3", "Discovery of W/Z (1983)", "case_study", "Nobel prize for Rubbia & Van der Meer."),
            ("1.9.4", "The Web (1989)", "text", "Tim Berners-Lee invented WWW at CERN."),
            ("1.9.5", "LEP (Large Electron Positron)", "text", "Previous collider in the LHC tunnel."),
            ("1.9.6", "Building the LHC", "text", "A 27km engineering marvel."),
            ("1.9.7", "Simulator Task: Facilities", "task", "Click 'Facilities' tab. Read about CERN T9 and CERN PS."),
            ("1.9.8", "Quiz: WWW", "quiz", {"q": "Where was the web born?", "a": ["NASA", "MIT", "CERN"], "correct": 2}),
            ("1.9.9", "Flashcards: PS", "flashcard", {"front": "CERN PS built in?", "back": "1959"}),
            ("1.9.10", "Future of CERN", "text", "FCC: Future Circular Collider.")
        ]
    },
    {
        "title": "10. Experimental Safety",
        "description": "Staying safe in the lab.",
        "icon": "Shield",
        "subtopics": [
            ("1.10.1", "High Voltage", "text", "Detectors use kV. Don't touch."),
            ("1.10.2", "Radiation Hazards", "text", "Beam on = Personnell out."),
            ("1.10.3", "Cryogenics", "text", "Liquid Helium/Nitrogen burn risks."),
            ("1.10.4", "Magnetic Fields", "text", "Loose metal becomes a projectile."),
            ("1.10.5", "Case Study: The Beam Dump", "case_study", "Where the energy goes when we stop."),
            ("1.10.6", "Interlock Systems", "text", "Keys and doors to prevent entry."),
            ("1.10.7", "Simulator Task: System Ready", "task", "Notice the 'System Ready' status? In real life, this checks safety interlocks."),
            ("1.10.8", "Quiz: B-Field", "quiz", {"q": "Danger in high B-field?", "a": ["Pacemakers", "Plastic", "Wood"], "correct": 0}),
            ("1.10.9", "Flashcards: Cryo", "flashcard", {"front": "Liquid Nitrogen Temp", "back": "77K (-196C)"}),
            ("1.10.10", "Culture of Safety", "text", "Safety first, Science second.")
        ]
    }
]

# --- INTERMEDIATE LEVEL ---
intermediate_chapters = [
    {
        "title": "11. Mathematics of Relativity",
        "description": "Algebra of Lorentz Transformations.",
        "icon": "Sigma",
        "subtopics": [
            ("2.11.1", "Coordinates (x, y, z, t)", "text", "Events happen at a place AND time."),
            ("2.11.2", "Galilean Transformation", "text", "x' = x - vt (Old physics). Fails at high speed."),
            ("2.11.3", "Lorentz Transformation", "case_study", "x' = gamma(x - vt). The correct math."),
            ("2.11.4", "Mixing Space and Time", "text", "Time for me depends on your space."),
            ("2.11.5", "Invariant Interval s^2", "text", "s^2 = (ct)^2 - x^2. Everyone agrees on calculation."),
            ("2.11.6", "Simulator Task: Calculate Gamma", "task", "Use calculator: P=8GeV, m=0.14. Find Gamma. Check with simulator."),
            ("2.11.7", "Velocity Addition", "text", "v + u != v+u. (v+u)/(1+vu/c^2)."),
            ("2.11.8", "Quiz: Addition", "quiz", {"q": "0.5c + 0.5c = ?", "a": ["1.0c", "0.8c", "0.9c"], "correct": 1}),
            ("2.11.9", "Flashcards: Invariant", "flashcard", {"front": "Spacetime Interval", "back": "Invariant for all observers"}),
            ("2.11.10", "Minkowski Diagrams", "text", "Visualizing spacetime with geometry.")
        ]
    },
    {
        "title": "12. Relativistic Energy",
        "description": "E=mc^2 and beyond.",
        "icon": "Zap",
        "subtopics": [
            ("2.12.1", "Total Energy", "text", "E = gamma * m * c^2."),
            ("2.12.2", "Rest Energy", "text", "E0 = m * c^2. Energy stored in mass."),
            ("2.12.3", "Kinetic Energy", "text", "KE = E_total - E_rest. NOT 1/2mv^2!"),
            ("2.12.4", "Momentum-Energy Relation", "case_study", "E^2 = (pc)^2 + (mc^2)^2. The Golden Rule."),
            ("2.12.5", "Units: electron-Volts (eV)", "text", "Energy gained by electron in 1 Volt."),
            ("2.12.6", "MeV and GeV", "text", "Mega and Giga eV. Protons are ~1 GeV."),
            ("2.12.7", "Simulator Task: Energy Check", "task", "Look at 'Total Energy E' in the live data. Verify E > Momentum."),
            ("2.12.8", "Quiz: Units", "quiz", {"q": "Energy unit?", "a": ["Tesla", "GeV", "Farad"], "correct": 1}),
            ("2.12.9", "Flashcards: E-p-m", "flashcard", {"front": "E^2 =", "back": "p^2 + m^2 (units c=1)"}),
            ("2.12.10", "Massless Particles", "text", "If m=0, E = p. Light has momentum!")
        ]
    },
    {
        "title": "13. Particle Decay Physics",
        "description": "Exponential decay law derived.",
        "icon": "Activity",
        "subtopics": [
            ("2.13.1", "Decay Probability", "text", "Constant probability per unit time lambda."),
            ("2.13.2", "The Exponential Law", "text", "N(t) = N0 * e^(-t/tau)."),
            ("2.13.3", "Mean Lifetime (tau)", "text", "Average time a particle lives."),
            ("2.13.4", "Half-Life vs Lifetime", "text", "t_1/2 = tau * ln(2)."),
            ("2.13.5", "Relativistic Decay", "case_study", "In lab frame, t_lab = gamma * tau. They live longer!"),
            ("2.13.6", "Survival Fraction", "text", "P = exp(-L / (beta * c * gamma * tau))."),
            ("2.13.7", "Simulator Task: Decay Length", "task", "Check 'Decay Length' value. If it's larger than Beamline Length (15m), most survive."),
            ("2.13.8", "Quiz: Gamma Effect", "quiz", {"q": "High gamma means...", "a": ["Faster decay", "Slower decay", "No change"], "correct": 1}),
            ("2.13.9", "Flashcards: Formula", "flashcard", {"front": "N(t)", "back": "N0 exp(-t/tau)"}),
            ("2.13.10", "Branching Ratios", "text", "Particles can decay in multiple ways.")
        ]
    },
    {
        "title": "14. Scintillation Counters",
        "description": "Detection mechanism details.",
        "icon": "Box",
        "subtopics": [
            ("2.14.1", "Organic Scintillators", "text", "Hydrocarbon chains. Fast response."),
            ("2.14.2", "Energy Loss (dE/dx)", "text", "Bethe-Bloch formula basics."),
            ("2.14.3", "Light Guides", "text", "Getting light to the sensor."),
            ("2.14.4", "Photomultiplier (PMT)", "case_study", "The Photoelectric effect in action."),
            ("2.14.5", "Efficiency", "text", "Do we see every particle? Usually >99%."),
            ("2.14.6", "Timing Resolution", "text", "How precise? ~100ps."),
            ("2.14.7", "Simulator Task: Scintillator", "task", "The big gray blocks in the 3D view are scintillators. Identify them."),
            ("2.14.8", "Quiz: dE/dx", "quiz", {"q": "Minimum Ionizing Particle (MIP)?", "a": ["Loses min energy", "Loses max energy", "Stopped"], "correct": 0}),
            ("2.14.9", "Flashcards: PMT", "flashcard", {"front": "PMT Gain", "back": "10^6 to 10^7 electrons"}),
            ("2.14.10", "Coincidence Matrix", "text", "Using 2 counters to reduce noise.")
        ]
    },
    {
        "title": "15. Time of Flight (TOF)",
        "description": "Measuring velocity directly.",
        "icon": "Watch",
        "subtopics": [
            ("2.15.1", "Concept: Start and Stop", "text", "t1 at detector A, t2 at detector B."),
            ("2.15.2", "Velocity Calculation", "text", "v = d / (t2 - t1)."),
            ("2.15.3", "Beta Calculation", "text", "beta = v / c."),
            ("2.15.4", "Mass Separation", "case_study", "Heavier particles move slower at same momentum."),
            ("2.15.5", "Resolution Limits", "text", "If particles are too fast (gamma >> 1), speeds are too close."),
            ("2.15.6", "Calibration", "text", "Using light or electrons to zero the clock."),
            ("2.15.7", "Simulator Task: TOF Detectors", "task", "Note the 'TOF1' and 'TOF2' checkboxes. They define the start/stop timing."),
            ("2.15.8", "Quiz: High Energy", "quiz", {"q": "Is TOF good for 100 GeV pions?", "a": ["Yes", "No", "Best"], "correct": 1}),
            ("2.15.9", "Flashcards: t", "flashcard", {"front": "Time of Flight", "back": "Distance / Velocity"}),
            ("2.15.10", "RPCs", "text", "Resistive Plate Chambers (alternative to scintillators).")
        ]
    },
    {
        "title": "16. Cherenkov Detectors",
        "description": "Breaking the light barrier.",
        "icon": "Sun",
        "subtopics": [
            ("2.16.1", "Sonic Boom for Light", "text", "Happens when v > c/n."),
            ("2.16.2", "Refractive Index (n)", "case_study", "Water n=1.33. CO2 gas n=1.0004."),
            ("2.16.3", "Threshold Velocity", "text", "Minimum beta = 1/n."),
            ("2.16.4", "The Angle", "text", "Cos(theta) = 1 / (beta * n)."),
            ("2.16.5", "Discrimination", "text", "Light = fast. No light = slow(er)."),
            ("2.16.6", "Ring Imaging (RICH)", "text", "Imaging the cone as a ring."),
            ("2.16.7", "Simulator Task: Cherenkov", "task", "Toggle 'Cherenkov'. It lights up if particle speed > threshold."),
            ("2.16.8", "Quiz: Threshold", "quiz", {"q": "If v < c/n, what happens?", "a": ["Light", "No Light", "Sound"], "correct": 1}),
            ("2.16.9", "Flashcards: Blue Glow", "flashcard", {"front": "Cherenkov Color", "back": "Blue/UV"}),
            ("2.16.10", "Applications", "text", "Neutrino detection (Super-K) uses this.")
        ]
    },
    {
        "title": "17. Beam Optics",
        "description": "Focusing and steering particles.",
        "icon": "Search",
        "subtopics": [
            ("2.17.1", "Dipoles", "text", "Magnets that BEND the beam."),
            ("2.17.2", "Quadrupoles", "text", "Magnets that FOCUS the beam."),
            ("2.17.3", "The FODO Cell", "case_study", "Focus-Drift-Defocus-Drift. Net focusing."),
            ("2.17.4", "Momentum Selection", "text", "Bending angle depends on Momentum. Acts as a filter."),
            ("2.17.5", "Collimators", "text", "Physical blocks to clean the beam."),
            ("2.17.6", "Beam Profile", "text", "Gaussian distribution of particles."),
            ("2.17.7", "Simulator Task: Intensity", "task", "Lower 'Beam Intensity'. This simulates closing a collimator."),
            ("2.17.8", "Quiz: Lens", "quiz", {"q": "Magnetic lens?", "a": ["Dipole", "Quadrupole", "Solenoid"], "correct": 1}),
            ("2.17.9", "Flashcards: Bending", "flashcard", {"front": "Dipole Field", "back": "Bends trajectory"}),
            ("2.17.10", "Secondary Beams", "text", "Smashing protons into target to get pions.")
        ]
    },
    {
        "title": "18. Data Analysis Basics",
        "description": "Histograms and Distributions.",
        "icon": "BarChart",
        "subtopics": [
            ("2.18.1", "The Event Loop", "text", "Processing one particle at a time."),
            ("2.18.2", "Histograms", "text", "Binning data to see shapes."),
            ("2.18.3", "Gaussian (Normal) Distribution", "text", "The Bell Curve. Noise is Gaussian."),
            ("2.18.4", "Mean and RMS", "text", "Center and Width of the distribution."),
            ("2.18.5", "Signal vs Background", "case_study", "Finding the needle in the haystack."),
            ("2.18.6", "Cuts and Selection", "text", "Removing bad data points."),
            ("2.18.7", "Simulator Task: Error Bars", "task", "Enable 'Show Error Bars' in Analysis. They show statistical range."),
            ("2.18.8", "Quiz: Binning", "quiz", {"q": "X-axis of histogram?", "a": ["Time", "Variable Value", "Count"], "correct": 1}),
            ("2.18.9", "Flashcards: RMS", "flashcard", {"front": "RMS", "back": "Root Mean Square (Width)"}),
            ("2.18.10", "ROOT Framework", "text", "C++ tool used by CERN for analysis.")
        ]
    },
    {
        "title": "19. The Muon",
        "description": "The heavy electron.",
        "icon": "Circle",
        "subtopics": [
            ("2.19.1", "Who ordered that?", "text", "Rabi's quote. Muon was unexpected."),
            ("2.19.2", "Properties", "text", "200x mass of electron. Unstable."),
            ("2.19.3", "Cosmic Rays", "case_study", "Muons rain down on us from space."),
            ("2.19.4", "Muon Lifetime", "text", "2.2 microseconds. Long enough to track."),
            ("2.19.5", "Muon Penetration", "text", "Passes through walls/iron easily."),
            ("2.19.6", "Decay Mode", "text", "Muon -> Electron + Neutrinos."),
            ("2.19.7", "Simulator Task: Muon Beam", "task", "Select 'Muon' particle. See how high its survival or gamma is."),
            ("2.19.8", "Quiz: Interaction", "quiz", {"q": "Does Muon feel Strong force?", "a": ["Yes", "No"], "correct": 1}),
            ("2.19.9", "Flashcards: Lifetime", "flashcard", {"front": "Muon Lifetime", "back": "2.2 us"}),
            ("2.19.10", "Muon Tomography", "text", "Using cosmic muons to X-ray Pyramids.")
        ]
    },
    {
        "title": "20. Writing a Lab Report",
        "description": "Documenting your science.",
        "icon": "FileText",
        "subtopics": [
            ("2.20.1", "Abstract", "text", "Summary of the whole thing."),
            ("2.20.2", "Introduction", "text", "Physics context and goal."),
            ("2.20.3", "Methodology", "text", "Setup, triggers, settings."),
            ("2.20.4", "Results", "text", "Plots, tables, numbers."),
            ("2.20.5", "Discussion", "case_study", "Interpreting the data. Why does it fit?"),
            ("2.20.6", "Conclusion", "text", "Did you prove the hypothesis?"),
            ("2.20.7", "Simulator Task: Export", "task", "Currently no export, but imagine saving your plot for the report."),
            ("2.20.8", "Quiz: Abstract", "quiz", {"q": "Length of abstract?", "a": ["10 pages", "1 paragraph", "1 sentence"], "correct": 1}),
            ("2.20.9", "Flashcards: References", "flashcard", {"front": "Citing work", "back": "Essential for credit"}),
            ("2.20.10", "Peer Review", "text", "Getting others to check your work.")
        ]
    }
]

# --- ADVANCED LEVEL ---
advanced_chapters = [
    {
        "title": "21. Lorentz Invariance Testing",
        "description": "Pushing relativity to the limit.",
        "icon": "Shield",
        "subtopics": [
            ("3.21.1", "Foundations of SR", "text", "Is 'c' truly isotropic?"),
            ("3.21.2", "Standard Model Extension (SME)", "text", "Framework for parameterizing violations."),
            ("3.21.3", "Sidereal Variations", "case_study", "Does physics change as Earth rotates?"),
            ("3.21.4", "The c_mu vs c_gamma test", "text", "Comparing max speed of Muon vs Photon."),
            ("3.21.5", "High Energy Limits", "text", "Does spacetime become 'grainy'?"),
            ("3.21.6", "Simulator Task: Precision", "task", "We need high stats (100k events) to see tiny deviations."),
            ("3.21.7", "Universality", "text", "Does dE/dx relate to gamma the same for all species?"),
            ("3.21.8", "Quiz: SME", "quiz", {"q": "SME stands for?", "a": ["Standard Model Extension", "Small Mass Energy"], "correct": 0}),
            ("3.21.9", "Flashcards: Planck Scale", "flashcard", {"front": "Planck Length", "back": "10^-35 m"}),
            ("3.21.10", "Modern Constraints", "text", "SR holds to 1 part in 10^18.")
        ]
    },
    {
        "title": "22. Transition Radiation (TR)",
        "description": "Particle ID at high gamma.",
        "icon": "Layers",
        "subtopics": [
            ("3.22.1", "Physics of Boundary Crossing", "text", "Changing dielectric constant causes emission."),
            ("3.22.2", "X-Ray Emission", "text", "Photons are in KeV range."),
            ("3.22.3", "Gamma Dependence", "text", "Intensity proportional to Gamma. Good for e/pi separation."),
            ("3.22.4", "Radiators and Absorbers", "case_study", "Foils (mylar) + Xenon gas detectors."),
            ("3.22.5", "Electron ID", "text", "Electrons are light -> High Gamma -> Strong TR."),
            ("3.22.6", "Heavy Particles", "text", "Pions/Protons have low gamma -> No TR."),
            ("3.22.7", "Simulator Task: Presets", "task", "Load 'DESY: e+e- Pair Studies'. Note use of detectors sensitive to electrons."),
            ("3.22.8", "Quiz: TR Range", "quiz", {"q": "TR useful for?", "a": ["Low velocity", "High Gamma", "Neutrons"], "correct": 1}),
            ("3.22.9", "Flashcards: Material", "flashcard", {"front": "Radiator", "back": "Many layers of foil"}),
            ("3.22.10", "ATLAS TRT", "text", "Transition Radiation Tracker at LHC.")
        ]
    },
    {
        "title": "23. Calorimetry",
        "description": "Stopping particles to measure E.",
        "icon": "Box",
        "subtopics": [
            ("3.23.1", "Electromagnetic Showers", "text", "Electrons/Photons cascade: e -> gamma -> ee."),
            ("3.23.2", "Hadronic Showers", "text", "Protons/Pions interact via Strong force. Messier."),
            ("3.23.3", "Radiation Length (X0)", "text", "Distance to lose 1/e energy."),
            ("3.23.4", "Interaction Length (Lambda)", "text", "Scale for hadronic showers (longer)."),
            ("3.23.5", "Resolution Scaling", "case_study", "Sigma(E)/E goes as 1/sqrt(E). Better at high energy!"),
            ("3.23.6", "Crystal Calorimeters", "text", "CMS ECAL uses Lead Tungstate."),
            ("3.23.7", "Simulator Task: None", "task", "Our simulator focuses on tracking/TOF, but imagine a block at the end."),
            ("3.23.8", "Quiz: Scaling", "quiz", {"q": "Resolution at high E?", "a": ["Improves", "Worsens", "Constant"], "correct": 0}),
            ("3.23.9", "Flashcards: X0", "flashcard", {"front": "Radiation Length", "back": "EM Shower scale"}),
            ("3.23.10", "Sampling vs Homogeneous", "text", "Sandwich layers vs solid block.")
        ]
    },
    {
        "title": "24. Feynman Diagrams",
        "description": "Visualizing particle interactions.",
        "icon": "Edit2", # Pen
        "subtopics": [
            ("3.24.1", "Space-Time Graphs", "text", "Time flows up (or right)."),
            ("3.24.2", "Lines and Vertices", "text", "Straight=Fermion, Wavy=Boson. Vertex=Interaction."),
            ("3.24.3", "Conservation Rules", "text", "Charge, Lepton #, Baryon # conserved at vertex."),
            ("3.24.4", "QED Examples", "case_study", "Electron-Electron scattering (photon exchange)."),
            ("3.24.5", "Weak Interaction", "text", "W/Z bosons. Beta decay diagram."),
            ("3.24.6", "QCD", "text", "Gluons and quark color flow."),
            ("3.24.7", "Simulator Task: Decay", "task", "Visualize Pion Decay: Pi -> Mu + Nu. Draw the W+ exchange."),
            ("3.24.8", "Quiz: Photon", "quiz", {"q": "Photon line is?", "a": ["Straight", "Wavy", "Dotted"], "correct": 1}),
            ("3.24.9", "Flashcards: Vertex", "flashcard", {"front": "Vertex coupling", "back": "Strength of interaction"}),
            ("3.24.10", "Virtual Particles", "text", "Internal lines are 'off-shell'.")
        ]
    },
    {
        "title": "25. Monte Carlo & GEANT4",
        "description": "Simulate before you build.",
        "icon": "Cpu",
        "subtopics": [
            ("3.25.1", "Why Simulate?", "text", "Optimize design and understand background."),
            ("3.25.2", "Monte Carlo Integration", "text", "Solving integrals by random sampling."),
            ("3.25.3", "Geometry Definition", "text", "Building the digital twin of detectors."),
            ("3.25.4", "Physics Lists", "text", "Telling GEANT4 which interactions to enable."),
            ("3.25.5", "Stepping Action", "case_study", "Tracking particle step-by-step."),
            ("3.25.6", "Optical Photons", "text", "Simulating Cherenkov light is CPU heavy."),
            ("3.25.7", "Simulator Task: Comparison", "task", "Compare our WebGL sim with GEANT4 data tab. WebGL is approx, GEANT4 is exact."),
            ("3.25.8", "Quiz: Steps", "quiz", {"q": "A 'Step' in GEANT4 is?", "a": ["Physical stride", "Distance between interactions", "1 meter"], "correct": 1}),
            ("3.25.9", "Flashcards: GEANT4", "flashcard", {"front": "Language", "back": "C++"}),
            ("3.25.10", "Analysis Chain", "text", "Simulation output -> Reconstruction -> Analysis.")
        ]
    },
    {
        "title": "26. Statistics & Fit Methods",
        "description": "Extracting numbers from noise.",
        "icon": "TrendingUp",
        "subtopics": [
            ("3.26.1", "Probability Density Functions", "text", "Gaussian, Poisson, Binomial."),
            ("3.26.2", "Maximum Likelihood Fit", "text", "L = Product(Probabilities). Maximize L."),
            ("3.26.3", "Least Squares Method", "text", "Minimize Sum(residuals^2). Easier but less general."),
            ("3.26.4", "Chi-Squared Test", "case_study", "Goodness of fit. reduced-Chi2 ~ 1."),
            ("3.26.5", "Confidence Intervals", "text", "68% (1-sigma), 95% (2-sigma)."),
            ("3.26.6", "Root Mean Square", "text", "Measure of spread."),
            ("3.26.7", "Simulator Task: Fit Curve", "task", "The 'Fit Curve' option in Analysis applies an exponential fit to the decay."),
            ("3.26.8", "Quiz: Sigmas", "quiz", {"q": "Percent in 1 sigma?", "a": ["50%", "68%", "99%"], "correct": 1}),
            ("3.26.9", "Flashcards: p-value", "flashcard", {"front": "p-value < 0.05", "back": "Statistically Significant"}),
            ("3.26.10", "Systematic Errors", "text", "Shift in the mean, not the width.")
        ]
    },
    {
        "title": "27. Beamline Instrumentation",
        "description": "Diagnostic tools.",
        "icon": "Tool",
        "subtopics": [
            ("3.27.1", "Beam Monitors (BPM)", "text", "Where is the beam center?"),
            ("3.27.2", "Wire Chambers (MWPC)", "text", "Tracking with gas wires."),
            ("3.27.3", "Magnet Control", "text", "Current stability is crucial."),
            ("3.27.4", "Target Selection", "case_study", "Beryllium vs Lead targets."),
            ("3.27.5", "Collimation", "text", "Scraping off the halo particles."),
            ("3.27.6", "Vacuum Systems", "text", "Beam needs vacuum to avoid scattering."),
            ("3.27.7", "Simulator Task: Beamline", "task", "We assume perfect vacuum. Try 'Beam Intensity' slider to simulate flux."),
            ("3.27.8", "Quiz: Vacuum", "quiz", {"q": "Why vacuum?", "a": ["Insulation", "Prevent collision with air", "Keep cool"], "correct": 1}),
            ("3.27.9", "Flashcards: MWPC", "flashcard", {"front": "Multi-Wire Proportional Chamber", "back": "Charpak (Nobel 1992)"}),
            ("3.27.10", "The Spill", "text", "Beam comes in pulses, not continuous.")
        ]
    },
    {
        "title": "28. Trigger Logic",
        "description": "Decidng what to save.",
        "icon": "CheckSquare",
        "subtopics": [
            ("3.28.1", "The Hardware Trigger", "text", "Fast electronics (ns). FPGA."),
            ("3.28.2", "Coincidence S1 * S2", "text", "Particle must hit start AND end."),
            ("3.28.3", "Veto Counters", "text", "Ignore particles that hit the walls."),
            ("3.28.4", "Prescaling", "text", "Record only 1 in 100 common events."),
            ("3.28.5", "Dead Time", "case_study", "Detector is 'blind' while reading out."),
            ("3.28.6", "Trigger Efficiency", "text", "Did we miss good events?"),
            ("3.28.7", "Simulator Task: Physics", "task", "Our simulator triggers on 'Particle Generation'. Real life is harder."),
            ("3.28.8", "Quiz: Logic", "quiz", {"q": "AND logic?", "a": ["Both must be true", "One must be true"], "correct": 0}),
            ("3.28.9", "Flashcards: Dead Time", "flashcard", {"front": "Dead Time", "back": "Lost data period"}),
            ("3.28.10", "Software Trigger (HLT)", "text", "Computer farm filtering.")
        ]
    },
    {
        "title": "29. Beyond the Standard Model",
        "description": "What's next?",
        "icon": "HelpCircle",
        "subtopics": [
            ("3.29.1", "Supersymmetry (SUSY)", "text", "Every fermion has a boson partner."),
            ("3.29.2", "Dark Matter Candidates", "text", "WIMPs, Axions."),
            ("3.29.3", "Neutrino Oscillations", "case_study", "Neutrinos have mass! (Nobel 2015)."),
            ("3.29.4", "Matter-Antimatter Asymmetry", "text", "Why are we here?"),
            ("3.29.5", "Grand Unified Theory (GUT)", "text", "Merging Strong, Weak, EM."),
            ("3.29.6", "String Theory", "text", "Particles are vibrating strings?"),
            ("3.29.7", "Simulator Task: Anomaly", "task", "Search for 'Rare Kaon Decay' in presets. Often a BSM channel."),
            ("3.29.8", "Quiz: SUSY", "quiz", {"q": "Selectron is partner of?", "a": ["Electron", "Proton", "Neutron"], "correct": 0}),
            ("3.29.9", "Flashcards: WIMP", "flashcard", {"front": "WIMP", "back": "Weakly Interacting Massive Particle"}),
            ("3.29.10", "Future Experiments", "text", "DUNE, Hyper-K, FCC.")
        ]
    },
    {
        "title": "30. Proposal Writing (BL4S)",
        "description": "How to become a scientist.",
        "icon": "PenTool",
        "subtopics": [
            ("3.30.1", "The Competition", "text", "Beamline for Schools context."),
            ("3.30.2", "Finding an Idea", "text", "Read papers, brainstorm."),
            ("3.30.3", "Feasibility Check", "case_study", "Can the T9 beam actually do this?"),
            ("3.30.4", "Simulating the Setup", "text", "Using tools like this website to optimize."),
            ("3.30.5", "Writing the Text", "text", "Clear, concise, English."),
            ("3.30.6", "Making the Video", "text", "Creativity counts."),
            ("3.30.7", "Simulator Task: Final Project", "task", "Design your own layout in 'Custom' preset."),
            ("3.30.8", "Quiz: Winning", "quiz", {"q": "Key to winning?", "a": ["Complex math", "Feasible & Creative idea", "Long video"], "correct": 1}),
            ("3.30.9", "Flashcards: BL4S", "flashcard", {"front": "Beamline", "back": "T9 (East Area)"}),
            ("3.30.10", "Good Luck!", "text", "The journey is the reward.")
        ]
    }
]

# Assemble full JSON
data = {
    "modules": [
        {"level": "beginner", "items": beginner_chapters},
        {"level": "intermediate", "items": intermediate_chapters},
        {"level": "advanced", "items": advanced_chapters}
    ]
}

# Write to file
with open('src/data/modules.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Modules.json generated successfully with 30 chapters!")
