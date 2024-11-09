import { Text } from "@react-three/drei"
import { Color } from "@react-three/fiber"
import { feetToM } from "../util/MathUtil"
import { FIELD_LOCATION } from "../Constants"

export default function DebugLocation({ title, position, visible = true, color = 'purple' }: { title?: string, position?: [number, number, number] | undefined, visible?: boolean, color?: Color }) {
  return (
    <group
      ref={ref => {
        ref?.lookAt(FIELD_LOCATION.BASE.HOME)
        ref?.rotateX(-Math.PI / 2)
      }}
      position={position && [position[0], position[1] + feetToM(.03), position[2]]}
      visible={visible}
    >
      <mesh scale={1}>
        <ringGeometry />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
          position={[feetToM(4), 0, 0]}
          scale={[0.1, 0.1, 0.1]}
          fontSize={10}
          color="white" // default
          anchorX="left" // default
          anchorY="middle" // default
        >
          {title}
        </Text>
    </group>
  )
}