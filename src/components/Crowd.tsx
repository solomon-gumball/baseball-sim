import { useTexture } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import { range } from "lodash"
import { useEffect, useMemo } from "react"
import { DoubleSide, Material, Mesh, MeshBasicMaterial, MeshStandardMaterial, SRGBColorSpace, TextureLoader } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

export default function Crowd() {
  const crowdObj = useLoader(GLTFLoader, '/assets/crowd-sprite.glb')
  const { scene: parkScene } = useLoader(GLTFLoader, '/assets/oracle-park.glb')
  const assetsToLoad = useMemo(() => range(8).flatMap(v => range(4).map(i => `/images/crowd/B_Cat${v + 1}_${i + 1}.webp`)), [])
  const frames = useLoader(TextureLoader, assetsToLoad)
  useEffect(() => {
    const crowdMember = parkScene.getObjectByName('CrowdPlatform') as Mesh
    crowdMember.castShadow = false
    let index = 0
    // const mat1 = new MeshStandardMaterial({
    //   roughness: 1,
    //   side: DoubleSide,
    //   map: frames[index],
    //   // depthTest: false,
    //   depthWrite: false,
    //   transparent: true
    // })
    // frames[0].offset.x
    frames.forEach(frame => {
      frame.colorSpace = SRGBColorSpace
    })

    const materials: MeshBasicMaterial[] = []
    crowdMember.children.forEach((child, i) => {
      // const mat = (child as Mesh).material as MeshStandardMaterial
      if (!(child instanceof Mesh)) return
      const mat = new MeshBasicMaterial({ map: frames[i * 4], side: DoubleSide })
      mat.depthWrite = true
      mat.alphaHash = true
      mat.transparent = false
      mat.needsUpdate = true
      child.material = mat
      materials.push(mat)
    })
    // range(8).map(i => new MeshStandardMaterial({
    //   roughness: 1,
    //   side: DoubleSide,
    //   map: frames[i * 4 + 1],
    //   // depthTest: false,
      
    //   depthWrite: false,
    //   transparent: true
    // }))

    // crowdMember.set
    // crowdMember.material = materials

    const timer = setInterval(() => {
      index = (index + 1) % 4;
      materials.forEach((mat, matIndex) => {
        mat.map = frames[matIndex * 4 + index]
        // mat.map.needsUpdate = true
        // mat.roughness = 1
      })
      // crowdMember.material = [...materials]
      
    }, 200)

    return () => {
      clearInterval(timer)
    }
  }, [crowdObj.scene, frames, parkScene])

  return (
    null
    // <primitive object={crowdObj.scene} position={[0, 2, 0]}>
    // </primitive>
  )
}