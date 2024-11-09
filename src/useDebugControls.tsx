import { useThree, useFrame } from "@react-three/fiber"
import { useEffect, useContext, useMemo, useState } from "react"
import { Euler, Object3D, Vector3 } from "three"
import { degToRad } from "three/src/math/MathUtils"
import { useKeysPressed } from "./util/useKeys"
import { GameFeedContext } from "./useCreateGameData"
import { FIELD_LOCATION } from "./Constants"
import { clamp, range } from "lodash"

const _PI_2 = Math.PI / 2
const MaxPolarAngle = Math.PI
const MinPolarAngle = 0
const RotationSpeed = .0035

export default function useDebugControls({ baseball }: { baseball: Object3D }) {
  const { camera, gl } = useThree()
  const keys = useKeysPressed()
  const newPos = useMemo(() => new Vector3(), [])
  const [{ cameraView, freeCam, isMobileLayout }, dispatch] = useContext(GameFeedContext)
  const [moveSpeedScalar, setMoveSpeedScalar] = useState(1)
  const cameraEuler = useMemo(() => new Euler( 0, 0, 0, 'YXZ' ), [])

  useEffect(() => {
    const canvas = gl.domElement
    const frameAvgLength = 15
    let cancelled = false
    let mouseMovements: [number, number][] = range(frameAvgLength).map(() => [0, 0])
    let i = 0

    if (!canvas.requestPointerLock) return

    function addMouseMoveEntry(x: number, y: number) {
      mouseMovements[i][0] = x
      mouseMovements[i][1] = y
      i = (i + 1) % mouseMovements.length
    }

    const handleMouseMove = (e: MouseEvent) => {
      addMouseMoveEntry(e.movementX, e.movementY)
    }
    function handleRotation() {
      if (cancelled) return

      addMouseMoveEntry(0, 0)

      let avgX = 0
      let avgY = 0
      for (let j = 0; j < mouseMovements.length; j++) {
        avgX += mouseMovements[j][0]
        avgY += mouseMovements[j][1]
      }

      avgX /= mouseMovements.length
      avgY /= mouseMovements.length

      cameraEuler.setFromQuaternion( camera.quaternion );
    
      cameraEuler.y -= avgX * RotationSpeed
      cameraEuler.x -= avgY * RotationSpeed
    
      cameraEuler.x = Math.max(_PI_2 - MaxPolarAngle, Math.min( _PI_2 - MinPolarAngle, cameraEuler.x ) );
    
      camera.quaternion.setFromEuler(cameraEuler);

      requestAnimationFrame(handleRotation)
    }

    const handleScroll = (e: WheelEvent) => {
      setMoveSpeedScalar(scalar => clamp(scalar - (e.deltaY / 500), 0.1, 5))
    }
    
    const lockPointer = async () => {
      try {
        // @ts-ignore
        await canvas.requestPointerLock({ unadjustedMovement: true })
      } catch (e) {
        console.error(e)
      }
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('wheel', handleScroll)

      mouseMovements = range(frameAvgLength).map(() => [0, 0])
      requestAnimationFrame(handleRotation)
    }
    const releasePointer = async () => {
      document.exitPointerLock()
      document.removeEventListener('mousemove', handleMouseMove)
    }
    canvas.addEventListener('mousedown', lockPointer)
    canvas.addEventListener('mouseup', releasePointer)

    return () => {
      cancelled = true
      canvas.removeEventListener('mousedown', lockPointer)
      canvas.removeEventListener('mouseup', releasePointer)
      releasePointer()
    }
  }, [camera, cameraEuler, gl])

  useEffect(() => {
    const keyCheck = (e: KeyboardEvent) => {
      if (e.key === 'i') {
        navigator.clipboard.writeText(`
  camera.position.set(${camera.position.toArray()})
  camera.rotation.set(${camera.rotation.x}, ${camera.rotation.y}, ${camera.rotation.z}, 'YXZ')`)
        }
    }
    document.addEventListener('keydown', keyCheck)
    return () => {
      document.removeEventListener('keydown', keyCheck)
    }
  }, [camera])

  useFrame(() => {
    const MOVE_SPEED = 0.4 * moveSpeedScalar

    const movementKeys = ['w', 'a', 's', 'd']
    const movementKeyPressed = Array.from(keys).some(val => movementKeys.includes(val))

    if (!freeCam && movementKeyPressed) {
      dispatch({ type: 'SET_FREE_CAM', freeCam: true })
    }

    if (keys.has('w')) { camera?.translateZ(-MOVE_SPEED) }
    if (keys.has('s')) { camera?.translateZ(MOVE_SPEED) }
    if (keys.has('a')) { camera?.translateX(-MOVE_SPEED) }
    if (keys.has('d')) { camera?.translateX(MOVE_SPEED) }

    if (keys.has('q')) { camera?.translateY(-MOVE_SPEED) }
    if (keys.has('e')) { camera?.translateY(MOVE_SPEED) }
  })

  useFrame(() => {
     if (freeCam || !cameraView) return
    //  console.log(cameraView)
    switch (cameraView.type) {  
      case 'Scoreboard': {
        if (isMobileLayout) {
          camera.position.set(55.18999248439486,6.976190174892986,96.30194254874714)
          camera.rotation.set(0.2603271015298174, 2.602592653590025, -0.004592653589784345, 'YXZ')
          break
        }
        camera.position.set(45.37011568386408,7.494516104037502,34.764874142377735)
        camera.rotation.set(0.18945740377138492, 2.841383302924678, 2.932106426820765e-16, 'YXZ')
        break
      }
      case 'StaticBasesOverview': {
        if (isMobileLayout) {
          camera.position.set(0, 44.41991617244219,-35.98755740666088)
          camera.rotation.set(-0.6989062318035044, 3.138092653589791, -0.0045926535897926005, 'YXZ')
          break
        }
        camera.position.set(0, 34.7, -70.7)
        camera.rotation.set(-2.7397197551196575, 0, 3.137, 'YXZ')
        break
      }
      case 'FollowBallAbove': {
        const verticalOffset = isMobileLayout ? 15 : 50
        baseball.getWorldPosition(newPos)
        camera.position.set(newPos.x, newPos.y + verticalOffset, newPos.z)
        camera.setRotationFromAxisAngle(new Vector3(0, 1, 0), degToRad(180))
        camera.rotateX(degToRad(-90))
        break
      }
      case 'CrowdBehindHomePlate': {
        if (isMobileLayout) {
          camera.position.set(-0.004395706860702597,21.980416436109902,-51.93800194346612)
          camera.rotation.set(-0.33187289847015317, -3.138092653589792, -0.004592653589793184, 'YXZ')
          break
        }
        camera.position.set(-6.4959323665787645, 16.543460777729507, -56.02149373079958)
        camera.rotation.set(-2.938049731281894, -0.10257326782897254, -3.1204616581508704, 'YXZ')
        break
      }
      case 'AlternateBatterAngle': {
        if (isMobileLayout) {
          camera.position.set(-2.0157484830459604,2.0106075613053958,-4.993714033055701)
          camera.rotation.set(-0.1664596734928792, -2.8370932657906343, 3.658798388536437e-16, 'YXZ')
          break
        }
        camera.position.set(-3.5, 2, -11)
        camera.rotation.set(degToRad(-3), degToRad(195), 0, 'YXZ')
        break
      }
      case 'CatchersPOV': {
        if (isMobileLayout) {
          camera.position.set(0, 0.85, -3.5)
          camera.setRotationFromAxisAngle(new Vector3(0, 1, 0), degToRad(180))
          break
        }
        camera.position.set(0, 0.85, -7.75)
        camera.setRotationFromAxisAngle(new Vector3(0, 1, 0), degToRad(180))
        break
      }
      case 'BehindPitcher': {
        if (isMobileLayout) {
          const camPos = cameraView.pitcher.scene.localToWorld(new Vector3(-1.2, 2, -4))
          camera.position.set(camPos.x, camPos.y, camPos.z)
          camera.lookAt(FIELD_LOCATION.BASE.HOME)  
          break
        }
        const camPos = cameraView.pitcher.scene.localToWorld(new Vector3(-1.5, 2, -7))
        camera.position.set(camPos.x, camPos.y, camPos.z)
        camera.lookAt(FIELD_LOCATION.BASE.HOME)
        break
      }
      case 'AboveBatter': {
        if (isMobileLayout) {
          camera.position.set(-1.6589504878506007e-15,3.1564831363109276,-4.45364125390579)
          camera.rotation.set(-0.4245333333333331, 3.141592653589793, 5.410681140679802e-32, 'YXZ')
          break
        }
        camera.position.set(0, 7,-16.75)
        camera.rotation.set(-0.2908265442264871, Math.PI, 0, 'YXZ')
        break
      }
      case 'BasePutOut': {
        switch (cameraView.outBase) {
          default: {
            newPos.set(0, 22, 6.2)
          }
        }
        camera.position.set(newPos.x, newPos.y, newPos.z)
        camera.lookAt(cameraView.player.scene.position)
        break
      }
      case 'FoulBall': {
        if (isMobileLayout) {
          camera.position.set(0, 15, 40)
          baseball.getWorldPosition(newPos)
          camera.lookAt(newPos)
          break
        }
        camera.position.set(0, 40, 100)
        baseball.getWorldPosition(newPos)
        camera.lookAt(newPos)
        break 
      }
      case 'AssistThrowOverShoulder': {
        // const camPos = cameraView.player.scene.localToWorld(new Vector3(-0.5, 1.5, -10))
        // const playerDir = cameraView.player.scene.getWorldDirection(new Vector3())
        // camera.position.set(camPos.x, camPos.y, camPos.z)
        // camera.lookAt(camera.position.clone().add(playerDir))

        // camera.position.set(FIELD_LOCATION.BASE.HOME)
        const newCamPos = cameraView.player.scene.position.clone().multiplyScalar(0.5)
        camera.position.set(newCamPos.x, newCamPos.y + 2, newCamPos.z)
        baseball.getWorldPosition(newPos)
        camera.lookAt(cameraView.player.scene.position.x, cameraView.player.scene.position.y, cameraView.player.scene.position.z)
        // camera.lookAt(newPos.x, newPos.y, newPos.z)
        break
      }
      case 'AssistCatch': {
        const camPos = cameraView.player.scene.localToWorld(new Vector3(1.5, 0.5, -7))
        camera.position.set(camPos.x, camPos.y, camPos.z)
        baseball.getWorldPosition(newPos)
        camera.lookAt(newPos)
        break
      }
    }

    // rotation.current = camera.rotation
  })
}