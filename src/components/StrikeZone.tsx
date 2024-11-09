import { useRef, useMemo } from "react"
import { DoubleSide, Euler, Mesh } from "three"
import { GameFeed } from "../data/MLBGameFeed"
import { feetToM, inchesToM } from "../util/MathUtil"

export default function StrikeZone({ pitchData, strikeZonePosition }: { pitchData: GameFeed.PitchData, strikeZonePosition?: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null)
  const verts = useMemo(() => {
    const strikeZoneHalfWidth = inchesToM(8.5)
    const strikeZoneTop = feetToM(pitchData.strikeZoneTop)
    const strikeZoneBottom = feetToM(pitchData.strikeZoneBottom)
    if (meshRef.current) {
      meshRef.current.geometry.attributes.position.needsUpdate = true
    }
    return new Float32Array([
      -strikeZoneHalfWidth, strikeZoneBottom,  0.0,
      strikeZoneHalfWidth , strikeZoneBottom,  0.0,
      strikeZoneHalfWidth , strikeZoneTop,     0.0,

      strikeZoneHalfWidth,  strikeZoneTop,     0.0,
      -strikeZoneHalfWidth, strikeZoneTop,     0.0,
      -strikeZoneHalfWidth, strikeZoneBottom,  0.0
    ])
  }, [pitchData.strikeZoneBottom, pitchData.strikeZoneTop])

  return (
    <>
      {strikeZonePosition && (
        <mesh
          scale={1}
          position={strikeZonePosition}
          rotation={new Euler(-Math.PI, 0, 0, 'XYZ')}
        >
          <ringGeometry args={[inchesToM(2.0), inchesToM(2.8)]} />
          <meshStandardMaterial side={DoubleSide} color="white" opacity={0.8}  />
        </mesh>
      )}
      <mesh ref={meshRef} scale={1} position={[0, 0, inchesToM(8.5)]}>
        <bufferGeometry attach="geometry">
          <bufferAttribute attach="attributes-position" array={verts} itemSize={3} count={6} />
        </bufferGeometry>
        <meshStandardMaterial transparent side={DoubleSide} opacity={0.3} color='white' />
      </mesh>
    </>
  )
}