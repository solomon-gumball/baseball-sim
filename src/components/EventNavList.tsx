import { useContext } from 'react'
import { GameFeedContext } from '../useCreateGameData'
import { UILayout } from '../LiveGameView'

function getInningText(inning: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = inning % 100;
  if (remainder >= 11 && remainder <= 13) {
      return `${inning}th`;
  }
  const suffixIndex = (inning + 1) % 10;
  const suffix = suffixes[suffixIndex] || suffixes[0]; // Default to "th" if none matches
  return `${inning + 1}${suffix}`;
}

export default function EventNavList({ layout }: { layout : UILayout }) {
  const [{ eventIndex, currentPlay, playIndex, currentEvent }, dispatch] = useContext(GameFeedContext)

  if (currentPlay == null || currentEvent == null) return null
  // https://img.mlbstatic.com/mlb-photos/image/upload/w_500,q_100/v1/people/656302/headshot/silo/current
  const hasNextEvent = eventIndex < currentPlay.playEvents.length - 1
  const hasPrevEvent = eventIndex > 0
  return (
    <div style={{ flexShrink: 1, flexGrow: 0, flexBasis: layout === 'LEFT' ? '35%' : '400px', height: layout === 'LEFT' ? '' : '40%', display: 'flex', flexDirection: 'column', backgroundColor: 'black', color: 'white', borderLeft: '4px solid white' }}>
      <div style={{ display: 'flex', flexDirection: 'row', padding: '10px 5px' }}>
        <button onClick={() => dispatch({ type: 'INCREMENT_PLAY', increment: -1 })}>{"<<"}</button>
        <button disabled={!hasPrevEvent} onClick={() => dispatch({ type: 'INCREMENT_EVENT', increment: -1 })}>{"<"}</button>
        <div style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
          <div style={{ marginBottom: 5 }}>{currentPlay.about.halfInning === 'top' ? 'TOP' : 'BOT'} {getInningText(currentPlay.about.inning - 1)}</div>
          <div>O:{currentPlay.count.outs} / B:{currentEvent.count.balls} / S:{currentEvent.count.strikes}</div>
        </div>
        <button disabled={!hasNextEvent} onClick={() => dispatch({ type: 'INCREMENT_EVENT', increment: 1 })}>{">"}</button>
        <button onClick={() => dispatch({ type: 'INCREMENT_PLAY', increment: 1 })}>{">>"}</button>
      </div>
      {currentPlay && (
        <div key={currentPlay.atBatIndex} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflowY: 'scroll', flexShrink: 1 }}>
          {currentPlay.playEvents.map((event, i) => (
            <div
              key={event.index}
              onClick={() => dispatch({ type: 'SET_EVENT', eventIndex: i })}
              style={{
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                background: i === eventIndex ? 'white' : 'black',
                color: i === eventIndex ? 'black' : 'white',
                padding: 10,
                margin: 5,
                border: '2px solid white'
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <div>{event.details.description}</div>
                <div style={{ color: i === eventIndex ? 'lightGray' : 'rgb(90, 90, 90)' }}>{playIndex}.{i}</div>
              </div>
              {i === currentPlay.playEvents.length - 1 && <p>{currentPlay?.result.description}</p>}
            </div>
          ))}
          {currentPlay.matchup.batter && (
            <div style={{ margin: 'auto 5px 5px 5px', display: 'flex', justifyContent: 'space-between', padding: 10, border: '2px solid white' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>At Bat: #{currentPlay.atBatIndex}</div>
                <div>{currentPlay.matchup.batter.fullName}</div>
                <div>Pitching:</div>
                <div>{currentPlay.matchup.pitcher.fullName} ({currentPlay.matchup.pitchHand.code})</div>
                <div>{currentEvent.details.type?.description}</div>
              </div>
              {/* <FilteredPhoto
                imageUrl={`https://img.mlbstatic.com/mlb-photos/image/upload/w_300,q_100/v1/people/${currentPlay.matchup.batter.id}/headshot/silo/current`}
                width={200} height={200}
                blockSize={4}
              /> */}
            </div>
          )}
          
          {/* {currentPlay.matchup.batter.id && (
            <img src={`https://img.mlbstatic.com/mlb-photos/image/upload/w_500,q_100/v1/people/${currentPlay.matchup.batter.id}/headshot/silo/current`} />
          )} */}
        </div>
      )}
    </div>
  )
}