import type { NextApiRequest, NextApiResponse } from "next";

const API_HOST = "https://europe.api.riotgames.com";
const API_KEY = process.env.API_KEY;
const headers = {
  "X-Riot-Token": API_KEY,
} as any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { matchId } = req.query;

  const response = await fetch(`${API_HOST}/lol/match/v5/matches/${matchId}`, {
    headers,
  });
  const matchData = await response.json();

  res.status(200).json(matchData);
}
