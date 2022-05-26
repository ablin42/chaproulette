import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Wheel from "../components/Wheel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGithub,
  faEthereum,
} from "@fortawesome/free-brands-svg-icons";

const API_HOST = "https://europe.api.riotgames.com";
const API_KEY = process.env.API_KEY;
const headers = {
  "X-Riot-Token": API_KEY,
} as any;
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

const selectOptions = [
  {
    value: "400",
    name: "5v5 Draft Pick",
  },
  {
    value: "420",
    name: "5v5 Ranked Solo",
  },
  {
    value: "430",
    name: "5v5 Blind Pick",
  },
  {
    value: "440",
    name: "5v5 Ranked Flex",
  },
  {
    value: "450",
    name: "ARAAAAAAAAAAM",
  },
];

const Home: NextPage = ({ gameData, fetchedSummoner }: any) => {
  const [summonerName, setSummonerName] = useState("chap fill acc");
  const [summoner, setSummoner] = useState(fetchedSummoner);
  const [usableData, setUsableData] = useState(gameData);
  const [queueType, setQueueType] = useState("430");

  useEffect(() => {
    onSearch();
  }, [queueType]);

  const onSearch = async () => {
    let response = await fetch(
      `/api/searchByName?summonerName=${summonerName}`
    );
    const fetchedSummoner = await response.json();
    setSummoner(fetchedSummoner);

    response = await fetch(
      `/api/getMatches?puuid=${fetchedSummoner.puuid}&type=${type}&queue=${queueType}`
    );
    const matches = await response.json();
    const lastMatchId = matches[0];

    response = await fetch(`/api/getMatchData?matchId=${lastMatchId}`);
    const lastGameData = await response.json();
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

      <main className={styles.main} style={{ padding: "30px 0 0 0" }}>
        <h1 className={styles.title}>"{summoner.name}"</h1>
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
            Load / Refresh
          </button>
        </div>
        <div className="input-group mb-3" style={{ width: "400px" }}>
          <select
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => setQueueType(e.target.value)}
            value={queueType}
          >
            {selectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <Wheel items={usableData} />

        <footer>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <a href="https://twitter.com/0xharb">
              <Image width={50} height={50} src="/img/ratirlKissMirror.png" />
            </a>
            <a href="https://twitter.com/Chap_GG">
              <Image width={50} height={50} src="/img/chap.png" />
            </a>
            <a href="https://www.instagram.com/jjdr___/">
              <Image width={50} height={50} src="/img/ratirlKiss.png" />
            </a>
          </div>
          {/* <div style={{ display: "flex", justifyContent: "center" }}>
            <ul>
              <li>
                <a href="https://twitter.com/0xharb">
                  <FontAwesomeIcon
                    icon={faTwitter}
                    fontSize={30}
                    color="#456cd1"
                  />
                </a>
              </li>
              <li>
                <a href="https://github.com/ablin42">
                  <FontAwesomeIcon
                    icon={faGithub}
                    fontSize={30}
                    color="#456cd1"
                  />
                </a>
              </li>
              <li>
                <a href="#">
                  <FontAwesomeIcon
                    icon={faEthereum}
                    fontSize={30}
                    width={30}
                    color="#456cd1"
                  />
                </a>
              </li>
            </ul>
            </div> */}

            {/* <span>
              <FontAwesomeIcon
                icon={faEthereum}
                fontSize={30}
                color="#456cd1"
              />{" "}
              (ETH/ERC-20): 0xCC61d2bb1A215f19922eCF81613bEa3253713371
            </span> */}
        </footer>
      </main>
    </div>
  );
};
export async function getStaticProps() {
  const chap_name = "chap fill acc";
  let res = await fetch(
    `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${chap_name}`,
    { headers }
  );
  const summoner = await res.json();

  res = await fetch(
    `${API_HOST}/lol/match/v5/matches/by-puuid/${CHAP_PUUID}/ids?type=${type}&count=1`,
    { headers }
  );
  const matches = await res.json();

  const lastMatchId = matches[0];
  res = await fetch(`${API_HOST}/lol/match/v5/matches/${lastMatchId}`, {
    headers,
  });
  const gameData = await res.json();

  return {
    props: {
      gameData: formatData(gameData, summoner),
      fetchedSummoner: summoner,
    },
  };
}

export default Home;
