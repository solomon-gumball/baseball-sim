import { useFrame } from '@react-three/fiber'
import { range } from 'lodash'
import { useMemo, useRef, useState } from 'react'
import { Mesh, Object3D, RingGeometry, Vector3 } from 'three'
import { Lagrange } from '../util/MathUtil'

type Particle = {
  mesh: Object3D
  velocity: Vector3,
  currentPos: Vector3,
  scale: number
}

const scale = new Lagrange([
  { x: 0, y: 0 },
  { x: .2, y: .9 },
  { x: .5, y: 1 },
  { x: .8, y: .9 },
  { x: 1, y: 0 },
])

function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4);
  }

export default function BallImpactLocation({ position }: { position: Vector3 }) {
  const startTime = useMemo(() => Date.now(), [])
  const ringMesh = useRef<Mesh>(null)
  const [particles, setParticles] = useState<Particle[]>(() => {
    return range(10).map((v, i) => {
      return {
        velocity: new Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize().multiplyScalar(0.2 + Math.random() * .5),
        currentPos: new Vector3(),
        mesh: new Mesh(),
        scale: (0.2 + Math.random() * 0.5) * 0.3
      }
    })
  })

  useFrame(() => {
    const elapsedTime = Date.now() - startTime
    const totalDuration = 600
    if (elapsedTime > totalDuration) return

    const normalizedProg = elapsedTime / totalDuration
    particles.forEach(particle => {
      particle.currentPos.copy(particle.velocity)
      particle.currentPos.multiplyScalar(easeOutQuart(normalizedProg) * 3)
      particle.mesh.position.set(particle.currentPos.x, particle.currentPos.y, particle.currentPos.z)
      const scaleN = scale.evaluate(elapsedTime / totalDuration) * particle.scale
      particle.mesh.scale.set(scaleN, scaleN, scaleN)
    })

    const ringGeom = new RingGeometry(easeOutQuart(normalizedProg) * 1, 1)
    if (ringMesh.current) {
      const calcScale = easeOutQuart(normalizedProg)
      ringMesh.current.geometry = ringGeom
      ringMesh.current.scale.set(calcScale, calcScale, calcScale) 
    }
  })

  return (
    <group position={position}>
      <mesh rotation-x={Math.PI * 1.5} ref={ringMesh} position={[0, .1, 0]}>
        <meshStandardMaterial color={"white"} />
      </mesh>
      {particles?.map((particle, i) => (
        <primitive key={i} object={particle.mesh}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color="white" />
        </primitive>
      ))}
    </group>
  )
}