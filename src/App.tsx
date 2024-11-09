import { Navigate, Route, Routes } from 'react-router'
import SwaggerUI from 'swagger-ui-react'
import MLBSwagger from './mlb-swagger.json'
import "swagger-ui-react/swagger-ui.css"
import LiveGameView from './LiveGameView'
import { ScoreboardDebugApp } from './components/Scoreboard'
import ScheduleView from './ScheduleView'
import cls from './css/LandingPage.module.css'
import { NavLink } from 'react-router-dom'
import './css/App.css'

function App() { 
  return (
    <Routes>
      <Route path='/api' element={<SwaggerPage />} />
      <Route path='/game/:gameId' element={<LiveGameView />} />
      <Route path='/game/:gameId/player' element={<ScoreboardDebugApp />} />
      <Route path='*' element={<LandingPage />} />
    </Routes>
  );
}

function css(...classes: (string | null | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}

function LandingPage() {
  return (
    <div className={cls.landingPageContainer}>
      {/* <div className={cls.floatingHeader}>
        <NavLink to="/games" className={({ isActive }) => css(cls.tabButton, isActive && cls.tabButton_active)}>GAMES</NavLink>
        <NavLink to="/about" className={({ isActive }) => css(cls.tabButton, isActive && cls.tabButton_active)}>ABOUT</NavLink>
        <NavLink to="/how" className={({ isActive }) => css(cls.tabButton, isActive && cls.tabButton_active)}>HOW</NavLink>
      </div> */}
      <Routes>
        <Route path='/games' element={<ScheduleView />} />
        <Route path='/about' element={<div>hi</div>} />
        <Route path='/how' element={<div>hi</div>} />
        <Route path='*' element={<Navigate to="/games" replace />} />
      </Routes>
    </div>
  )
}

function SwaggerPage() {
  return (
    <SwaggerUI spec={MLBSwagger} />
  )
}

export default App;
