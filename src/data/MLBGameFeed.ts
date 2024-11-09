export namespace GameFeed {
  export interface ResponseBody {
    copyright: string;
    gamePk:    number;
    link:      string;
    metaData:  MetaData;
    gameData:  GameData;
    liveData:  LiveData;
  }
  
  export interface GameData {
    game:              Game;
    datetime:          Datetime;
    status:            Status;
    teams:             GameDataTeams;
    players:           { [key: string]: PlayerDetails };
    venue:             Venue;
    officialVenue:     Entity;
    weather:           Weather;
    gameInfo:          GameInfo;
    review:            Review;
    flags:             Flags;
    alerts:            any[];
    probablePitchers:  ProbablePitchers;
    officialScorer:    EntityWithFullName;
    primaryDatacaster: EntityWithFullName;
    moundVisits:       MoundVisits;
  }
  
  export interface Datetime {
    dateTime:     string;
    originalDate: Date;
    officialDate: Date;
    dayNight:     string;
    time:         string;
    ampm:         string;
  }
  
  export interface Flags {
    noHitter:            boolean;
    perfectGame:         boolean;
    awayTeamNoHitter:    boolean;
    awayTeamPerfectGame: boolean;
    homeTeamNoHitter:    boolean;
    homeTeamPerfectGame: boolean;
  }
  
  export interface Game {
    pk:              number;
    type:            AbstractGameCodeEnum;
    doubleHeader:    DoubleHeader;
    id:              string;
    gamedayType:     GamedayType;
    tiebreaker:      DoubleHeader;
    gameNumber:      number;
    calendarEventID: string;
    season:          string;
    seasonDisplay:   string;
  }
  
  export enum DoubleHeader {
    N = "N",
  }

  export enum DPosAbbrEnum {
    First = "1B",
    Second = "2B",
    Third = "3B",
    Shortstop = "SS",
    LeftField = "LF",
    CenterField = "CF",
    RightField = "RF",
    Pitcher = "P",
    Catcher = "C"
  }

  export type DPosAbbr = `${DPosAbbrEnum}`;
  
  export enum GamedayType {
    C = "C",
    CF = "CF",
    Dh = "DH",
    LF = "LF",
    P = "P",
    Ph = "PH",
    RF = "RF",
    Score = "score",
    Ss = "SS",
    The1B = "1B",
    The2B = "2B",
    The3B = "3B",
  }
  
  export enum AbstractGameCodeEnum {
    A = "A",
    B = "B",
    C = "C",
    Ch = "CH",
    Cu = "CU",
    D = "D",
    E = "E",
    F = "F",
    FS = "FS",
    Fc = "FC",
    Ff = "FF",
    Kc = "KC",
    M = "M",
    S = "S",
    Si = "SI",
    Sl = "SL",
    St = "ST",
    T = "T",
    TypeB = "*B",
    VB = "VB",
    W = "W",
    X = "X",
  }
  
  export interface GameInfo {
    attendance:          number;
    firstPitch:          Date;
    gameDurationMinutes: number;
  }
  
  export interface MoundVisits {
    away: MoundVisitsAway;
    home: MoundVisitsAway;
  }
  
  export interface MoundVisitsAway {
    used:      number;
    remaining: number;
  }
  
  export interface EntityWithFullName {
    id:       number;
    fullName: string;
    link:     string;
  }
  
  export interface Entity {
    id:   number;
    link: string;
  }
  
  export interface PlayerDetails {
    id:                  number;
    fullName:            string;
    link:                string;
    firstName:           string;
    lastName:            string;
    primaryNumber:       string;
    birthDate:           Date;
    currentAge:          number;
    birthCity:           string;
    birthStateProvince?: string;
    birthCountry:        Country;
    height:              string;
    weight:              number;
    active:              boolean;
    primaryPosition:     Position;
    useName:             string;
    useLastName:         string;
    middleName?:         string;
    boxscoreName:        string;
    nickName?:           string;
    gender:              AbstractGameCodeEnum;
    isPlayer:            boolean;
    isVerified:          boolean;
    draftYear?:          number;
    mlbDebutDate:        Date;
    batSide:             BatSide;
    pitchHand:           BatSide;
    nameFirstLast:       string;
    nameSlug:            string;
    firstLastName:       string;
    lastFirstName:       string;
    lastInitName:        string;
    initLastName:        string;
    fullFMLName:         string;
    fullLFMName:         string;
    strikeZoneTop:       number;
    strikeZoneBottom:    number;
    nameMatrilineal?:    string;
    pronunciation?:      string;
  }
  
  export interface BatSide {
    code:        'R' | 'L';
    description: Description;
  }

  export enum Description {
    Active = "Active",
    AutomaticBallIntentional = "Automatic Ball - Intentional",
    Ball = "Ball",
    BallInDirt = "Ball In Dirt",
    CalledStrike = "Called Strike",
    Changeup = "Changeup",
    Curveball = "Curveball",
    Cutter = "Cutter",
    Foul = "Foul",
    FoulBunt = "Foul Bunt",
    FoulTip = "Foul Tip",
    FourSeamFastball = "Four-Seam Fastball",
    InPlayNoOut = "In play, no out",
    InPlayOutS = "In play, out(s)",
    InPlayRunS = "In play, run(s)",
    KnuckleCurve = "Knuckle Curve",
    Left = "Left",
    MissedBunt = "Missed Bunt",
    Right = "Right",
    Sinker = "Sinker",
    Slider = "Slider",
    Splitter = "Splitter",
    Sweeper = "Sweeper",
    SwingingStrike = "Swinging Strike",
    SwingingStrikeBlocked = "Swinging Strike (Blocked)",
    Switch = "Switch",
  }

  // export function getCodeDescription(code: AbstractGameCodeEnum) {
  //   switch (code) {
  //     case AbstractGameCodeEnum.A: return Description.Active
  //     case AbstractGameCodeEnum.B: return Description.Ball
  //     case AbstractGameCodeEnum.C: return Description.CalledStrike
  //     case AbstractGameCodeEnum.Ch: return Description.Changeup
  //     case AbstractGameCodeEnum.Cu: return Description.Curveball
  //     case AbstractGameCodeEnum.D: return Description.
  //     case AbstractGameCodeEnum.E: return Description.
  //     case AbstractGameCodeEnum.F: return Description.
  //     case AbstractGameCodeEnum.FS: return Description.
  //     case AbstractGameCodeEnum.Fc: return Description.
  //     case AbstractGameCodeEnum.Ff: return Description.
  //     case AbstractGameCodeEnum.Kc: return Description.
  //     case AbstractGameCodeEnum.L: return Description.
  //     case AbstractGameCodeEnum.M: return Description.
  //     case AbstractGameCodeEnum.R: return Description.
  //     case AbstractGameCodeEnum.S: return Description.
  //     case AbstractGameCodeEnum.Si: return Description.
  //     case AbstractGameCodeEnum.Sl: return Description.
  //     case AbstractGameCodeEnum.St: return Description.
  //     case AbstractGameCodeEnum.T: return Description.
  //     case AbstractGameCodeEnum.TypeB: return Description.
  //     case AbstractGameCodeEnum.VB: return Description.
  //     case AbstractGameCodeEnum.W: return Description.
  //     case AbstractGameCodeEnum.X: return Description.
  //   }
  // }
  
  export enum Country {
    Canada = "Canada",
    Cuba = "Cuba",
    DominicanRepublic = "Dominican Republic",
    Usa = "USA",
    Venezuela = "Venezuela",
  }
  
  export interface Position {
    code:         string;
    name:         PrimaryPositionName;
    type:         PrimaryPositionType;
    abbreviation: DPosAbbr;
  }
  
  export enum PrimaryPositionName {
    Catcher = "Catcher",
    DesignatedHitter = "Designated Hitter",
    FirstBase = "First Base",
    Outfielder = "Outfielder",
    PinchHitter = "Pinch Hitter",
    Pitcher = "Pitcher",
    SecondBase = "Second Base",
    Shortstop = "Shortstop",
    ThirdBase = "Third Base",
  }
  
  export enum PrimaryPositionType {
    Catcher = "Catcher",
    Hitter = "Hitter",
    Infielder = "Infielder",
    Outfielder = "Outfielder",
    Pitcher = "Pitcher",
  }
  
  export interface ProbablePitchers {
    away: EntityWithFullName;
    home: EntityWithFullName;
  }
  
  export interface Review {
    hasChallenges: boolean;
    away:          MoundVisitsAway;
    home:          MoundVisitsAway;
  }
  
  export interface Status {
    abstractGameState: string;
    codedGameState:    AbstractGameCodeEnum;
    detailedState:     string;
    statusCode:        AbstractGameCodeEnum;
    startTimeTBD:      boolean;
    abstractGameCode:  AbstractGameCodeEnum;
  }
  
  export interface GameDataTeams {
    away: GameDataTeamInfo;
    home: GameDataTeamInfo;
  }
  
  export interface GameDataTeamInfo {
    springLeague:    Division;
    allStarStatus:   DoubleHeader;
    id:              number;
    name:            AwayName;
    link:            Link;
    season:          number;
    venue:           Division;
    springVenue:     Entity;
    teamCode:        string;
    fileCode:        string;
    abbreviation:    string;
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
    abbreviation?: Abbreviation;
  }
  
  export enum Abbreviation {
    Cl = "CL",
    Gl = "GL",
  }
  
  export enum Link {
    APIV1Teams114 = "/api/v1/teams/114",
    APIV1Teams116 = "/api/v1/teams/116",
  }
  
  export enum AwayName {
    ClevelandGuardians = "Cleveland Guardians",
    DetroitTigers = "Detroit Tigers",
  }
  
  export interface Record {
    gamesPlayed:           number;
    wildCardGamesBack:     ConferenceGamesBack;
    leagueGamesBack:       ConferenceGamesBack;
    springLeagueGamesBack: ConferenceGamesBack;
    sportGamesBack:        ConferenceGamesBack;
    divisionGamesBack:     ConferenceGamesBack;
    conferenceGamesBack:   ConferenceGamesBack;
    leagueRecord:          LeagueRecord;
    records:               HitDistance;
    divisionLeader:        boolean;
    wins:                  number;
    losses:                number;
    winningPercentage:     string;
  }
  
  export enum ConferenceGamesBack {
    Empty = "-",
    The000 = ".000",
    The9373 = "93.73",
  }
  
  export interface LeagueRecord {
    wins:   number;
    losses: number;
    ties:   number;
    pct:    string;
  }
  
  export interface HitDistance {
  }
  
  export interface Venue {
    id:        number;
    name:      string;
    link:      string;
    location:  Location;
    timeZone:  TimeZone;
    fieldInfo: FieldInfo;
    active:    boolean;
    season:    string;
  }
  
  export interface FieldInfo {
    capacity:    number;
    turfType:    string;
    roofType:    string;
    leftLine:    number;
    leftCenter:  number;
    center:      number;
    rightCenter: number;
    rightLine:   number;
  }
  
  export interface Location {
    address1:           string;
    city:               string;
    state:              string;
    stateAbbrev:        string;
    postalCode:         string;
    defaultCoordinates: DefaultCoordinates;
    azimuthAngle:       number;
    elevation:          number;
    country:            Country;
    phone:              string;
  }
  
  export interface DefaultCoordinates {
    latitude:  number;
    longitude: number;
  }
  
  export interface TimeZone {
    id:               string;
    offset:           number;
    offsetAtGameTime: number;
    tz:               string;
  }
  
  export interface Weather {
    condition: string;
    temp:      string;
    wind:      string;
  }
  
  export interface LiveData {
    plays:     PlayData;
    linescore: Linescore;
    boxscore:  Boxscore;
    decisions: Decisions;
    leaders:   Leaders;
  }
  
  export interface Boxscore {
    teams:         BoxscoreTeams;
    officials:     Official[];
    info:          NoteElement[];
    pitchingNotes: any[];
    topPerformers: TopPerformer[];
  }
  
  export interface NoteElement {
    label:  string;
    value?: string;
  }
  
  export interface Official {
    official:     EntityWithFullName;
    officialType: string;
  }
  
  export interface BoxscoreTeams {
    away: Team;
    home: Team;
  }
  
  export interface Team {
    team:         TeamMeta;
    teamStats:    TeamStatsClass;
    players:      { [key: string]: TeamPlayerInfo };
    batters:      number[];
    pitchers:     number[];
    bench:        number[];
    bullpen:      number[];
    battingOrder: number[];
    info:         PurpleInfo[];
    note:         NoteElement[];
  }
  
  export interface PurpleInfo {
    title:     string;
    fieldList: NoteElement[];
  }

  export interface TeamPlayerInfo {
    person:       EntityWithFullName;
    jerseyNumber: string;
    position:     Position;
    status:       BatSide;
    parentTeamId: number;
    battingOrder?: string;
    stats:        PurpleStats;
    seasonStats:  TeamStatsClass;
    gameStatus:   GameStatus;
    allPositions: Position[];
  }
  
  export interface GameStatus {
    isCurrentBatter:  boolean;
    isCurrentPitcher: boolean;
    isOnBench:        boolean;
    isSubstitute:     boolean;
  }
  
  export interface TeamStatsClass {
    batting:  Batting;
    pitching: Pitching;
    fielding: FieldingClass;
  }
  
  export interface Batting {
    gamesPlayed?:          number;
    flyOuts?:              number;
    groundOuts?:           number;
    airOuts?:              number;
    runs?:                 number;
    doubles?:              number;
    triples?:              number;
    homeRuns?:             number;
    strikeOuts?:           number;
    baseOnBalls?:          number;
    intentionalWalks?:     number;
    hits?:                 number;
    hitByPitch?:           number;
    avg?:                  string;
    atBats?:               number;
    obp?:                  string;
    slg?:                  string;
    ops?:                  string;
    caughtStealing?:       number;
    stolenBases?:          number;
    stolenBasePercentage?: StolenBasePercentage;
    groundIntoDoublePlay?: number;
    groundIntoTriplePlay?: number;
    plateAppearances?:     number;
    totalBases?:           number;
    rbi?:                  number;
    leftOnBase?:           number;
    sacBunts?:             number;
    sacFlies?:             number;
    babip?:                string;
    groundOutsToAirouts?:  string;
    catchersInterference?: number;
    pickoffs?:             number;
    atBatsPerHomeRun?:     AtBatsPerHomeRun;
    popOuts?:              number;
    lineOuts?:             number;
    summary?:              string;
    note?:                 string;
  }
  
  export enum AtBatsPerHomeRun {
    Empty = "-.--",
    The1100 = "11.00",
    The1300 = "13.00",
    The2000 = "20.00",
  }
  
  export enum StolenBasePercentage {
    Empty = ".---",
    The1000 = "1.000",
    The500 = ".500",
  }
  
  export interface FieldingClass {
    gamesStarted?:        number;
    caughtStealing:       number;
    stolenBases:          number;
    stolenBasePercentage: StolenBasePercentage;
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
    The929 = ".929",
    The938 = ".938",
  }
  
  export interface Pitching {
    gamesPlayed?:            number;
    gamesStarted?:           number;
    flyOuts?:                number;
    groundOuts?:             number;
    airOuts?:                number;
    runs?:                   number;
    doubles?:                number;
    triples?:                number;
    homeRuns?:               number;
    strikeOuts?:             number;
    baseOnBalls?:            number;
    intentionalWalks?:       number;
    hits?:                   number;
    hitByPitch?:             number;
    atBats?:                 number;
    obp?:                    string;
    caughtStealing?:         number;
    stolenBases?:            number;
    stolenBasePercentage?:   StolenBasePercentage;
    numberOfPitches?:        number;
    era?:                    string;
    inningsPitched?:         string;
    wins?:                   number;
    losses?:                 number;
    saves?:                  number;
    saveOpportunities?:      number;
    holds?:                  number;
    blownSaves?:             number;
    earnedRuns?:             number;
    whip?:                   string;
    battersFaced?:           number;
    outs?:                   number;
    gamesPitched?:           number;
    completeGames?:          number;
    shutouts?:               number;
    pitchesThrown?:          number;
    balls?:                  number;
    strikes?:                number;
    strikePercentage?:       string;
    hitBatsmen?:             number;
    balks?:                  number;
    wildPitches?:            number;
    pickoffs?:               number;
    groundOutsToAirouts?:    string;
    rbi?:                    number;
    winPercentage?:          WinPercentage;
    pitchesPerInning?:       string;
    gamesFinished?:          number;
    strikeoutWalkRatio?:     string;
    strikeoutsPer9Inn?:      string;
    walksPer9Inn?:           string;
    hitsPer9Inn?:            string;
    runsScoredPer9?:         string;
    homeRunsPer9?:           HomeRunsPer9;
    inheritedRunners?:       number;
    inheritedRunnersScored?: number;
    catchersInterference?:   number;
    sacBunts?:               number;
    sacFlies?:               number;
    passedBall?:             number;
    popOuts?:                number;
    lineOuts?:               number;
    note?:                   string;
    summary?:                string;
  }
  
  export enum HomeRunsPer9 {
    Empty = "-.--",
    The000 = "0.00",
    The180 = "1.80",
    The450 = "4.50",
  }
  
  export enum WinPercentage {
    Empty = ".---",
    The000 = ".000",
    The1000 = "1.000",
  }
  
  export interface PurpleStats {
    batting:  HitDistance;
    pitching: Pitching;
    fielding: FieldingClass;
  }
  
  export interface Id571510 {
    person:       EntityWithFullName;
    jerseyNumber: string;
    position:     Position;
    status:       BatSide;
    parentTeamId: number;
    stats:        FluffyStats;
    seasonStats:  TeamStatsClass;
    gameStatus:   GameStatus;
  }
  
  export interface FluffyStats {
    batting:  HitDistance;
    pitching: HitDistance;
    fielding: HitDistance;
  }
  
  export interface TentacledStats {
    batting:  Batting;
    pitching: HitDistance;
    fielding: FieldingClass;
  }
  
  export interface TeamMeta {
    springLeague:  Division;
    allStarStatus: DoubleHeader;
    id:            number;
    name:          AwayName;
    link:          Link;
  }
  
  export interface TopPerformer {
    player:             TopPerformerPlayer;
    type:               string;
    gameScore:          number;
    pitchingGameScore?: number;
    hittingGameScore?:  number;
  }
  
  export interface TopPerformerPlayer {
    person:        EntityWithFullName;
    jerseyNumber:  string;
    position:      Position;
    status:        BatSide;
    parentTeamId:  number;
    stats:         TeamStatsClass;
    seasonStats:   TeamStatsClass;
    gameStatus:    GameStatus;
    allPositions:  Position[];
    battingOrder?: string;
  }
  
  export interface Decisions {
    winner: EntityWithFullName;
    loser:  EntityWithFullName;
    save:   EntityWithFullName;
  }
  
  export interface Leaders {
    hitDistance: HitDistance;
    hitSpeed:    HitDistance;
    pitchSpeed:  HitDistance;
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
    defense:              Defense;
    offense:              Offense;
    balls:                number;
    strikes:              number;
    outs:                 number;
  }
  
  export interface Defense {
    pitcher:      EntityWithFullName;
    catcher:      EntityWithFullName;
    first:        EntityWithFullName;
    second:       EntityWithFullName;
    third:        EntityWithFullName;
    shortstop:    EntityWithFullName;
    left:         EntityWithFullName;
    center:       EntityWithFullName;
    right:        EntityWithFullName;
    batter:       EntityWithFullName;
    onDeck:       EntityWithFullName;
    inHole:       EntityWithFullName;
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
  
  export interface Offense {
    batter:       EntityWithFullName;
    onDeck:       EntityWithFullName;
    inHole:       EntityWithFullName;
    pitcher:      EntityWithFullName;
    battingOrder: number;
    team:         Division;
  }
  
  export interface LinescoreTeams {
    home: InningAway;
    away: InningAway;
  }
  
  export interface PlayData {
    allPlays:      Play[];
    currentPlay:   CurrentPlay;
    scoringPlays:  number[];
    playsByInning: PlaysByInning[];
  }
  
  export interface Play {
    result:      Result;
    about:       About;
    count:       Count;
    matchup:     AllPlayMatchup;
    pitchIndex:  number[];
    actionIndex: number[];
    runnerIndex: number[];
    runners:     Runner[];
    playEvents:  Event[];
    playEndTime: Date;
    atBatIndex:  number;
  }
  
  export interface About {
    atBatIndex:       number;
    halfInning:       HalfInning;
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
  
  export enum HalfInning {
    Bottom = "bottom",
    Top = "top",
  }
  
  export interface Count {
    balls:   number;
    strikes: number;
    outs:    number;
  }
  
  export interface AllPlayMatchup {
    batter:                  EntityWithFullName;
    batSide:                 BatSide;
    pitcher:                 EntityWithFullName;
    pitchHand:               BatSide;
    batterHotColdZones:      Zone[];
    pitcherHotColdZones:     any[];
    splits:                  Splits;
    postOnFirst?:            EntityWithFullName;
    postOnSecond?:           EntityWithFullName;
    postOnThird?:            EntityWithFullName;
    batterHotColdZoneStats?: BatterHotColdZoneStats;
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
    value: ConferenceGamesBack;
  }
  
  export enum Color {
    RGBA214415255 = "rgba(214, 41, 52, .55)",
    RGBA255255255055 = "rgba(255, 255, 255, 0.55)",
    RGBA69023855 = "rgba(6, 90, 238, .55)",
  }
  
  export enum Temp {
    Cold = "cold",
    Hot = "hot",
    Lukewarm = "lukewarm",
  }
  
  export interface Splits {
    batter:    Batter;
    pitcher:   Pitcher;
    menOnBase: MenOnBase;
  }
  
  export enum Batter {
    VsLHP = "vs_LHP",
    VsRHP = "vs_RHP",
  }
  
  export enum MenOnBase {
    Empty = "Empty",
    MenOn = "Men_On",
    Risp = "RISP",
  }
  
  export enum Pitcher {
    VsLHB = "vs_LHB",
    VsRHB = "vs_RHB",
  }
  
  export interface Event {
    details:            EventDetails;
    count:              Count;
    index:              number;
    startTime:          Date;
    endTime:            Date;
    isPitch:            boolean;
    type:               PlayEventType;
    player?:            Entity;
    pitchData?:         PitchData;
    playId?:            string;
    pitchNumber?:       number;
    hitData?:           HitData;
    isSubstitution?:    boolean;
    position?:          Position;
    battingOrder?:      string;
    replacedPlayer?:    Entity;
    actionPlayId?:      string;
    isBaseRunningPlay?: boolean;
  }

  export enum EventDetailsCode {
    Ball = 'B',
    CalledStrike = 'C',
    Foul = 'F',
    FoulBunt = 'L',
    InPlayRun = 'E',
    InPlayOut = 'X',
    SwingingStrike = 'S',
    InPlayNoOut = 'D',
    PickoffAttempt1b = '1',
    PitcherStepOff = 'PSO',
    BallInDirt = '*B',
    FoulTip = 'T',
    AutomaticBallIntentional = 'VB',
    HitByPitch = 'H',
    PickoffAttempt2b = '2',
    AutomaticBallPitcherPitchTimerViolation = 'VP'
  }

  export type EventDetailsEventType = (
    'game_advisory' |
    'batter_timeout' |
    'mound_visit' |
    'wild_pitch' |
    'pitching_substitution' |
    'defensive_substitution' |
    'offensive_substitution' |
    'defensive_switch' |
    'stolen_base_3b' |
    'stolen_base_2b' |
    'defensive_indiff'
  )
  
  export interface EventDetails {
    description:       string;
    event?:            string;
    eventType?:        EventDetailsEventType;
    awayScore?:        number;
    homeScore?:        number;
    isScoringPlay?:    boolean;
    isOut:             boolean;
    hasReview:         boolean;
    call?:             BatSide;
    code?:             EventDetailsCode;
    ballColor?:        BallColor;
    trailColor?:       TrailColor;
    isInPlay?:         boolean;
    isStrike?:         boolean;
    isBall?:           boolean;
    type?:             BatSide;
    fromCatcher?:      boolean;
    disengagementNum?: number;
    runnerGoing?:      boolean;
  }

  export type EventCode = 'B' | 'C' | 'F' | 'E' | 'X' | 'S' | 'D' | '1' | 'PSO' | '*B' | 'T' | 'VB' | 'H' | '2' | 'VP'
  
  export enum BallColor {
    RGBA170211110 = "rgba(170, 21, 11, 1.0)",
    RGBA268619010 = "rgba(26, 86, 190, 1.0)",
    RGBA391613910 = "rgba(39, 161, 39, 1.0)",
  }
  
  export enum TrailColor {
    RGBA0025410 = "rgba(0, 0, 254, 1.0)",
    RGBA03425510 = "rgba(0, 34, 255, 1.0)",
    RGBA08525410 = "rgba(0, 85, 254, 1.0)",
    RGBA119015210 = "rgba(119, 0, 152, 1.0)",
    RGBA152010110 = "rgba(152, 0, 101, 1.0)",
    RGBA153171010 = "rgba(153, 171, 0, 1.0)",
    RGBA18803310 = "rgba(188, 0, 33, 1.0)",
    RGBA50022110 = "rgba(50, 0, 221, 1.0)",
    RGBA50505010 = "rgba(50, 50, 50, 1.0)",
  }
  
  export interface HitData {
    launchSpeed:   number;
    launchAngle:   number;
    totalDistance: number;
    trajectory:    Trajectory;
    hardness:      Hardness;
    location:      string;
    coordinates:   HitDataCoordinates;
  }
  
  export interface HitDataCoordinates {
    coordX: number;
    coordY: number;
  }
  
  export enum Hardness {
    Hard = "hard",
    Medium = "medium",
  }
  
  export enum Trajectory {
    FlyBall = "fly_ball",
    GroundBall = "ground_ball",
    LineDrive = "line_drive",
    Popup = "popup",
  }
  
  export interface PitchData {
    startSpeed:       number;
    endSpeed:         number;
    strikeZoneTop:    number;
    strikeZoneBottom: number;
    coordinates:      {
        aY: number,
        aZ: number,
        pfxX: number,
        pfxZ: number,
        pX: number,
        pZ: number,
        vX0: number,
        vY0: number,
        vZ0: number,
        x: number,
        y: number,
        x0: number,
        y0: number,
        z0: number,
        aX: number
    };
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
  
  export enum PlayEventType {
    Action = "action",
    NoPitch = "no_pitch",
    Pickoff = "pickoff",
    Pitch = "pitch",
    Stepoff = "stepoff",
  }

  export type ResultEvent = (
    'Groundout' |
    'Lineout' |
    'Pop Out' |
    'Flyout' |
    'Single' |
    'Home Run' |
    'Strikeout' |
    'Walk' |
    'Fielders Choice'
  )
  
  export interface Result {
    type:        ResultType;
    event:       ResultEvent;
    eventType:   EventType;
    description: string;
    rbi:         number;
    awayScore:   number;
    homeScore:   number;
    isOut:       boolean;
  }
  
  export enum EventType {
    Double = "double",
    Triple = "triple",
    Error = "error",
    FieldError = "field_error",
    FieldOut = "field_out",
    IntentWalk = "intent_walk",
    SacFly = "sac_fly",
    Single = "single",
    Strikeout = "strikeout",
    HomeRun = "home_run",
    Walk = "walk",
    WildPitch = "wild_pitch",
    HitByPitch = "hit_by_pitch"
  }
  
  export enum ResultType {
    AtBat = "atBat",
  }
  
  export interface Runner {
    movement: Movement;
    details:  RunnerDetails;
    credits:  CreditElement[];
  }
  
  export interface CreditElement {
    player:   Entity;
    position: Position;
    credit:   CreditEnum;
  }
  
  export enum CreditEnum {
    FAssist = "f_assist",
    FDeflection = "f_deflection",
    FFieldedBall = "f_fielded_ball",
    FFieldingError = "f_fielding_error",
    FPutout = "f_putout",
    FThrowingError = "f_throwing_error",
  }
  
  export interface RunnerDetails {
    event:              string;
    eventType:          EventType;
    movementReason:     MovementReason | null;
    runner:             EntityWithFullName;
    responsiblePitcher: Entity | null;
    isScoringEvent:     boolean;
    rbi:                boolean;
    earned:             boolean;
    teamUnearned:       boolean;
    playIndex:          number;
  }
  
  export enum MovementReason {
    RAdvForce = "r_adv_force",
    RAdvPlay = "r_adv_play",
  }

  export type BaseKey = (
    '1B' |
    '2B' |
    '3B' |
    'score'
  )
  
  export interface Movement {
    originBase: BaseKey | null;
    start:      BaseKey | null;
    end:        BaseKey | null;
    outBase:    BaseKey | null;
    isOut:      boolean;
    outNumber:  number | null;
  }
  
  export interface CurrentPlay {
    result:      Result;
    about:       About;
    count:       Count;
    matchup:     CurrentPlayMatchup;
    pitchIndex:  number[];
    actionIndex: any[];
    runnerIndex: number[];
    runners:     Runner[];
    playEvents:  CurrentPlayPlayEvent[];
    playEndTime: Date;
    atBatIndex:  number;
  }
  
  export interface CurrentPlayMatchup {
    batter:                 EntityWithFullName;
    batSide:                BatSide;
    pitcher:                EntityWithFullName;
    pitchHand:              BatSide;
    batterHotColdZoneStats: BatterHotColdZoneStats;
    batterHotColdZones:     Zone[];
    pitcherHotColdZones:    any[];
    splits:                 Splits;
  }
  
  export interface CurrentPlayPlayEvent {
    details:     FluffyDetails;
    count:       Count;
    pitchData:   PitchData;
    index:       number;
    playId:      string;
    pitchNumber: number;
    startTime:   Date;
    endTime:     Date;
    isPitch:     boolean;
    type:        PlayEventType;
  }
  
  export interface FluffyDetails {
    call:        BatSide;
    description: Description;
    code:        AbstractGameCodeEnum;
    ballColor:   BallColor;
    trailColor:  TrailColor;
    isInPlay:    boolean;
    isStrike:    boolean;
    isBall:      boolean;
    type:        BatSide;
    isOut:       boolean;
    hasReview:   boolean;
  }
  
  export interface PlaysByInning {
    startIndex: number;
    endIndex:   number;
    top:        number[];
    bottom:     number[];
    hits:       Hits;
  }
  
  export interface Hits {
    away: AwayElement[];
    home: AwayElement[];
  }
  
  export interface AwayElement {
    team:        Team;
    inning:      number;
    pitcher:     EntityWithFullName;
    batter:      EntityWithFullName;
    coordinates: AwayCoordinates;
    type:        AwayType;
    description: string;
  }
  
  export interface AwayCoordinates {
    x: number;
    y: number;
  }
  
  export enum AwayType {
    E = "E",
    H = "H",
    O = "O",
  }
  
  export interface MetaData {
    wait:          number;
    timeStamp:     string;
    gameEvents:    string[];
    logicalEvents: string[];
  }
  
}

export {}