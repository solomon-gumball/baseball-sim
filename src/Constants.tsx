import { Vector3 } from "three"
import { GameFeed } from "./data/MLBGameFeed"
import { feetToM, mphToMetersPerSecond } from "./util/MathUtil"

export type OffensePositionKeys = ( 'B' | '1B' | '2B' | '3B')
export type AllPlayerPositions = GameFeed.DPosAbbr | OffensePositionKeys

export const BASE_URL = 'https://solomon-gumball.github.io/baseball-sim'
export const BASE_PATH = 'baseball-sim'
// export const BASE_URL = 'http://localhost:3000'
// export const BASE_PATH = ''

export const FIELD_LOCATION: {
  BASE: { [key: string]: Vector3 },
  OFFENSE: { [key in OffensePositionKeys]: Vector3 },
  DEFENSE: { [key in GameFeed.DPosAbbr]: Vector3 }
 } = {
  BASE: {
    FIRST: new Vector3(feetToM(-63.4), 0, feetToM(63.4)),
    SECOND: new Vector3(feetToM(0), 0, feetToM(128.2)),
    THIRD: new Vector3(feetToM(63.4), 0, feetToM(63.4)),
    HOME: new Vector3(0, 0, 0)
  },
  OFFENSE: {
    'B': new Vector3(feetToM(2.4), 0, feetToM(1)),
    '1B': new Vector3(feetToM(-63.4), 0, feetToM(63.4)),
    '2B': new Vector3(feetToM(0), 0, feetToM(131.6)),
    '3B': new Vector3(feetToM(63.4), 0, feetToM(63.4)),
  },
  DEFENSE: {
    '1B': new Vector3(feetToM(-66), 0, feetToM(83.4)),
    '2B': new Vector3(feetToM(-45), 0, feetToM(150)),
    '3B': new Vector3(feetToM(66), 0, feetToM(83.4)),
    'SS': new Vector3(feetToM(45), 0, feetToM(150)),
    'LF': new Vector3(feetToM(120), 0, feetToM(240)),
    'CF': new Vector3(0, 0, feetToM(270)),
    'RF': new Vector3(-feetToM(120), 0, feetToM(240)),
    'P': new Vector3(0, 0, feetToM(60.5)),
    'C': new Vector3(0, 0, feetToM(-6))
  }
}

export const CONSTANTS = {
  MAX_RUN_SPEED: mphToMetersPerSecond(9)
}

export const PITCH_ANIMATION_DATA = {
  BALL_RELEASE_TIME: 1320,
  BALL_RIGHT_HAND_RELEASE_POSITION: [-0.2205, -1.4052, 1.3730] as const, // meters cuz blender
  BALL_LEFT_HAND_RELEASE_POSITION: [0.2205, -1.4052, 1.3730] as const,
  ASSIS_THROW_HAND_RELEASE_POSITION: [-1.38627, -3.47286, 4.2743] as const,
  HI_CATCH_POSITION: [1.30294, -0.71982, 5.66154] as const
}

export const eventCodeToDisplayText = ((currentEvent: GameFeed.Event) => {
  if (currentEvent.type === 'action') {
    switch (currentEvent.details.eventType) {
      case 'pitching_substitution':
        return 'PITCHING SUBSTITUTION'
      case 'defensive_indiff':
      case 'stolen_base_3b':
      case 'stolen_base_2b':
        return 'BASE STEAL'
      case 'mound_visit':
        return 'MOUND VISIT'
      case 'game_advisory':
        return 'GAME ADVISORY'
      case 'batter_timeout':
        return 'BATTER TIMEOUT'
      case 'wild_pitch':
        return 'WILD PITCH'
      case 'defensive_switch':
        return 'DEFENSIVE SWITCH'
      case 'defensive_substitution':
        return 'DEFENSIVE SUBSTITUTION'
      case 'offensive_substitution':
        return 'OFFENSIVE SUBSTITUTION'
    }
  }
  switch (currentEvent.details.code) {
    case GameFeed.EventDetailsCode.Ball: return 'BALL'
    case GameFeed.EventDetailsCode.AutomaticBallIntentional: return 'INTENTIONAL BALL'

    case GameFeed.EventDetailsCode.CalledStrike: 
    case GameFeed.EventDetailsCode.SwingingStrike: {
      if (currentEvent.count.strikes === 3) {
        return 'STRIKE OUT'
      }
      return 'STRIKE'
    }
    case GameFeed.EventDetailsCode.BallInDirt: return 'BALL IN DIRT'
    case GameFeed.EventDetailsCode.FoulTip:
    case GameFeed.EventDetailsCode.Foul: return 'FOUL'
    case GameFeed.EventDetailsCode.InPlayOut: return 'OUT'
    case GameFeed.EventDetailsCode.InPlayRun:
    case GameFeed.EventDetailsCode.InPlayNoOut: return 'SAFE'
    case GameFeed.EventDetailsCode.PickoffAttempt2b:
    case GameFeed.EventDetailsCode.PickoffAttempt1b: return 'PICKOFF ATTEMPT'
    case GameFeed.EventDetailsCode.PitcherStepOff: return 'PITCHER STEP OFF'
    case GameFeed.EventDetailsCode.HitByPitch: return 'HIT BY PITCH'

    case GameFeed.EventDetailsCode.AutomaticBallPitcherPitchTimerViolation: return 'AutomaticBallPitcherPitchTimerViolation'
  }
})

export function getLocationForBaseCode(code: GameFeed.BaseKey | null, team: 'defense' | 'offense'): Vector3 {
  switch (code) {
    case '1B': return team === 'defense'
      ? FIELD_LOCATION.BASE.FIRST
      : FIELD_LOCATION.BASE.FIRST.clone().add({ x: 1.3, y: 0, z: 0 })
    case '2B': return team === 'defense'
    ? FIELD_LOCATION.BASE.SECOND
    : FIELD_LOCATION.BASE.SECOND.clone().add({ x: 1, y: 0, z: -1 })
    case '3B': return team === 'defense'
    ? FIELD_LOCATION.BASE.THIRD
    : FIELD_LOCATION.BASE.THIRD.clone().add({ x: -1, y: 0, z: 0.2 })
    default:
    case 'score': return team === 'defense'
    ? FIELD_LOCATION.BASE.HOME.clone().add({ x: -0.5, y: 0, z: .5 })
    : FIELD_LOCATION.BASE.HOME.clone().add({ x: 0.5, y: 0, z: 0 })
  }
}