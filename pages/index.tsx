import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Wheel from "../components/Wheel";

const API_HOST = "https://europe.api.riotgames.com";
const API_KEY = "RGAPI-17ae741a-a2ef-4b93-bf77-9372e2b01b67";
const CHAP_PUUID =
  "b-XsF_M6AvSsyKpGzc5T4jMpCvPocKD1uJfDDdq01ta1sTV0rLZSByuy9wXePcMkChLNp-lrFy_sDA";

const type = "normal"; //let user choose later on ranked|normal|tourney|tutorial

const formatData = (data: any, summoner: any) => {
  console.log(data.info.participants[0].puuid, summoner.name);
  const player = data.info.participants.find(
    (player: any) => player.puuid === summoner.puuid
  );
  const ennemyTeamId = player.teamId === 100 ? 200 : 100;
  const ennemyTeam = data.info.participants.filter(
    (player: any) => player.teamId === ennemyTeamId
  );

  return ennemyTeam.map((player: any) => {
    return {
      role: player.individualPosition,
      roleImg: `/img/roles/${player.individualPosition}_icon.png`,
      championName: player.championName,
      championImg: `/img/champions/${player.championName}.png`,
    };
  });
};

const Home: NextPage = ({ gameData, fetchedSummoner }: any) => {
  const [summonerName, setSummonerName] = useState("chap fill acc");
  const [summoner, setSummoner] = useState(fetchedSummoner);
  const [usableData, setUsableData] = useState(gameData)
  const queueType = "430";

  const onSearch = async () => {
    console.log("searching")
    // const response = await fetch(`/api/searchByName?summonerName=${summonerName}`);
    // const summoner = response.json();
    // console.log(summoner, "!")
    let response = await fetch(
      `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`
    );
    const fetchedSummoner = await response.json();
    setSummoner(fetchedSummoner);

    response = await fetch(
      `${API_HOST}/lol/match/v5/matches/by-puuid/${fetchedSummoner.puuid}/ids?api_key=${API_KEY}&type=${type}&count=1&queue=${queueType}`
    );
    const matches = await response.json();
    const lastMatchId = matches[0];

    response = await fetch(
      `${API_HOST}/lol/match/v5/matches/${lastMatchId}?api_key=${API_KEY}`
    );
    const lastGameData = await response.json();
    console.log(lastGameData, "!!!!!!!!")
    setUsableData(formatData(lastGameData, fetchedSummoner));
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Chaproulette</title>
        <meta name="description" content="De grâce" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Coucou {summoner.name}</h1>
        <br />

        <div className="input-group mb-3" style={{ width: "400px" }}>
          <input
            className="form-control form-control-lg"
            type="text"
            placeholder="chap fill acc"
            aria-label="summonername"
            aria-describedby="button-addon2"
            onChange={(e) => setSummonerName(e.target.value)}
          />
          <button
            className="btn btn-primary"
            type="button"
            id="button-addon2"
            onClick={(_) => onSearch()}
          >
            Load last match
          </button>
        </div>

        <Wheel items={usableData} />
      </main>
    </div>//EUW1_5523329431
  );
};

export async function getStaticProps() {
  const chap_name = "chap fill acc";
  let res = await fetch(
    `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${chap_name}?api_key=${API_KEY}`
  );
  const summoner = await res.json();

  res = await fetch(
    `${API_HOST}/lol/match/v5/matches/by-puuid/${CHAP_PUUID}/ids?api_key=${API_KEY}&type=${type}&count=1`
  );
  const matches = await res.json();

  const lastMatchId = matches[0];
  res = await fetch(
    `${API_HOST}/lol/match/v5/matches/${lastMatchId}?api_key=${API_KEY}`
  );
  const gameData = await res.json();

  return {
    props: { gameData: formatData(gameData, summoner), fetchedSummoner: summoner },
  };
}

export default Home;
