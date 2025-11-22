// Gravity.js
// Utility for calculating gravitational force between bodies
// Usage: Gravity.calculateForce(m1, m2, pos1, pos2)

export const Gravity = {
    G: 6.67430e-11, // Universal gravitational constant (m^3 kg^-1 s^-2)

    // Calculate gravitational force vector from m2 on m1
    // m1, m2: masses (kg)
    // pos1, pos2: {x, y, z} positions (meters or simulation units)
    calculateForce(m1, m2, pos1, pos2) {
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const dz = pos2.z - pos1.z;
        const rSquared = dx*dx + dy*dy + dz*dz;
        const r = Math.sqrt(rSquared);
        if (r === 0) return {x: 0, y: 0, z: 0};
        const F = this.G * m1 * m2 / rSquared;
        // Normalize direction
        const fx = F * dx / r;
        const fy = F * dy / r;
        const fz = F * dz / r;
        return { x: fx, y: fy, z: fz };
    }
};

// Example usage:
// const force = Gravity.calculateForce(m1, m2, {x:0,y:0,z:0}, {x:1000,y:0,z:0});
