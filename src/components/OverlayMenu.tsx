import { useNavigate } from 'react-router'
import cls from '../css/OverlayMenu.module.css'
import { useContext } from 'react'
import { GameFeedContext } from '../useCreateGameData'
import { formatDate } from '../ScheduleView'

export default function OverlayMenu({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const [{ rawData, eventIndex, gamePk, playIndex, muteEnabled, playSpeed }, dispatch] = useContext(GameFeedContext)

  function copyLinkToClipboard() {
    navigator.clipboard.writeText(`${window.location.origin}/game/${gamePk}?p=${playIndex}.${eventIndex}`)
  }

  function goBackToSchedule() {
    navigate(`/games?d=${formatDate(new Date(rawData?.gameData.datetime.dateTime ?? ''))}`)
  }

  return (
    <div className={cls.background} onClick={onClose}>
      <div className={cls.modal} onClick={e => e.stopPropagation()}>
        <center style={{ marginBottom: 10, color: 'gray' }}>MENU</center>
        <div className={cls.menuOption} onClick={() => dispatch({ type: 'TOGGLE_MUTE' })}>{muteEnabled ? 'X' : '+'} SOUND IS {muteEnabled ? 'OFF' : 'ON'}</div>
        <div className={cls.menuOption} onClick={copyLinkToClipboard}>🔗 COPY LINK TO PLAY</div>
        <div className={cls.divider} />
        <div className={cls.playSpeedOption}>
          <div className={cls.incrementButton} onClick={() => dispatch({ type: 'SET_PLAY_SPEED', playSpeed: Math.round((playSpeed - .1) * 10) / 10 })}>-</div>
          PLAY SPEED {playSpeed}
          <div className={cls.incrementButton} onClick={() => dispatch({ type: 'SET_PLAY_SPEED', playSpeed: Math.round((playSpeed + .1) * 10) / 10 })}>+</div>
        </div>
        <div className={cls.divider} />
        <div className={cls.menuOption} onClick={goBackToSchedule}>← BACK TO SCHEDULE</div>
        <div className={cls.menuOption} onClick={() => navigate('/how')}>← HOW IT WORKS</div>
        <div className={cls.menuOption} onClick={onClose}>X CLOSE MENU</div>
      </div>
    </div>
  )
}