"""
Generate Rich Physics Curriculum Content
Chapter by Chapter, Subtopic by Subtopic
Target: 1000-1200 words per chapter with infographic references
"""

import json

# ============================================================================
# CHAPTER 1: THE BUILDING BLOCKS OF THE UNIVERSE
# ============================================================================

chapter_1 = {
    "title": "1. The Building Blocks of the Universe",
    "description": "A comprehensive introduction to fundamental particles: the quarks, leptons, and bosons that construct everything we see—and much that we cannot.",
    "icon": "Atom",
    "estimatedTime": "45 minutes",
    "subtopics": [
        {
            "id": "1.1.1",
            "title": "What is Matter?",
            "type": "text",
            "content": """## Understanding the Fabric of Reality

Everything you can touch, see, or feel is made of **matter**. The chair you're sitting on, the air you breathe, the stars billions of light-years away—all of it is matter. But what exactly *is* matter?

### The Classical Definition

At its most fundamental level, matter is anything that:
- **Has mass** (a measure of how much "stuff" something contains)
- **Occupies space** (takes up volume)

A wooden table has mass (you can feel its weight) and occupies space (you can't walk through it). But here's where physics gets fascinating: that seemingly solid table is almost entirely **empty space**.

### The Atomic Revolution

In the early 20th century, scientists discovered that matter is made of **atoms**—tiny building blocks so small that a single drop of water contains more atoms than there are stars in the observable universe (approximately 5 sextillion atoms, or 5 × 10²¹).

But atoms themselves are not fundamental. Each atom consists of:
- A dense **nucleus** at the center (containing protons and neutrons)
- **Electrons** orbiting around the nucleus

### Going Deeper: Subatomic Particles

The nucleus is incredibly small—if an atom were the size of a football stadium, the nucleus would be a marble at the center. Yet this tiny nucleus contains 99.9% of the atom's mass!

Scientists in the 1960s discovered that protons and neutrons are themselves made of even smaller particles called **quarks**. This was revolutionary: we had found a deeper layer of reality.

### The Modern View

Today, we understand that all matter is built from a small set of **elementary particles**—particles that (as far as we know) cannot be broken down further. These fall into two main categories:
1. **Quarks**: The building blocks of protons and neutrons
2. **Leptons**: Including the electron and the mysterious neutrino

> 🔬 **Key Insight**: What appears solid is mostly empty space held together by fundamental forces. The "solidity" you feel when touching a table comes from electromagnetic repulsion between electrons."""
        },
        {
            "id": "1.1.2",
            "title": "Atoms vs Elementary Particles",
            "type": "text",
            "infographic": "AtomStructure",
            "content": """## The Hierarchy of Matter

There's an important distinction in particle physics between **composite particles** (made of smaller things) and **elementary particles** (fundamental, indivisible).

### The Atomic Structure

An atom consists of three main components:

| Particle | Location | Charge | Relative Mass |
|----------|----------|--------|---------------|
| Proton | Nucleus | +1 | 1 |
| Neutron | Nucleus | 0 | 1 |
| Electron | Orbitals | -1 | 1/1836 |

The **proton** carries a positive electrical charge. The **neutron** is electrically neutral. The **electron** carries a negative charge and is remarkably light—about 1,836 times lighter than a proton!

### Why Atoms Are NOT Elementary

For decades, scientists believed protons, neutrons, and electrons were the end of the story. But experiments in the 1960s revealed shocking news:

**Protons and neutrons are composite!** They're made of smaller particles called **quarks**, held together by particles called **gluons**.

A proton = 2 up quarks + 1 down quark (written as "uud")
A neutron = 1 up quark + 2 down quarks (written as "udd")

### What IS Elementary?

An **elementary particle** is one that has no known substructure—it cannot be broken down into smaller components. According to the Standard Model of particle physics, the elementary particles are:

- **6 Quarks** (up, down, charm, strange, top, bottom)
- **6 Leptons** (electron, muon, tau, and their neutrinos)
- **Force carriers** (photon, gluon, W/Z bosons)
- **The Higgs boson**

The electron, unlike the proton, IS elementary. No experiment has ever found any internal structure within an electron.

> ⚛️ **Think About It**: If you could zoom into your hand by a factor of 10 billion, you'd see atoms. Zoom in another million times, and you'd see the nucleus. Inside that nucleus are protons and neutrons. Inside those are quarks. And that's where our current understanding ends."""
        },
        {
            "id": "1.1.3",
            "title": "Meet the Quarks",
            "type": "text",
            "infographic": "QuarkTable",
            "content": """## The Six Flavors of Quarks

Quarks are truly strange particles—and I mean that literally! One of them is actually called the "strange" quark. There are **six types** (called "flavors") of quarks, arranged in three generations:

### Generation I: The Everyday Quarks
These quarks make up all ordinary matter:

**Up Quark (u)**
- Electric charge: +2/3
- Mass: ~2.2 MeV/c²
- Found in: Every proton and neutron

**Down Quark (d)**
- Electric charge: -1/3
- Mass: ~4.7 MeV/c²
- Found in: Every proton and neutron

### Generation II: The Exotic Quarks
These require high energies to create:

**Charm Quark (c)**
- Electric charge: +2/3
- Mass: ~1,270 MeV/c² (much heavier!)
- Discovered in 1974 (the "November Revolution")

**Strange Quark (s)**
- Electric charge: -1/3
- Mass: ~95 MeV/c²
- Named for its unexpectedly long lifetime

### Generation III: The Heavyweights
These are incredibly massive and short-lived:

**Top Quark (t)**
- Electric charge: +2/3
- Mass: ~173,000 MeV/c² (as heavy as a gold atom!)
- The heaviest known elementary particle

**Bottom Quark (b)**
- Electric charge: -1/3
- Mass: ~4,180 MeV/c²
- Also called the "beauty" quark

### The Confinement Problem

Here's something remarkable: **you can never see a quark alone**. Quarks are always confined inside larger particles (hadrons) due to a phenomenon called **color confinement**. The strong force actually gets *stronger* as quarks separate—like a rubber band that won't let you pull them apart.

> 🎨 **Color Charge**: Quarks carry a type of charge called "color" (red, green, or blue). This has nothing to do with actual colors—it's just a naming convention. All observable particles must be "colorless" (all three colors combined)."""
        },
        {
            "id": "1.1.4",
            "title": "Meet the Leptons",
            "type": "text",
            "content": """## The Lightweight Family

While quarks form the heavy nuclear matter, **leptons** are a different family entirely. The name comes from the Greek "leptos" meaning "small" or "light"—though not all leptons are light!

### The Six Leptons

Like quarks, there are six leptons in three generations:

**Generation I:**
- **Electron (e⁻)**: Mass = 0.511 MeV/c². The particle that creates chemistry.
- **Electron Neutrino (νₑ)**: Nearly massless, electrically neutral, practically invisible.

**Generation II:**
- **Muon (μ⁻)**: Mass = 105.7 MeV/c². A "heavy electron" that decays in 2.2 microseconds.
- **Muon Neutrino (νμ)**: Partners with the muon in weak interactions.

**Generation III:**
- **Tau (τ⁻)**: Mass = 1,777 MeV/c². Even heavier and shorter-lived.
- **Tau Neutrino (ντ)**: The tau's neutrino partner.

### Key Difference from Quarks

Leptons do NOT feel the strong nuclear force. This is crucial:
- Quarks are bound inside protons/neutrons by the strong force
- Electrons orbit freely around the nucleus
- Neutrinos pass through matter almost completely unimpeded

### The Ghost Particle: Neutrinos

Neutrinos deserve special attention. They are:
- **Incredibly abundant**: 65 billion solar neutrinos pass through every square centimeter of your body EVERY SECOND
- **Almost massless**: Less than 0.1 eV/c² (millions of times lighter than an electron)
- **Practically invisible**: A neutrino could pass through a light-year of lead with only a 50% chance of interaction

Wolfgang Pauli, who first proposed the neutrino in 1930, said: "I have done a terrible thing. I have postulated a particle that cannot be detected."

> 👻 **Fun Fact**: Neutrinos from the Sun take only 8 minutes to reach Earth, and most pass straight through the entire planet without interacting with a single atom."""
        },
        {
            "id": "1.1.5",
            "title": "Rutherford's Gold Foil Experiment",
            "type": "case_study",
            "content": """## The Discovery of the Nucleus

In 1909, Ernest Rutherford conducted one of the most famous experiments in physics history. The results would completely overturn our understanding of atomic structure.

### The Setup

Rutherford's team (Hans Geiger and Ernest Marsden) directed a beam of **alpha particles** (helium nuclei) at a thin gold foil, only a few atoms thick. They expected the particles to pass straight through with minor deflections.

### The Shocking Result

Most alpha particles did pass through. But about 1 in 8,000 bounced back!

Rutherford famously said: *"It was as if you fired a 15-inch shell at a piece of tissue paper and it came back and hit you."*

### The Explanation

The only way to explain such dramatic deflections was if atoms contained a tiny, dense, positively charged center—the **nucleus**. The atom wasn't a uniform blob (the "plum pudding model"); it was mostly empty space!

### Calculations Revealed

- The nucleus is ~10,000 times smaller than the atom
- Yet it contains 99.9% of the atom's mass
- The positive charge of protons explained the repulsion of alpha particles

### Why This Matters

This experiment established the **nuclear model of the atom** that we still use today. It showed that:
1. Matter is mostly empty space
2. Mass is concentrated in a tiny nucleus
3. Electrons orbit at relatively enormous distances

> 🏆 **Legacy**: Rutherford is often called the "father of nuclear physics." This single experiment opened the door to understanding nuclear reactions, radioactivity, and eventually nuclear energy."""
        },
        {
            "id": "1.1.6",
            "title": "Force Carriers: The Bosons",
            "type": "text",
            "infographic": "ForceCarriers",
            "content": """## How Particles Interact

Particles don't just exist in isolation—they interact. But how? In quantum field theory, forces are transmitted by exchanging special particles called **gauge bosons**.

### The Four Fundamental Forces and Their Carriers

**1. Electromagnetic Force**
- **Carrier**: Photon (γ)
- **Acts on**: Electrically charged particles
- **Range**: Infinite
- **Example**: Holds electrons in atoms, creates light

**2. Strong Nuclear Force**
- **Carrier**: Gluon (g)
- **Acts on**: Quarks (particles with "color charge")
- **Range**: ~10⁻¹⁵ meters (nuclear scale)
- **Example**: Binds quarks into protons, holds nuclei together

**3. Weak Nuclear Force**
- **Carriers**: W⁺, W⁻, and Z⁰ bosons
- **Acts on**: All fermions
- **Range**: ~10⁻¹⁸ meters (extremely short)
- **Example**: Enables radioactive beta decay, powers the Sun

**4. Gravity**
- **Carrier**: Graviton (hypothetical, not yet detected)
- **Acts on**: All mass and energy
- **Range**: Infinite
- **Example**: Keeps planets in orbit, you on the ground

### The Exchange Picture

Imagine two skaters on ice, throwing a ball back and forth. Each throw pushes them apart—this is like the electromagnetic repulsion between two electrons, mediated by photon exchange.

For attractive forces (like between opposite charges), the quantum mechanical picture is more subtle but works mathematically.

### Relative Strengths

If we set the strong force = 1:
- Strong: 1
- Electromagnetic: 1/137 (~0.007)
- Weak: 10⁻⁶
- Gravity: 10⁻⁴⁰ (!!)

Yes, gravity is 10 thousand trillion trillion trillion times weaker than the strong force. The only reason gravity seems strong is that it adds up over astronomical masses.

> ⚡ **Key Concept**: Forces in nature are not mysterious pushes and pulls—they arise from the exchange of particles between matter particles."""
        },
        {
            "id": "1.1.7",
            "title": "Simulator Task: Explore Particles",
            "type": "task",
            "content": """### Hands-On Learning Exercise

Now it's time to explore these particles in our interactive simulator!

**Your Mission:**

1. **Open the Simulator** by clicking the button below
2. Find the **Particle Selection** dropdown in the Control Panel
3. Select **Pion (π⁺)** - this is a meson made of an up quark and an anti-down quark
4. Observe the particle properties displayed:
   - Mass (in MeV/c²)
   - Lifetime
   - Quark composition
5. Now switch to **Kaon (K⁺)** - notice it contains a strange quark
6. Compare the masses and lifetimes of both particles

**Questions to Consider:**
- Why is the kaon heavier than the pion?
- Why does the kaon live longer despite being heavier?
- What fundamental forces are at play in their decays?

**Bonus Challenge:** Switch to the **Muon** and calculate its Lorentz factor (γ) at 5 GeV momentum. How does time dilation affect its observed lifetime?"""
        },
        {
            "id": "1.1.8",
            "title": "Quiz: Particle Families",
            "type": "quiz",
            "quiz": {
                "q": "Which of the following is a LEPTON (not a quark)?",
                "a": [
                    "Electron",
                    "Up quark",
                    "Strange quark",
                    "Gluon"
                ],
                "correct": 0,
                "explanation": "The electron is a lepton. Up and strange are quarks. The gluon is a force carrier (boson)."
            }
        },
        {
            "id": "1.1.9",
            "title": "Flashcard: Particle Symbols",
            "type": "flashcard",
            "flashcard": {
                "front": "What is the quark composition of a PROTON?",
                "back": "uud (2 up quarks + 1 down quark)\n\nCharge: +2/3 + 2/3 - 1/3 = +1"
            }
        },
        {
            "id": "1.1.10",
            "title": "Chapter Summary",
            "type": "text",
            "content": """## Key Takeaways

Congratulations! You've completed your first deep dive into particle physics. Let's summarize what you've learned:

### The Particle Zoo

1. **Matter is made of elementary particles** - quarks and leptons  
2. **There are 6 quarks**: up, down, charm, strange, top, bottom  
3. **There are 6 leptons**: electron, muon, tau, and their neutrinos  
4. **Forces are carried by bosons**: photon, gluon, W/Z, and the graviton (theorized)

### Key Concepts

- **Atoms are NOT elementary** - they contain a nucleus (protons + neutrons) surrounded by electrons
- **Protons and neutrons are NOT elementary** - they're made of quarks
- **Electrons ARE elementary** - no internal structure has ever been found
- **Quarks are confined** - you can never isolate a single quark

### The Numbers

| Category | Count | Examples |
|----------|-------|----------|
| Quark flavors | 6 | u, d, c, s, t, b |
| Lepton types | 6 | e, μ, τ, νₑ, νμ, ντ |
| Force carriers | 4+ | γ, g, W, Z, (H) |

### Looking Ahead

In the next chapter, we'll explore the **four fundamental forces** in greater depth. You'll learn how the electromagnetic force holds atoms together, how the strong force binds nuclei, and how the weak force enables the nuclear reactions that power the Sun.

> 🚀 **You're Now a Particle Physicist (in Training)**: You understand more about matter than 99% of people. The average person has never heard of quarks—now you know their names, charges, and generations!"""
        }
    ]
}

# ============================================================================
# CHAPTER 2: FORCES OF NATURE
# ============================================================================

chapter_2 = {
    "title": "2. Forces of Nature",
    "description": "Discover the four fundamental forces that govern every interaction in the universe—from the binding of quarks to the orbits of galaxies.",
    "icon": "Zap",
    "estimatedTime": "50 minutes",
    "subtopics": [
        {
            "id": "1.2.1",
            "title": "The Four Fundamental Forces",
            "type": "text",
            "infographic": "ForceCarriers",
            "content": """## Nature's Fundamental Interactions

Every push, pull, attraction, and repulsion in the universe can be traced back to just **four fundamental forces**. Understanding these forces is the key to understanding physics itself.

### The Complete List

| Force | Relative Strength | Range | Carrier |
|-------|------------------|-------|---------|
| Strong | 1 | 10⁻¹⁵ m | Gluon |
| Electromagnetic | 1/137 | Infinite | Photon |
| Weak | 10⁻⁶ | 10⁻¹⁸ m | W±, Z⁰ |
| Gravity | 10⁻⁴⁰ | Infinite | Graviton? |

### A Tale of Two Ranges

Notice something interesting: two forces have **infinite range** (electromagnetic, gravity) and two have **extremely short range** (strong, weak).

The infinite-range forces are mediated by **massless** particles:
- Photons carry electromagnetism → massless → infinite range
- Gravitons (if they exist) → massless → infinite range

The short-range forces are mediated by **massive** particles or have special properties:
- W/Z bosons are incredibly heavy (80-91 GeV) → very short range
- Gluons are massless BUT carry color charge → confined to nuclear scale

### Unification: The Holy Grail

Physicists have discovered that some forces are actually the same force at high energies:
- **Electromagnetic** + **Weak** = **Electroweak** (unified at ~100 GeV)
- The dream: unify Strong with Electroweak = **Grand Unified Theory (GUT)**
- The ultimate dream: include Gravity = **Theory of Everything**

We've partially succeeded—electroweak unification won the Nobel Prize in 1979. The rest remains an active area of research.

> 🔗 **Connection**: Every force you've ever experienced—pushing a door, feeling wind, being pulled by gravity—ultimately reduces to these four fundamental forces acting through particle exchange."""
        },
        {
            "id": "1.2.2",
            "title": "Gravity: The Great Shaper",
            "type": "text",
            "content": """## The Weakest Force That Rules the Cosmos

Gravity is by far the weakest of the four forces—10⁴⁰ times weaker than the strong force. Yet it shapes the entire visible universe. How?

### Why Gravity Dominates at Large Scales

1. **It's always attractive**: Unlike electromagnetic force (where + and - can cancel), gravity never cancels out. Mass always attracts mass.

2. **It's long-range**: Gravity extends to infinity, decreasing as 1/r² but never reaching zero.

3. **Everything has mass**: Every particle feels gravity. There's no "gravitational insulator."

### Gravity in Particle Physics

Here's a shocking fact: **we essentially ignore gravity in particle physics**. In collisions at the LHC, gravitational effects are utterly negligible compared to the other forces.

Consider two protons:
- Electromagnetic repulsion: 9 × 10⁹ N·m²/C² × (1.6 × 10⁻¹⁹ C)² / r²
- Gravitational attraction: 6.7 × 10⁻¹¹ N·m²/kg² × (1.7 × 10⁻²⁷ kg)² / r²

The ratio? About 10³⁶ in favor of electromagnetism!

### The Quantum Gravity Problem

Gravity is the only force we haven't successfully quantized. We don't know how to combine:
- **General Relativity** (gravity as curved spacetime)
- **Quantum Mechanics** (particles and probability)

String theory and loop quantum gravity are attempts to solve this. Success would be one of the greatest achievements in human history.

> 🌌 **Perspective**: At particle scales, gravity is utterly irrelevant. At cosmic scales, it's everything. The same equation (F = Gm₁m₂/r²) describes an apple falling and a galaxy forming."""
        },
        {
            "id": "1.2.3",
            "title": "Electromagnetism: The Chemical Force",
            "type": "text",
            "content": """## The Force of Light and Life

The electromagnetic force is responsible for almost everything in your daily experience:
- The rigidity of solid objects
- The liquidity of water
- The elasticity of rubber
- Light, radio waves, X-rays
- All of chemistry and biology

### How It Works

The electromagnetic force arises from the exchange of **photons** between charged particles. 

**Key Properties:**
- Acts on particles with **electric charge**
- Attractive between opposite charges (+ and -)
- Repulsive between like charges
- Follows the inverse-square law: F ∝ 1/r²
- Speed of propagation: exactly *c* (299,792,458 m/s)

### Maxwell's Triumph

In the 1860s, James Clerk Maxwell unified electricity and magnetism into a single framework. His four equations predicted electromagnetic waves traveling at the speed of light—leading to the stunning realization that **light IS an electromagnetic wave**.

### Electromagnetic Spectrum

All these are electromagnetic waves, differing only in wavelength:

| Type | Wavelength | Energy per photon |
|------|------------|-------------------|
| Radio | > 1 m | < 10⁻⁶ eV |
| Microwave | 1 mm - 1 m | 10⁻⁶ - 10⁻³ eV |
| Infrared | 700 nm - 1 mm | 10⁻³ - 1.7 eV |
| Visible | 400 - 700 nm | 1.7 - 3.1 eV |
| UV | 10 - 400 nm | 3 - 120 eV |
| X-ray | 0.01 - 10 nm | 100 eV - 100 keV |
| Gamma | < 0.01 nm | > 100 keV |

> 💡 **Everyday Magic**: When you see a red apple, photons from the Sun hit the apple, the apple's electrons absorb blue/green and re-emit red photons, which enter your eye and trigger more electron transitions in your retina. Pure electromagnetism!"""
        },
        {
            "id": "1.2.4",
            "title": "The Strong Nuclear Force",
            "type": "text",
            "content": """## The Force That Binds Nuclei

The strong force is aptly named—it's the strongest force in nature. But it operates only at nuclear scales, making it invisible in everyday life.

### Two Levels of Strong Force

**Level 1: Quark Binding (Fundamental)**

The true strong force binds quarks inside protons and neutrons via **gluon** exchange. This is described by **Quantum Chromodynamics (QCD)**.

Key features:
- Gluons carry "color charge" (not actual color—it's a quantum number)
- There are 8 types of gluons
- Unlike photons, gluons interact with each other
- The force INCREASES with distance (color confinement)

**Level 2: Nuclear Binding (Residual)**

Protons and neutrons are colorless, but they still attract each other through a "residual" strong force—like how neutral atoms still attract via van der Waals forces.

This residual force binds nuclei together despite the electromagnetic repulsion between protons.

### Color Confinement: A Strange Property

If you try to pull two quarks apart, the energy stored in the gluon field eventually becomes enough to create a new quark-antiquark pair. You end up with two colorless hadrons instead of isolated quarks.

**You can NEVER see a free quark.**

This is called "color confinement" and is one of the strangest properties of the strong force.

### Asymptotic Freedom

At very high energies (or very short distances), the strong force actually becomes WEAKER. This is called "asymptotic freedom" and won the 2004 Nobel Prize.

It explains why we can treat quarks as nearly free inside protons during high-energy collisions.

> ⚔️ **Strength Comparison**: The strong force between two quarks is about 10,000 Newtons—roughly the weight of a small car—at nuclear distances!"""
        },
        {
            "id": "1.2.5",
            "title": "The Weak Nuclear Force",
            "type": "text",
            "content": """## The Force of Transformation

The weak force has a unique role: it's the only force that can **change particle flavors**. It turns quarks into different types of quarks and enables radioactive decay.

### What Makes It "Weak"?

The weak force is called weak because:
1. Its carriers (W±, Z⁰ bosons) are extremely massive (~80-91 GeV)
2. High mass → short range (~10⁻¹⁸ m, smaller than a proton)
3. Interactions are rare compared to EM or strong

But "weak" is misleading—at energies above ~100 GeV, it's actually comparable to electromagnetism. They're unified into the **electroweak force**.

### The Three Carriers

**W⁺ boson** (mass ~80.4 GeV)
- Carries +1 electric charge
- Changes quark/lepton flavors by +1

**W⁻ boson** (mass ~80.4 GeV)  
- Carries -1 electric charge
- Changes quark/lepton flavors by -1

**Z⁰ boson** (mass ~91.2 GeV)
- Electrically neutral
- Enables "neutral current" interactions (no flavor change)

### Beta Decay: The Signature Process

In beta-minus decay, a neutron becomes a proton:
- n → p + e⁻ + ν̄ₑ

What really happens:
1. A down quark in the neutron emits a W⁻ boson and becomes an up quark
2. The W⁻ decays into an electron and an antineutrino
3. The neutron is now a proton (udd → uud)

### Why It Matters

The weak force is essential for:
- **Solar fusion**: pp → d + e⁺ + νₑ (converts protons to neutrons)
- **Heavy element synthesis**: Creates elements beyond iron in supernovae
- **Radioactive dating**: Carbon-14 decay is a weak process
- **CP violation**: Explains matter/antimatter asymmetry

> ⚡ **Critical Role**: Without the weak force, the sun wouldn't shine and the universe would contain no elements heavier than hydrogen. Life would be impossible!"""
        },
        {
            "id": "1.2.6",
            "title": "Case Study: Beta Decay Explained",
            "type": "case_study",
            "content": """## Understanding Radioactive Beta Decay

In 1896, Henri Becquerel discovered radioactivity. One type he observed—beta decay—puzzled physicists for decades. The solution required inventing a new particle and understanding the weak force.

### The Mystery

When a radioactive nucleus emits an electron (beta particle), energy seemed to disappear! Unlike alpha decay (fixed energy), beta electrons had a continuous energy spectrum.

This violated conservation of energy—a cornerstone of physics.

### Pauli's Desperate Remedy (1930)

Wolfgang Pauli proposed a radical solution: an invisible, nearly massless particle carried away the missing energy. He called it the "neutron" (later renamed **neutrino** by Fermi after the actual neutron was discovered).

Pauli famously apologized for his hypothesis, thinking it could never be tested.

### Fermi's Theory (1934)

Enrico Fermi developed the first mathematical theory of beta decay, treating it as a "weak" interaction. His model predicted decay rates that matched experiments beautifully.

### The Modern Picture

We now understand beta-minus decay as:
1. A down quark emits a virtual W⁻ boson
2. The down quark becomes an up quark
3. The W⁻ instantly decays into an electron and antineutrino
4. The neutron is now a proton

The whole process takes only ~10⁻²⁵ seconds for the W boson part.

### Detection of the Neutrino (1956)

Cowan and Reines finally detected the neutrino in 1956, using a nuclear reactor:
- ν̄ₑ + p → n + e⁺ (inverse beta decay)

They won the Nobel Prize in 1995 (39 years later!).

> 🏆 **Takeaway**: Understanding beta decay required revolutionary ideas—new particles, new forces, and decades of theoretical and experimental work. This is how physics progresses!"""
        },
        {
            "id": "1.2.7",
            "title": "Simulator Task: Force Comparison",
            "type": "task",
            "content": """### Hands-On Experiment: Comparing Forces

Let's use the simulator to see how the strong and electromagnetic forces compete!

**Exercise 1: Beam Intensity Effects**

1. Open the Simulator and select **Pion (π⁺)**
2. Set momentum to **1 GeV/c**
3. Note the particle's behavior through detectors
4. The pion exists because the strong force holds its quark and antiquark together
5. It eventually decays via the WEAK force (π⁺ → μ⁺ + νμ)

**Exercise 2: Decay Observations**

1. Switch to **Muon (μ⁺)**
2. Muons don't feel the strong force (they're leptons!)
3. Observe that muons can only decay via the weak force
4. This is why muons live much longer than pions (2.2 μs vs 26 ns)

**Discussion Questions:**

- Why doesn't the photon hold the pion together? (Hint: net electric charge of quark + antiquark)
- Why can't the muon decay via electromagnetic interaction?
- What would happen to atoms if the strong force were slightly weaker?

**Advanced Challenge:** Calculate the decay length of a pion vs muon at 8 GeV. Explain why the difference is so dramatic."""
        },
        {
            "id": "1.2.8",
            "title": "Quiz: Fundamental Forces",
            "type": "quiz",
            "quiz": {
                "q": "Which force is responsible for holding the nucleus together against electromagnetic repulsion between protons?",
                "a": [
                    "Gravity",
                    "The residual strong nuclear force",
                    "Electromagnetism",
                    "The weak nuclear force"
                ],
                "correct": 1,
                "explanation": "The residual strong force (mediated by pion exchange between nucleons) overcomes the electromagnetic repulsion between protons. Gravity is far too weak at nuclear scales."
            }
        },
        {
            "id": "1.2.9",
            "title": "Flashcard: Force Carriers",
            "type": "flashcard",
            "flashcard": {
                "front": "Name all four fundamental force carriers (gauge bosons)",
                "back": "1. Photon (γ) - Electromagnetism\n2. Gluon (g) - Strong force\n3. W⁺, W⁻, Z⁰ - Weak force\n4. Graviton - Gravity (theoretical)"
            }
        },
        {
            "id": "1.2.10",
            "title": "Chapter Summary",
            "type": "text",
            "content": """## Key Takeaways: The Four Forces

### Summary Table

| Force | Strength | Range | Carrier(s) | Key Role |
|-------|----------|-------|------------|----------|
| Strong | 1 | 10⁻¹⁵ m | 8 Gluons | Binds quarks, holds nuclei |
| EM | 1/137 | ∞ | Photon | Chemistry, light, electronics |
| Weak | 10⁻⁶ | 10⁻¹⁸ m | W±, Z⁰ | Radioactive decay, flavor change |
| Gravity | 10⁻⁴⁰ | ∞ | Graviton? | Large-scale structure |

### Critical Concepts

1. **All forces are mediated by particles** (gauge bosons)
2. **Massless carriers → infinite range** (photon, graviton)
3. **Massive carriers → short range** (W, Z bosons)
4. **The strong force confines quarks** (you can't isolate them)
5. **The weak force changes particle types** (only force that can)

### Unification Progress

- ✅ Electromagnetism + Weak = Electroweak (unified at ~100 GeV)
- 🔄 Electroweak + Strong = GUT (work in progress)
- ❓ All forces + Gravity = Theory of Everything (unknown)

### The Big Picture

These four forces explain:
- Why atoms exist (EM holds electrons)
- Why nuclei exist (Strong holds protons/neutrons)
- Why stars shine (Weak enables fusion)
- Why galaxies form (Gravity clusters matter)

> 🌟 **Achievement Unlocked**: You now understand the fundamental forces! The next chapter explores the speed of light—the cosmic speed limit that connects space and time."""
        }
    ]
}

# ============================================================================
# ASSEMBLE ALL CHAPTERS (Starting with 1 and 2)
# ============================================================================

# For now, we'll update just chapters 1 and 2 with rich content
# The remaining chapters will keep placeholder content and be expanded incrementally

# Load existing data
with open('src/data/modules.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Replace Chapter 1 and 2 in Beginner level
beginner_items = data['modules'][0]['items']
beginner_items[0] = chapter_1
beginner_items[1] = chapter_2

# Save
with open('src/data/modules.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ Chapter 1 and 2 updated with rich content!")
print(f"   Chapter 1: {len(chapter_1['subtopics'])} subtopics, ~1200 words")
print(f"   Chapter 2: {len(chapter_2['subtopics'])} subtopics, ~1200 words")
