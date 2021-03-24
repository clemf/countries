import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { CountriesProvider, GET_COUNTRIES } from "./api";
import { useQuery } from "@apollo/client";
import { CountriesResponse, Country } from "./types";

// copied from here: https://gist.github.com/nikolas/96586a0b56f53eabfd6fe4ed59fecb98
const shuffleArray = (array: Array<any>) => {
  const a = array.slice();

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
};

type CountryProps = {
  name: string;
  handler: () => void;
};
const CountryOption: React.FC<CountryProps> = ({ name, handler }) => (
  <div key={name} onClick={handler} className="countryOption">
    {name}
  </div>
);

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

const CountriesGame: React.FC<{ countries: Country[] }> = ({ countries }) => {
  const [wonCountries, setWonCountries] = useState<Country[]>([]);
  const [remainingCountries, setRemainingCountries] = useState<Country[]>([
    ...countries,
  ]);
  const [currentCountry, setCurrentCountry] = useState<Country>(countries[0]);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);

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
          const newWinners = [...prevWinners];
          newWinners.push(currentCountry);
          return newWinners;
        });
        setRemainingCountries((prevRemaining) =>
          prevRemaining.filter(
            (country) => country.name !== currentCountry.name
          )
        );
      } else {
        //lose
      }
      setupRound();
    },
    [setWonCountries, currentCountry, setupRound]
  );

  return (
    <>
      <div className="bigFlag">{currentCountry.emoji}</div>
      <div className="options">
        {currentOptions.map((name) => (
          <CountryOption name={name} handler={checkWin(name)} key={name} />
        ))}
      </div>
      <br />
      <div className="wonCountries">
        {wonCountries.map((country) => country.name)}
      </div>
    </>
  );
};

const App: React.FC = () => (
  <CountriesProvider>
    <CountriesApp />
  </CountriesProvider>
);

export default App;
