import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Schedule } from './data/MLBSchedule'
import styles from './css/LiveGameView.module.css'
import { BASE_URL } from './Constants'

function parseFormattedDate(dateString: string | null): Date | null {
  if (dateString == null) return null
  const [month, day, year] = dateString.split('/').map(Number)

  if (!month || !day || !year || month > 12 || day > 31) {
      return null // Invalid date
  }
  return new Date(year, month - 1, day) // Subtract 1 from month as Date months are 0-based
}

export function formatDate(date: Date) {
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const year = date.getFullYear()

  return `${month}/${day}/${year}`
}

function getWeekRange(date: Date): { start: Date, end: Date } {
  const start = new Date(date)
  const end = new Date(date)

  const dayOfWeek = date.getDay() // 0 is Sunday, 6 is Saturday

  // Set the start of the week (Sunday)
  start.setDate(date.getDate() - dayOfWeek)
  start.setHours(0, 0, 0, 0) // Set time to midnight

  // Set the end of the week (Saturday)
  end.setDate(date.getDate() + (6 - dayOfWeek))
  end.setHours(23, 59, 59, 999) // Set time to the end of the day

  return { start, end }
}

// World series final week 2024
const DefaultStartDate = new Date('10/27/2024')

function computeIsMobileLayout() {
  return window.innerWidth < 1100
}
export default function ScheduleView() {
  const [schedule, setSchedule] = useState<Schedule>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [dateRange, setDateRange] = useState<{ start: Date, end: Date }>(getWeekRange(parseFormattedDate(searchParams.get('d')) ?? DefaultStartDate))
  const [isMobileLayout, setIsMobileLayout] = useState(computeIsMobileLayout)
  useEffect(() => {
    const resizeHandler = () => {
      setIsMobileLayout(computeIsMobileLayout())
    }
    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  useEffect(() => {
    setSearchParams({ d: formatDate(dateRange.start) })
    setIsLoading(true)
    fetch(`https://statsapi.mlb.com/api/v1/schedule?sportId=1&startDate=${formatDate(dateRange.start)}&endDate=${formatDate(dateRange.end)}`)
      .then(response => response.json())
      .then((data: Schedule) => {
        setSchedule(data)
        setIsLoading(false)
      })
  }, [dateRange.end, dateRange.start, setSearchParams])

  function incrementWeek(inc: number) {
    dateRange.start.setSeconds(dateRange.start.getSeconds() + (60 * 60 * 24 * 7) * inc)
    setDateRange(getWeekRange(dateRange.start))
  }
 
  return (
    <div style={{ display: 'flex', flexDirection: isMobileLayout ? 'column-reverse' : 'row', position: 'relative', justifyContent: 'center' }}>
      <div style={{ padding: 20, paddingTop: 20, marginTop: 40, display: 'flex', flexDirection: 'column', position: isMobileLayout ? 'static' : 'sticky', top: '10px', maxWidth: isMobileLayout ? '800px': '550px', border: '2px dashed gray', width: '100%', boxSizing: 'border-box', alignSelf: isMobileLayout ? 'center' : 'flex-start' }}>
        <div style={{ flexGrow: 1, textShadow: '2px 2px gray', marginBottom: 20 }}>
          HOW IT WORKS
        </div>
        The app uses publicly available stats from the MLB API to recreate real MLB games.
        <br /><br />
        Use this page to search for games by date.  Click into any game to view the simulation.
        <br /><br />
        For more information on how the simulation works, watch the making of video on youtube:
        <br /><br />
        <iframe height="315" src="https://www.youtube.com/embed/kIWMH6PU5B8?si=jUKEwL24QPEtr59D" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        <br /><br />
        If you are interested in contributing to the project <a href="https://github.com/solomon-gumball/baseball-sim">it is open source on github here</a>
      </div>
      <div className={styles.flexCol} style={{ boxSizing: 'border-box', alignItems: 'stretch', maxWidth: 800, padding: '40px 15px', width: '100%', marginBottom: 'auto', alignSelf: 'center' }}>
        <div style={{ flexGrow: 1, alignSelf: 'center', textShadow: '2px 2px gray', marginBottom: 20 }}>
          FIND A GAME
        </div>
        <div className={styles.flexRow} style={{ textAlign: 'center', alignItems: 'center', border: '2px solid white' }}>
          <button style={{ padding: 10 }} onClick={() => incrementWeek(-1)}>-</button>
          <div style={{ flexGrow: 1 }}>{formatDate(dateRange.start)} --- {formatDate(dateRange.end)}</div>
          <button style={{ padding: 10 }} onClick={() => incrementWeek(1)}>+</button>
        </div>
        {schedule?.dates.map(date => (
          <div key={date.date} style={{ margin: '10px 0px', borderLeft: '2px solid white', padding: '0px 5px' }}>
            <div>{date.date}</div>
            {date.games.map(game => (
              <Link key={game.gamePk} to={`${BASE_URL}/game/${game.gamePk}`} style={{ display: 'block' }}>
                <div style={{ width: '100%' }}>
                  <div>{game.teams.away.team.name} VS {game.teams.home.team.name}</div>
                  <div></div>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}