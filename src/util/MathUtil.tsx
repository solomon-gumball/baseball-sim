import { degToRad } from "three/src/math/MathUtils"
import { GameFeed } from "../data/MLBGameFeed"
import { Vector3 } from "three"

export const feetToM = (feet: number) => feet * 0.3048
export const cmToFeet = (cm: number) => cm / 30.48
export const inchesToM = (inches: number) => (inches / 12) * 0.3048
export const mphToMetersPerSecond = (mph: number) => mph * 0.44704

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(v, max))

export const getLandingLocation = (hitData: GameFeed.HitData): [number, number, number] => {
  const sprayAngle = computeSprayAngle(hitData.coordinates.coordX, hitData.coordinates.coordY)
  const totalDistance = -feetToM(hitData.totalDistance)
  const deg = degToRad(sprayAngle - 90)
  return [Math.cos(deg) * totalDistance, 0, Math.sin(deg) * totalDistance]
}

export const computeSprayAngle = (hc_x: number, hc_y: number) => {
  // const angle = Math.atan((hc_x - 125.42) / (198.27 - hc_y)) * 180 / Math.PI * 0.75;
  const angle = Math.atan((hc_x - 125) / (199 - hc_y)) * 180 / Math.PI * 0.75;
  return Math.round(angle * 10) / 10; // rounding to one decimal place
}

interface SymmetricalArc {
  positionAtTime(seconds: number): Vector3,
  totalDuration(): number
}

export function makeSymmetricalArc(
  x0: number, y0: number, z0: number,   // Initial position (launch point)
  xf: number, yf: number, zf: number,   // Final position (landing point)
  speed: number,                       // Launch speed (m/s)
  launchAngle: number                 // Launch angle (in degrees)
): SymmetricalArc {
  return {
    positionAtTime(time: number) {
      // Convert launch angle from degrees to radians
      const launchAngleRad = (launchAngle * Math.PI) / 180;

      // Calculate the horizontal distance between launch and landing points
      const horizontalDistance = Math.sqrt((xf - x0) ** 2 + (yf - y0) ** 2);
      
      // Calculate the horizontal velocity component
      const horizontalSpeed = speed * Math.cos(launchAngleRad);

      // Calculate total flight time based on horizontal speed
      const totalTime = horizontalDistance / horizontalSpeed;
      
      // Calculate horizontal position (linear interpolation)
      const x = x0 + (xf - x0) * (time / totalTime);
      const y = y0 + (yf - y0) * (time / totalTime);

      // Calculate the maximum height (vertex of the parabola)
      const maxHeight = z0 + (horizontalDistance / 2) * Math.tan(launchAngleRad);

      // Parabolic interpolation for the vertical position
      // Adjust for different start and end heights
      const z = z0 + (maxHeight - z0) * (1 - (2 * time / totalTime - 1) ** 2) + (zf - z0) * (time / totalTime);

      return new Vector3(x, z, y);
    },
    totalDuration() {
      // Convert launch angle from degrees to radians
      const launchAngleRad = (launchAngle * Math.PI) / 180;
      // Calculate horizontal velocity (vx)
      const vx = speed * Math.cos(launchAngleRad);

      // Calculate horizontal distance between the start and end points
      const horizontalDistance = Math.sqrt((xf - x0) ** 2 + (yf - y0) ** 2);
      const timeForHorizontal = horizontalDistance / vx;
      const totalTime = timeForHorizontal;

      return totalTime;
    }
  }
}

// Function to compute the first possible intersection point, if any
export function findIntersection(
  ballPos: Vector3,
  ballDir: Vector3,
  ballSpeed: number,
  catcherPos: Vector3,
  catcherSpeed: number,
  startingInterceptTime: number
): { location: Vector3, t: number, requiredCatcherSpeed: number } | undefined {
  let t = startingInterceptTime
  const deltaT = 0.01
  const MAX_SECONDS = 5
  let lastDistance = Infinity

  while (t < MAX_SECONDS) {
      const dirClone = ballDir.clone()
      const currentBallPos = ballPos.clone().add(dirClone.multiplyScalar(ballSpeed * t))
      const dist = currentBallPos.distanceTo(catcherPos)
      const catcherMaxDistance = t * catcherSpeed

      const shouldOverrideResolve = lastDistance < dist && (ballSpeed > catcherSpeed)
      if (dist < catcherMaxDistance || shouldOverrideResolve) {
          return { location: currentBallPos, t, requiredCatcherSpeed: dist / t }
      }
      lastDistance = dist
      t += deltaT
  }

  return undefined
}

export function calculateTimeToCrossThreshold(
  x0: number, // initial position
  v0: number, // initial velocity
  a: number,  // acceleration
  threshold: number // threshold to cross (e.g. 0)
): number | null {
  // Quadratic equation coefficients
  const A = 0.5 * a; 
  const B = v0;
  const C = x0 - threshold;

  // Calculate discriminant (B^2 - 4AC)
  const discriminant = B * B - 4 * A * C;

  if (discriminant < 0) {
      // No real solution, the ball never crosses the threshold
      return null;
  }

  // Calculate both roots of the quadratic equation
  const t1 = (-B + Math.sqrt(discriminant)) / (2 * A);
  const t2 = (-B - Math.sqrt(discriminant)) / (2 * A);

  // Return the first positive root (time must be positive)
  if (t1 >= 0 && t2 >= 0) {
      return Math.min(t1, t2);
  } else if (t1 >= 0) {
      return t1;
  } else if (t2 >= 0) {
      return t2;
  } else {
      // Both roots are negative, meaning the threshold is never crossed in the future
      return null;
  }
}

export function getBallPositionDuringPitch(pitchData: GameFeed.PitchData, t: number): Vector3 {
  const initialPos = new Vector3(-pitchData.coordinates.x0, pitchData.coordinates.z0, pitchData.coordinates.y0).multiplyScalar(0.3048)
  const initialVelocity = new Vector3(-pitchData.coordinates.vX0, pitchData.coordinates.vZ0, pitchData.coordinates.vY0).multiplyScalar(0.3048)
  const averageAcceleration = new Vector3(-pitchData.coordinates.aX, pitchData.coordinates.aZ, pitchData.coordinates.aY).multiplyScalar(0.3048)
  return initialVelocity.multiply(new Vector3(t, t, t))
    .add(averageAcceleration.multiply(new Vector3(0.5, 0.5, 0.5)).multiply(new Vector3(Math.pow(t, 2), Math.pow(t, 2), Math.pow(t, 2))))
    .add(initialPos)
}

export function getBallXYSpeed(launchSpeed: number, elevationAngle: number): number {
  const phiRadians = elevationAngle * (Math.PI / 180);
  // The XY speed is the horizontal component of the 3D velocity
  // XY speed = launchSpeed * cos(elevationAngle)
  const xySpeed = launchSpeed * Math.cos(phiRadians);

  return xySpeed;
}

/**
 * @class Lagrange polynomial interpolation.
 * The computed interpolation polynomial will be referred to as L(x).
 * @example
 * const points = [{x:0, Y:0}, {x:0.5, y:0.8}, {x:1, y:1}];
 * const polynomial = new Lagrange(points);
 * console.log(polynomial.evaluate(0.1));
 */
export class Lagrange {
  xs: number[]
  ws: number[]
  ys: number[]
  k: number = 0

  constructor(points: { x: number, y: number }[]) {
    const ws: number[] = this.ws = [];
    const xs: number[] = this.xs = [];
    const ys: number[] = this.ys = [];
    if (points && points.length) {
      this.k = points.length;
      points.forEach(({ x, y }) => {
        xs.push(x);
        ys.push(y);
      });
      for (let w, j = 0; j < this.k; j++) {
        w = 1;
        for (let i = 0; i < this.k; i++) if (i !== j) w *= xs[j] - xs[i];
        ws[j] = 1 / w;
      }
    }
  }

  /**
   * Calculate L(x)
   */
  evaluate(x: number) {
    const { k, xs, ys, ws } = this;
    let a = 0,
      b = 0,
      c = 0;
    for (let j = 0; j < k; j++) {
      if (x === xs[j]) return ys[j];
      a = ws[j] / (x - xs[j]);
      b += a * ys[j];
      c += a;
    }
    return b / c;
  }
}