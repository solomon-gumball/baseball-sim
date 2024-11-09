import { useLoader } from "@react-three/fiber"
import { range } from "lodash"
import { useEffect, useMemo } from "react"
import { DoubleSide, Mesh, MeshBasicMaterial, SRGBColorSpace, TextureLoader } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

export default function Crowd() {
  const crowdObj = useLoader(GLTFLoader, `${process.env.PUBLIC_URL}/assets/crowd-sprite.glb`)
  const { scene: parkScene } = useLoader(GLTFLoader, `${process.env.PUBLIC_URL}/assets/oracle-park.glb`)
  const assetsToLoad = useMemo(() => range(8).flatMap(v => range(4).map(i => `${process.env.PUBLIC_URL}/images/crowd/B_Cat${v + 1}_${i + 1}.webp`)), [])
  const frames = useLoader(TextureLoader, assetsToLoad)
  useEffect(() => {
    const crowdMember = parkScene.getObjectByName('CrowdPlatform') as Mesh
    crowdMember.castShadow = false
    let index = 0

    frames.forEach(frame => {
      frame.colorSpace = SRGBColorSpace
    })

    const materials: MeshBasicMaterial[] = []
    crowdMember.children.forEach((child, i) => {
      if (!(child instanceof Mesh)) return
      const mat = new MeshBasicMaterial({ map: frames[i * 4], side: DoubleSide })
      mat.depthWrite = true
      mat.alphaHash = true
      mat.transparent = false
      mat.needsUpdate = true
      child.material = mat
      materials.push(mat)
    })


    const timer = setInterval(() => {
      index = (index + 1) % 4;
      materials.forEach((mat, matIndex) => {
        mat.map = frames[matIndex * 4 + index]
      })
    }, 200)

    return () => {
      clearInterval(timer)
    }
  }, [crowdObj.scene, frames, parkScene])

  return (
    null
  )
}