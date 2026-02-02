import type { IBracket } from '@interface/bracket.interface'
import type { IMatch } from '@interface/match.interface'
import type { IParticipant } from '@interface/participant.interface'
import { formatDateTime } from './myFunctions'

interface ConvertedParticipant {
  id: string
  resultText?: string
  isWinner: boolean
  status?: string
  name: string
}

interface ConvertedMatch {
  id: number
  name: string
  nextMatchId?: number | null
  nextLooserMatchId?: number | null
  tournamentRoundText: string
  startTime?: string
  state: string
  participants: ConvertedParticipant[]
}

interface DoubleBracketData {
  upper: ConvertedMatch[]
  lower: ConvertedMatch[]
}

export function convertToDoubleBracket(bracketData: IBracket): DoubleBracketData {
  const { matches } = bracketData

  // Separate matches by bracket type
  const winnerMatches = matches.filter((m) => m.bracket_type === 'WINNER')
  const loserMatches = matches.filter((m) => m.bracket_type === 'LOSER')
  const grandFinalMatch = matches.find((m) => m.bracket_type === 'GRAND_FINAL')

  // Helper function to create participant object
  const createParticipant = (
    corner: IParticipant | null | undefined,
    winnerId: number | null
  ): ConvertedParticipant | null => {
    if (!corner) return null

    const isWinner = winnerId === corner.id

    return {
      id: corner.uuid,
      resultText: winnerId ? (isWinner ? 'WON' : 'LOST') : undefined,
      isWinner: isWinner,
      status: winnerId ? 'DONE' : 'SCHEDULED',
      name: corner.full_name
    }
  }

  // Helper function to get next match ID in winner bracket
  const getNextWinnerMatchId = (currentMatch: IMatch): number | null => {
    const { round_number, match_number } = currentMatch

    const nextRoundMatch = winnerMatches.find(
      (m) => m.round_number === round_number + 1 && m.match_number === Math.ceil(match_number / 2)
    )

    return nextRoundMatch ? nextRoundMatch.id : null
  }

  // Helper function to get loser next match ID
  const getLoserNextMatchId = (currentMatch: IMatch): number | null => {
    // This is complex and depends on your bracket structure
    // For simplicity, we'll use a basic logic
    const { round_number, match_number } = currentMatch

    // Find corresponding loser bracket match
    // The logic here depends on your specific bracket structure
    const loserRound = round_number
    const loserMatchNumber = match_number

    const loserMatch = loserMatches.find(
      (m) => m.round_number === loserRound && m.match_number === loserMatchNumber
    )

    return loserMatch ? loserMatch.id : null
  }

  // Helper function to get next match ID in loser bracket
  const getNextLoserMatchId = (currentMatch: IMatch): number | null => {
    const { round_number, match_number } = currentMatch

    // Check if this should go to grand final
    const maxLoserRound = Math.max(...loserMatches.map((m) => m.round_number))
    if (round_number === maxLoserRound) {
      return grandFinalMatch ? grandFinalMatch.id : null
    }

    const nextRoundMatch = loserMatches.find(
      (m) => m.round_number === round_number + 1 && m.match_number === Math.ceil(match_number / 2)
    )

    return nextRoundMatch ? nextRoundMatch.id : null
  }

  // Convert winner bracket matches
  const upperBracket: ConvertedMatch[] = winnerMatches.map((match) => {
    const participants: ConvertedParticipant[] = []

    const redParticipant = createParticipant(match.red_corner, match.winner_id)
    if (redParticipant) participants.push(redParticipant)

    const blueParticipant = createParticipant(match.blue_corner, match.winner_id)
    if (blueParticipant) participants.push(blueParticipant)

    const convertedMatch: ConvertedMatch = {
      id: match.id,
      name: match.match_number.toString(),
      tournamentRoundText: match.round_number.toString(),
      state:
        match.status === 'SCHEDULED' ? 'SCHEDULED' : match.status === 'DONE' ? 'DONE' : 'SCHEDULED',
      participants: participants
    }

    const nextMatchId = getNextWinnerMatchId(match)
    if (nextMatchId) {
      convertedMatch.nextMatchId = nextMatchId
    } else if (grandFinalMatch) {
      convertedMatch.nextMatchId = grandFinalMatch.id
    }

    const loserNextMatchId = getLoserNextMatchId(match)
    if (loserNextMatchId) {
      convertedMatch.nextLooserMatchId = loserNextMatchId
    }

    if (match.start_time) {
      convertedMatch.startTime = (match.start_time && formatDateTime(match.start_time)) || ''
    }

    return convertedMatch
  })

  // Convert loser bracket matches
  const lowerBracket: ConvertedMatch[] = loserMatches.map((match) => {
    const participants: ConvertedParticipant[] = []

    const redParticipant = createParticipant(match.red_corner, match.winner_id)
    if (redParticipant) participants.push(redParticipant)

    const blueParticipant = createParticipant(match.blue_corner, match.winner_id)
    if (blueParticipant) participants.push(blueParticipant)

    const convertedMatch: ConvertedMatch = {
      id: match.id,
      name: match.match_number.toString(),
      tournamentRoundText: match.round_number.toString(),
      state:
        match.status === 'SCHEDULED' ? 'SCHEDULED' : match.status === 'DONE' ? 'DONE' : 'SCHEDULED',
      participants: participants
    }

    const nextMatchId = getNextLoserMatchId(match)
    if (nextMatchId) {
      convertedMatch.nextMatchId = nextMatchId
    }

    if (match.start_time) {
      convertedMatch.startTime = (match.start_time && formatDateTime(match.start_time)) || ''
    }

    return convertedMatch
  })

  // Add Grand Final to lower bracket (as final match)
  if (grandFinalMatch) {
    const participants: ConvertedParticipant[] = []

    const redParticipant = createParticipant(grandFinalMatch.red_corner, grandFinalMatch.winner_id)
    if (redParticipant) participants.push(redParticipant)

    const blueParticipant = createParticipant(
      grandFinalMatch.blue_corner,
      grandFinalMatch.winner_id
    )
    if (blueParticipant) participants.push(blueParticipant)

    lowerBracket.push({
      id: grandFinalMatch.id,
      name: 'Final',
      tournamentRoundText: 'Final',
      state:
        grandFinalMatch.status === 'SCHEDULED'
          ? 'SCHEDULED'
          : grandFinalMatch.status === 'DONE'
            ? 'DONE'
            : 'SCHEDULED',
      participants: participants
    })
  }

  return {
    upper: upperBracket,
    lower: lowerBracket
  }
}

// Usage example:
// const doubleBracketData = convertToDoubleBracket(yourBracketData);
