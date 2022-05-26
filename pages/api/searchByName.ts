// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

const API_HOST = "https://euw1.api.riotgames.com";
const API_KEY = "RGAPI-17ae741a-a2ef-4b93-bf77-9372e2b01b67";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // /lol/summoner/v4/summoners/by-name/{summonerName}
  const summonerName = req.query.summonerName;

  const response = await fetch(
    `${API_HOST}/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`
  );
  const summoner = await response.json();
  console.log(summoner)

  return res.status(200).json(summoner);
}
