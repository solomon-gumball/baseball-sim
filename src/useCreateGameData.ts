import { Dispatch, useEffect, useMemo, useReducer, useState } from 'react'
import { GameFeed } from './data/MLBGameFeed'
import React from 'react'
import { clamp, getLandingLocation } from './util/MathUtil'
import { PlayerControls } from './components/Players'
import { range } from 'lodash'

export enum CameraViewEnum {
  FollowBallAbove = 'FollowBallAbove',
  CatchersPOV = 'CatchersPOV',
  AssistThrowOverShoulder = 'AssistThrowOverShoulder',
  AssistCatch = 'AssistCatch',
  BehindPitcher = 'BehindPitcher',
  StaticBasesOverview = 'StaticBasesOverview',
  BasePutOut = 'BasePutOut',
  FoulBall = 'FoulBall',
  CrowdBehindHomePlate = 'CrowdBehindHomePlate',
  Scoreboard = 'Scoreboard',
  AlternateBatterAngle = 'AlternateBatterAngle',
  AboveBatter = 'AboveBatter'
}

export type CameraView = (
  { type: CameraViewEnum.FollowBallAbove } |
  { type: CameraViewEnum.CatchersPOV } |
  { type: CameraViewEnum.AssistThrowOverShoulder, player: PlayerControls } |
  { type: CameraViewEnum.AssistCatch, player: PlayerControls } |
  { type: CameraViewEnum.BehindPitcher, pitcher: PlayerControls } | 
  { type: CameraViewEnum.StaticBasesOverview } |
  { type: CameraViewEnum.FoulBall } |
  { type: CameraViewEnum.CrowdBehindHomePlate } |
  { type: CameraViewEnum.BasePutOut, player: PlayerControls, outBase: GameFeed.BaseKey } |
  { type: CameraViewEnum.Scoreboard } |
  { type: CameraViewEnum.AlternateBatterAngle } | 
  { type: CameraViewEnum.AboveBatter }
)

type GameDataReducerState = {
  gamePk?: number,
  rawData?: GameFeed.ResponseBody,
  playIndex: number,
  eventIndex: number,
  playSpeed: number,
  version: number,
  freeCam: boolean,
  cameraView?: CameraView,
  playResultText?: string,
  scoreboardImage?: HTMLImageElement,
  currentEventHasCompleted: boolean,
  muteEnabled: boolean,
  autoPlayEnabled: boolean
}

export const StaticCameraAngles = [
  CameraViewEnum.FollowBallAbove,
  CameraViewEnum.CatchersPOV,
  CameraViewEnum.StaticBasesOverview,
  CameraViewEnum.FoulBall,
  CameraViewEnum.CrowdBehindHomePlate,
  CameraViewEnum.Scoreboard,
] as const

export type GameDataState = GameDataReducerState & {
  currentPlay?: GameFeed.Play,
  currentEvent?: GameFeed.Event,
  linescore?: GameFeed.Linescore,
  ballLandingLocation?: [number, number, number],
  prevPlay?: GameFeed.Play,
  currrentRunnersOnBase: RunnersOnBase,
  isFinalEvent: boolean,
  prevEvent?: GameFeed.Event,
  scoreboardData?: ScoreboardData,
  currentEventHasCompleted: boolean,
  currentPlayHasCompleted: boolean,
  halfInningComplete: boolean,
  isMobileLayout: boolean,
  isHalfInningFinalEvent: boolean,
  isFirstEventOfInning: boolean
}

type GameDataAction = (
  { type: 'DATA', data: GameFeed.ResponseBody } |
  { type: 'INCREMENT_EVENT', increment: number } |
  { type: 'INCREMENT_PLAY', increment: number, goLastEvent?: boolean } |
  { type: 'SET_EVENT', eventIndex: number } |
  { type: 'SET_PLAY_SPEED', playSpeed: number } |
  { type: 'SET_CAMERA_VIEW', cameraView: CameraView } |
  { type: 'SET_PLAY_RESULT_TEXT', text?: string } |
  { type: 'SET_FREE_CAM', freeCam: boolean } |
  { type: 'SET_SCOREBOARD_IMAGE', image?: HTMLImageElement } |
  { type: 'SET_AUTOPLAY_ENABLED', autoPlayEnabled: boolean } |
  { type: 'TOGGLE_MUTE' } |
  { type: 'SET_CURRENT_EVENT_COMPLETED' }
)

type ScoreboardData = {
  currentOuts: number,
  currentBalls: number,
  currentStrikes: number,
  awayScoresByInning: (number | undefined)[],
  homeScoresByInning: (number | undefined)[],
  currentAwayScore: number,
  currentHomeScore: number,
  currentAwayHits: number,
  currentAwayErrors: number,
  currentAwayLOB: number,
  currentHomeHits: number,
  currentHomeErrors: number,
  currentHomeLOB: number,
  bases: RunnersOnBase
}

type RunnersOnBase = {
  '1B': GameFeed.EntityWithFullName | undefined,
  '2B': GameFeed.EntityWithFullName | undefined,
  '3B': GameFeed.EntityWithFullName | undefined,
  'B': GameFeed.EntityWithFullName | undefined,
  'score': GameFeed.EntityWithFullName | undefined
}

function GameDataReducer(state: GameDataReducerState, action: GameDataAction): GameDataReducerState {
  switch (action.type) {
    case 'DATA': {
      return {
        ...state, rawData: action.data, gamePk: action.data.gamePk
      }
    }
    case 'TOGGLE_MUTE': return { ...state, muteEnabled: !state.muteEnabled }
    case 'SET_AUTOPLAY_ENABLED': return { ...state, autoPlayEnabled: action.autoPlayEnabled }
    case 'SET_CURRENT_EVENT_COMPLETED': return { ...state, currentEventHasCompleted: true }
    case 'SET_SCOREBOARD_IMAGE': return { ...state, scoreboardImage: action.image }
    case 'SET_CAMERA_VIEW': return { ...state, cameraView: action.cameraView }
    case 'SET_PLAY_SPEED': return { ...state, playSpeed: Math.max(0.1, action.playSpeed) }
    case 'SET_PLAY_RESULT_TEXT': return { ...state, playResultText: action.text }
    case 'SET_FREE_CAM': return { ...state, freeCam: action.freeCam }
    case 'INCREMENT_EVENT':
      const currPlayEvents = state.rawData?.liveData?.plays.allPlays[state.playIndex]?.playEvents
      const newIndex = state.eventIndex + action.increment
      if (currPlayEvents) {
        if (newIndex > currPlayEvents.length - 1) {
          return GameDataReducer(state, { type: 'INCREMENT_PLAY', increment: 1 })
        } if (newIndex < 0) {
          return GameDataReducer(state, { type: 'INCREMENT_PLAY', increment: -1, goLastEvent: true })
        }
      }
    return { ...state, eventIndex: newIndex, currentEventHasCompleted: false }
    case 'INCREMENT_PLAY': {
      const newIndex = state.rawData ? clamp(state.playIndex + action.increment, 0, state.rawData.liveData.plays.allPlays.length - 1) : state.playIndex
      const playAtIndex = state.rawData?.liveData.plays.allPlays[newIndex]
      const numEvents = playAtIndex?.playEvents.length ?? 0
      return {
        ...state,
        playIndex: newIndex,
        eventIndex: action.goLastEvent ? numEvents - 1 : 0,
        playResultText: undefined,
        currentEventHasCompleted: false,
      }
    }
    case 'SET_EVENT': return { ...state, eventIndex: action.eventIndex, playResultText: undefined }
  }
}

const DefaultStore: GameDataState = {
  freeCam: false,
  playIndex: 0,
  eventIndex: 0,
  playSpeed: 0.8,
  version: 0,
  isFinalEvent: false,
  isFirstEventOfInning: false,
  currentEventHasCompleted: true,
  currentPlayHasCompleted: true,
  isHalfInningFinalEvent: false,
  halfInningComplete: false,
  prevEvent: undefined,
  isMobileLayout: false,
  autoPlayEnabled: true,
  muteEnabled: false,
  cameraView: { type: CameraViewEnum.CatchersPOV } as const,
  currrentRunnersOnBase: {
    '1B': undefined,
    '2B': undefined,
    '3B': undefined,
    'B': undefined,
    'score': undefined,
  }
}

function computeIsMobileLayout() {
  return (window.innerWidth / window.innerHeight) <= 2/3
}

function initStorageValue(gamePk?: number): GameDataReducerState {
  const data = localStorage.getItem('play-data')
  if (!data) return DefaultStore
  try {
    const savedState: GameDataReducerState = JSON.parse(data)
    if (
      !savedState.gamePk ||
      savedState.gamePk !== gamePk ||
      savedState.version !== 0
    ) throw new Error()
    return savedState
  } catch {
    console.error('invalid saved local state, starting new')
  }

  return {
    ...DefaultStore,
    gamePk,
  }
}

function initReducerState(gamePk?: number): GameDataReducerState {
  const saved = initStorageValue(gamePk)

  const urlParams = new URLSearchParams(window.location.search);
  const playId = urlParams.get('p')
  const [playIndexStr, eventIndexStr] = playId?.split('.') ?? ['', '']
  const playIndexOverride = parseInt(playIndexStr)
  const eventIndexOverride = parseInt(eventIndexStr)

  return {
    ...saved,
    playIndex: isNaN(playIndexOverride) ? saved.playIndex : playIndexOverride,
    eventIndex: isNaN(eventIndexOverride) ? saved.eventIndex : eventIndexOverride,
  }
}

function getRunnersOnBaseForEventStart(playIndex: number, eventIndex: number, plays?: GameFeed.Play[]) {
  const currentPlay = plays?.[playIndex]
  const prevPlay = plays?.[playIndex - 1]
  const bases = {
    '1B': prevPlay?.matchup.postOnFirst,
    '2B': prevPlay?.matchup.postOnSecond,
    '3B': prevPlay?.matchup.postOnThird,
    'B': currentPlay?.matchup.batter,
    'score': (undefined as GameFeed.EntityWithFullName | undefined)
  }
  const prevEventIndex = eventIndex - 1
  for (let i = 0; i <= prevEventIndex; i++) {
    currentPlay?.runners.forEach(runner => {
      if (runner.details.playIndex === i) {
        if (!runner.movement.end) {
          bases[runner.movement.start ?? 'B'] = undefined
        } else {
          bases[runner.movement.end] = bases[runner.movement.start ?? 'B']
          bases[runner.movement.start ?? 'B'] = undefined
        }
      }
    })
  }

  return bases
}

export default function useCreateGameData(gamePk?: number): [GameDataState, Dispatch<GameDataAction>] {
  const [feedState, dispatch] = useReducer(GameDataReducer, { gamePk, ...DefaultStore }, () => initReducerState(gamePk))
  const { rawData, eventIndex, playIndex, currentEventHasCompleted } = feedState
  const allPlays = rawData?.liveData.plays.allPlays
  const currentPlay = allPlays?.[playIndex]
  const linescore = rawData?.liveData.linescore
  const currentEvent = currentPlay?.playEvents[eventIndex]
  const prevPlay = rawData?.liveData.plays.allPlays[playIndex - 1]
  const prevEvent = currentPlay?.playEvents[eventIndex - 1]
  const isFinalEvent = (feedState && currentPlay) ? (feedState?.eventIndex >= currentPlay.playEvents.length - 1) : false
  const currentPlayHasCompleted = isFinalEvent && currentEventHasCompleted
  const isHalfInningFinalEvent = isFinalEvent && currentPlay?.count.outs === 3
  const halfInningComplete = currentPlayHasCompleted && currentPlay?.count.outs === 3
  const isFirstEventOfInning = eventIndex === 0 && prevPlay?.about.halfInning !== currentPlay?.about.halfInning
  const [initialIndices] = useState(() => [playIndex, eventIndex])

  useEffect(() => {
    if (initialIndices[0] !== playIndex || initialIndices[1] !== eventIndex) {
      window.history.replaceState({}, '', window.location.pathname + window.location.hash)
    }
  }, [eventIndex, initialIndices, playIndex])

  const ballLandingLocation: [number, number, number] | undefined = useMemo(() => (
    currentEvent?.hitData && getLandingLocation(currentEvent.hitData)
  ), [currentEvent?.hitData])

  const currrentRunnersOnBase = useMemo(() => {
    return getRunnersOnBaseForEventStart(playIndex, eventIndex, rawData?.liveData.plays.allPlays)
  }, [eventIndex, playIndex, rawData?.liveData.plays.allPlays])

  const scoreboardData: ScoreboardData | undefined = useMemo(() => {
    if (!currentPlay || !rawData) return undefined
    const currentPlayInningIndex = currentPlay.about.inning - 1
    const completedPlayIndex = currentPlayHasCompleted ? playIndex + 1 : playIndex
    const lastCompletedEvent = currentEventHasCompleted ? currentEvent : prevEvent
    const lastCompletedPlay = currentPlayHasCompleted ? currentPlay : prevPlay

    const completedAwayTeamPlaysByInning = range(9).map(inning => {
      if (currentPlayInningIndex < inning) return undefined
      const playIDsThisInning = rawData.liveData.plays.playsByInning[inning].top.filter(id => id < completedPlayIndex)
      const playsThisInning = playIDsThisInning.map(index => rawData.liveData.plays.allPlays[index])
      return playsThisInning
    })

    const completedHomeTeamPlaysByInning = range(9).map(inning => {
      if (currentPlayInningIndex < inning || (currentPlayInningIndex === inning && currentPlay.about.isTopInning)) return undefined
      const playIDsThisInning = rawData.liveData.plays.playsByInning[inning].bottom.filter(id => id < completedPlayIndex)
      const playsThisInning = playIDsThisInning.map(index => rawData.liveData.plays.allPlays[index])
      return playsThisInning
    })

    function getScoringPlayCount(completedPlays: GameFeed.Play[] | undefined) {
      if (completedPlays == null) return undefined
      const scoresThisPlay = completedPlays.reduce<number>((acc, play) => acc + play.runners.filter(runner => runner.details.isScoringEvent).length, 0)
      return scoresThisPlay
    }
    function getTotalErrors(playsByInning: (GameFeed.Play[] | undefined)[]) {
      let errors = 0
      playsByInning.forEach(playsThisInning => {
        playsThisInning?.forEach(play => {
          if (
            play.result.eventType === GameFeed.EventType.Error ||
            play.result.eventType === GameFeed.EventType.FieldError
          )
          errors++
        })
      })
      return errors
    }
    
    function getTotalLOB(playsByInning: (GameFeed.Play[] | undefined)[]) {
      let lob = 0
      playsByInning.forEach(playsThisInning => {
        if (!playsThisInning) return
        const lastPlay = playsThisInning[playsThisInning.length - 1]
        const lastSetup = playsThisInning[playsThisInning.length - 2]?.matchup
        if (lastPlay?.count.outs !== 3) return

        if (lastSetup?.postOnFirst) lob++
        if (lastSetup?.postOnSecond) lob++
        if (lastSetup?.postOnThird) lob++

        lastPlay.runners.forEach(runner => {
          // If we start on a base and complete a run we should undo our
          // left on base addition
          if (runner.movement.start && runner.details.isScoringEvent) {
            lob--
          }
        })
      })
      return lob
    }

    function getTotalHits(playsByInning: (GameFeed.Play[] | undefined)[]) {
      let runs = 0
      playsByInning.forEach(playsThisInning => {
        playsThisInning?.forEach(play => {
          if (
            play.result.eventType === GameFeed.EventType.Single ||
            play.result.eventType === GameFeed.EventType.Double ||
            play.result.eventType === GameFeed.EventType.Triple ||
            play.result.eventType === GameFeed.EventType.HomeRun
          )
          runs++
        })
      })
      return runs
    }

    return {
      awayScoresByInning: completedAwayTeamPlaysByInning.map(getScoringPlayCount),
      homeScoresByInning: completedHomeTeamPlaysByInning.map(getScoringPlayCount),
      currentAwayScore: lastCompletedPlay?.result.awayScore ?? 0,
      currentHomeScore: lastCompletedPlay?.result.homeScore ?? 0,
      bases: getRunnersOnBaseForEventStart(
        playIndex,
        currentEventHasCompleted
          ? eventIndex + 1
          : eventIndex,
        rawData.liveData.plays.allPlays
      ),
      currentOuts: lastCompletedPlay?.about.halfInning === currentPlay?.about.halfInning ? (lastCompletedPlay?.count.outs ?? 0) : 0,
      currentStrikes: lastCompletedEvent?.count.strikes ?? 0,
      currentBalls: lastCompletedEvent?.count.balls ?? 0,
      currentAwayHits: getTotalHits(completedAwayTeamPlaysByInning),
      currentAwayErrors: getTotalErrors(completedAwayTeamPlaysByInning),
      currentAwayLOB: getTotalLOB(completedAwayTeamPlaysByInning),
      currentHomeHits: getTotalHits(completedHomeTeamPlaysByInning),
      currentHomeErrors: getTotalErrors(completedHomeTeamPlaysByInning),
      currentHomeLOB: getTotalLOB(completedHomeTeamPlaysByInning),
    }
  }, [currentPlay, rawData, currentPlayHasCompleted, playIndex, currentEventHasCompleted, currentEvent, prevEvent, prevPlay, eventIndex])

  useEffect(() => {
    const toSave: Partial<GameDataReducerState> = {
      playIndex: feedState.playIndex,
      eventIndex: feedState.eventIndex,
      playSpeed: feedState.playSpeed,
      version: feedState.version,
      autoPlayEnabled: feedState.autoPlayEnabled,
      freeCam: false,
      muteEnabled: feedState.muteEnabled,
      gamePk: feedState.gamePk
    }
    localStorage.setItem('play-data', JSON.stringify(toSave))

  }, [feedState.autoPlayEnabled, feedState.cameraView, feedState.eventIndex, feedState.freeCam, feedState.gamePk, feedState.muteEnabled, feedState.playIndex, feedState.playSpeed, feedState.version])

  useEffect(() => {
    if (gamePk == null) return

    fetch(`https://statsapi.mlb.com/api/v1.1/game/${gamePk}/feed/live`)
      .then(result => result.json())
      .then((data: GameFeed.ResponseBody) => {
        dispatch({ type: 'DATA', data })
      })
  }, [gamePk])

  const [isMobileLayout, setIsMobileLayout] = useState(computeIsMobileLayout)
  useEffect(() => {
    const resizeHandler = () => {
      setIsMobileLayout(computeIsMobileLayout())
    }
    document.addEventListener('resize', resizeHandler)
    return () => {
      document.removeEventListener('resize', resizeHandler)
    }
  }, [])
  
  return [{
      ...feedState,
      isFirstEventOfInning,
      isHalfInningFinalEvent,
      isMobileLayout,
      prevPlay,
      isFinalEvent,
      prevEvent,
      currrentRunnersOnBase,
      currentPlay,
      currentEvent,
      linescore,
      ballLandingLocation,
      scoreboardData,
      currentEventHasCompleted,
      currentPlayHasCompleted,
      halfInningComplete
    },
    dispatch
  ]
}

export const GameFeedContext = React.createContext<[GameDataState, Dispatch<GameDataAction>]>([DefaultStore, () => {}])