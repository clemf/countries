import React from "react";
import "./App.css";
import { CountriesProvider, GET_COUNTRIES } from "./api";
import { useQuery } from "@apollo/client";
import { CountriesResponse } from "./types";

const Countries: React.FC = () => {
  const { loading, error, data } = useQuery<CountriesResponse>(GET_COUNTRIES);

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error :(</p>;

  const countries = data.countries.map(({ name, emoji }) => (
    <div key={name}>
      <p>{emoji}</p>
    </div>
  ));

  return <div>{countries}</div>;
};

const App: React.FC = () => (
  <CountriesProvider>
    <Countries />
  </CountriesProvider>
);
export default App;
