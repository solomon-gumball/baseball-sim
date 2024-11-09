export interface GameStats {
  game_status_code:    GameStatusEnum;
  game_status:         GameStatusEnum;
  gamedayType:         string;
  gameDate:            string;
  scoreboard:          Scoreboard;
  venue_id:            number;
  home_team_data:      AwayTeamData;
  away_team_data:      AwayTeamData;
  team_home_id:        number;
  team_away_id:        number;
  team_home:           TeamAwayElement[];
  home_pitchers:       { [key: string]: HomePitcher[] };
  away_batters:        { [key: string]: AwayBatter[] };
  team_away:           TeamAwayElement[];
  home_batters:        { [key: string]: HomeBatter[] };
  away_pitchers:       { [key: string]: AwayPitcher[] };
  exit_velocity:       ExitVelocity[];
  game_date:           Date;
  players:             any[];
  away_lineup:         number[];
  home_lineup:         number[];
  away_pitcher_lineup: number[];
  home_pitcher_lineup: number[];
  boxscore:            Boxscore;
  cacheKey:            string;
  cache_hit:           string;
}

export interface AwayBatter {
  play_id:                          string;
  inning:                           number;
  ab_number:                        number;
  cap_index:                        number;
  outs:                             number;
  batter:                           number;
  stand:                            PThrows;
  batter_name:                      BatterNameEnum;
  pitcher:                          number;
  p_throws:                         PThrows;
  pitcher_name:                     PitcherNameEnum;
  team_batting:                     Abbreviation;
  team_fielding:                    Abbreviation;
  team_batting_id:                  number;
  team_fielding_id:                 number;
  result:                           Events;
  des:                              string;
  events:                           Events;
  contextMetrics:                   ContextMetrics;
  strikes:                          number;
  balls:                            number;
  pre_strikes:                      number;
  pre_balls:                        number;
  call:                             GameStatusEnum;
  call_name:                        CallName;
  pitch_type:                       PitchType;
  pitch_name:                       PitchNameEnum;
  description:                      AwayBatterDescription;
  result_code:                      GameStatusEnum;
  pitch_call:                       PitchCall;
  is_strike_swinging:               boolean;
  balls_and_strikes:                string;
  start_speed:                      number;
  end_speed:                        number;
  sz_top:                           number;
  sz_bot:                           number;
  extension:                        number;
  plateTime:                        number;
  zone:                             number;
  spin_rate?:                       number;
  px:                               number;
  pz:                               number;
  x0:                               number;
  y0:                               number;
  z0:                               number;
  ax:                               number;
  ay:                               number;
  az:                               number;
  vx0:                              number;
  vy0:                              number;
  vz0:                              number;
  pfxX:                             number;
  pfxZ:                             number;
  pfxZWithGravity:                  number;
  pfxZWithGravityNice:              number;
  pfxZDirection:                    ZDirection;
  pfxXWithGravity:                  number;
  pfxXNoAbs:                        string;
  pfxXDirection:                    PfxXDirection;
  breakX:                           number;
  breakZ:                           number;
  inducedBreakZ:                    number;
  inducedBreakZDec:                 string;
  inducedBreakZForcedSign:          string;
  ivbZDirection:                    ZDirection;
  isSword:                          boolean;
  is_bip_out:                       AllStarStatus;
  pitch_number:                     number;
  player_total_pitches:             number;
  player_total_pitches_pitch_types: number;
  game_total_pitches:               number;
  rowId:                            string;
  game_pk:                          string;
  pitch_types?:                     AwayBatterPitchTypes;
  results?:                         Results;
  avg_pitch_speed?:                 AvgPitchSpeed[];
  batSpeed?:                        number;
  hit_speed_round?:                 string;
  hit_speed?:                       string;
  hit_distance?:                    string;
  xba?:                             string;
  hit_angle?:                       string;
  is_barrel?:                       number;
  hc_x?:                            number;
  hc_x_ft?:                         number;
  hc_y?:                            number;
  hc_y_ft?:                         number;
  player_name?:                     Abbreviation;
  runnerOn1B?:                      boolean;
  runnerOn2B?:                      boolean;
  runnerOn3B?:                      boolean;
}

export interface AvgPitchSpeed {
  oSwingMiss:          number;
  oFouls:              number;
  oInPlay:             number;
  oSwings:             number;
  zSwingMiss:          number;
  zFouls:              number;
  zInPlay:             number;
  zSwings:             number;
  o_swing:             number | null;
  z_swing:             number | null;
  o_contact:           number | null;
  z_contact:           number | null;
  zone_rate:           number;
  swings:              number;
  miss_percent:        string;
  cs_plus_whiffs:      number;
  csw_percent:         string;
  avg_rel_x:           string;
  avg_rel_z:           string;
  avg_rpm:             string;
  max_rpm:             string;
  min_rpm:             string;
  avg_break_z:         string;
  max_break_z:         string;
  min_break_z:         string;
  avg_break_z_induced: string;
  max_break_z_induced: string;
  min_break_z_induced: string;
  avg_break_x:         string;
  max_break_x:         string;
  min_break_x:         string;
  min_pitch_speed:     string;
  avg_pitch_speed:     string;
  max_pitch_speed:     string;
  avg_hit_speed:       string;
  max_hit_speed:       string;
  min_hit_speed:       string;
  count:               number;
  pitches_vs_right:    number;
  pitches_vs_left:     number;
  results:             Results;
  swinging_strikes:    number;
  fouls:               number;
  called_strikes:      number;
  balls_in_play:       number;
  percent:             string;
  rhb_pitch_percent?:  string;
  lhb_pitch_percent?:  string;
  pitch_type:          PitchNameEnum;
  pitch_type_literal?: PitchType;
}

export enum PitchNameEnum {
  All = "ALL",
  Changeup = "Changeup",
  Cutter = "Cutter",
  KnuckleCurve = "Knuckle Curve",
  Sinker = "Sinker",
  Slider = "Slider",
  Splitter = "Splitter",
  Sweeper = "Sweeper",
  The4SeamFastball = "4-Seam Fastball",
}

export enum PitchType {
  Ch = "CH",
  FS = "FS",
  Fc = "FC",
  Ff = "FF",
  Kc = "KC",
  Si = "SI",
  Sl = "SL",
  St = "ST",
}

export interface Results {
  X?: number;
  S?: number;
  B?: number;
}

export enum BatterNameEnum {
  AndyPages = "Andy Pages",
  DavidPeralta = "David Peralta",
  FernandoTatisJr = "Fernando Tatis Jr.",
  FreddieFreeman = "Freddie Freeman",
  GavinLux = "Gavin Lux",
  JacksonMerrill = "Jackson Merrill",
  JakeCronenworth = "Jake Cronenworth",
  JuricksonProfar = "Jurickson Profar",
  KyleHigashioka = "Kyle Higashioka",
  LuisArraez = "Luis Arraez",
  MannyMachado = "Manny Machado",
  MaxMuncy = "Max Muncy",
  MiguelRojas = "Miguel Rojas",
  MookieBetts = "Mookie Betts",
  RobertSuarez = "Robert Suarez",
  ShoheiOhtani = "Shohei Ohtani",
  TeoscarHernández = "Teoscar Hernández",
  TommyEdman = "Tommy Edman",
  WillSmith = "Will Smith",
  XanderBogaerts = "Xander Bogaerts",
}

export enum GameStatusEnum {
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  GameStatusB = "*B",
  S = "S",
  T = "T",
  X = "X",
}

export enum CallName {
  Ball = "Ball",
  InPlay = "In Play",
  Strike = "Strike",
}

export interface ContextMetrics {
  homeRunBallparks?: number;
}

export enum AwayBatterDescription {
  Ball = "Ball",
  BallInDirt = "Ball In Dirt",
  CalledStrike = "Called Strike",
  Foul = "Foul",
  FoulTip = "Foul Tip",
  InPlayNoOut = "In play, no out",
  InPlayOutS = "In play, out(s)",
  InPlayRunS = "In play, run(s)",
  SwingingStrike = "Swinging Strike",
}

export enum Events {
  Double = "Double",
  FieldersChoice = "Fielders Choice",
  Flyout = "Flyout",
  Forceout = "Forceout",
  Gidp = "GIDP",
  Groundout = "Groundout",
  HomeRun = "Home Run",
  IntentWalk = "Intent Walk",
  Lineout = "Lineout",
  PopOut = "Pop Out",
  SacFly = "Sac Fly",
  Single = "Single",
  Strikeout = "Strikeout",
  Walk = "Walk",
}

export enum AllStarStatus {
  N = "N",
  Y = "Y",
}

export enum ZDirection {
  Empty = "↑",
  Purple = "",
  ZDirection = "↓",
}

export enum PThrows {
  A = "A",
  B = "B",
  Ch = "CH",
  F = "F",
  Ff = "FF",
  L = "L",
  R = "R",
  S = "S",
  T = "T",
}

export enum PfxXDirection {
  Empty = "→",
  PfxXDirection = "←",
  Purple = "",
}

export enum PitchCall {
  Ball = "ball",
  BlockedBall = "blocked_ball",
  CalledStrike = "called_strike",
  Foul = "foul",
  FoulTip = "foul_tip",
  HitIntoPlay = "hit_into_play",
  SwingingStrike = "swinging_strike",
}

export interface AwayBatterPitchTypes {
  SI?: number;
  FF:  number;
  SL?: number;
  ST?: number;
  FC?: number;
  CH?: number;
  FS?: number;
}

export enum PitcherNameEnum {
  AnthonyBanda = "Anthony Banda",
  DanielHudson = "Daniel Hudson",
  JasonAdam = "Jason Adam",
  JeremiahEstrada = "Jeremiah Estrada",
  MichaelKing = "Michael King",
  MichaelKopech = "Michael Kopech",
  RobertSuarez = "Robert Suarez",
  TannerScott = "Tanner Scott",
  WalkerBuehler = "Walker Buehler",
}

export enum Abbreviation {
  Lad = "LAD",
  SD = "SD",
}

export interface AwayPitcher {
  play_id:                          string;
  inning:                           number;
  ab_number:                        number;
  cap_index:                        number;
  outs:                             number;
  batter:                           number;
  stand:                            PThrows;
  batter_name:                      BatterNameEnum;
  pitcher:                          number;
  p_throws:                         PThrows;
  pitcher_name:                     PitcherNameEnum;
  team_batting:                     Abbreviation;
  team_fielding:                    Abbreviation;
  team_batting_id:                  number;
  team_fielding_id:                 number;
  result:                           Events;
  des:                              string;
  events:                           Events;
  contextMetrics:                   ContextMetrics;
  strikes:                          number;
  balls:                            number;
  pre_strikes:                      number;
  pre_balls:                        number;
  call:                             GameStatusEnum;
  call_name:                        CallName;
  pitch_type:                       PitchType;
  pitch_name:                       PitchNameEnum;
  description:                      AwayBatterDescription;
  result_code:                      GameStatusEnum;
  pitch_call:                       PitchCall;
  is_strike_swinging:               boolean;
  balls_and_strikes:                string;
  start_speed:                      number;
  end_speed:                        number;
  sz_top:                           number;
  sz_bot:                           number;
  extension:                        number;
  plateTime:                        number;
  zone:                             number;
  spin_rate?:                       number;
  px:                               number;
  pz:                               number;
  x0:                               number;
  y0:                               number;
  z0:                               number;
  ax:                               number;
  ay:                               number;
  az:                               number;
  vx0:                              number;
  vy0:                              number;
  vz0:                              number;
  pfxX:                             number;
  pfxZ:                             number;
  pfxZWithGravity:                  number;
  pfxZWithGravityNice:              number;
  pfxZDirection:                    ZDirection;
  pfxXWithGravity:                  number;
  pfxXNoAbs:                        string;
  pfxXDirection:                    PfxXDirection;
  breakX:                           number;
  breakZ:                           number;
  inducedBreakZ:                    number;
  inducedBreakZDec:                 string;
  inducedBreakZForcedSign:          string;
  ivbZDirection:                    ZDirection;
  isSword:                          boolean;
  is_bip_out:                       AllStarStatus;
  pitch_number:                     number;
  player_total_pitches:             number;
  player_total_pitches_pitch_types: number;
  game_total_pitches:               number;
  rowId:                            string;
  game_pk:                          string;
  pitch_types?:                     AwayPitcherPitchTypes;
  results?:                         Results;
  avg_pitch_speed?:                 AvgPitchSpeed[];
  batSpeed?:                        number;
  hit_speed_round?:                 string;
  hit_speed?:                       string;
  hit_distance?:                    string;
  xba?:                             string;
  hit_angle?:                       string;
  is_barrel?:                       number;
  hc_x?:                            number;
  hc_x_ft?:                         number;
  hc_y?:                            number;
  hc_y_ft?:                         number;
  runnerOn1B?:                      boolean;
  runnerOn2B?:                      boolean;
  runnerOn3B?:                      boolean;
}

export interface AwayPitcherPitchTypes {
  FF:  number;
  SL?: number;
  SI?: number;
  ST?: number;
  FC?: number;
  CH?: number;
  KC?: number;
}

export interface AwayTeamData {
  springLeague:    Division;
  allStarStatus:   AllStarStatus;
  id:              number;
  name:            string;
  link:            string;
  season:          number;
  venue:           Division;
  springVenue:     SpringVenue;
  teamCode:        string;
  fileCode:        string;
  abbreviation:    Abbreviation;
  teamName:        string;
  locationName:    string;
  firstYearOfPlay: string;
  league:          Division;
  division:        Division;
  sport:           Division;
  shortName:       string;
  record:          Record;
  franchiseName:   string;
  clubName:        string;
  active:          boolean;
}

export interface Division {
  id:            number;
  name:          string;
  link:          string;
  abbreviation?: string;
}

export interface Record {
  gamesPlayed:           number;
  wildCardGamesBack:     string;
  leagueGamesBack:       string;
  springLeagueGamesBack: string;
  sportGamesBack:        string;
  divisionGamesBack:     string;
  conferenceGamesBack:   string;
  leagueRecord:          LeagueRecord;
  records:               Records;
  divisionLeader:        boolean;
  wins:                  number;
  losses:                number;
  winningPercentage:     string;
}

export interface LeagueRecord {
  wins:   number;
  losses: number;
  ties:   number;
  pct:    string;
}

export interface Records {
}

export interface SpringVenue {
  id:   number;
  link: string;
}

export interface Boxscore {
  teams:         BoxscoreTeams;
  officials:     BoxscoreOfficial[];
  info:          NoteElement[];
  pitchingNotes: any[];
  topPerformers: TopPerformer[];
}

export interface NoteElement {
  label:  string;
  value?: string;
}

export interface BoxscoreOfficial {
  official:     OfficialClass;
  officialType: OfficialType;
}

export interface OfficialClass {
  id:       number;
  fullName: string;
  link:     string;
}

export enum OfficialType {
  FirstBase = "First Base",
  HomePlate = "Home Plate",
  LeftField = "Left Field",
  RightField = "Right Field",
  SecondBase = "Second Base",
  ThirdBase = "Third Base",
}

export interface BoxscoreTeams {
  away: PurpleAway;
  home: Home;
}

export interface PurpleAway {
  team:         Team;
  teamStats:    Stats;
  players:      AwayPlayers;
  batters:      number[];
  pitchers:     number[];
  bench:        number[];
  bullpen:      number[];
  battingOrder: number[];
  info:         HomeInfo[];
  note:         NoteElement[];
}

export interface HomeInfo {
  title:     string;
  fieldList: NoteElement[];
}

export interface AwayPlayers {
  ID676508: Id518489;
  ID669257: Player;
  ID621035: Player;
  ID543339: Id543339;
  ID681911: Id518489;
  ID621111: Id543339;
  ID605131: Id518489;
  ID571771: Id518489;
  ID571970: Player;
  ID607455: Id543339;
  ID518692: Player;
  ID683618: Id518489;
  ID656427: Id518489;
  ID669242: Player;
  ID660271: Player;
  ID656629: Id543339;
  ID606192: Player;
  ID689017: Id518489;
  ID681624: Player;
  ID666158: Player;
  ID623465: Id518489;
  ID605141: Player;
  ID518489: Id518489;
  ID500743: Player;
  ID595014: Id518489;
  ID808967: Id518489;
}

export interface Player {
  person:       OfficialClass;
  jerseyNumber: string;
  position:     Position;
  status:       BatSide;
  parentTeamId: number;
  battingOrder: string;
  stats:        PlayerStats;
  seasonStats:  Stats;
  gameStatus:   GameStatus;
  allPositions: Position[];
}

export interface Position {
  code:         string;
  name:         PositionName;
  type:         Type;
  abbreviation: string;
}

export enum PositionName {
  Catcher = "Catcher",
  DesignatedHitter = "Designated Hitter",
  FirstBase = "First Base",
  Outfielder = "Outfielder",
  PinchRunner = "Pinch Runner",
  Pitcher = "Pitcher",
  SecondBase = "Second Base",
  Shortstop = "Shortstop",
  ThirdBase = "Third Base",
}

export enum Type {
  Catcher = "Catcher",
  Hitter = "Hitter",
  Infielder = "Infielder",
  Outfielder = "Outfielder",
  Pitcher = "Pitcher",
  Runner = "Runner",
}

export interface GameStatus {
  isCurrentBatter:  boolean;
  isCurrentPitcher: boolean;
  isOnBench:        boolean;
  isSubstitute:     boolean;
}

export interface Stats {
  batting:  Batting;
  pitching: Pitching;
  fielding: FieldingClass;
}

export interface Batting {
  gamesPlayed?:         number;
  flyOuts:              number;
  groundOuts:           number;
  airOuts:              number;
  runs:                 number;
  doubles:              number;
  triples:              number;
  homeRuns:             number;
  strikeOuts:           number;
  baseOnBalls:          number;
  intentionalWalks:     number;
  hits:                 number;
  hitByPitch:           number;
  avg?:                 string;
  atBats:               number;
  obp?:                 string;
  slg?:                 string;
  ops?:                 string;
  caughtStealing:       number;
  stolenBases:          number;
  stolenBasePercentage: Percentage;
  groundIntoDoublePlay: number;
  groundIntoTriplePlay: number;
  plateAppearances:     number;
  totalBases:           number;
  rbi:                  number;
  leftOnBase:           number;
  sacBunts:             number;
  sacFlies:             number;
  babip?:               string;
  groundOutsToAirouts?: string;
  catchersInterference: number;
  pickoffs:             number;
  atBatsPerHomeRun:     string;
  popOuts:              number;
  lineOuts:             number;
  summary?:             string;
  note?:                string;
}

export enum Percentage {
  Empty = ".---",
  The000 = ".000",
  The1000 = "1.000",
}

export interface FieldingClass {
  gamesStarted?:        number;
  caughtStealing:       number;
  stolenBases:          number;
  stolenBasePercentage: Percentage;
  assists:              number;
  putOuts:              number;
  errors:               number;
  chances:              number;
  fielding?:            FieldingEnum;
  passedBall:           number;
  pickoffs:             number;
}

export enum FieldingEnum {
  The000 = ".000",
  The1000 = "1.000",
  The917 = ".917",
  The947 = ".947",
}

export interface Pitching {
  gamesPlayed?:           number;
  gamesStarted?:          number;
  flyOuts:                number;
  groundOuts:             number;
  airOuts:                number;
  runs:                   number;
  doubles:                number;
  triples:                number;
  homeRuns:               number;
  strikeOuts:             number;
  baseOnBalls:            number;
  intentionalWalks:       number;
  hits:                   number;
  hitByPitch:             number;
  atBats:                 number;
  obp?:                   string;
  caughtStealing:         number;
  stolenBases:            number;
  stolenBasePercentage:   Percentage;
  numberOfPitches:        number;
  era?:                   string;
  inningsPitched:         string;
  wins?:                  number;
  losses?:                number;
  saves?:                 number;
  saveOpportunities:      number;
  holds?:                 number;
  blownSaves?:            number;
  earnedRuns:             number;
  whip?:                  string;
  battersFaced:           number;
  outs:                   number;
  gamesPitched?:          number;
  completeGames:          number;
  shutouts:               number;
  balls:                  number;
  strikes:                number;
  strikePercentage:       string;
  hitBatsmen:             number;
  balks:                  number;
  wildPitches:            number;
  pickoffs:               number;
  groundOutsToAirouts?:   string;
  rbi:                    number;
  winPercentage?:         Percentage;
  pitchesPerInning?:      string;
  gamesFinished?:         number;
  strikeoutWalkRatio?:    string;
  strikeoutsPer9Inn?:     string;
  walksPer9Inn?:          string;
  hitsPer9Inn?:           string;
  runsScoredPer9:         string;
  homeRunsPer9:           string;
  inheritedRunners:       number;
  inheritedRunnersScored: number;
  catchersInterference:   number;
  sacBunts:               number;
  sacFlies:               number;
  passedBall:             number;
  popOuts:                number;
  lineOuts:               number;
  pitchesThrown?:         number;
  summary?:               string;
  note?:                  string;
}

export interface PlayerStats {
  batting:  Batting;
  pitching: Records;
  fielding: FieldingClass;
}

export interface BatSide {
  code:        PThrows;
  description: BatSideDescription;
}

export enum BatSideDescription {
  Active = "Active",
  Ball = "Ball",
  Changeup = "Changeup",
  Foul = "Foul",
  FoulTip = "Foul Tip",
  FourSeamFastball = "Four-Seam Fastball",
  Left = "Left",
  Right = "Right",
  SwingingStrike = "Swinging Strike",
}

export interface Id518489 {
  person:       OfficialClass;
  jerseyNumber: string;
  position:     Position;
  status:       BatSide;
  parentTeamId: number;
  stats:        ID518489Stats;
  seasonStats:  Stats;
  gameStatus:   GameStatus;
}

export interface ID518489Stats {
  batting:  Records;
  pitching: Records;
  fielding: Records;
}

export interface Id543339 {
  person:       OfficialClass;
  jerseyNumber: string;
  position:     Position;
  status:       BatSide;
  parentTeamId: number;
  stats:        ID543339Stats;
  seasonStats:  Stats;
  gameStatus:   GameStatus;
  allPositions: Position[];
}

export interface ID543339Stats {
  batting:  Records;
  pitching: Pitching;
  fielding: FieldingClass;
}

export interface Team {
  springLeague:  Division;
  allStarStatus: AllStarStatus;
  id:            number;
  name:          string;
  link:          string;
}

export interface Home {
  team:         Team;
  teamStats:    Stats;
  players:      HomePlayers;
  batters:      number[];
  pitchers:     number[];
  bench:        number[];
  bullpen:      number[];
  battingOrder: number[];
  info:         HomeInfo[];
  note:         any[];
}

export interface HomePlayers {
  ID673513: Id518489;
  ID650633: Id543339;
  ID663158: Id543339;
  ID593974: Id518489;
  ID595777: Player;
  ID456781: Id518489;
  ID701538: Player;
  ID663773: Id518489;
  ID592094: Id543339;
  ID663604: Id518489;
  ID506433: Id518489;
  ID656945: Id543339;
  ID669093: Id543339;
  ID444482: Player;
  ID656302: Id518489;
  ID670970: Id518489;
  ID543309: Player;
  ID592518: Player;
  ID689690: Id518489;
  ID642180: Id518489;
  ID665487: Player;
  ID593428: Player;
  ID553869: Id518489;
  ID630105: Player;
  ID650333: Player;
  ID527048: Id518489;
}

export interface TopPerformer {
  player:           Player;
  type:             string;
  gameScore:        number;
  hittingGameScore: number;
}

export interface ExitVelocity {
  play_id:                          string;
  inning:                           number;
  ab_number:                        number;
  cap_index:                        number;
  outs:                             number;
  batter:                           number;
  stand:                            PThrows;
  batter_name:                      BatterNameEnum;
  pitcher:                          number;
  p_throws:                         PThrows;
  pitcher_name:                     PitcherNameEnum;
  team_batting:                     Abbreviation;
  team_fielding:                    Abbreviation;
  team_batting_id:                  number;
  team_fielding_id:                 number;
  result:                           Events;
  des:                              string;
  events:                           Events;
  contextMetrics:                   ContextMetrics;
  strikes:                          number;
  balls:                            number;
  pre_strikes:                      number;
  pre_balls:                        number;
  call:                             GameStatusEnum;
  call_name:                        CallName;
  pitch_type:                       PitchType;
  pitch_name:                       PitchNameEnum;
  description:                      AwayBatterDescription;
  result_code:                      GameStatusEnum;
  pitch_call:                       PitchCall;
  is_strike_swinging:               boolean;
  balls_and_strikes:                string;
  start_speed:                      number;
  end_speed:                        number;
  sz_top:                           number;
  sz_bot:                           number;
  extension:                        number;
  plateTime:                        number;
  zone:                             number;
  spin_rate?:                       number;
  px:                               number;
  pz:                               number;
  x0:                               number;
  y0:                               number;
  z0:                               number;
  ax:                               number;
  ay:                               number;
  az:                               number;
  vx0:                              number;
  vy0:                              number;
  vz0:                              number;
  pfxX:                             number;
  pfxZ:                             number;
  pfxZWithGravity:                  number;
  pfxZWithGravityNice:              number;
  pfxZDirection:                    ZDirection;
  pfxXWithGravity:                  number;
  pfxXNoAbs:                        string;
  pfxXDirection:                    PfxXDirection;
  breakX:                           number;
  breakZ:                           number;
  inducedBreakZ:                    number;
  inducedBreakZDec:                 string;
  inducedBreakZForcedSign:          string;
  ivbZDirection:                    ZDirection;
  isSword:                          boolean;
  batSpeed?:                        number;
  hit_speed_round:                  string;
  hit_speed:                        string;
  hit_distance:                     string;
  xba:                              string;
  hit_angle:                        string;
  is_barrel:                        number;
  hc_x:                             number;
  hc_x_ft:                          number;
  hc_y:                             number;
  hc_y_ft:                          number;
  is_bip_out:                       AllStarStatus;
  pitch_number:                     number;
  player_total_pitches:             number;
  player_total_pitches_pitch_types: number;
  game_total_pitches:               number;
  rowId:                            string;
  game_pk:                          string;
  result_table:                     string;
  runnerOn1B?:                      boolean;
  runnerOn2B?:                      boolean;
  runnerOn3B?:                      boolean;
}

export interface HomeBatter {
  play_id:                          string;
  inning:                           number;
  ab_number:                        number;
  cap_index:                        number;
  outs:                             number;
  batter:                           number;
  stand:                            PThrows;
  batter_name:                      BatterNameEnum;
  pitcher:                          number;
  p_throws:                         PThrows;
  pitcher_name:                     PitcherNameEnum;
  team_batting:                     Abbreviation;
  team_fielding:                    Abbreviation;
  team_batting_id:                  number;
  team_fielding_id:                 number;
  runnerOn1B?:                      boolean;
  runnerOn2B?:                      boolean;
  runnerOn3B?:                      boolean;
  result:                           Events;
  des:                              string;
  events:                           Events;
  contextMetrics:                   ContextMetrics;
  strikes:                          number;
  balls:                            number;
  pre_strikes:                      number;
  pre_balls:                        number;
  call:                             GameStatusEnum;
  call_name:                        CallName;
  pitch_type:                       PitchType;
  pitch_name:                       PitchNameEnum;
  description:                      AwayBatterDescription;
  result_code:                      GameStatusEnum;
  pitch_call:                       PitchCall;
  is_strike_swinging:               boolean;
  balls_and_strikes:                string;
  start_speed:                      number;
  end_speed:                        number;
  sz_top:                           number;
  sz_bot:                           number;
  extension:                        number;
  plateTime:                        number;
  zone:                             number;
  spin_rate?:                       number;
  px:                               number;
  pz:                               number;
  x0:                               number;
  y0:                               number;
  z0:                               number;
  ax:                               number;
  ay:                               number;
  az:                               number;
  vx0:                              number;
  vy0:                              number;
  vz0:                              number;
  pfxX:                             number;
  pfxZ:                             number;
  pfxZWithGravity:                  number;
  pfxZWithGravityNice:              number;
  pfxZDirection:                    ZDirection;
  pfxXWithGravity:                  number;
  pfxXNoAbs:                        string;
  pfxXDirection:                    PfxXDirection;
  breakX:                           number;
  breakZ:                           number;
  inducedBreakZ:                    number;
  inducedBreakZDec:                 string;
  inducedBreakZForcedSign:          string;
  ivbZDirection:                    ZDirection;
  isSword:                          boolean;
  batSpeed?:                        number;
  is_bip_out:                       AllStarStatus;
  pitch_number:                     number;
  player_total_pitches:             number;
  player_total_pitches_pitch_types: number;
  game_total_pitches:               number;
  rowId:                            string;
  game_pk:                          string;
  pitch_types?:                     HomeBatterPitchTypes;
  results?:                         Results;
  avg_pitch_speed?:                 AvgPitchSpeed[];
  hit_speed_round?:                 string;
  hit_speed?:                       string;
  hit_distance?:                    string;
  xba?:                             string;
  hit_angle?:                       string;
  is_barrel?:                       number;
  hc_x?:                            number;
  hc_x_ft?:                         number;
  hc_y?:                            number;
  hc_y_ft?:                         number;
}

export interface HomeBatterPitchTypes {
  FF:  number;
  KC?: number;
  SL?: number;
  FC?: number;
  SI?: number;
  ST?: number;
  CH?: number;
  FS?: number;
}

export interface HomePitcher {
  play_id:                          string;
  inning:                           number;
  ab_number:                        number;
  cap_index:                        number;
  outs:                             number;
  batter:                           number;
  stand:                            PThrows;
  batter_name:                      BatterNameEnum;
  pitcher:                          number;
  p_throws:                         PThrows;
  pitcher_name:                     PitcherNameEnum;
  team_batting:                     Abbreviation;
  team_fielding:                    Abbreviation;
  team_batting_id:                  number;
  team_fielding_id:                 number;
  result:                           Events;
  des:                              string;
  events:                           Events;
  contextMetrics:                   ContextMetrics;
  strikes:                          number;
  balls:                            number;
  pre_strikes:                      number;
  pre_balls:                        number;
  call:                             GameStatusEnum;
  call_name:                        CallName;
  pitch_type:                       PitchType;
  pitch_name:                       PitchNameEnum;
  description:                      AwayBatterDescription;
  result_code:                      GameStatusEnum;
  pitch_call:                       PitchCall;
  is_strike_swinging:               boolean;
  balls_and_strikes:                string;
  start_speed:                      number;
  end_speed:                        number;
  sz_top:                           number;
  sz_bot:                           number;
  extension:                        number;
  plateTime:                        number;
  zone:                             number;
  spin_rate:                        number;
  px:                               number;
  pz:                               number;
  x0:                               number;
  y0:                               number;
  z0:                               number;
  ax:                               number;
  ay:                               number;
  az:                               number;
  vx0:                              number;
  vy0:                              number;
  vz0:                              number;
  pfxX:                             number;
  pfxZ:                             number;
  pfxZWithGravity:                  number;
  pfxZWithGravityNice:              number;
  pfxZDirection:                    ZDirection;
  pfxXWithGravity:                  number;
  pfxXNoAbs:                        string;
  pfxXDirection:                    PfxXDirection;
  breakX:                           number;
  breakZ:                           number;
  inducedBreakZ:                    number;
  inducedBreakZDec:                 string;
  inducedBreakZForcedSign:          string;
  ivbZDirection:                    ZDirection;
  isSword:                          boolean;
  batSpeed?:                        number;
  hit_speed_round?:                 string;
  hit_speed?:                       string;
  hit_distance?:                    string;
  xba?:                             string;
  hit_angle?:                       string;
  is_barrel?:                       number;
  hc_x?:                            number;
  hc_x_ft?:                         number;
  hc_y?:                            number;
  hc_y_ft?:                         number;
  is_bip_out:                       AllStarStatus;
  pitch_number:                     number;
  player_total_pitches:             number;
  player_total_pitches_pitch_types: number;
  game_total_pitches:               number;
  rowId:                            string;
  game_pk:                          string;
  pitch_types?:                     AwayBatterPitchTypes;
  results?:                         Results;
  avg_pitch_speed?:                 AvgPitchSpeed[];
  runnerOn1B?:                      boolean;
  runnerOn2B?:                      boolean;
  runnerOn3B?:                      boolean;
}

export interface Scoreboard {
  gamePk:           number;
  linescore:        Linescore;
  stats:            ScoreboardStats;
  currentPlay:      CurrentPlay;
  status:           Status;
  teams:            ScoreboardTeams;
  datetime:         Datetime;
  probablePitchers: ProbablePitchers;
}

export interface CurrentPlay {
  result:                      Result;
  about:                       About;
  count:                       Count;
  matchup:                     Matchup;
  pitchIndex:                  number[];
  actionIndex:                 any[];
  runnerIndex:                 number[];
  runners:                     Runner[];
  playEvents:                  PlayEvent[];
  credits:                     CurrentPlayCredit[];
  flags:                       any[];
  homeTeamWinProbability:      number;
  awayTeamWinProbability:      number;
  homeTeamWinProbabilityAdded: number;
  leverageIndex:               number;
  contextMetrics:              Records;
  playEndTime:                 Date;
  atBatIndex:                  number;
}

export interface About {
  atBatIndex:       number;
  halfInning:       string;
  isTopInning:      boolean;
  inning:           number;
  startTime:        Date;
  endTime:          Date;
  isComplete:       boolean;
  isScoringPlay:    boolean;
  hasReview:        boolean;
  hasOut:           boolean;
  captivatingIndex: number;
}

export interface Count {
  balls:   number;
  strikes: number;
  outs:    number;
}

export interface CurrentPlayCredit {
  player: SpringVenue;
  credit: string;
}

export interface Matchup {
  batter:                 OfficialClass;
  batSide:                BatSide;
  pitcher:                OfficialClass;
  pitchHand:              BatSide;
  batterHotColdZoneStats: BatterHotColdZoneStats;
  batterHotColdZones:     Zone[];
  pitcherHotColdZones:    any[];
  splits:                 Splits;
}

export interface BatterHotColdZoneStats {
  stats: StatElement[];
}

export interface StatElement {
  type:       Group;
  group:      Group;
  exemptions: any[];
  splits:     Split[];
}

export interface Group {
  displayName: string;
}

export interface Split {
  stat: SplitStat;
}

export interface SplitStat {
  name:  string;
  zones: Zone[];
}

export interface Zone {
  zone:  string;
  color: Color;
  temp:  Temp;
  value: string;
}

export enum Color {
  RGBA15018825555 = "rgba(150, 188, 255, .55)",
  RGBA214415255 = "rgba(214, 41, 52, .55)",
  RGBA255255255055 = "rgba(255, 255, 255, 0.55)",
  RGBA69023855 = "rgba(6, 90, 238, .55)",
}

export enum Temp {
  Cold = "cold",
  Cool = "cool",
  Hot = "hot",
  Lukewarm = "lukewarm",
}

export interface Splits {
  batter:    string;
  pitcher:   string;
  menOnBase: string;
}

export interface PlayEvent {
  details:        PlayEventDetails;
  count:          Count;
  preCount:       Count;
  pitchData:      PitchData;
  hitData:        HitData;
  index:          number;
  playId:         string;
  pitchNumber:    number;
  startTime:      Date;
  endTime:        Date;
  isPitch:        boolean;
  type:           string;
  defense:        PlayEventDefense;
  offense:        PlayEventOffense;
  officials:      PlayEventOfficial[];
  contextMetrics: Records;
}

export interface PlayEventDefense {
  pitcher:   Pitcher;
  catcher:   SpringVenue;
  first:     SpringVenue;
  second:    SpringVenue;
  third:     SpringVenue;
  shortstop: SpringVenue;
  left:      SpringVenue;
  center:    SpringVenue;
  right:     SpringVenue;
}

export interface Pitcher {
  id:        number;
  link:      string;
  pitchHand: BatSide;
}

export interface PlayEventDetails {
  call:        BatSide;
  description: AwayBatterDescription;
  code:        GameStatusEnum;
  ballColor:   string;
  trailColor:  string;
  isInPlay:    boolean;
  isStrike:    boolean;
  isBall:      boolean;
  type:        BatSide;
  isOut:       boolean;
  hasReview:   boolean;
}

export interface HitData {
  coordinates:   Records;
  batSpeed?:     number;
  isSwordSwing?: boolean;
}

export interface PlayEventOffense {
  batter:         Batter;
  batterPosition: Position;
}

export interface Batter {
  id:      number;
  link:    string;
  batSide: BatSide;
}

export interface PlayEventOfficial {
  official:     SpringVenue;
  officialType: OfficialType;
}

export interface PitchData {
  startSpeed:       number;
  endSpeed:         number;
  strikeZoneTop:    number;
  strikeZoneBottom: number;
  coordinates:      { [key: string]: number };
  breaks:           Breaks;
  zone:             number;
  typeConfidence:   number;
  plateTime:        number;
  extension:        number;
}

export interface Breaks {
  breakAngle:           number;
  breakLength:          number;
  breakY:               number;
  breakVertical:        number;
  breakVerticalInduced: number;
  breakHorizontal:      number;
  spinRate:             number;
  spinDirection:        number;
}

export interface Result {
  type:        string;
  event:       Events;
  eventType:   string;
  description: string;
  rbi:         number;
  awayScore:   number;
  homeScore:   number;
  isOut:       boolean;
}

export interface Runner {
  movement: Movement;
  details:  RunnerDetails;
  credits:  RunnerCredit[];
}

export interface RunnerCredit {
  player:   SpringVenue;
  position: Position;
  credit:   string;
}

export interface RunnerDetails {
  event:              Events;
  eventType:          string;
  movementReason:     null;
  runner:             OfficialClass;
  responsiblePitcher: null;
  isScoringEvent:     boolean;
  rbi:                boolean;
  earned:             boolean;
  teamUnearned:       boolean;
  playIndex:          number;
}

export interface Movement {
  originBase: null;
  start:      null;
  end:        null;
  outBase:    string;
  isOut:      boolean;
  outNumber:  number;
}

export interface Datetime {
  dateTime:     Date;
  originalDate: Date;
  officialDate: Date;
  dayNight:     string;
  time:         string;
  ampm:         string;
}

export interface Linescore {
  currentInning:        number;
  currentInningOrdinal: string;
  inningState:          string;
  inningHalf:           string;
  isTopInning:          boolean;
  scheduledInnings:     number;
  innings:              Inning[];
  teams:                LinescoreTeams;
  defense:              LinescoreDefense;
  offense:              LinescoreOffense;
  balls:                number;
  strikes:              number;
  outs:                 number;
}

export interface LinescoreDefense {
  pitcher:      OfficialClass;
  catcher:      OfficialClass;
  first:        OfficialClass;
  second:       OfficialClass;
  third:        OfficialClass;
  shortstop:    OfficialClass;
  left:         OfficialClass;
  center:       OfficialClass;
  right:        OfficialClass;
  batter:       OfficialClass;
  onDeck:       OfficialClass;
  inHole:       OfficialClass;
  battingOrder: number;
  team:         Division;
}

export interface Inning {
  num:        number;
  ordinalNum: string;
  home:       InningAway;
  away:       InningAway;
}

export interface InningAway {
  runs?:      number;
  hits:       number;
  errors:     number;
  leftOnBase: number;
}

export interface LinescoreOffense {
  batter:       OfficialClass;
  onDeck:       OfficialClass;
  inHole:       OfficialClass;
  pitcher:      OfficialClass;
  battingOrder: number;
  team:         Division;
}

export interface LinescoreTeams {
  home: InningAway;
  away: InningAway;
}

export interface ProbablePitchers {
  away: OfficialClass;
  home: OfficialClass;
}

export interface ScoreboardStats {
  wpa:           WPA;
  exitVelocity:  ExitVelocityClass;
  pitchVelocity: PitchVelocity;
}

export interface ExitVelocityClass {
  top:         LastEv[];
  lastEV:      LastEv[];
  xbaTeam:     XbaTeam;
  topDistance: LastEv[];
}

export interface LastEv {
  team:                    number;
  teamAbbrev:              Abbreviation;
  batterName:              BatterNameEnum;
  batterId:                number;
  atBatIndex:              number;
  result:                  string;
  launchSpeed:             string;
  launchAngle:             string;
  distance:                string;
  hitProbabilityFormatted: string;
  hitProbability:          number;
}

export interface XbaTeam {
  away: XbaTeamAway;
  home: XbaTeamAway;
}

export interface XbaTeamAway {
  abs: number;
  sum: number;
  xba: string;
}

export interface PitchVelocity {
  topPitches:     TopPitch[];
  currentPitcher: CurrentPitcher[];
}

export interface CurrentPitcher {
  pitchType:    PitchType;
  totalPitches: number;
  avg:          string;
  min:          number;
  max:          number;
  pitches:      Pitch[];
}

export interface Pitch {
  startSpeed: number;
  pitchType:  PitchType;
  px:         number;
  pz:         number;
}

export interface TopPitch {
  startSpeed: number;
  id:         number;
  name:       PitcherNameEnum;
}

export interface WPA {
  gameWpa:       GameWPA[];
  lastPlays:     LastPlay[];
  topWpaPlayers: LastPlay[];
}

export interface GameWPA {
  homeTeamWinProbability:      number;
  awayTeamWinProbability:      number;
  homeTeamWinProbabilityAdded: number;
  hwp:                         number;
  awp:                         number;
  atBatIndex:                  number;
  i:                           string;
  capIndex:                    number;
}

export interface LastPlay {
  wpa:  number;
  name: BatterNameEnum;
}

export interface Status {
  abstractGameState: string;
  codedGameState:    GameStatusEnum;
  detailedState:     string;
  statusCode:        GameStatusEnum;
  startTimeTBD:      boolean;
  abstractGameCode:  GameStatusEnum;
}

export interface ScoreboardTeams {
  away: AwayTeamData;
  home: AwayTeamData;
}

export interface TeamAwayElement {
  play_id:                          string;
  inning:                           number;
  ab_number:                        number;
  cap_index:                        number;
  outs:                             number;
  batter:                           number;
  stand:                            PThrows;
  batter_name:                      BatterNameEnum;
  pitcher:                          number;
  p_throws:                         PThrows;
  pitcher_name:                     PitcherNameEnum;
  team_batting:                     Abbreviation;
  team_fielding:                    Abbreviation;
  team_batting_id:                  number;
  team_fielding_id:                 number;
  result:                           Events;
  des:                              string;
  events:                           Events;
  contextMetrics:                   ContextMetrics;
  strikes:                          number;
  balls:                            number;
  pre_strikes:                      number;
  pre_balls:                        number;
  call:                             GameStatusEnum;
  call_name:                        CallName;
  pitch_type:                       PitchType;
  pitch_name:                       PitchNameEnum;
  description:                      AwayBatterDescription;
  result_code:                      GameStatusEnum;
  pitch_call:                       PitchCall;
  is_strike_swinging:               boolean;
  balls_and_strikes:                string;
  start_speed:                      number;
  end_speed:                        number;
  sz_top:                           number;
  sz_bot:                           number;
  extension:                        number;
  plateTime:                        number;
  zone:                             number;
  spin_rate?:                       number;
  px:                               number;
  pz:                               number;
  x0:                               number;
  y0:                               number;
  z0:                               number;
  ax:                               number;
  ay:                               number;
  az:                               number;
  vx0:                              number;
  vy0:                              number;
  vz0:                              number;
  pfxX:                             number;
  pfxZ:                             number;
  pfxZWithGravity:                  number;
  pfxZWithGravityNice:              number;
  pfxZDirection:                    ZDirection;
  pfxXWithGravity:                  number;
  pfxXNoAbs:                        string;
  pfxXDirection:                    PfxXDirection;
  breakX:                           number;
  breakZ:                           number;
  inducedBreakZ:                    number;
  inducedBreakZDec:                 string;
  inducedBreakZForcedSign:          string;
  ivbZDirection:                    ZDirection;
  isSword:                          boolean;
  is_bip_out:                       AllStarStatus;
  pitch_number:                     number;
  player_total_pitches:             number;
  player_total_pitches_pitch_types: number;
  game_total_pitches:               number;
  rowId:                            string;
  game_pk:                          string;
  pitch_types?:                     TeamAwayPitchTypes;
  results?:                         Results;
  avg_pitch_speed?:                 AvgPitchSpeed[];
  batSpeed?:                        number;
  hit_speed_round?:                 string;
  hit_speed?:                       string;
  hit_distance?:                    string;
  xba?:                             string;
  hit_angle?:                       string;
  is_barrel?:                       number;
  hc_x?:                            number;
  hc_x_ft?:                         number;
  hc_y?:                            number;
  hc_y_ft?:                         number;
  player_name?:                     Abbreviation;
  runnerOn1B?:                      boolean;
  runnerOn2B?:                      boolean;
  runnerOn3B?:                      boolean;
}

export interface TeamAwayPitchTypes {
  SI:  number;
  FF:  number;
  SL?: number;
  ST?: number;
  FC?: number;
}
