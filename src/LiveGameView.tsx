import { useRef, useMemo, useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router'
import { useResizeObserver } from './util/useSize'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { DirectionalLight, Mesh, Object3D, Raycaster, Vector3, Vector4 } from 'three'
import { degToRad, lerp, randFloat, randInt } from 'three/src/math/MathUtils'
import { calculateTimeToCrossThreshold, feetToM, findIntersection, getBallPositionDuringPitch, getBallXYSpeed, inchesToM, makeSymmetricalArc, mphToMetersPerSecond } from './util/MathUtil'
import { GameFeed } from './data/MLBGameFeed'
import useCreateGameData, { CameraView, CameraViewEnum, GameFeedContext } from './useCreateGameData'
import EventNavList from './components/EventNavList'
import { useLocalStorage } from './util/useStorage'
import { AnimationGroup, AnimationGroupType, CancelledAnimationGroupError } from './util/Animation'
import { clamp, cloneDeep } from 'lodash'
import { OffensivePlayer, PlayerControls } from './components/Players'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { CONSTANTS, eventCodeToDisplayText, FIELD_LOCATION, getLocationForBaseCode, OffensePositionKeys, PITCH_ANIMATION_DATA } from './Constants'
import StrikeZone from './components/StrikeZone'
import { Pixelation, EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { TrailRenderer } from './util/TrailRenderer'
import useDebugControls from './useDebugControls'
import BallImpactLocation from './components/BallImpactLocation'
import styles from './css/LiveGameView.module.css'
import Crowd from './components/Crowd'
import { ScoreboardHTML } from './components/Scoreboard'
import ScoreCard from './components/ScoreCard'
import GameControlPanel from './components/GameControlPanel'
import ToneController from './util/ToneController'
import Park from './components/Park'
import { NavLink } from 'react-router-dom'
import BatHitSoundUrl from './sounds/fx BatHit.mp3'
import MitCatchSound from './sounds/fx MitCatch.mp3'
import ThrowSound from './sounds/fx Throw.mp3'
import HitDirt from './sounds/fx HitDirt.mp3'
import OverlayMenu from './components/OverlayMenu'

export type UILayout = 'BOTTOM' | 'LEFT'

function getInningText(inning: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const remainder = inning % 100
  if (remainder >= 11 && remainder <= 13) {
      return `${inning}th`
  }
  const suffixIndex = (inning + 1) % 10
  const suffix = suffixes[suffixIndex] || suffixes[0] // Default to "th" if none matches
  return `${inning + 1}${suffix}`
}

export default function LiveGameView() {
  const { gameId } = useParams()
  const [store, dispatch] = useCreateGameData(parseInt(gameId ?? ''))
  const [canvasContainerRef, setCanvasContainerRef] = useState<HTMLDivElement | null>(null)
  const canvasContainerSize = useResizeObserver(canvasContainerRef)
  const [useDebugView, setUseDebugView] = useState(false)
  const [showSceneTransition, setShowSceneTransition] = useState({ transitionActive: false, showInningText: false })
  const [layout, setLayout] = useLocalStorage<UILayout>('layout', 'BOTTOM')
  const [showMenu, setShowMenu] = useState(false)
  const canvasSize = useMemo(() => canvasContainerSize &&
    ({
      width: Math.min(canvasContainerSize.width, canvasContainerSize.height),
      height: Math.min(canvasContainerSize.width, canvasContainerSize.height)
    }),
    [canvasContainerSize]
  )

  const { currentPlay, playResultText, currentPlayHasCompleted, isMobileLayout, rawData, playIndex, eventIndex, freeCam, isHalfInningFinalEvent } = store

  // useEffect(() => {
  //   try {
  //     navigator.wakeLock.request("screen").then(() => console.log("Wake Lock is active!"))
  //   } catch (err) {
  //     // The Wake Lock request has failed - usually system related, such as battery.
  //     console.error(err)
  //   }
  // }, [])

  const incrementEvent = useMemo(() => {
    let inProgress = false
    return (increment: number) => {
      if (inProgress || canvasContainerRef == null) return
      inProgress = true

      setShowSceneTransition({ showInningText: false, transitionActive: true })
      setTimeout(() => {
        inProgress = false
        dispatch({ type: 'INCREMENT_EVENT', increment })

        // Regular event transition
        if (!isHalfInningFinalEvent) {
          setShowSceneTransition({ showInningText: false, transitionActive: false })

        // Inning transition
        } else if (currentPlay) {
          setShowSceneTransition({ showInningText: true, transitionActive: true })
          setTimeout(() => {
            setShowSceneTransition({ showInningText: false, transitionActive: false })
          }, 1400)
        }
      }, 500)
    }
  }, [canvasContainerRef, dispatch, isHalfInningFinalEvent, currentPlay])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft': return incrementEvent(-1)
        case 'ArrowRight': return incrementEvent(1)
        case '1': return 
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [canvasContainerRef, dispatch, eventIndex, gameId, playIndex, setLayout, incrementEvent])

  function handleScoreboardTextureLoaded(image: HTMLImageElement) {
    dispatch({ type: 'SET_SCOREBOARD_IMAGE', image })
  }
  if (currentPlay == null) {
    if (rawData?.gameData.status.detailedState === 'Scheduled') {
      return (
        <div className={styles.absoluteCentered} style={{ textAlign: 'center' }}>
          Game not yet started
          <NavLink to={"/games"} style={{ display: 'block' }}>Back to menu</NavLink>
        </div>
      )
    }
    return null
  }

  return (
    <GameFeedContext.Provider value={[store, dispatch]}>
      <div className="App">
        <div className={styles.menuButton} onClick={() => setShowMenu(true)}>MENU</div>
        {showMenu && <OverlayMenu onClose={() => setShowMenu(false)} />}
        <div style={{ position: 'absolute', left: '0', width: 0, height: 0, overflow: 'hidden' }}>
          {rawData?.liveData.boxscore && (
            <ScoreboardHTML onComplete={handleScoreboardTextureLoaded} />
          )}
        </div>
        <GameControlPanel incrementEvent={incrementEvent} />
        <div className={layout === 'BOTTOM' ? styles.flexCol : styles.flexRow} style={{ height: '100%', position: 'relative' }}>
          <div className={styles.playResultText} style={{ opacity: showSceneTransition.showInningText ? 1 : 0, zIndex: 1 }}>{`${currentPlay.about.halfInning.toUpperCase()} OF THE ${getInningText(currentPlay.about.inning - 1)}`}</div>
          <div className={styles.canvasContainer} ref={setCanvasContainerRef} style={{ height: layout === 'BOTTOM' ? 650 : '', filter: showSceneTransition.transitionActive ? 'brightness(0)' : 'brightness(1)' }}>
            {freeCam && <div onClick={() => dispatch({ type: 'SET_FREE_CAM', freeCam: false })} className={styles.freeCamButton}>EXIT FREE CAM</div>}
            {playResultText && <div className={styles.playResultText}>{playResultText}</div>}
            {currentPlayHasCompleted && (
              <div style={{ zIndex: 1, position: 'absolute', top: 0, margin: 15, right: 0, left: 0, display: 'flex', justifyContent: 'center' }}>
                <div style={{ backgroundColor: 'rgb(0, 0, 0, .8)', padding: 8 }}>
                  {currentPlay.result.description}
                </div>
              </div>
            )}
            {canvasSize && (
              <Canvas
                shadows="percentage"
                camera={{ position: [0, 0.85, -7.75], near: 0.1, far: 500, fov: isMobileLayout ? 60 : 20 }}
                dpr={devicePixelRatio * 0.4}
              >
                <EffectComposer>
                  <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} />
                  <ChromaticAberration radialModulation={false} modulationOffset={1} opacity={1} />
                  <Pixelation granularity={2} />
                </EffectComposer>
                <Canvas3dView incrementEvent={incrementEvent} />
              </Canvas>
            )}
          </div>
          {useDebugView && <EventNavList layout={layout} />}
          {!useDebugView && <ScoreCard />}
        </div>
      </div>
    </GameFeedContext.Provider>
  )
}

const BASE_ORDER: (GameFeed.BaseKey | null)[] = [
  null, '1B', '2B', '3B', 'score'
]

function getBaseIndexForMovementKey(key: GameFeed.BaseKey | null | '4B') {
  switch (key) {
    case null: return 0
    case '1B': return 1
    case '2B': return 2
    case '3B': return 3
    case 'score':
    case '4B': return 4
    default: return -1
  }
}

function playerAnimateToLocation({ runner, locations, playSpeed, duration, lookAt, animGroup }: {
  runner: PlayerControls,
  locations: Vector3[],
  playSpeed: number,
  duration: number,
  lookAt?: Vector3 | Object3D,
  animGroup: AnimationGroupType
}) {
  runner.setAnimationState('Running')
  let finished = false
  return locations.reduce<Promise<void>>((lastPromise, newLoc, i) =>
    i === 0 ? lastPromise : lastPromise.then(() => animGroup.animate(elapsedTime => {
      const prevLoc = locations[i - 1]
      const location = prevLoc.clone().lerp(newLoc, (elapsedTime / duration))
      const lookTarget = lookAt instanceof Vector3 ? lookAt : newLoc

      const distance = lookTarget.distanceTo(location)
        // TODO cleanup
      if (i === locations.length - 1 && (duration - elapsedTime) < 500 && !finished && runner.type === 'offense') {
        finished = true
        runner.setAnimationState('SlideStop')
      }
      runner.scene.position.set(location.x, location.y, location.z)
      if (!finished && distance > 1) {
        runner.scene.lookAt(lookTarget.x, 0, lookTarget.z)
      }
    }, { duration, playSpeed }))
    , Promise.resolve())
    .then(() => {
      runner.setAnimationState('StandingNeutral')
    })
}

const animateBaserun = ({ runner, movement, playSpeed, animGroup }: { runner: PlayerControls, movement: GameFeed.Movement, playSpeed: number, animGroup: AnimationGroupType }) => {
  const startIndex = getBaseIndexForMovementKey(movement.start)
  const endIndex = getBaseIndexForMovementKey(movement.end ?? movement.outBase)
  // base location not found, short circuit
  if (startIndex === -1 || endIndex === -1) return Promise.resolve()
  const locations = BASE_ORDER.slice(startIndex, endIndex + 1).map(base => getLocationForBaseCode(base, 'offense'))

  return animGroup.delay(runner.playerPos === 'B' ? 300 : 0, { playSpeed })
  .then(() => 
    playerAnimateToLocation({ runner, locations, playSpeed, duration: 2900 + ((Math.random() * 400) - 200) , animGroup })
  )
}

const batHitSound = new Audio(BatHitSoundUrl)
const mitCatchSound = new Audio(MitCatchSound)
const throwSound = new Audio(ThrowSound)
const hitDirtSound = new Audio(HitDirt)

throwSound.volume = 0.2

function playSound(audio: HTMLAudioElement) {
  return audio.play().catch(e => {})
}

function Canvas3dView({ incrementEvent }: { incrementEvent: (inc: number) => void }) {
  const { scene: parkScene } = useLoader(GLTFLoader, '/assets/oracle-park.glb')
  const playerGLTF = useLoader(GLTFLoader, '/assets/player.glb')
  const { scene: baseball } = useLoader(GLTFLoader, '/assets/ball.glb')
  const lightRef = useRef<DirectionalLight>(null)
  const [showBaseball, setShowBaseball] = useState(false)
  const lightTargetRef = useRef<Object3D>(null)
  const [strikeZonePosition, setStrikeZonePosition] = useState<[number, number, number]>()
  const [{ isFirstEventOfInning, muteEnabled, autoPlayEnabled, isFinalEvent, currrentRunnersOnBase, linescore, currentEvent, currentPlay, ballLandingLocation, playSpeed, eventIndex, prevPlay }, dispatch] = useContext(GameFeedContext)
  const [runnersStatus, setRunnersStatus] = useState<{ [key in OffensePositionKeys]?: GameFeed.Runner }>({})
  const [ballDidHitGround, setBallDidGround] = useState(false)
  const isTopInning = currentPlay?.about.isTopInning ?? false
  const tone = useMemo(() => new ToneController(), [])

  useEffect(() => {
    tone.toggleMute(muteEnabled)

    batHitSound.muted = muteEnabled
    mitCatchSound.muted = muteEnabled
    throwSound.muted = muteEnabled
    hitDirtSound.muted = muteEnabled
  }, [muteEnabled, tone])
  
  const offense = useMemo(() => ({
    '1B': new PlayerControls(playerGLTF, 'offense', '1B', isTopInning ? 'away' : 'home'),
    '2B': new PlayerControls(playerGLTF, 'offense', '2B', isTopInning ? 'away' : 'home'),
    '3B': new PlayerControls(playerGLTF, 'offense', '3B', isTopInning ? 'away' : 'home'),
    'B': new PlayerControls(playerGLTF, 'offense', 'B', isTopInning ? 'away' : 'home'),
  }) as { [key in OffensePositionKeys]: PlayerControls }, [isTopInning, playerGLTF])

  const defense = useMemo(() => ({
    '1B': new PlayerControls(playerGLTF, 'defense', '1B', isTopInning ? 'home' : 'away'),
    '2B': new PlayerControls(playerGLTF, 'defense', '2B', isTopInning ? 'home' : 'away'),
    '3B': new PlayerControls(playerGLTF, 'defense', '3B', isTopInning ? 'home' : 'away'),
    'SS': new PlayerControls(playerGLTF, 'defense', 'SS', isTopInning ? 'home' : 'away'),
    'LF': new PlayerControls(playerGLTF, 'defense', 'LF', isTopInning ? 'home' : 'away'),
    'CF': new PlayerControls(playerGLTF, 'defense', 'CF', isTopInning ? 'home' : 'away'),
    'RF': new PlayerControls(playerGLTF, 'defense', 'RF', isTopInning ? 'home' : 'away'),
    'P': new PlayerControls(playerGLTF, 'defense',  'P', isTopInning ? 'home' : 'away'),
    'C': new PlayerControls(playerGLTF, 'defense',  'C', isTopInning ? 'home' : 'away'),
  }) as { [key in GameFeed.DPosAbbr]: PlayerControls }, [playerGLTF, isTopInning])

  const [intersectPointDebug, setIntersectPointDebug] = useState<Vector3>()

  const trail = useMemo(() => new TrailRenderer( parkScene, true ), [parkScene])
  useEffect(() => {
    // specify points to create planar trail-head geometry
    const trailHeadGeometry = [
      new Vector3( -.05, 0.0, 0.0 ), 
      new Vector3( 0.0, .05, 0.0 ),
      new Vector3( .05, 0.0, 0.0 ),
      new Vector3( 0.0, -.05, 0.0 ),
      new Vector3( -.05, 0.0, 0.0 ), 
    ]
    const trailMaterial = TrailRenderer.createBaseMaterial()
    trailMaterial.uniforms.headColor = { value: new Vector4(1, 1, 1, 0.2) }
    trailMaterial.uniforms.tailColor = { value: new Vector4(1, 1, 1, 0.0) }

    const trailLength = 40
    trail.initialize( trailMaterial, trailLength, false, 0, trailHeadGeometry, baseball)

    return () => {
      trail.destroyMesh()
      trail.deactivate()
      trail.removeFromParent()
    }
  }, [baseball, parkScene, trail])

  useEffect(() => {
    trail.setAdvanceFrequency(playSpeed * 60)
  }, [playSpeed, trail])

  useFrame(() => {
    trail.update()
    trail.geometry?.computeBoundingSphere()
  })

  useFrame((_, deltaSeconds) => {
    // lol
    for (const key in offense) {
      // @ts-ignore
      offense[key].update(deltaSeconds)
    }
    for (const key in defense) {
      // @ts-ignore
      defense[key].update(deltaSeconds)
    }
  })

  useEffect(() => {
    parkScene.castShadow = true
    parkScene.receiveShadow = true
    parkScene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    Object.values(GameFeed.DPosAbbrEnum).forEach(abbr => {
      if (abbr === 'P' && currentEvent?.pitchData) {
        const handReleaseLocation = currentPlay?.matchup.pitchHand.code === 'R'
          ? PITCH_ANIMATION_DATA.BALL_RIGHT_HAND_RELEASE_POSITION
          : PITCH_ANIMATION_DATA.BALL_LEFT_HAND_RELEASE_POSITION
        const rightHandThrowLocation = new Vector3(...handReleaseLocation)
        const newPosition = new Vector3(-currentEvent.pitchData.coordinates.x0, currentEvent.pitchData.coordinates.z0, currentEvent.pitchData.coordinates.y0).multiplyScalar(.3048)
        const pitcherOrigin = newPosition.add(rightHandThrowLocation)

        defense[abbr].setGloveHand(currentPlay?.matchup.pitchHand.code === 'R' ? 'L' : 'R')
        defense[abbr].scene.position.set(pitcherOrigin.x, pitcherOrigin.y, pitcherOrigin.z)
      } else {
        defense[abbr].setGloveHand('L')
        defense[abbr].scene.position.set(FIELD_LOCATION.DEFENSE[abbr].x, FIELD_LOCATION.DEFENSE[abbr].y, FIELD_LOCATION.DEFENSE[abbr].z)
      }
      defense[abbr].scene.lookAt(FIELD_LOCATION.BASE.HOME)

      if (abbr === 'C') {
        defense[abbr].setAnimationState('CatcherIdle')
      } else {
        defense[abbr].setAnimationState('StandingNeutral')
      }
    })

    offense['B'].scene.setRotationFromAxisAngle(new Vector3(0, 1, 0), degToRad(-90))
    offense['B'].scene.position.set(FIELD_LOCATION.OFFENSE['B'].x, FIELD_LOCATION.OFFENSE['B'].y, FIELD_LOCATION.OFFENSE['B'].z)
    offense['B']?.setAnimationState('BattingIdle')
    offense['B']?.setGloveHand(undefined)

    if (currrentRunnersOnBase['1B']) {
      const position = getLocationForBaseCode('1B', 'offense')
      offense['1B'].scene.position.set(position.x, position.y, position.z)
      offense['1B'].scene.lookAt(FIELD_LOCATION.BASE.HOME)
      offense['1B']?.setAnimationState('RunnerAtBaseIdle')
      offense['1B']?.setGloveHand(undefined)
    }
    if (currrentRunnersOnBase['2B']) {
      const position = getLocationForBaseCode('2B', 'offense')
      offense['2B'].scene.position.set(position.x, position.y, position.z)
      offense['2B'].scene.lookAt(FIELD_LOCATION.BASE.HOME)
      offense['2B']?.setAnimationState('RunnerAtBaseIdle')
      offense['2B']?.setGloveHand(undefined)
    }
    if (currrentRunnersOnBase['3B']) {
      const position = getLocationForBaseCode('3B', 'offense')
      offense['3B'].scene.position.set(position.x, position.y, position.z)
      offense['3B'].scene.lookAt(FIELD_LOCATION.BASE.HOME)
      offense['3B']?.setAnimationState('RunnerAtBaseIdle')
      offense['3B']?.setGloveHand(undefined)
    }
      setIntersectPointDebug(undefined)
  }, [defense, currentEvent, offense, prevPlay, currrentRunnersOnBase, parkScene, currentPlay])

  const customPlayInfo = useMemo(() => currentPlay && ({
    wasCaught: (['Pop Out', 'Flyout', 'Lineout'] as GameFeed.ResultEvent[]).includes(currentPlay.result.event)
  }), [currentPlay])

  const animationRefs = useRef({ autoPlayEnabled })
  animationRefs.current = { autoPlayEnabled }

  useEffect(() => {
    const pitchData = currentEvent?.pitchData
    const animGroup = AnimationGroup()
    const baseballMesh = baseball.getObjectByName('Sphere')

    if (currentEvent == null || currentPlay == null) return
    async function initAnimations() {
      if (currentPlay == null || currentEvent == null) return

      if (eventIndex === 0) {
        dispatch({ type: 'SET_CAMERA_VIEW', cameraView: { type: CameraViewEnum.Scoreboard } })
        await animGroup.delay(isFirstEventOfInning ? 4000 : 2500)
      }

      if (currentEvent.details.code === GameFeed.EventDetailsCode.PitcherStepOff) {
        dispatch({ type: 'SET_PLAY_RESULT_TEXT', text: 'PITCHER STEP OFF' })
      }
      if (currentEvent.type === 'pickoff') {
        dispatch({ type: 'SET_PLAY_RESULT_TEXT', text: 'PICKOFF ATTEMPT' })
      }
      
      if (currentEvent.type === 'action') {
        dispatch({ type: 'SET_PLAY_RESULT_TEXT', text: eventCodeToDisplayText(currentEvent) })
        dispatch({ type: 'SET_CAMERA_VIEW', cameraView: { type: CameraViewEnum.StaticBasesOverview }})
        // console.log(currentEvent) b
        if (currentEvent.details.eventType === 'pitching_substitution') {
        }
        if (
          currentEvent.details.eventType === 'defensive_indiff' ||
          currentEvent.details.eventType === 'stolen_base_3b' ||
          currentEvent.details.eventType === 'stolen_base_2b'
        ) {
          const baseStealingRunners = currentPlay?.runners.filter(runner => runner.details.playIndex === currentEvent.index)
          await Promise.all(
            baseStealingRunners.map(runner => {
              // @ts-ignore
              const fbx = offense[runner.movement.start ?? 'B']
              return animateBaserun({ runner: fbx, movement: runner.movement, playSpeed, animGroup })
            })
          )
        }
      }

      const ballWasNotHit = ([
        GameFeed.EventDetailsCode.Ball,
        GameFeed.EventDetailsCode.BallInDirt,
        GameFeed.EventDetailsCode.CalledStrike,
        GameFeed.EventDetailsCode.SwingingStrike,
        GameFeed.EventDetailsCode.FoulTip,
        GameFeed.EventDetailsCode.AutomaticBallIntentional
      ] as any).includes(currentEvent.details.code)

      /**
       * PITCHER THROWS BALL
       */
      if (pitchData) {
        setShowBaseball(true)
        const cameraViewOptions: CameraView[] = [
          { type: CameraViewEnum.CatchersPOV },
          { type: CameraViewEnum.AlternateBatterAngle },
          { type: CameraViewEnum.AboveBatter },
          { type: CameraViewEnum.BehindPitcher, pitcher: defense['P'] }
        ]
        const randomCameraView = cameraViewOptions[randInt(0, cameraViewOptions.length - 1)]
        dispatch({ type: 'SET_CAMERA_VIEW', cameraView: randomCameraView })

        const timeToReachStrikezone = calculateTimeToCrossThreshold(pitchData.coordinates.y0, pitchData.coordinates.vY0, pitchData.coordinates.aY, 0)
        const timeToReachCatcher = calculateTimeToCrossThreshold(pitchData.coordinates.y0, pitchData.coordinates.vY0, pitchData.coordinates.aY, -3.3)
        const swingWindupTime = 480 * playSpeed
        const didSwing = (
          currentEvent.details.code === GameFeed.EventDetailsCode.SwingingStrike ||
          currentEvent.details.code === GameFeed.EventDetailsCode.InPlayOut ||
          currentEvent.details.code === GameFeed.EventDetailsCode.InPlayNoOut ||
          currentEvent.details.code === GameFeed.EventDetailsCode.InPlayRun ||
          currentEvent.details.code === GameFeed.EventDetailsCode.Foul ||
          currentEvent.details.code === GameFeed.EventDetailsCode.FoulTip
        )

        trail.reset()

        // baseball
        defense['P'].attachBallToHand(baseball, currentPlay.matchup.pitchHand.code)
        baseball.position.set(0, 0, 0)
        defense['P'].setAnimationState(currentPlay.matchup.pitchHand.code === 'R' ? 'RightHandPitch' : 'LeftHandPitch')
        // animGroup.delay(1300).then(() => )
        await animGroup.delay(PITCH_ANIMATION_DATA.BALL_RELEASE_TIME)
        playSound(throwSound)

        parkScene.add(baseball)

        const ballArcTime = (ballWasNotHit ? timeToReachCatcher : timeToReachStrikezone) ?? 0
        /**  FIELD
         *    +Z
         * -X  Y  +X
         *    -Z
         */

        /**  SPIN DIR
         *    180
         * 90  *  270
         *     0
         */
        const spinClockHand = new Vector3(Math.sin(degToRad(pitchData.breaks.spinDirection + 180)), Math.sin(degToRad(pitchData.breaks.spinDirection + 270)), 0)
        const rotationAxis = spinClockHand.cross({ x: 0, y: 0, z: -1 })

        trail.reset()
        trail.resume()
        trail.activate()

        tone.startTone(400)

        const originalHeight = baseballMesh?.position.y ?? 0
        await Promise.all([
          animGroup.animate((elapsedTime, normalized) => {
            const ballPosition = getBallPositionDuringPitch(pitchData, (elapsedTime / 1000))
            baseball.position.set(ballPosition.x, ballPosition.y, ballPosition.z)
            const slowAmt = 0.5
            // baseballMesh?.setRotationFromAxisAngle(rotationAxis, (-degToRad(elapsedTime * pitchData.breaks.spinRate) / 360) * slowAmt)

            // tone.updateFromFlightProgress(normalized)
            tone.updateFrequency(200 + (ballPosition.y - originalHeight) * 40)
            tone.updateFlangerDepth(.00005)
            tone.updateVolume(normalized * .05)
          }, { playSpeed, duration: ballArcTime * 1000 })
          .then(() => tone.stopTone()),

          // Swing animation
          didSwing && timeToReachStrikezone && (
            animGroup.delay((timeToReachStrikezone * 1000) - swingWindupTime, { playSpeed })
            .then(() => offense['B'].setAnimationState('SwingMid'))
          ),

          timeToReachStrikezone && animGroup.delay(timeToReachStrikezone * 1000, { playSpeed }).then(() => {
            setStrikeZonePosition([feetToM(-pitchData.coordinates.pX), feetToM(pitchData.coordinates.pZ), inchesToM(8.5)])
          }), 
        ])

      }

      const hitData = currentEvent?.hitData
      const isWalkEvent = (
        currentPlay.result.eventType === 'walk' ||
        currentPlay.result.eventType === 'intent_walk' ||
        currentPlay.result.eventType === 'hit_by_pitch'
      )
      
      /**
       * WALK
       */
      if (isFinalEvent && isWalkEvent) {
        dispatch({ type: 'SET_PLAY_RESULT_TEXT', text: 'WALK' })
        await animGroup.delay(600)
        dispatch({ type: 'SET_CAMERA_VIEW', cameraView: { type: CameraViewEnum.StaticBasesOverview } })
        await Promise.all([
          ...currentPlay.runners.map(runner => {
            // @ts-ignore
            const fbx = offense[runner.movement.start ?? 'B']
            return animateBaserun({ runner: fbx, movement: runner.movement, playSpeed, animGroup })
          })
        ])

      /**
       * BALL NOT HIT (STRIKE, BALL ETC)
       */
      } else if (ballWasNotHit) {
        playSound(mitCatchSound)
        dispatch({ type: 'SET_PLAY_RESULT_TEXT', text: eventCodeToDisplayText(currentEvent) })

      /**
       * FOUL (MAKE UP HIT DATA)
       */
      } else if ((
        currentEvent.details.code === GameFeed.EventDetailsCode.Foul ||
        currentEvent.details.code === GameFeed.EventDetailsCode.FoulBunt
      ) && pitchData
      ) {
        playSound(batHitSound)
        tone.startTone(400)

        const foulBallLandingLoc = new Vector3(randFloat(-30, 30), 0, randFloat(-50, 0))
        const cast = new Raycaster(foulBallLandingLoc, new Vector3(0, 1, 0))
        const intersect = cast.intersectObject(parkScene)[0]
        const arc = makeSymmetricalArc(
          feetToM(-pitchData.coordinates.pX), inchesToM(8.5), feetToM(pitchData.coordinates.pZ),
          foulBallLandingLoc.x, foulBallLandingLoc.z, intersect.point?.y ?? 0,
          mphToMetersPerSecond(randFloat(60, 90)), // mph to cm/s
          randFloat(40, 70),
        )
        dispatch({ type: 'SET_CAMERA_VIEW', cameraView: { type: CameraViewEnum.FoulBall } })

        await animGroup.animate((elapsedTime, normalized) => {
          const ballPosition = arc.positionAtTime(elapsedTime / 1000)

          const ballRotationAxis = new Vector3(0, 1, 0).cross(foulBallLandingLoc).normalize()
          baseballMesh?.setRotationFromAxisAngle(ballRotationAxis, (elapsedTime / 1000) * 5)
          tone.updateFromFlightProgress(normalized)

          baseball.position.set(ballPosition.x, ballPosition.y, ballPosition.z)
        }, { playSpeed, duration: arc.totalDuration() * 1000 })

        dispatch({ type: 'SET_PLAY_RESULT_TEXT', text: currentEvent.details.code === GameFeed.EventDetailsCode.FoulBunt ? 'FOUL BUNT' : 'FOUL BALL' })

      /**
       * NOW RENDER BALL ARC
       */
      } else if (pitchData && !ballWasNotHit && ballLandingLocation && hitData && customPlayInfo) {
        playSound(batHitSound)
        tone.startTone(400)

        const arc = makeSymmetricalArc(
          feetToM(-pitchData.coordinates.pX), inchesToM(8.5), feetToM(pitchData.coordinates.pZ),
          ballLandingLocation[0], ballLandingLocation[2], 0,
          mphToMetersPerSecond(hitData.launchSpeed), // mph to cm/s
          hitData.launchAngle,
        )
        const ballAirTime = arc.totalDuration()

        const runnersRelevantToThisPlay = currentPlay.runners.filter(runner => runner.details.playIndex === eventIndex) // Filter out runs that happened before this event, (like base stealing)
        const catchingPlayer = runnersRelevantToThisPlay[0].credits[0] as GameFeed.CreditElement | undefined
        const catchingPlayerLocation = catchingPlayer && FIELD_LOCATION.DEFENSE[catchingPlayer.position.abbreviation].clone()
        const catchingControls = catchingPlayer && defense[catchingPlayer.position.abbreviation]
        const intersectionPoint = (!customPlayInfo.wasCaught && catchingPlayerLocation && ballLandingLocation && hitData)
          ? findIntersection(
              new Vector3(feetToM(-pitchData.coordinates.pX), 0, inchesToM(8.5)),
              new Vector3(ballLandingLocation[0], 0, ballLandingLocation[2])
                .sub(new Vector3(feetToM(-pitchData.coordinates.pX), 0, inchesToM(8.5))).normalize(),
              getBallXYSpeed(mphToMetersPerSecond(hitData.launchSpeed), hitData.launchAngle),
              catchingPlayerLocation,
              CONSTANTS.MAX_RUN_SPEED,
              ballAirTime + 0.05,
            )
          : undefined

        const ballCatch = intersectionPoint ?? { location: new Vector3(...ballLandingLocation), t: ballAirTime }
        const timeUntilOutfielderReachesBall = catchingPlayerLocation
          ? Math.min(ballCatch.t, ballCatch.location.distanceTo(catchingPlayerLocation) / CONSTANTS.MAX_RUN_SPEED)
          : ballCatch.t
        setIntersectPointDebug(intersectionPoint?.location)

        const totalOuts = runnersRelevantToThisPlay.filter(runner => runner.movement.outBase != null).length
        let currentOuts = 0
        const incrementOuts = () => {
          ++currentOuts
          dispatch({
            type: 'SET_PLAY_RESULT_TEXT',
            text: currentOuts === 1 ? 'OUT' : currentOuts === 2 ? 'DOUBLE PLAY' : 'TRIPLE PLAY'
          })
        }
        const ballRotationAxis = new Vector3(0, 1, 0).cross(new Vector3(...ballLandingLocation).normalize())

        const getComputedRunners = (runners: GameFeed.Runner[]): GameFeed.Runner[] => {
          // runnersOnBaseData
          const consolidated = cloneDeep(runners).reduce<GameFeed.Runner[]>((runners, runner) => {
            // CONSOLIDATE BASE MOVES
            const existingIndex = runners.findIndex(prev => prev.details.runner.id === runner.details.runner.id)
            if (existingIndex !== -1) {
              runner.movement.start = runners[existingIndex].movement.start
              runners[existingIndex] = runner
            } else {
              runners.push(runner)
            }
            return runners
          }, [])

          return consolidated
        }
        const computedRunnerList = getComputedRunners(runnersRelevantToThisPlay)

        let didHitGroundAlready = false
        await Promise.all([
          /**
           * MOVE RUNNERS
           */
          ...computedRunnerList.map(runner => {
            // @ts-ignore
            const fbx = offense[runner.movement.start ?? 'B']
            return animateBaserun({ runner: fbx, movement: runner.movement, playSpeed, animGroup })
          }),

          /**
           * BALL AIRBORNE
           */
          Promise.all([
            /**
             * MOVE BALL THRU AIR
             */
            Promise.all([
              animGroup.animate((elapsedTime, normalized) => {
                const ballPosition = arc.positionAtTime(elapsedTime / 1000)
                if (ballPosition.y < 0 || (ballAirTime && (elapsedTime / 1000) > ballAirTime)) {
                  ballPosition.y = 0
                  if (!didHitGroundAlready) {
                    // Ground ball FX
                    if (intersectionPoint) {
                      setBallDidGround(true)
                      playSound(hitDirtSound)
                    }
                  }
                }

                tone.updateFromFlightProgress(normalized)
  
                baseballMesh?.setRotationFromAxisAngle(ballRotationAxis, (elapsedTime / 1000) * 5)
                // if ((elapsedTime / 1000) > ballCatch.t) {
                //   return false
                // }
        
                baseball.position.set(ballPosition.x, ballPosition.y, ballPosition.z)
              }, { playSpeed, duration: ballCatch.t * 1000 })
              .then(() => {
                tone.stopTone()
              }),

             /**
               * MOVE CATCHING PLAYER TO BALL
               */
              catchingPlayer && catchingControls && (
                playerAnimateToLocation({
                  runner: catchingControls,
                  locations: [
                    FIELD_LOCATION.DEFENSE[catchingPlayer.position.abbreviation],
                    ballCatch.location,
                  ],
                  playSpeed,
                  duration: timeUntilOutfielderReachesBall * 1000,
                  lookAt: ballCatch.location,
                  animGroup
                }).then(() => {
                  // catchingControls.scene.lookAt(baseball.position.x, 0, baseball.position.z)
                  catchingControls.scene.lookAt(0, 0, 0)
                  if (customPlayInfo.wasCaught) {
                    catchingControls.setAnimationState('CatchHI')
                  } else {
                    catchingControls.setAnimationState('CatchGround')
                  }
                })
              ),

              /**
               * MOVE DEF PLAYERS TO RECEIVING LOCATIONS
               */
              ...currentPlay.runners.reduce<Promise<void>[]>((animations, runner) => {
                runner.credits.forEach(credit => {
                  if (credit.credit === GameFeed.CreditEnum.FPutout && runner.movement.outBase && catchingPlayer !== credit) {
                    const startPos = FIELD_LOCATION.DEFENSE[credit.position.abbreviation]
                    const endPos = getLocationForBaseCode(runner.movement.outBase, 'defense')
                    const distanceToBall = endPos.distanceTo(startPos)
                    const duration = Math.min(distanceToBall / CONSTANTS.MAX_RUN_SPEED, ballCatch.t)
                    animations.push(
                      playerAnimateToLocation({
                        runner: defense[credit.position.abbreviation],
                        locations: [startPos, endPos],
                        playSpeed,
                        duration: duration * 1000,
                        lookAt: baseball,
                        animGroup
                      })
                    )
                  }
                })
                return animations
              }, []),

              /**
               * CHANGE CAM
               */
              animGroup.delay(300).then(() => {
                dispatch({ type: 'SET_CAMERA_VIEW', cameraView: { type: CameraViewEnum.FollowBallAbove } })
              }),
            ])

            /**
             * BALL CAUGHT AND ALL DEF IN POSITION NOW
             */
            .then(async () => {
              if (catchingControls == null || catchingPlayer == null) return

              catchingControls?.attachBallToHand(baseball, 'R')
              playSound(mitCatchSound)
              // Run catching player to base
              if (catchingPlayer.credit === GameFeed.CreditEnum.FPutout && !customPlayInfo.wasCaught) {
                const baseKey = runnersRelevantToThisPlay[0]?.movement.outBase
                catchingControls && baseKey && dispatch({ type: 'SET_CAMERA_VIEW', cameraView: { type: CameraViewEnum.BasePutOut, player: catchingControls, outBase: baseKey } })

                await playerAnimateToLocation({
                  runner: catchingControls,
                  locations: [
                    ballCatch.location,
                    getLocationForBaseCode(runnersRelevantToThisPlay[0].movement.outBase, 'defense')
                  ],
                  playSpeed,
                  duration: ballCatch.t * 1000,
                  lookAt: baseball,
                  animGroup
                })
              }
              if (catchingPlayer?.credit === 'f_putout') {
                incrementOuts()
                // setRunnersStatus(status => ({ ...status, [runnersRelevantToThisPlay[0].movement.start ?? 'B']: 'out' }))
              }
            }),
          ])

          /**
           * ASSIST DEF SEQUENCE
           */
          .then(async () => {
              let assistIndex = 0
              const defenseCredits = currentPlay.runners.reduce<(GameFeed.CreditElement & { runner: GameFeed.Runner })[]>((credits, runner) => {
                runner.credits.forEach(credit => {
                  if (
                    credit.credit === GameFeed.CreditEnum.FAssist ||
                    credit.credit === GameFeed.CreditEnum.FPutout || 
                    credit.credit === GameFeed.CreditEnum.FFieldedBall
                  ) {
                    if (!credits.find(prevCredit => prevCredit.player.id === credit.player.id)) {
                      credits.push({ ...credit, runner })
                    }
                  }
                })
                return credits
              }, [])

              let ballThrower = catchingPlayer && defense[catchingPlayer.position.abbreviation]

              while (ballThrower && defenseCredits[++assistIndex]) {
                const receiverCredits = defenseCredits[assistIndex]
                const ballReceiver = defense[defenseCredits[assistIndex].position.abbreviation]
                const throwSpeed = mphToMetersPerSecond(70)
                const distanceToThrow = ballThrower.scene.position.distanceTo(ballReceiver.scene.position)
                const throwAngle = lerp(0, 20, clamp(distanceToThrow / feetToM(400), 0, 1)) // Ball should be lower angle up close

                // Look at each other
                ballThrower.scene.lookAt(ballReceiver.scene.position)
                ballReceiver.scene.lookAt(ballThrower.scene.position)

                catchingControls && dispatch({ type: 'SET_CAMERA_VIEW', cameraView: { type: CameraViewEnum.AssistThrowOverShoulder, player: ballThrower } })

                ballThrower.setAnimationState('AssistThrow')
                ballReceiver.setAnimationState('CatchMid')
                ballThrower.attachBallToHand(baseball, 'R')
                await animGroup.delay(750)
                const throwOrigin = ballThrower.rightHandSocketBone?.getWorldPosition(new Vector3()) ?? ballThrower.scene.position
                const throwDestination = ballReceiver.leftHandSocketBone?.getWorldPosition(new Vector3()) ?? ballReceiver.scene.position
                parkScene.add(baseball)

                const arc = makeSymmetricalArc(
                  throwOrigin.x, throwOrigin.z, throwOrigin.y,
                  throwDestination.x, throwDestination.z, throwDestination.y,
                  throwSpeed,
                  throwAngle,
                )
                const ballRotationAxis = new Vector3(0, 1, 0).cross(throwDestination.clone().sub(throwOrigin).normalize())
                const throwDuration = arc.totalDuration() * 1000
                const isFinalThrow = defenseCredits[assistIndex + 1] == null

                let didTransition = false
                await Promise.all([
                  // eslint-disable-next-line no-loop-func
                  animGroup.animate(elapsedTime => {
                    const ballPosition = arc.positionAtTime(elapsedTime / 1000)
                    baseball.position.set(ballPosition.x, ballPosition.y, ballPosition.z)
                    baseball.setRotationFromAxisAngle(ballRotationAxis, (elapsedTime / 1000) * 10)
                    const progress = (elapsedTime / throwDuration)
                    if (progress > 0.5 && isFinalThrow && !didTransition) {
                      didTransition = true
                      dispatch({ type: 'SET_CAMERA_VIEW', cameraView: { type: CameraViewEnum.AssistCatch, player: ballReceiver } })
                    }
                  }, { playSpeed, duration: throwDuration })
                  .then(() => {
                    if (receiverCredits?.credit === 'f_putout') {
                      // setRunnersStatus(status => ({ ...status, [receiverCredits.runner.movement.start ?? 'B']: 'out' }))
                      incrementOuts()
                    }
                  }),

                  // eslint-disable-next-line no-loop-func
                  await animGroup.delay(500).then(() => {
                    ballThrower?.setAnimationState('StandingNeutral')
                  })
                ])

                ballThrower = ballReceiver
              }

              if (!ballWasNotHit) {
                await animGroup.delay(600)
                dispatch({ type: 'SET_CAMERA_VIEW', cameraView: { type: CameraViewEnum.StaticBasesOverview } })
              }
            })
            .then(() => {
              if (currentPlay.result.eventType === 'home_run') {
                dispatch({ type: 'SET_PLAY_RESULT_TEXT', text: 'HOME RUN' })
              }
            })
        ]).then(async () => {
          const runnerStatus = computedRunnerList.reduce<{ [key in OffensePositionKeys]?: GameFeed.Runner }>((acc, runner) => {
            acc[(runner.movement.start ?? 'B') as OffensePositionKeys] = runner
            return acc
          }, {})
          setRunnersStatus(runnerStatus)

          if (totalOuts === 0) {
            const endBase = computedRunnerList[0].movement.end

            if (endBase === '1B') dispatch({ type: 'SET_PLAY_RESULT_TEXT', text: 'SINGLE' })
            else if (endBase === '2B') dispatch({ type: 'SET_PLAY_RESULT_TEXT', text: 'DOUBLE' })
            else if (endBase === '3B') dispatch({ type: 'SET_PLAY_RESULT_TEXT', text: 'TRIPLE' })
          }
        })
      }

      trail.advance()
      trail.pause()
    }

    initAnimations()
    .then(async () => {
        // dispatch({ type: 'SET_PLAY_RESULT_TEXT', text: displayText })
        // setShowBaseball(false)
      tone.stopTone()
      dispatch({ type: 'SET_CURRENT_EVENT_COMPLETED' })

      if (animationRefs.current.autoPlayEnabled) {
        await animGroup.delay(isFinalEvent ? 3000 : 1500)
        incrementEvent(1)
      }
    })
    .catch(e => {
      if (e instanceof CancelledAnimationGroupError) {
        // Animation cancelled (happens frequently)
      } else {
        console.error(e)
      }
    })
    

    return () => {
      // setShowBaseball(false)
      tone.stopTone()
      setRunnersStatus({})
      setBallDidGround(false)
      setStrikeZonePosition(undefined)
      dispatch({ type: 'SET_PLAY_RESULT_TEXT', text: undefined })
      animGroup.cancelAll()
    }
  }, [ballLandingLocation, currentEvent, currentPlay, playSpeed, customPlayInfo, eventIndex, offense, defense, dispatch, trail, baseball, parkScene, isFinalEvent, tone, incrementEvent, isFirstEventOfInning])

  useDebugControls({ baseball })

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.shadow.bias = -.00003;
      lightRef.current.shadow.blurSamples = 4
    }
  }, [])

  const DIR_LIGHT = useMemo(() => {
    const POSITION = new Vector3(-30, 10, 30)
    const DIRECTION = new Vector3(1, -1, 1)
    return {
      TARGET_POS: POSITION.clone().add(DIRECTION),
      POSITION, DIRECTION
    }
  }, [])

  return (
    <group>
      <Park scene={parkScene} />
      {(['1B', '2B', '3B', 'B'] as OffensePositionKeys[]).map((positionKey) => currrentRunnersOnBase[positionKey] && (
        <OffensivePlayer
          key={positionKey}
          runner={runnersStatus[positionKey]}
          offensivePosition={positionKey}
          playerControls={offense[positionKey]}
        />
      ))}
      <Crowd />
      <primitive object={baseball} visible={showBaseball} />
      {customPlayInfo && (
        <>
          {/* {!customPlayInfo.wasCaught && (
            <DebugLocation
              position={intersectPointDebug && intersectPointDebug.toArray()}
              visible={!!intersectPointDebug}
              title={"Ball picked up here"}
            />
          )} */}
          {/* <DebugLocation
            position={ballLandingLocation}
            visible={!!ballLandingLocation}
            title={!customPlayInfo.wasCaught ? "Ground ball landed here" : "Ball caught here"}
          /> */}
        </>
      )}
      {/* {currentEvent?.pitchData && (
        <PitchArc pitchData={currentEvent.pitchData} />
      )}
      {currentEvent?.hitData && currentEvent.pitchData && (
        <HitArc
          pitchData={currentEvent.pitchData}
          hitData={currentEvent.hitData}
          ballLandingLocation={ballLandingLocation}
        />
      )} */}
      {/* {intersectPointDebug && <DebugLocation position={intersectPointDebug.toArray()}  />} */}
      {ballDidHitGround && ballLandingLocation && <BallImpactLocation position={new Vector3().fromArray(ballLandingLocation)}  />}
      {linescore?.defense && (
        <>
            <OffensivePlayer playerControls={defense.P} />
            <OffensivePlayer playerControls={defense['C']} />
            <OffensivePlayer playerControls={defense['1B']} />
            <OffensivePlayer playerControls={defense['2B']} />
            <OffensivePlayer playerControls={defense['SS']} />
            <OffensivePlayer playerControls={defense['3B']} />
            <OffensivePlayer playerControls={defense['LF']} />
            <OffensivePlayer playerControls={defense['CF']} />
            <OffensivePlayer playerControls={defense['RF']} />
        </>
      )}
      <ambientLight intensity={2} />
      <object3D ref={lightTargetRef} position={DIR_LIGHT.TARGET_POS} />
      <directionalLight
        ref={lightRef}
        intensity={3}
        castShadow
        shadow-mapSize-width={1024 * 2}
        shadow-mapSize-height={1024 * 2}
        position={DIR_LIGHT.POSITION}
        target={lightTargetRef.current ?? undefined}
      >
        <orthographicCamera
          near={.01}
          far={5000}
          attach="shadow-camera"
          args={[-50, 50, 50, -50]}
        />
      </directionalLight>
      {currentEvent?.pitchData && (
        <StrikeZone
          pitchData={currentEvent?.pitchData}
          strikeZonePosition={strikeZonePosition}
        />
      )}
    </group>
  )
          
}