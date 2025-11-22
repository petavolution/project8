// KeplerianOrbit.js
// Utility for calculating positions of celestial bodies using Keplerian orbital elements
// Supports elliptical orbits with inclination, eccentricity, argument of periapsis, longitude of ascending node, etc.

// Orbital elements:
// - semiMajorAxis (a)
// - eccentricity (e)
// - inclination (i, radians)
// - longitudeOfAscendingNode (Ω, radians)
// - argumentOfPeriapsis (ω, radians)
// - meanAnomalyAtEpoch (M0, radians)
// - orbitalPeriod (T, seconds)

export function getOrbitalPosition({
    semiMajorAxis,
    eccentricity,
    inclination,
    longitudeOfAscendingNode,
    argumentOfPeriapsis,
    meanAnomalyAtEpoch,
    orbitalPeriod
}, time) {
    // Calculate mean anomaly
    const M = meanAnomalyAtEpoch + 2 * Math.PI * (time / orbitalPeriod);
    // Solve Kepler's equation for eccentric anomaly (E)
    let E = M;
    for (let i = 0; i < 6; i++) {
        E = M + eccentricity * Math.sin(E);
    }
    // True anomaly (ν)
    const nu = 2 * Math.atan2(
        Math.sqrt(1 + eccentricity) * Math.sin(E / 2),
        Math.sqrt(1 - eccentricity) * Math.cos(E / 2)
    );
    // Distance from focus
    const r = semiMajorAxis * (1 - eccentricity * Math.cos(E));
    // Position in orbital plane
    const xOrb = r * Math.cos(nu);
    const yOrb = r * Math.sin(nu);
    // Rotate to 3D space
    const cosO = Math.cos(longitudeOfAscendingNode);
    const sinO = Math.sin(longitudeOfAscendingNode);
    const cosI = Math.cos(inclination);
    const sinI = Math.sin(inclination);
    const cosW = Math.cos(argumentOfPeriapsis);
    const sinW = Math.sin(argumentOfPeriapsis);
    // Position in 3D
    const x = xOrb * (cosO * cosW - sinO * sinW * cosI) - yOrb * (cosO * sinW + sinO * cosW * cosI);
    const y = xOrb * (sinO * cosW + cosO * sinW * cosI) - yOrb * (sinO * sinW - cosO * cosW * cosI);
    const z = xOrb * (sinW * sinI) + yOrb * (cosW * sinI);
    return { x, y, z };
}
