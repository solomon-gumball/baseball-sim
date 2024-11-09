import { useContext, useEffect } from "react";
import { Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3DEventMap, Texture, TextureLoader } from "three";
import { GameFeedContext } from "../useCreateGameData";
import { useLoader } from "@react-three/fiber";

export default function Park({ scene }: { scene: Group<Object3DEventMap>}) {
  const [{ scoreboardImage }, dispatch] = useContext(GameFeedContext)
  const [parkLightmap] = useLoader(TextureLoader, [`${process.env.PUBLIC_URL}/textures/LightingBake.png`])
  useEffect(() => {
    if (!scoreboardImage) return
    const screenObj = scene.getObjectByName('Screen') as Mesh | undefined

    if (screenObj == null) return

    const texture = new Texture(scoreboardImage)
    texture.needsUpdate = true
    const material = new MeshBasicMaterial({ map: texture })
    screenObj.material = material
    if (material instanceof MeshBasicMaterial) {
      texture.needsUpdate = true
      material.map = texture
      material.needsUpdate = true
    }
  }, [scene, scoreboardImage])

  useEffect(() => {
    const stadium = scene.getObjectByName('Stadium') as Mesh

    parkLightmap.flipY = false;
    parkLightmap.channel = 1;
    parkLightmap.colorSpace = 'srgb'

    if (!stadium) return
    stadium.children.forEach(child => {
      if (child instanceof Mesh) {
        if (child.material instanceof MeshStandardMaterial) {
          child.material.lightMap = parkLightmap
          child.material.lightMapIntensity = 2
          child.material.needsUpdate = true
        }
      }
    })
  }, [parkLightmap, scene])

  return (
    <primitive object={scene} receiveShadows />
  )
}