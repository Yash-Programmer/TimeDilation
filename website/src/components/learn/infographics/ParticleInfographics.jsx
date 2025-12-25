import React, { useRef, useEffect } from 'react';

/**
 * Interactive Atom Structure Diagram
 * Shows protons, neutrons, electrons with orbital animation
 */
export const AtomStructure = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;

        let animationId;
        let angle = 0;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Background gradient
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
            gradient.addColorStop(0, 'rgba(0, 51, 160, 0.1)');
            gradient.addColorStop(1, 'rgba(0, 51, 160, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Draw electron orbitals (shells)
            const shells = [60, 100, 140];
            shells.forEach((radius, i) => {
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(100, 149, 237, ${0.3 - i * 0.08})`;
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);
                ctx.stroke();
                ctx.setLineDash([]);
            });

            // Draw nucleus (protons and neutrons)
            const nucleusRadius = 25;
            ctx.beginPath();
            ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2);
            const nucleusGradient = ctx.createRadialGradient(centerX - 5, centerY - 5, 0, centerX, centerY, nucleusRadius);
            nucleusGradient.addColorStop(0, '#FF6B6B');
            nucleusGradient.addColorStop(1, '#C92A2A');
            ctx.fillStyle = nucleusGradient;
            ctx.fill();

            // Protons inside nucleus
            const protonPositions = [
                { x: -8, y: -5 }, { x: 8, y: -5 }, { x: 0, y: 8 }
            ];
            protonPositions.forEach(pos => {
                ctx.beginPath();
                ctx.arc(centerX + pos.x, centerY + pos.y, 6, 0, Math.PI * 2);
                ctx.fillStyle = '#E03131';
                ctx.fill();
                ctx.fillStyle = 'white';
                ctx.font = 'bold 8px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('+', centerX + pos.x, centerY + pos.y);
            });

            // Draw electrons orbiting
            const electronConfigs = [
                { shell: 60, count: 2, speed: 0.02 },
                { shell: 100, count: 8, speed: 0.015 },
                { shell: 140, count: 6, speed: 0.01 }
            ];

            electronConfigs.forEach((config, shellIndex) => {
                for (let i = 0; i < config.count; i++) {
                    const electronAngle = angle * config.speed * 60 + (i * Math.PI * 2 / config.count);
                    const x = centerX + Math.cos(electronAngle) * config.shell;
                    const y = centerY + Math.sin(electronAngle) * config.shell;

                    // Electron glow
                    const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 12);
                    glowGradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
                    glowGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
                    ctx.fillStyle = glowGradient;
                    ctx.beginPath();
                    ctx.arc(x, y, 12, 0, Math.PI * 2);
                    ctx.fill();

                    // Electron
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, Math.PI * 2);
                    ctx.fillStyle = '#3B82F6';
                    ctx.fill();
                    ctx.fillStyle = 'white';
                    ctx.font = 'bold 6px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('-', x, y);
                }
            });

            // Labels
            ctx.fillStyle = '#1E293B';
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Nucleus', centerX, centerY + 50);
            ctx.font = '11px Inter, sans-serif';
            ctx.fillStyle = '#64748B';
            ctx.fillText('(Protons + Neutrons)', centerX, centerY + 65);

            ctx.fillStyle = '#3B82F6';
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillText('Electrons (e⁻)', centerX + 120, centerY - 130);

            angle += 1;
            animationId = requestAnimationFrame(draw);
        };

        draw();

        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <div className="my-8 p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200">
            <h4 className="text-lg font-bold text-slate-800 mb-4 text-center">🔬 Interactive: Atomic Structure</h4>
            <canvas
                ref={canvasRef}
                width={400}
                height={320}
                className="mx-auto block rounded-xl bg-white shadow-inner"
            />
            <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-4 h-4 rounded-full bg-red-500 mx-auto mb-1"></div>
                    <span className="font-medium text-slate-700">Protons (+)</span>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-4 h-4 rounded-full bg-gray-400 mx-auto mb-1"></div>
                    <span className="font-medium text-slate-700">Neutrons (0)</span>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-4 h-4 rounded-full bg-blue-500 mx-auto mb-1"></div>
                    <span className="font-medium text-slate-700">Electrons (−)</span>
                </div>
            </div>
        </div>
    );
};

/**
 * Quark Types Visualization
 * Shows all 6 quark flavors with properties
 */
export const QuarkTable = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear
        ctx.fillStyle = '#FAFAFA';
        ctx.fillRect(0, 0, width, height);

        const quarks = [
            { name: 'Up', symbol: 'u', charge: '+2/3', mass: '2.2 MeV', color: '#22C55E', gen: 1 },
            { name: 'Down', symbol: 'd', charge: '-1/3', mass: '4.7 MeV', color: '#3B82F6', gen: 1 },
            { name: 'Charm', symbol: 'c', charge: '+2/3', mass: '1.27 GeV', color: '#F59E0B', gen: 2 },
            { name: 'Strange', symbol: 's', charge: '-1/3', mass: '95 MeV', color: '#8B5CF6', gen: 2 },
            { name: 'Top', symbol: 't', charge: '+2/3', mass: '173 GeV', color: '#EF4444', gen: 3 },
            { name: 'Bottom', symbol: 'b', charge: '-1/3', mass: '4.18 GeV', color: '#EC4899', gen: 3 },
        ];

        // Title
        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('The Six Quark Flavors', width / 2, 30);

        // Generation labels
        ctx.font = '12px Inter, sans-serif';
        ctx.fillStyle = '#64748B';
        ['Generation I', 'Generation II', 'Generation III'].forEach((label, i) => {
            ctx.fillText(label, 85 + i * 150, 55);
        });

        // Draw quark cards
        quarks.forEach((quark, i) => {
            const col = quark.gen - 1;
            const row = quark.charge === '+2/3' ? 0 : 1;
            const x = 20 + col * 150;
            const y = 70 + row * 110;

            // Card background
            ctx.fillStyle = 'white';
            ctx.shadowColor = 'rgba(0,0,0,0.1)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 2;
            ctx.beginPath();
            ctx.roundRect(x, y, 130, 95, 12);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Colored accent
            ctx.fillStyle = quark.color;
            ctx.beginPath();
            ctx.roundRect(x, y, 130, 6, [12, 12, 0, 0]);
            ctx.fill();

            // Symbol circle
            ctx.beginPath();
            ctx.arc(x + 35, y + 45, 22, 0, Math.PI * 2);
            ctx.fillStyle = quark.color + '20';
            ctx.fill();
            ctx.fillStyle = quark.color;
            ctx.font = 'bold 24px Georgia, serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(quark.symbol, x + 35, y + 45);

            // Name and properties
            ctx.textAlign = 'left';
            ctx.fillStyle = '#1E293B';
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.fillText(quark.name, x + 65, y + 35);

            ctx.fillStyle = '#64748B';
            ctx.font = '11px Inter, sans-serif';
            ctx.fillText(`Q: ${quark.charge}`, x + 65, y + 52);
            ctx.fillText(`m: ${quark.mass}`, x + 65, y + 67);
        });

    }, []);

    return (
        <div className="my-8 p-6 bg-gradient-to-br from-slate-50 to-green-50 rounded-2xl border border-slate-200">
            <canvas
                ref={canvasRef}
                width={480}
                height={290}
                className="mx-auto block rounded-xl"
            />
            <p className="text-center text-sm text-slate-500 mt-4">
                💡 Quarks combine in groups of 2 (mesons) or 3 (baryons) to form hadrons
            </p>
        </div>
    );
};

/**
 * Standard Model Overview
 * Interactive particle family tree
 */
export const StandardModelDiagram = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.fillStyle = '#FAFAFA';
        ctx.fillRect(0, 0, width, height);

        // Section backgrounds
        const sections = [
            { x: 10, y: 50, w: 180, h: 200, label: 'QUARKS', color: '#22C55E20', borderColor: '#22C55E' },
            { x: 200, y: 50, w: 180, h: 200, label: 'LEPTONS', color: '#3B82F620', borderColor: '#3B82F6' },
            { x: 390, y: 50, w: 90, h: 200, label: 'BOSONS', color: '#F59E0B20', borderColor: '#F59E0B' },
            { x: 490, y: 50, w: 60, h: 200, label: 'HIGGS', color: '#EC489920', borderColor: '#EC4899' },
        ];

        sections.forEach(sec => {
            ctx.fillStyle = sec.color;
            ctx.beginPath();
            ctx.roundRect(sec.x, sec.y, sec.w, sec.h, 8);
            ctx.fill();
            ctx.strokeStyle = sec.borderColor;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = sec.borderColor;
            ctx.font = 'bold 10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(sec.label, sec.x + sec.w / 2, sec.y + 18);
        });

        // Title
        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('The Standard Model of Particle Physics', width / 2, 30);

        // Particles
        const drawParticle = (x, y, symbol, name, color) => {
            ctx.beginPath();
            ctx.arc(x, y, 18, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px Georgia, serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(symbol, x, y);
            ctx.fillStyle = '#475569';
            ctx.font = '9px Inter, sans-serif';
            ctx.fillText(name, x, y + 28);
        };

        // Quarks
        drawParticle(55, 95, 'u', 'up', '#22C55E');
        drawParticle(100, 95, 'c', 'charm', '#16A34A');
        drawParticle(145, 95, 't', 'top', '#15803D');
        drawParticle(55, 165, 'd', 'down', '#3B82F6');
        drawParticle(100, 165, 's', 'strange', '#2563EB');
        drawParticle(145, 165, 'b', 'bottom', '#1D4ED8');

        // Leptons
        drawParticle(245, 95, 'e', 'electron', '#8B5CF6');
        drawParticle(290, 95, 'μ', 'muon', '#7C3AED');
        drawParticle(335, 95, 'τ', 'tau', '#6D28D9');
        drawParticle(245, 165, 'νₑ', 'e neutrino', '#A78BFA');
        drawParticle(290, 165, 'νμ', 'μ neutrino', '#8B5CF6');
        drawParticle(335, 165, 'ντ', 'τ neutrino', '#7C3AED');

        // Bosons
        drawParticle(435, 90, 'γ', 'photon', '#F59E0B');
        drawParticle(435, 140, 'g', 'gluon', '#D97706');
        drawParticle(435, 190, 'Z', 'Z boson', '#B45309');
        drawParticle(435, 230, 'W', 'W boson', '#92400E');

        // Higgs
        drawParticle(520, 140, 'H', 'Higgs', '#EC4899');

    }, []);

    return (
        <div className="my-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <canvas
                ref={canvasRef}
                width={560}
                height={270}
                className="mx-auto block"
            />
        </div>
    );
};

/**
 * Force Carriers Diagram
 */
export const ForceCarriers = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);

        const forces = [
            {
                name: 'Electromagnetic',
                carrier: 'Photon (γ)',
                strength: 'Strong',
                range: 'Infinite',
                color: '#F59E0B',
                affects: 'Charged particles'
            },
            {
                name: 'Strong Nuclear',
                carrier: 'Gluon (g)',
                strength: 'Strongest',
                range: '10⁻¹⁵ m',
                color: '#22C55E',
                affects: 'Quarks'
            },
            {
                name: 'Weak Nuclear',
                carrier: 'W±, Z⁰',
                strength: 'Weak',
                range: '10⁻¹⁸ m',
                color: '#3B82F6',
                affects: 'All fermions'
            },
            {
                name: 'Gravity',
                carrier: 'Graviton (?)',
                strength: 'Weakest',
                range: 'Infinite',
                color: '#8B5CF6',
                affects: 'All mass/energy'
            },
        ];

        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('The Four Fundamental Forces', width / 2, 25);

        forces.forEach((force, i) => {
            const y = 50 + i * 65;

            // Card
            ctx.fillStyle = force.color + '15';
            ctx.beginPath();
            ctx.roundRect(15, y, width - 30, 55, 10);
            ctx.fill();
            ctx.strokeStyle = force.color;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Color bar
            ctx.fillStyle = force.color;
            ctx.beginPath();
            ctx.roundRect(15, y, 6, 55, [10, 0, 0, 10]);
            ctx.fill();

            // Text
            ctx.textAlign = 'left';
            ctx.fillStyle = '#1E293B';
            ctx.font = 'bold 13px Inter, sans-serif';
            ctx.fillText(force.name, 35, y + 20);

            ctx.fillStyle = '#64748B';
            ctx.font = '11px Inter, sans-serif';
            ctx.fillText(`Carrier: ${force.carrier}`, 35, y + 38);

            ctx.textAlign = 'right';
            ctx.fillStyle = force.color;
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillText(force.strength, width - 25, y + 20);
            ctx.fillStyle = '#64748B';
            ctx.font = '10px Inter, sans-serif';
            ctx.fillText(`Range: ${force.range}`, width - 25, y + 38);
        });

    }, []);

    return (
        <div className="my-8">
            <canvas
                ref={canvasRef}
                width={500}
                height={320}
                className="mx-auto block rounded-2xl border border-slate-200 shadow-sm"
            />
        </div>
    );
};

export default {
    AtomStructure,
    QuarkTable,
    StandardModelDiagram,
    ForceCarriers
};
