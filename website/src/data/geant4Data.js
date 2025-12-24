export const geant4Data = [
  // Sample data row based on the CSV structure
  {
    eventID: 0,
    primaryPDG: 211, // Pion
    primaryMom: 8.01,
    rich1Beta: 0.9998,
    rich2Beta: 0.9997,
    caloTotalE: 8.05,
    caloEoP: 1.005,
    decayed: 0,
    survived: 1,
    tof: 50.1,
    decayPosZ: 15.2,
  },
  {
    eventID: 1,
    primaryPDG: 321, // Kaon
    primaryMom: 7.99,
    rich1Beta: 0.9981,
    rich2Beta: 0.9980,
    caloTotalE: 8.00,
    caloEoP: 1.001,
    decayed: 1,
    survived: 0,
    tof: 33.4,
    decayPosZ: 10.5,
  },
  {
    eventID: 2,
    primaryPDG: -13, // Muon
    primaryMom: 8.02,
    rich1Beta: 0.9999,
    rich2Beta: 0.9999,
    caloTotalE: 2.1,
    caloEoP: 0.26,
    decayed: 0,
    survived: 1,
    tof: 50.05,
    decayPosZ: 20.0,
  },
  // Add more fake data points to simulate a full run
  ...Array.from({ length: 100 }, (_, i) => ({
    eventID: i + 3,
    primaryPDG: Math.random() > 0.8 ? 321 : 211, // Mostly Pions
    primaryMom: 8.0 + (Math.random() - 0.5) * 0.2,
    rich1Beta: Math.random() > 0.8 ? 0.9981 : 0.9998,
    decayed: Math.random() > 0.8 ? 1 : 0, // Simplified
    survived: Math.random() > 0.8 ? 0 : 1,
    tof: 50 + Math.random(),
    decayPosZ: Math.random() * 15,
  }))
];

// Helper to get aggregated stats
export const getStats = () => {
    const total = geant4Data.length;
    const pions = geant4Data.filter(d => d.primaryPDG === 211).length;
    const kaons = geant4Data.filter(d => d.primaryPDG === 321).length;
    const decayed = geant4Data.filter(d => d.decayed === 1).length;

    return { total, pions, kaons, decayed };
};
