import type { NextApiRequest, NextApiResponse } from "next";

const API_HOST = "https://euw1.api.riotgames.com";
const API_KEY = process.env.API_KEY;
const headers = {
  "X-Riot-Token": API_KEY,
} as any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { summonerName } = req.query;

  const response = await fetch(
    `${API_HOST}/lol/summoner/v4/summoners/by-name/${summonerName}`,
    { headers }
  );
  const summoner = await response.json();

  res.status(200).json(summoner);
}
