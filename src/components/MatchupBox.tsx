import { useContext } from 'react'
import { GameFeedContext } from '../useCreateGameData'
import cls from './ScoreCard.module.css'

export default function MatchupBox() {
  const [{ currentPlay, currentEvent, isMobileLayout }] = useContext(GameFeedContext)

  if (!currentPlay) return null

  return (
    <div className={cls.matchupContainer}>
      <div style={{ padding: '12px 10px', backgroundColor: 'rgba(0, 0, 0, 0.7)', borderBottom: '2px solid rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'space-between' }}>
          <div>{currentPlay.matchup.pitcher.fullName.toUpperCase()}</div>
          <div style={{ color: 'yellow' }}>{currentEvent?.pitchData?.startSpeed} MPH</div>
      </div>
      <div style={{ padding: '12px 10px', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
        {currentPlay.matchup.batter.fullName.toUpperCase()}
      </div>
    </div>
  )
}