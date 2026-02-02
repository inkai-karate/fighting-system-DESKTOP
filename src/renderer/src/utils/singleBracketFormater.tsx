import type { IBracket } from '@interface/bracket.interface'
import type { IMatch } from '@interface/match.interface'
import type { IParticipant } from '@interface/participant.interface'
import { formatDateTime } from './myFunctions'

interface ConvertedMatch {
  id: number
  name: string
  nextMatchId: number | null
  tournamentRoundText: string
  startTime: string
  state: string
  participants: ConvertedParticipant[]
}

interface ConvertedParticipant {
  id: string
  resultText: string | null
  isWinner: boolean
  status: string | null
  name: string
}

export function convertToSingleBracket(bracketData: IBracket): ConvertedMatch[] {
  const { matches } = bracketData

  // Helper function to determine next match ID
  const getNextMatchId = (currentMatch: IMatch): number | null => {
    const { round_number, match_number } = currentMatch

    // Find the match in the next round that this match feeds into
    const nextRoundMatch = matches.find(
      (m) => m.round_number === round_number + 1 && m.match_number === Math.ceil(match_number / 2)
    )

    return nextRoundMatch ? nextRoundMatch.id : null
  }

  // Helper function to create participant object
  const createParticipant = (
    corner: IParticipant | null | undefined,
    winnerId: number | null
  ): ConvertedParticipant | null => {
    if (!corner) return null

    const isWinner = winnerId === corner.id

    return {
      id: corner.uuid,
      resultText: winnerId ? (isWinner ? 'Won' : 'Lost') : null,
      isWinner: isWinner,
      status: winnerId ? 'PLAYED' : null,
      name: corner.full_name
    }
  }

  // Helper function to get round name
  const getRoundName = (roundNumber: number, matchNumber: number, totalRounds: number): string => {
    const roundsFromEnd = totalRounds - roundNumber

    if (roundsFromEnd === 0) {
      return 'Final'
    } else if (roundsFromEnd === 1) {
      return `Semi Final - Match ${matchNumber}`
    } else if (roundsFromEnd === 2) {
      return `Quarter Final - Match ${matchNumber}`
    } else {
      return `Round ${roundNumber} - Match ${matchNumber}`
    }
  }

  // Get total number of rounds
  const totalRounds = Math.max(...matches.map((m) => m.round_number))

  // Convert matches
  const convertedMatches: ConvertedMatch[] = matches.map((match) => {
    const participants: ConvertedParticipant[] = []

    // Add red corner participant
    const redParticipant = createParticipant(match.red_corner, match.winner_id)
    if (redParticipant) participants.push(redParticipant)

    // Add blue corner participant
    const blueParticipant = createParticipant(match.blue_corner, match.winner_id)
    if (blueParticipant) participants.push(blueParticipant)

    return {
      id: match.id,
      name: getRoundName(match.round_number, match.match_number, totalRounds),
      nextMatchId: getNextMatchId(match),
      tournamentRoundText: match.round_number.toString(),
      startTime: (match.start_time && formatDateTime(match.start_time)) || '',
      state:
        match.status === 'SCHEDULED' ? 'SCHEDULED' : match.status === 'DONE' ? 'DONE' : 'SCHEDULED',
      participants: participants
    }
  })

  return convertedMatches
}

// Usage example:
// const singleBracketData = convertToSingleBracket(yourBracketData);
