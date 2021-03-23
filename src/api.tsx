import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { gql } from "@apollo/client";

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://countries.trevorblades.com",
});

export const GET_COUNTRIES = gql`
  {
    countries {
      name
      emoji
    }
  }
`;

export const CountriesProvider: React.FC = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
