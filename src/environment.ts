import {
  Environment,
  Network,
  RecordSource,
  Store,
  RequestParameters,
  Variables
} from "relay-runtime";

function fetchQuery(operation: RequestParameters, variables: Variables) {
  return fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`
    },
    body: JSON.stringify({
      query: operation.text,
      variables
    })
  }).then(response => {
    return response.json();
  });
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource())
});

export default environment;
