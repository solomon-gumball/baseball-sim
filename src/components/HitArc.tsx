import { useRef, useMemo, useEffect } from "react"
import { Mesh, Vector3 } from "three"
import { GameFeed } from "../data/MLBGameFeed"
import { makeSymmetricalArc, inchesToM, mphToMetersPerSecond, feetToM } from "../util/MathUtil"

export default function HitArc({ pitchData, hitData, ballLandingLocation }: { pitchData: GameFeed.PitchData, hitData: GameFeed.HitData, ballLandingLocation?: [number, number, number] }) {
  const landingSpotMesh = useRef<Mesh>(null)

  const locations = useMemo(() => {
    if (ballLandingLocation == null) return

    const MAX_DURATION = 10
    let time = 0
    let increment = .01
    const positions: Vector3[] = []
    const arc = makeSymmetricalArc(
      feetToM(-pitchData.coordinates.pX), inchesToM(8.5), feetToM(pitchData.coordinates.pZ),
        ballLandingLocation[0], ballLandingLocation[2], 0,
        mphToMetersPerSecond(hitData.launchSpeed), // mph to m/s
        hitData.launchAngle,
    )
    while (time < MAX_DURATION) {
      const position = arc.positionAtTime(time)
      if (position.y < 0) break
      positions.push(position)
      time += increment
    }
    return positions
  }, [hitData, pitchData, ballLandingLocation])

  useEffect(() => {
    if (landingSpotMesh.current && ballLandingLocation) {
      landingSpotMesh.current.position.set(...ballLandingLocation)
    }
  }, [ballLandingLocation])

  return (
    <>
      {/* <mesh scale={1000} ref={landingSpotMesh} position={ballLandingLocation}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh> */}
      {locations?.map((location, i) => (
        <mesh scale={i === 0 ? .1 : .1} position={location} key={i} >
          <boxGeometry />
          <meshStandardMaterial color={i === 0 ? "red" : "hotpink"} />
        </mesh>
      ))}
    </>
  )
}