// Cricket calculation helpers with ICC-compliant formulas
export const cricketHelpers = {
  // Strike Rate = (Runs Scored / Balls Faced) × 100
  calculateStrikeRate: (runs, balls) => {
    if (!balls || balls === 0) return 0
    const strikeRate = (runs / balls) * 100
    return Math.round(strikeRate * 100) / 100 // Round to 2 decimal places
  },

  // Batting Average = Runs Scored / Times Dismissed
  calculateBattingAverage: (runs, dismissals) => {
    if (!dismissals || dismissals === 0) return runs || 0
    const average = runs / dismissals
    return Math.round(average * 100) / 100
  },

  // Economy Rate = Runs Conceded / Overs Bowled
  calculateEconomyRate: (runsConceded, balls) => {
    if (!balls || balls === 0) return 0
    const overs = balls / 6
    const economy = runsConceded / overs
    return Math.round(economy * 100) / 100
  },

  // Bowling Average = Runs Conceded / Wickets Taken
  calculateBowlingAverage: (runsConceded, wickets) => {
    if (!wickets || wickets === 0) return 0
    const average = runsConceded / wickets
    return Math.round(average * 100) / 100
  },

  // Bowling Strike Rate = Balls Bowled / Wickets Taken
  calculateBowlingStrikeRate: (balls, wickets) => {
    if (!wickets || wickets === 0) return 0
    const strikeRate = balls / wickets
    return Math.round(strikeRate * 100) / 100
  },

  // Format overs (e.g., 123 balls = 20.3 overs)
  formatOvers: (balls) => {
    if (!balls) return '0.0'
    const completedOvers = Math.floor(balls / 6)
    const remainingBalls = balls % 6
    return `${completedOvers}.${remainingBalls}`
  },

  // Validate strike rate (should be between 0-400 for realistic values)
  isValidStrikeRate: (strikeRate) => {
    return strikeRate >= 0 && strikeRate <= 400
  },

  // Validate economy rate (should be between 0-25 for realistic values)
  isValidEconomyRate: (economy) => {
    return economy >= 0 && economy <= 25
  }
}

export default cricketHelpers
