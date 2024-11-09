import { useContext, useMemo } from 'react'
import styles from '../css/LiveGameView.module.css'
import { GameFeedContext } from '../useCreateGameData'
import MatchupBox from './MatchupBox'
import { formatDate } from '../ScheduleView'

export default function GameControlPanel({ incrementEvent }: { incrementEvent: (inc: number) => void }) {
  const [{ rawData, isMobileLayout, currentEventHasCompleted, autoPlayEnabled }, dispatch] = useContext(GameFeedContext)
  const formattedDate = useMemo(() => formatDate(new Date(rawData?.gameData.datetime.dateTime ?? '')), [rawData?.gameData.datetime.dateTime])
  function toggleAutoplay() {
    dispatch({ type: 'SET_AUTOPLAY_ENABLED', autoPlayEnabled: !autoPlayEnabled })

    if (currentEventHasCompleted && !autoPlayEnabled) {
      dispatch({ type: 'INCREMENT_EVENT', increment: 1 })
    }
  }

  return (
    <div className={styles.gameControlsContainer}>
      {isMobileLayout && <MatchupBox />}
      <div className={styles.flexRow} style={{ height: 45, marginBottom: 4 }}>
        <div
          onClick={() => incrementEvent(-1)}
          className={styles.controlButtons}>{"<<"}</div>
        <div
          className={styles.controlButtons}
          style={{ color: autoPlayEnabled ? 'yellow' : 'white', flexGrow: 1 }}
          onClick={toggleAutoplay}
        >
          {autoPlayEnabled ? 'AUTOPLAY ON' : 'AUTOPLAY OFF'}
        </div>
        <div
          onClick={() => incrementEvent(1)}
          className={styles.controlButtons}>{">>"}</div>
      </div>
      <div className={styles.controlsInfoBox}>
        {rawData?.gameData.teams.home.clubName} VS {rawData?.gameData.teams.away.clubName}
        <div style={{ color: 'gray', textAlign: 'center', marginTop: 5 }}>
          <div>{rawData?.gameData.venue.name}</div>
          {formattedDate}
        </div>
      </div>
    </div>
  )
}