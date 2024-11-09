import { useContext, useEffect, useReducer, useRef } from 'react'
import { GameFeedContext } from '../useCreateGameData'
import cls from './ScoreCard.module.css'
import { degToRad } from 'three/src/math/MathUtils'
import MatchupBox from './MatchupBox'

export default function ScoreCard({ }: { }) {
  const [{ rawData, currentPlay, currentEvent, prevEvent, prevPlay, scoreboardData, isMobileLayout }] = useContext(GameFeedContext)
  const basesCanvas = useRef<HTMLCanvasElement>(null)
  const CW = 35
  const CH = 30

  useEffect(() => {
    const canvas = basesCanvas.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    ctx.resetTransform()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.imageSmoothingEnabled = false
    const squareSize = CW * 0.28
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 1

    function drawBaseDiamond(x: number, y: number, fill: boolean) {
      if (!ctx) return
      ctx.resetTransform()
      ctx.translate(x, y)
      ctx.rotate(degToRad(45))
      !fill
        ? ctx.strokeRect(-squareSize * .5, -squareSize * .5, squareSize, squareSize)
        : ctx.fillRect(-squareSize * .5, -squareSize * .5, squareSize, squareSize)
    }

    drawBaseDiamond(CW * 0.25, CH * 0.63, !!scoreboardData?.bases['3B'])
    drawBaseDiamond(CW * 0.5,  CH * 0.32, !!scoreboardData?.bases['2B'])
    drawBaseDiamond(CW * 0.75, CH * 0.63, !!scoreboardData?.bases['1B'])

    ctx.stroke()
  }, [scoreboardData])

  if (currentPlay == null) return null

  // const containerStyles = isMobileLayout
  return (
    <div className={cls.container} style={{ display: 'flex', flexDirection: 'column' }}>
      {!isMobileLayout && <MatchupBox />}
      <div className={cls.scorecard}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ flexGrow: 1, width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'blue' }}>
              <div className={cls.teamScoreRow} style={{ paddingBottom: 0 }}>
                {rawData?.gameData.teams.away.abbreviation}
                <div style={{ marginLeft: 'auto' }}>{scoreboardData?.currentAwayScore ?? 0}</div>
              </div>
              <div className={cls.teamScoreRow}>
                {rawData?.gameData.teams.home.abbreviation}
                <div style={{ marginLeft: 'auto' }}>{scoreboardData?.currentHomeScore ?? 0}</div>
              </div>
            </div>
          </div>
          <div style={{ width: 120, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
            <canvas ref={basesCanvas} width={CW} height={CH} style={{ margin: 'auto', height: '100%', imageRendering: 'pixelated' }} />
          </div>
        </div>
        <div style={{ display: 'flex', padding: 10, justifyContent: 'space-between' }}>
          <div >{currentPlay?.about.isTopInning ? '↑' : '↓'}{currentPlay?.about.inning}</div>
          <div><b>{scoreboardData?.currentOuts ?? 0}-</b>OUT</div>
          <div>{scoreboardData?.currentBalls}-{scoreboardData?.currentStrikes}</div>
        </div>
      </div>
    </div>
  )
}