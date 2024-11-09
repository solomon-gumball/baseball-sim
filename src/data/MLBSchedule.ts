export interface Schedule {
  copyright:            string;
  totalItems:           number;
  totalEvents:          number;
  totalGames:           number;
  totalGamesInProgress: number;
  dates:                ScheduleDateElement[];
}

export interface ScheduleDateElement {
  date:                 string;
  totalItems:           number;
  totalEvents:          number;
  totalGames:           number;
  totalGamesInProgress: number;
  games:                Game[];
  events:               any[];
}

export interface Game {
  gamePk:                 number;
  gameGuid:               string;
  link:                   string;
  gameType:               string;
  season:                 string;
  gameDate:               Date;
  officialDate:           Date;
  status:                 {
    abstractGameState: string;
    codedGameState:    string;
    detailedState:     string;
    statusCode:        string;
    startTimeTBD:      boolean;
    abstractGameCode:  string;
  };
  teams:                  {
    away: TeamScheduleRecord;
    home: TeamScheduleRecord;
  };
  venue:                  {
    id:   number;
    name: string;
    link: string;
  };
  content:                Content;
  isTie?:                 boolean;
  gameNumber:             number;
  publicFacing:           boolean;
  doubleHeader:           string;
  gamedayType:            string;
  tiebreaker:             string;
  calendarEventID:        string;
  seasonDisplay:          string;
  dayNight:               string;
  description:            string;
  scheduledInnings:       number;
  reverseHomeAwayStatus:  boolean;
  inningBreakLength:      number;
  gamesInSeries:          number;
  seriesGameNumber:       number;
  seriesDescription:      string;
  recordSource:           string;
  ifNecessary:            string;
  ifNecessaryDescription: string;
}

export interface Content {
  link: string;
}

export interface TeamScheduleRecord {
  leagueRecord: {
    wins:   number;
    losses: number;
    pct:    string;
  };
  score:        number;
  team:         {
    id:   number;
    name: string;
    link: string;
  };
  isWinner?:    boolean;
  splitSquad:   boolean;
  seriesNumber: number;
}