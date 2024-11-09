import { ObjectMap, useFrame, useLoader, useThree } from "@react-three/fiber"
import { useEffect, useMemo } from "react"
import { AnimationAction, AnimationClip, AnimationMixer, Bone, Color, LoopOnce, Mesh, MeshStandardMaterial, Object3D, RGBAFormat, SkinnedMesh, TextureLoader } from "three"
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import {  } from "../LiveGameView"
import { AllPlayerPositions, BASE_URL, OffensePositionKeys } from "../Constants"
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils'
import { GameFeed } from "../data/MLBGameFeed"
import { CustomDitheredMaterial } from "../util/ScreenDoorShader"
import { clamp } from "lodash"

export type CharacterType = 'offense' | 'defense' | 'umpire'
export type CharacterAnimationState = 'BattingIdle' |
'Running' |
'RunnerAtBaseIdle' |
'SlideStop' |
'StandingNeutral' |
'SwingMid' |
'AssistThrow' |
'RightHandPitch' | 
'LeftHandPitch' | 
'CatchHI' | 
'CatchMid' |
'CatchGround' |
'CatcherIdle'

const textureLoader = new TextureLoader()

export class PlayerControls {
  animMixer: AnimationMixer
  scene: Object3D
  clips: AnimationClip[]
  prevAction?: AnimationAction
  playerPos: AllPlayerPositions
  type: CharacterType
  bat?: Object3D
  animationState?: CharacterAnimationState
  bodyMesh: SkinnedMesh
  hatMesh: SkinnedMesh
  helmetMesh: SkinnedMesh
  rightHandMesh: SkinnedMesh
  leftHandMesh: SkinnedMesh
  leftGloveMesh: SkinnedMesh
  rightGloveMesh: SkinnedMesh
  headwearMesh?: SkinnedMesh
  rightHandSocketBone?: Bone
  leftHandSocketBone?: Bone
  batSocketBone?: Bone
  playerInfo?: GameFeed.PlayerDetails
  teamType?: 'away' | 'home'

  bodyMaterial: CustomDitheredMaterial
  mitMaterial: CustomDitheredMaterial

  static AwayTexture = textureLoader.load('/textures/AwayPlayer_BaseColor.png')
  static HomeTexture = textureLoader.load('/textures/HomePlayer_BaseColor.png')

  constructor(gltfObj: GLTF & ObjectMap, type: CharacterType, playerPos: AllPlayerPositions, teamType?: 'away' | 'home') {
    this.scene = SkeletonUtils.clone(gltfObj.scene)
    this.scene.castShadow = true
    this.type = type
    this.playerPos = playerPos
    this.teamType = teamType

    this.scene.receiveShadow = true
    this.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    })

    this.bodyMesh = this.scene.getObjectByName("JOINED") as SkinnedMesh
    this.rightGloveMesh = this.scene.getObjectByName("GloveR") as SkinnedMesh
    this.leftGloveMesh = this.scene.getObjectByName("GloveL") as SkinnedMesh
    this.rightHandMesh = this.scene.getObjectByName("HandR") as SkinnedMesh
    this.leftHandMesh = this.scene.getObjectByName("HandL") as SkinnedMesh
    this.hatMesh = this.scene.getObjectByName("CAP") as SkinnedMesh
    this.helmetMesh = this.scene.getObjectByName("Helmet") as SkinnedMesh

    // this.headwearMesh = type === 'offense' ? this.helmetMesh : this.hatMesh
    if (type === 'offense') {
      this.hatMesh.visible = false
      this.headwearMesh = this.helmetMesh
    } else if (type === 'defense') {
      this.helmetMesh.visible = false
      this.headwearMesh = this.hatMesh
    }

    this.batSocketBone = this.bodyMesh?.skeleton.getBoneByName('BatIK')
    this.rightHandSocketBone = this.bodyMesh?.skeleton.getBoneByName('palm_handleR')
    this.leftHandSocketBone = this.bodyMesh?.skeleton.getBoneByName('palm_handleL')

    if (
      !this.rightGloveMesh ||
      !this.rightHandMesh ||
      !this.leftHandMesh ||
      !this.leftGloveMesh
    ) {
      throw new Error ('MISSING MESHES')
    }
    if (playerPos === 'B') {
      const gltfLoader = new GLTFLoader()
      gltfLoader.load(`${BASE_URL}/assets/bat.glb`, ({ scene: bat }) => {
        this.bat = bat
        this.batSocketBone?.add(bat)
        this.bat.visible = true
      })
    }

    if (type === 'defense') {
      this.leftHandMesh.visible = false
      this.rightGloveMesh.visible = false
    }
    if (type === 'offense') {
      this.leftGloveMesh.visible = false
      this.rightGloveMesh.visible = false
    }
    const texture = this.teamType === 'away' ? PlayerControls.AwayTexture : PlayerControls.HomeTexture
    texture.flipY = false
    texture.format = RGBAFormat
    texture.needsUpdate = true
    texture.colorSpace = 'srgb'
    texture.mapping = 300
    texture.wrapS = 1000
    texture.wrapT = 1000

    this.bodyMaterial = new CustomDitheredMaterial({ map: texture, roughness: 1, opacity: 1 })
    this.bodyMesh.material = this.bodyMaterial
    this.rightHandMesh.material = this.bodyMaterial
    this.leftHandMesh.material = this.bodyMaterial
    if (this.type === 'defense') {
      this.hatMesh.material = this.bodyMaterial
    } else if (this.type === 'offense') {
      const mat = this.helmetMesh.material as MeshStandardMaterial
      mat.color = new Color(this.teamType === 'home' ? 'orange' : '#4A3448')
    }

    this.mitMaterial = new CustomDitheredMaterial({
      map: (this.leftGloveMesh.material as MeshStandardMaterial).map,
      roughness: 1,
    })
    this.leftGloveMesh.material = this.mitMaterial

    // this.scene = gltfObj.scene
    this.clips = gltfObj.animations
    this.animMixer = new AnimationMixer(this.scene)
  }

  setPlayerInfo = (info: GameFeed.PlayerDetails) => {
    this.playerInfo = info
  }

  setGloveHand = (hand: 'R' | 'L' | undefined) => {
    switch (hand) {
      case null:
        this.leftGloveMesh.visible = false
        this.rightGloveMesh.visible = false
        this.rightHandMesh.visible = true
        this.leftHandMesh.visible = true
        return
      case 'R':
        this.leftGloveMesh.visible = false
        this.rightGloveMesh.visible = true
        this.rightHandMesh.visible = false
        this.leftHandMesh.visible = true
        return
      case 'L':
        this.leftGloveMesh.visible = true
        this.rightGloveMesh.visible = false
        this.rightHandMesh.visible = true
        this.leftHandMesh.visible = false
        return
    }
  }

  setOpacity = (opacity: number) => {
    this.mitMaterial.opacity = opacity
    this.bodyMaterial.opacity = opacity
  }

  attachBallToHand = (ball: Object3D, side: GameFeed.BatSide['code']) => {
    const bone = (side === 'R' ? this.rightHandSocketBone : this.leftHandSocketBone)
    bone?.add(ball)
    ball.position.set(0, 0, 0)
  }

  update = (deltaTime: number) => {
    this.animMixer.update(deltaTime)
  }
  
  setAnimationState(state: CharacterAnimationState) {
    const clip = AnimationClip.findByName(this.clips, state)
    const action = this.animMixer.clipAction(clip)

    if (this.prevAction === action) return
    action.reset()

    if (this.prevAction) {
      this.prevAction.fadeOut(0.2)
      action.fadeIn(0.2)
    }
    if (['SwingMid', 'BattingIdle'].includes(state)) {
      this.bat && (this.bat.visible = true)
    } else {
      this.bat && (this.bat.visible = false)
    }
    if (state === 'Running') {
      action.setEffectiveTimeScale(4)
    }
    if ([
      'SlideStop',
      'StandingNeutral',
      'SwingMid',
      'AssistThrow',
      'RightHandPitch',
      'LeftHandPitch',
      'CatchHI',
      'CatchMid',
      'CatcherIdle'
    ].includes(state)) {
      action.clampWhenFinished = true
      action.setLoop(LoopOnce, 1)
    }

    action.play()
    this.prevAction = action
    this.animationState = state
  }
}

export function OffensivePlayer({ playerControls, runner }: { offensivePosition?: OffensePositionKeys, playerControls: PlayerControls, runner?: GameFeed.Runner }) {
  const { camera } = useThree()
  const safeIndicator = useLoader(GLTFLoader, `${BASE_URL}/assets/safe-indicator.glb`)
  const outIndicator = useLoader(GLTFLoader, `${BASE_URL}/assets/out-indicator.glb`)
  const safeIndicatorScene = useMemo(() => safeIndicator.scene.clone(), [safeIndicator.scene])
  const outIndicatorScene = useMemo(() => outIndicator.scene.clone(), [outIndicator.scene])

  useFrame(() => {
    if (safeIndicatorScene) {
      safeIndicatorScene.lookAt(camera.position)
      outIndicatorScene.lookAt(camera.position)
    }

    if (playerControls.playerPos === 'C') {
      const distanceToCamera = camera.position.distanceTo(playerControls.scene.position)
      playerControls.setOpacity(clamp((distanceToCamera - 3) / 8, 0, 1))
    }
  })
  
  useEffect(() => {
    if (!runner) return

    const child = runner.movement.isOut ? outIndicatorScene : safeIndicatorScene
    playerControls.scene.add(runner.movement.isOut ? outIndicatorScene : safeIndicatorScene)

    const period = 1500
    const moveScale = 0.8

    let cancel = false
    function idleAnimation() {
      if (cancel) return
      const time = Date.now()
      const offset = 1 + (Math.sin((time / period) * Math.PI * 2)) * 0.5 // 0 to 1
      child.position.set(0, 1.5 + offset * moveScale, 0)
      requestAnimationFrame(idleAnimation)
    }
    idleAnimation()

    return () => {
      cancel = true
      outIndicatorScene.removeFromParent()
      safeIndicatorScene.removeFromParent()
    }
  }, [safeIndicatorScene, outIndicatorScene, runner, playerControls.scene])

  return (
    <group>
      <primitive object={playerControls.scene}>
      </primitive>
    </group>
  )
}