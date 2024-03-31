declare global {
	declare module "*.wasm?url";

	function _internal_dissectReadWrapper(pullBytes: (n: number) => Uint8Array): Promise<string>;

	namespace Dissect {
		type Entity = {
			name: string;
			id: number;
		};

		type TeamRole = "Attack" | "Defense";
		type WinCondition =
			| "KilledOpponents"
			| "SecuredArea"
			| "DisabledDefuser"
			| "DefusedBomb"
			| "ExtractedHostage"
			| "Time";

		type Team = {
			name: string;
			score: number;
			won: boolean;
			winCondition?: WinCondition;
			role?: TeamRole;
		};

		type Player = {
			id?: bigint;
			profileID?: string;
			username: string;
			teamIndex: number;
			operator: Entity;
			heroName?: number;
			alliance: number;
			roleImage?: number;
			roleName?: string;
			rolePortrait?: number;
			spawn?: string;
		};

		type MatchUpdate = {
			type: Entity;
			username?: string;
			target?: string;
			headshot?: boolean;
			time: string;
			timeInSeconds: number;
			message?: string;
			operator?: Entity;
		};

		type PlayerRoundStats = {
			username: string;
			kills: number;
			died: boolean;
			assists: number;
			headshots: number;
			headshotPercentage: number;
			"1vX"?: number;
		};

		type Replay = {
			gameVersion: string;
			codeVersion: number;
			timestamp: string;
			matchType: Entity;
			map: Entity;
			site?: string;
			recordingPlayerID: bigint;
			recordingProfileID?: string;
			additionalTags: string;
			gamemode: Entity;
			roundsPerMatch: number;
			roundsPerMatchOvertime: number;
			roundNumber: number;
			overtimeRoundNumber: number;
			teams: Team[];
			players: Player[];
			gmSettings: number[];
			playlistCategory?: number;
			matchID: string;
			matchFeedback: MatchUpdate[];
			stats: PlayerRoundStats[];
		};

		type PlayerMatchStats = {
			username: string;
			rounds: number;
			kills: number;
			deaths: number;
			assists: number;
			headshots: number;
			headshotPercentage: number;
		};

		type Match = {
			rounds: Replay[];
			stats: PlayerMatchStats[];
		};

		type ReplayResponse = {
			error?: string;
			data?: Replay;
		};

		type MatchResponse = {
			error?: string;
			data?: Match;
		};
	}
}

export {};
