import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Wheel from "../components/Wheel";

const API_HOST = "https://europe.api.riotgames.com";
const API_KEY = "RGAPI-17ae741a-a2ef-4b93-bf77-9372e2b01b67";
const CHAP_PUUID =
  "b-XsF_M6AvSsyKpGzc5T4jMpCvPocKD1uJfDDdq01ta1sTV0rLZSByuy9wXePcMkChLNp-lrFy_sDA";

const Home: NextPage = ({ gameData }: any) => {
  const chap = gameData.info.participants.find(
    (player: any) => player.puuid === CHAP_PUUID
  );
  const ennemyTeamId = chap.teamId === 100 ? 200 : 100;
  const ennemyTeam = gameData.info.participants.filter(
    (player: any) => player.teamId === ennemyTeamId
  );
  const data = ennemyTeam.map((player: any) => {
    return {
      role: player.individualPosition,
      roleImg: `/img/roles/${player.individualPosition}_icon.png`,
      championName: player.championName,
      championImg: `/img/champions/${player.championName}.png`,
    };
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Chaproulette</title>
        <meta name="description" content="Agligli issou la chancla" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Coucou chapito</h1>
        <Wheel items={data} />
      </main>
    </div>
  );
};

export async function getServerSideProps() {
  // /lol/summoner/v4/summoners/by-name/{summonerName}
  // get puuid

  const type = "normal"; //let user choose later on ranked|normal|tourney|tutorial

  let res = await fetch(
    `${API_HOST}/lol/match/v5/matches/by-puuid/${CHAP_PUUID}/ids?api_key=${API_KEY}&type=${type}&count=1`
  );
  const matches = await res.json();

  const lastMatchId = matches[0];
  res = await fetch(
    `${API_HOST}/lol/match/v5/matches/${lastMatchId}?api_key=${API_KEY}`
  );
  const gameData = await res.json();

  return {
    props: { gameData },
  };
}

export default Home;
