import { Route, Routes } from 'react-router'
import SwaggerUI from 'swagger-ui-react'
import MLBSwagger from './mlb-swagger.json'
import "swagger-ui-react/swagger-ui.css"
import LiveGameView from './LiveGameView'
import { ScoreboardDebugApp } from './components/Scoreboard'
import ScheduleView from './ScheduleView'
import cls from './css/LandingPage.module.css'
import './css/App.css'
import { BASE_PATH } from './Constants'

function App() { 
  return (
    <Routes>
      <Route path={`${BASE_PATH}/api`} element={<SwaggerPage />} />
      <Route path={`${BASE_PATH}/game/:gameId`} element={<LiveGameView />} />
      <Route path={`${BASE_PATH}/game/:gameId/player`} element={<ScoreboardDebugApp />} />
      <Route path='*' element={<LandingPage />} />
    </Routes>
  )
}

function LandingPage() {
  return (
    <div className={cls.landingPageContainer}>
      <ScheduleView />
    </div>
  )
}

function SwaggerPage() {
  return (
    <SwaggerUI spec={MLBSwagger} />
  )
}

export default App;
