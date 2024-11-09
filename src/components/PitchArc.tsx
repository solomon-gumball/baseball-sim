import { useMemo } from "react"
import { Vector3 } from "three"
import { GameFeed } from "../data/MLBGameFeed"
import { getBallPositionDuringPitch } from "../util/MathUtil"

export default function PitchArc({ pitchData }: { pitchData: GameFeed.PitchData }) {
  const locations = useMemo(() => {
    let i = 0
    let positions: Vector3[] = []
    while (i < 500) {
      const ballPos = getBallPositionDuringPitch(pitchData, i * .02)
      if (ballPos.z < 0) break
      positions.push(ballPos)
      i++
    }
    return positions
  }, [pitchData])

  return (
    <>
      {locations.map((location, i) => (
        <mesh scale={i === 0 ? .15 : .05} position={location} key={i} >
          <boxGeometry />
          <meshStandardMaterial color={i === 0 ? "red" : "yellow"} />
        </mesh>
      ))}
    </>
  )
}