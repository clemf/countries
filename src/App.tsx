import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { CountriesProvider, GET_COUNTRIES } from "./api";
import { useQuery } from "@apollo/client";
import { CountriesResponse, Country } from "./types";
import shuffleArray from "./shuffleArray";

const CountriesGame: React.FC<{ countries: Country[] }> = ({ countries }) => {
  const [wonCountries, setWonCountries] = useState<Country[]>([]);
  const [lostCountries, setLostCountries] = useState<Country[]>([]);
  const [remainingCountries, setRemainingCountries] = useState<Country[]>([
    ...countries,
  ]);
  const [currentCountry, setCurrentCountry] = useState<Country>(countries[0]);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [previousCountry, setPreviousCountry] = useState<Country>();
  const [previousResult, setPreviousResult] = useState<boolean>();

  const setupRound = useCallback(() => {
    const shuffledCountries = shuffleArray(remainingCountries).slice(0, 3);
    const selectedCountry = shuffledCountries[0];
    const shuffledOptions = shuffleArray(shuffledCountries).map(
      (country) => country.name
    );

    setCurrentCountry(selectedCountry);
    setCurrentOptions(shuffledOptions);
  }, [setCurrentCountry, setCurrentOptions, remainingCountries]);

  useEffect(() => {
    setupRound();
  }, [setupRound]);

  const checkWin = useCallback(
    (name: string) => () => {
      if (name === currentCountry.name) {
        setWonCountries((prevWinners) => {
          setPreviousResult(true);
          const newWinners = [...prevWinners];
          newWinners.push(currentCountry);
          return newWinners;
        });
      } else {
        setLostCountries((prevLosers) => {
          setPreviousResult(false);
          const newLosers = [...prevLosers];
          newLosers.push(currentCountry);
          return newLosers;
        });
      }
      setRemainingCountries((prevRemaining) =>
        prevRemaining.filter((country) => country.name !== currentCountry.name)
      );
      setPreviousCountry(currentCountry);
      setupRound();
    },
    [
      setWonCountries,
      currentCountry,
      setupRound,
      setLostCountries,
      setPreviousCountry,
      setPreviousResult,
    ]
  );

  return (
    <div className="gameContainer">
      <div className="bigFlag">{currentCountry.emoji}</div>
      <div className="title">Select the country:</div>
      <div className="optionContainer">
        {currentOptions.map((name) => (
          <CountryOption name={name} handler={checkWin(name)} key={name} />
        ))}
      </div>
      <Result isWin={previousResult} country={previousCountry} />
      <ScoreDisplay won={wonCountries} lost={lostCountries} />
    </div>
  );
};

type OptionProps = {
  name: string;
  handler: () => void;
};
const CountryOption: React.FC<OptionProps> = ({ name, handler }) => (
  <div key={name} onClick={handler} className="option">
    {name}
  </div>
);

type ScoreProps = {
  won: Country[];
  lost: Country[];
};
const ScoreDisplay: React.FC<ScoreProps> = ({ won, lost }) => {
  const wonCount = won.length;
  const lostCount = lost.length;
  const totalCount = wonCount + lostCount;
  const percent = (wonCount / totalCount) * 100;
  return (
    <div className="scoreContainer">
      <div className="scoreTitle">
        Your score: {wonCount}/{totalCount}
        <p>{Number(percent || 0).toFixed(2)}%</p>
      </div>
      <div className="scoreTitle">Won:</div>
      <div className="flagScoreContainer">
        {won.map((country) => (
          <div className="smallFlag" key={country.name}>
            {country.emoji}
          </div>
        ))}
      </div>
      <div className="scoreTitle">Lost:</div>
      <div className="flagScoreContainer">
        {lost.map((country) => (
          <div className="smallFlag" key={country.name}>
            {country.emoji}
          </div>
        ))}
      </div>
    </div>
  );
};

type ResultProps = {
  isWin?: boolean;
  country?: Country;
};
const Result: React.FC<ResultProps> = ({ isWin, country }) => {
  if (!country) {
    return <div />;
  }
  const winText = "Correct!";
  const loseText = "Incorrect!";
  const text = isWin ? winText : loseText;
  const className = (isWin ? "resultWin" : "resultLose") + " result";
  return (
    <div className={className}>
      {country.emoji} {country.name}: {text}
    </div>
  );
};

const CountriesApp: React.FC = () => {
  const { loading, error, data } = useQuery<CountriesResponse>(GET_COUNTRIES);

  let content;
  if (loading) content = <p>Loading...</p>;
  if (error) content = <p>Error :(</p>;
  if (data) {
    content = <CountriesGame countries={data.countries} />;
  }

  return <div className="appContainer">{content}</div>;
};

const App: React.FC = () => (
  <CountriesProvider>
    <CountriesApp />
  </CountriesProvider>
);

export default App;
