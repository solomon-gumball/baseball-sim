import { useParams } from "react-router"
import { GameFeed } from "../data/MLBGameFeed"
import { feetToM } from "../util/MathUtil"
import useCreateGameData, { GameFeedContext } from "../useCreateGameData"
import styles from '../css/LiveGameView.module.css'
import { useContext, useEffect, useRef, useState } from "react"
import domToImage from 'dom-to-image'
import { range } from "lodash"
import FilteredPhoto from "./FilteredPhoto"

// blender coords -> threejs
// xyz = xz-y

export default function Scoreboard() {
  return (
    <group position={[feetToM(13.6001), feetToM(121.547), feetToM(569.098)]}>
      <mesh scale={1}>
        <boxGeometry args={[1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  )
}

export function ScoreboardDebugApp() {
  const { gameId } = useParams();
  const [store, dispatch] = useCreateGameData(parseInt(gameId ?? ''))
  const [image, setImage] = useState<HTMLImageElement>()
  const containerRef = useRef<HTMLDivElement>(null)

  const team = store.rawData?.liveData.boxscore

  function onComplete(image: HTMLImageElement) {
    setImage(image)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container || !image) return
    
    // container.appendChild(image)
    return () => {
      // container.removeChild(image)
    }
  }, [image])

  return (
    <GameFeedContext.Provider value={[store, dispatch]}>
      <div ref={containerRef}>
        <ScoreboardHTML onComplete={onComplete}/>
      </div>
    </GameFeedContext.Provider>
  )
}

function StatValue({ label, val }: { label?: string, val?: string }) {
  const valParsed = parseFloat(val ?? '')
  return (
    <div className={styles.flexCol} style={{ flexGrow: 1, alignItems: 'center' }}>
      <div style={{ }}>{label}</div>
      <div style={{ fontSize: '1.4em' }}>{valParsed.toFixed(3).slice(1)}</div>
    </div>
  )
}

function ScoringGridColumn({ linescore, col, teams, themeColor }: { themeColor: string, linescore: GameFeed.Linescore, col: number, teams: GameFeed.GameDataTeams }) {
  const [{ currentEvent, currentPlay, scoreboardData }, dispatch] = useContext(GameFeedContext)
  if (!currentEvent || !currentPlay) return null
  if (col === 0) {
    return (
      <div className={styles.inningCol} style={{ textAlign: 'center', flexBasis: '150%', flexGrow: 1, borderRight: '2px solid black' }}>
        <div className={styles.inningHeader} />
        <div className={styles.inningScoreCell}>{teams.away.abbreviation}</div>
        <div className={styles.inningScoreCell}>{teams.home.abbreviation}</div>
      </div>
    )
  } else if (col <= 9) {
    const isCurrentInning = currentPlay.about.inning === col
    return (
      <div className={styles.inningCol} style={{ textAlign: 'center', flexBasis: '100%', flexGrow: 1, boxShadow: isCurrentInning ? 'inset 0px 0px 0px 4px white' : '' }}>
        <div className={styles.inningHeader} style={{ backgroundColor: isCurrentInning ? 'white': 'rgba(255, 255, 255, 0.2)', color: isCurrentInning ? themeColor : 'white' }}>{col}</div>
        <div className={styles.inningScoreCell}>
        {scoreboardData?.awayScoresByInning[col - 1]}
        </div>
        <div className={styles.inningScoreCell}>
        {scoreboardData?.homeScoresByInning[col - 1]}
        </div>
      </div>
    )
  } else if (col <= 13) {
    return (
      <div className={styles.inningCol} style={{ textAlign: 'center', flexBasis: '100%', flexGrow: 1, borderLeft: col === 10 ? '2px solid black' : '', borderRight: col === 10 ? '2px solid black' : '' }}>
        <div className={styles.inningHeader}>
          {col === 10 && 'R'}
          {col === 11 && 'H'}
          {col === 12 && 'E'}
          {col === 13 && 'LOB'}
        </div>
        <div className={styles.inningScoreCell}>
          {col === 10 && (scoreboardData?.currentAwayScore ?? 0)}
          {col === 11 && (scoreboardData?.currentAwayHits ?? 0)}
          {col === 12 && (scoreboardData?.currentAwayErrors ?? 0)}
          {col === 13 && (scoreboardData?.currentAwayLOB ?? 0)}
        </div>
        <div className={styles.inningScoreCell}>
          {col === 10 && (scoreboardData?.currentHomeScore ?? 0)}
          {col === 11 && (scoreboardData?.currentHomeHits ?? 0)}
          {col === 12 && (scoreboardData?.currentHomeErrors ?? 0)}
          {col === 13 && (scoreboardData?.currentHomeLOB ?? 0)}
        </div>
      </div>
    )
  }
  return (
    <div className={styles.inningCol} style={{ paddingTop: 0, textAlign: 'center', flexBasis: '100%', flexGrow: 1, borderLeft: col === 14 ? '2px solid black' : '' }}>
      <div className={styles.inningHeader}>
        {col === 14 && 'B'}
        {col === 15 && 'S'}
        {col === 16 && 'O'}
      </div>
      <div className={styles.inningScoreCell + ' ' + styles.flexCol} style={{ fontSize: 48, flexGrow: 1, justifyContent: 'space-around' }}>
        <div>
          {col === 14 && scoreboardData?.currentBalls}
          {col === 15 && scoreboardData?.currentStrikes}
          {col === 16 && scoreboardData?.currentOuts}
        </div>
      </div>
    </div>
  )
}

function getCurrentEventId(eventIndex: number, playIndex: number, completed: boolean) {
  return `${playIndex}-${eventIndex}-${completed ? 1 : 0}`
}

export function ScoreboardHTML({ onComplete }: { onComplete: (imageUrl: HTMLImageElement) => void }) {
  const [{ rawData, currentEvent, currentPlay, playIndex, eventIndex, currentEventHasCompleted }, dispatch] = useContext(GameFeedContext)
  const container = useRef<HTMLDivElement>(null)
  const [imageLoadedPlayId, setImageLoaded] = useState<string>()
  const widthHeightRatio = 194 / 80
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const specialEventId = getCurrentEventId(playIndex, eventIndex, currentEventHasCompleted)

  useEffect(() => {
    if (
      container.current == null ||
      currentEvent == null ||
      imageLoadedPlayId !== specialEventId
    ) return

    domToImage.toJpeg(container.current, { quality: 1, cacheBust: false }).then(data => {
      const image = new Image()
      image.src = data
      onCompleteRef.current(image)
    })
  }, [imageLoadedPlayId, currentEvent, specialEventId])
  
  if (rawData == null || currentPlay == null) return null

  const awayTeamAtBat = currentPlay.about.halfInning === 'top'
  const atBatTeamName = awayTeamAtBat
    ? rawData.gameData.teams.away.teamName
    : rawData.gameData.teams.home.teamName

  const batterInfoId = currentPlay?.matchup.batter.id
  const batterInfo = rawData.gameData.players[`ID${batterInfoId ?? ''}`]
  const batterData = rawData.liveData.boxscore.teams[awayTeamAtBat ? 'away' : 'home'].players[`ID${batterInfoId ?? ''}`]

  const linescore = rawData.liveData.linescore
  const battingOrder = rawData.liveData.boxscore.teams.away.battingOrder
  const currentBatterIndex = battingOrder?.indexOf(batterInfoId)
  const nextAtBats = battingOrder?.slice(currentBatterIndex + 1).concat(battingOrder.slice(0, currentBatterIndex))
      .map(id => rawData.gameData.players[`ID${id}`])

  const teamAbbr = rawData.gameData.teams[awayTeamAtBat ? 'away' : 'home'].abbreviation
  // const themeColor = teamColors[(teamAbbr.toUpperCase() as keyof typeof teamColors)]?.[0] ?? 'teal'
  const themeColor = currentPlay.about.halfInning === 'top' ? '#4A3448' : '#AD4126'

  return (
    <div ref={container} className={styles.flexCol + ' ' + styles.scoreboard} style={{ width: 1060, height: 1060 / widthHeightRatio, color: 'white', backgroundColor: themeColor, fontSize: 24 }}>
      <div className={styles.flexRow} style={{ flexGrow: 1, fontWeight: 'bold' }}>
        <div className={styles.flexCol} style={{ width: '32%', background: 'linear-gradient(.25turn, black, rgba(255, 255, 255, 0.1))' }}>
          <div className={styles.colInfoBox}>TEAM - {atBatTeamName?.toUpperCase()}</div>
          <div className={styles.colInfoBoxHeader}>SEASON STATS</div>
          <div className={styles.colInfoBox}>
            <div className={styles.flexRow}>
              <StatValue label="OBP" val={batterData.seasonStats.batting.obp} />
              <StatValue label="SLG" val={batterData.seasonStats.batting.slg} />
              <StatValue label="OPS" val={batterData.seasonStats.batting.ops} />
            </div>
          </div>
          {/* <div className={classes.colInfoBox}> */}
            <div className={styles.colInfoBoxHeader}>BATTING ORDER</div>
          {/* </div> */}
          {nextAtBats?.slice(0, 3).map((player, i) => <div key={player.id} style={{ borderBottom: i === 2 ? '' : '4px solid rgba(0, 0, 0, .3)', padding: 3 }}>{player.firstLastName.toUpperCase()}</div>)}
        </div>
        <div style={{ flexGrow: 1, position: 'relative', borderRight: '4px inset rgba(0, 0, 0, .3)', borderLeft: '4px inset rgba(0, 0, 0, .3)', }}>
          <div className={styles.flexCol} style={{ top: '5%', display: 'flex', position: 'relative' }}>
            <div className={styles.flexRow} style={{ alignItems: 'flex-end' }}>
              <div style={{
                borderTopRightRadius: '40px',
                borderBottomRightRadius: '40px',
                marginRight: 4,
                backgroundColor: 'white',
                fontWeight: 'bold',
                color: themeColor,
                lineHeight: '28px',
                padding: '16px 30px',
                fontSize: '2.16em',
                paddingTop: 20
              }}>
                {batterInfo.primaryNumber}
              </div>
              <div style={{ fontSize: '1.42em', fontWeight: 'bold' }}>{batterInfo.firstName.toUpperCase()}</div>
            </div>
            <div style={{ fontSize: '3.3em', paddingLeft: 2, marginTop: -5, marginLeft: 5 }}>{batterInfo.lastName.toUpperCase()}</div>
            <div className={styles.flexRow} style={{ alignItems: 'center', marginLeft: 5, marginTop: 12 }}>
              <div className={styles.flexRow} style={{ fontSize: '1.1em', marginRight: 16 }}>
                AVG<div className={styles.tagEl} style={{ marginTop: -4, marginLeft: 5 }}>{batterData.seasonStats.batting.avg}</div>
              </div>
              <div className={styles.flexRow} style={{ fontSize: '1.1em', marginRight: 16 }}>
                HR<div className={styles.tagEl} style={{ marginTop: -4, marginLeft: 5 }}>{batterData.seasonStats.batting.homeRuns}</div>
              </div>
              <div className={styles.flexRow} style={{ fontSize: '1.1em', marginRight: 16 }}>
                RBI<div className={styles.tagEl} style={{ marginTop: -4, marginLeft: 5 }}>{batterData.seasonStats.batting.rbi}</div>
              </div>
            </div>
          </div>
          <div style={{ bottom: 0, position: 'absolute', width: '100%' }}>
            <FilteredPhoto
              imageUrl={`https://img.mlbstatic.com/mlb-photos/image/upload/w_300,q_100/v1/people/${batterInfoId}/headshot/silo/current`}
              blockSize={4}
              width={300}
              height={300}
              onComplete={() => {
                setImageLoaded(specialEventId)
              }}
              style={{ bottom: '100%', right: '0px', position: 'absolute' }}
            />
            {/* <img
              alt="hi"
              src={`https://img.mlbstatic.com/mlb-photos/image/upload/w_300,q_100/v1/people/${batterInfoId}/headshot/silo/current`}
              style={{ bottom: '100%', right: '0px', position: 'absolute', width: 300 }}
            /> */}
          </div>
        </div>
        
        {/* <div className={classes.flexCol} style={{ fontWeight: 'bold', padding: '7px 8px', width: '22%', background: 'linear-gradient(.25turn, black, rgba(255, 255, 255, 0.1))' }}>
          {boxScore.teams.away.team.name.toUpperCase()}
        </div> */}
      </div>
      <div className={styles.flexRow}>
          {range(17).map(i => (
            <ScoringGridColumn themeColor={themeColor} key={i} col={i} linescore={linescore} teams={rawData.gameData.teams} />
          ))}
        </div>
    </div>
  )
}