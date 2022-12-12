import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Wheel from "../components/Wheel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
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
const type = "normal";

const formatData = (data: any, summoner: any) => {
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
  // {
  //   value: "450",
  //   name: "ARAAAAAAAAAAM",
  // },
];

const Home: NextPage = ({ gameData, fetchedSummoner }: any) => {
  const [summonerName, setSummonerName] = useState("chap fill acc");
  const [showError, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summoner, setSummoner] = useState(fetchedSummoner);
  const [usableData, setUsableData] = useState(gameData);
  const [queueType, setQueueType] = useState("430");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onSearch();
  }, [queueType]);

  function handleClipboard(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    const tooltip = document.querySelector(".tooltiptextSpecial");

    if (tooltip && !tooltip.classList.contains("tooltip-visible")) {
      tooltip.classList.add("tooltipAnim");
      tooltip.classList.add("tooltip-visible");
      setTimeout(() => {
        if (tooltip) {
          tooltip.classList.remove("tooltip-visible");
          tooltip.classList.remove("tooltipAnim");
        }
      }, 3000);
    }

    const copyText = "0xCC61d2bb1A215f19922eCF81613bEa3253713371";
    navigator.clipboard.writeText(copyText);
  }

  const handleError = (error: string) => {
    setError(error);
    setIsLoading(false);
    setTimeout(() => {
      if (showError !== null && error !== showError) setError(null);
    }, 1000 * 15);
  };

  const onSearch = async () => {
    setIsLoading(true);
    let response = await fetch(
      `/api/searchByName?summonerName=${summonerName}`
    );
    const fetchedSummoner = await response.json();
    setSummoner(fetchedSummoner);
    if (!fetchedSummoner.puuid)
      return handleError(
        "No summoner found, check spelling & make sure this is an EUW account"
      );

    response = await fetch(
      `/api/getMatches?puuid=${fetchedSummoner.puuid}&queue=${queueType}` //&type={type}
    );
    const matches = await response.json();
    if (matches.length <= 0)
      return handleError(
        "No match found, make sure you've set the right game mode"
      );
    const lastMatchId = matches[0];

    response = await fetch(`/api/getMatchData?matchId=${lastMatchId}`);
    const lastGameData = await response.json();
    setUsableData(formatData(lastGameData, fetchedSummoner));
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Chaproulette</title>
        <meta
          name="description"
          content="Hey Chap, i was wondering if you could kiss webcam same time as i do so it's like we eKiss  ? @chap_gg ratirlKiss"
        />
        <meta property="og:title" content="Chaproulette" />
        <meta name="title" content="Chaproulette" />
        <meta
          property="og:description"
          content="Hey Chap, i was wondering if you could kiss webcam same time as i do so it's like we eKiss  ? @chap_gg ratirlKiss"
        />
        <meta name="keywords" content="Chap, jjdr, 0xharb, eKiss" />
        <meta name="author" content="0xharb" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content="/img/ratirlKiss.png" />
      </Head>

      <main className={styles.main} style={{ padding: "30px 0 0 0" }}>
        {open && (
          <div
            onClick={() => setOpen(false)}
            style={{
              backgroundColor: "#070a1269",
              position: "absolute",
              width: "100%",
              height: "101%",
              marginTop: "-20px",
              zIndex: "443",
            }}
          >
            <div
              style={{
                backgroundColor: "#070a12",
                position: "absolute",
                width: "40%",
                height: "50%",
                transform: "translate(75%, 50%)",
                zIndex: "444",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <FontAwesomeIcon
                icon={faCircleXmark}
                fontSize={30}
                color="#456cd1"
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                }}
                onClick={() => setOpen(false)}
              />
              <div
                className="row"
                style={{ padding: "75px 50px", color: "white" }}
              >
                <div
                  className="col-8 "
                  style={{ alignItems: "center", margin: "auto" }}
                >
                  <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
                    About Chaproulette.lol
                  </h1>

                  <p>
                    This is a simple app allowing you to roll for a champion to
                    play, depending on the ennemy team from your last game
                    <br />
                    <br />
                    Simply enter your summoner name (EUW) and select the game
                    mode you want to pull data from, the site will automatically
                    load the wheel with the data
                    <br />
                    <br />
                    When you&apos;re ready, click on the wheel to spin it, GLHF
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {showError && (
          <div
            style={{ position: "absolute", top: "3%", left: "2%" }}
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {showError}
            <button
              onClick={() => setError(null)}
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        )}

        <h1 className={styles.title}>
          &quot;{summoner.name || summonerName}&quot;
        </h1>
        <br />

        <div className="input-group mb-3" style={{ width: "400px" }}>
          <input
            className="form-control form-control-lg"
            type="text"
            placeholder="chap fill acc"
            aria-label="summonername"
            aria-describedby="button-addon2"
            onChange={(e) => setSummonerName(e.target.value)}
            style={{ borderRadius: 0 }}
          />
          <button
            className="btn btn-primary"
            type="button"
            id="button-addon2"
            onClick={(_) => onSearch()}
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              borderRadius: 0,
            }}
          >
            Load / Refresh
            {isLoading && (
              <div
                style={{ marginLeft: "10px" }}
                className="spinner-border text-light"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </button>
        </div>
        <div className="input-group mb-3" style={{ width: "400px" }}>
          <select
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => setQueueType(e.target.value)}
            value={queueType}
            style={{ borderRadius: 0 }}
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              position: "absolute",
              left: "1%",
              bottom: "1.5%",
            }}
          >
            <a
              target="_blank"
              rel="noreferrer"
              href="https://twitter.com/0xharb"
            >
              <Image
                width={50}
                height={50}
                src="/img/ratirlKissMirror.png"
                alt="0xHarb twitter"
              />
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://twitter.com/Chap_GG"
            >
              <Image
                width={50}
                height={50}
                src="/img/chap.png"
                alt="Chap twitter"
              />
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.instagram.com/jjdr___/"
            >
              <Image
                width={50}
                height={50}
                src="/img/ratirlKiss.png"
                alt="jjdr instagram"
              />
            </a>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <ul>
              <li style={{ cursor: "pointer" }} onClick={() => setOpen(true)}>
                <FontAwesomeIcon
                  icon={faCircleQuestion}
                  fontSize={30}
                  color="#456cd1"
                />
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://twitter.com/0xharb"
                >
                  <FontAwesomeIcon
                    icon={faTwitter}
                    fontSize={30}
                    color="#456cd1"
                  />
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://github.com/ablin42"
                >
                  <FontAwesomeIcon
                    icon={faGithub}
                    fontSize={30}
                    color="#456cd1"
                  />
                </a>
              </li>
              <li>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={(e) => handleClipboard(e)}
                >
                  <FontAwesomeIcon
                    icon={faEthereum}
                    fontSize={30}
                    width={30}
                    color="#456cd1"
                  />
                  <div className="tooltipSpecial">
                    <span className="tooltiptextSpecial">
                      Copied to clipboard!
                    </span>
                  </div>
                </span>
              </li>
            </ul>
          </div>
        </footer>
      </main>
    </div>
  );
};
export async function getServerSideProps() {
  const chap_name = "chap fill acc";
  let res = await fetch(
    `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${chap_name}`,
    { headers }
  );
  const summoner = await res.json();

  res = await fetch(
    `${API_HOST}/lol/match/v5/matches/by-puuid/${summoner.puuid}/ids?type=${type}&count=1`,
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
