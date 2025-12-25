import React from 'react';

// Replaced heavy shader with pure, "Apple clean" emptiness.
// Sometimes the best background is no background.
const ParticleFlow = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#F5F5F7]">
            {/* Optional: Very, very subtle mesh gradient if the user wants *something* */}
            <div
                className="absolute inset-0 opacity-40 mix-blend-soft-light"
                style={{
                    background: 'radial-gradient(circle at 50% 0%, #FFFFFF 0%, transparent 70%)'
                }}
            />
        </div>
    );
};

export default ParticleFlow;
