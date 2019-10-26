import { AppUserQuery } from "./__generated__/AppUserQuery.graphql";

import React from "react";
import { graphql, QueryRenderer } from "react-relay";

import RepositoryList from "./RepositoryList/index";

import environment from "../environment";
import TopBar from "./User/User";
import LinearProgress from "@material-ui/core/LinearProgress";
import Container from "@material-ui/core/Container";

export default function App() {
  return (
    <QueryRenderer<AppUserQuery>
      environment={environment}
      query={graphql`
        query AppUserQuery($orderBy: RepositoryOrder) {
          viewer {
            ...User_user
            ...RepositoryList_user @arguments(orderBy: $orderBy)
          }
        }
      `}
      variables={{ orderBy: { field: "STARGAZERS", direction: "DESC" } }}
      render={({ error, props }) => {
        if (error) {
          console.error(error);
          return <div>Error!</div>;
        }
        if (!props) {
          return <LinearProgress />;
        }
        return (
          <>
            <TopBar user={props.viewer} />
            <Container maxWidth={"md"} style={{ marginBottom: 20 }}>
              <RepositoryList user={props.viewer} />
            </Container>
          </>
        );
      }}
    />
  );
}
