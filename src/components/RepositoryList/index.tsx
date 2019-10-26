import {RepositoryList_user} from "./__generated__/RepositoryList_user.graphql";
import {RepositoryOrderField} from "./__generated__/RepositoryListQuery.graphql";

import React, {useCallback, useState} from "react";
import {
  createPaginationContainer,
  graphql,
  RelayPaginationProp
} from "react-relay";
import Repository from "../Repository/index";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

type Props = {
  user: RepositoryList_user;
  relay: RelayPaginationProp;
};

function RepositoryList({relay, user}: Props) {
  const sortDirection = "DESC";
  const [sortField, setSortField] = useState<RepositoryOrderField>(
    "STARGAZERS"
  );
  const [nextIsLoading, setNextIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {edges, pageInfo, totalCount} = user.repositories;

  const handleChangeField = useCallback(
    (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      setIsLoading(true);
      const field = e.target.value as RepositoryOrderField;
      setSortField(field);
      relay.refetchConnection(5, () => setIsLoading(false), {
        orderBy: {field, direction: sortDirection}
      });
    },
    []
  );

  const header = (
    <Card style={{marginBottom: 20}}>
      <CardContent>
        <Typography variant="h5" component="h2" style={{marginBottom: 16}}>
          Repositories
        </Typography>
        <FormControl>
          <InputLabel htmlFor="repositories-sort-by">Sort by</InputLabel>
          <Select
            value={sortField}
            onChange={handleChangeField}
            inputProps={{
              id: "repositories-sort-by"
            }}
          >
            <MenuItem value="STARGAZERS">Stargazers</MenuItem>
            <MenuItem value="NAME">Name</MenuItem>
            <MenuItem value="CREATED_AT">Created at</MenuItem>
            <MenuItem value="UPDATED_AT">Updated at</MenuItem>
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );

  const repositories = (
    <Paper style={{marginBottom: 20}}>
      <List>
        {edges?.map(
          (repo, idx) =>
            repo?.node && (
              <div key={repo.node.id}>
                <Repository repository={repo.node}/>
                {idx !== edges.length - 1 && <Divider/>}
              </div>
            )
        )}
      </List>
    </Paper>
  );

  const nextButton = (
    <Card>
      <CardContent>
        <Button
          variant="contained"
          disabled={nextIsLoading}
          onClick={() => {
            setNextIsLoading(true);
            relay.loadMore(5, () => {
              setNextIsLoading(false);
            });
          }}
        >
          {nextIsLoading ? <CircularProgress size={22}/> : "Next"}
        </Button>
        <Typography
          style={{marginLeft: 8}}
          variant={"body1"}
          color={"textSecondary"}
          component="span"
        >
          Shown {edges?.length || 0} of {totalCount}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <div>
      {header}
      {isLoading ? (
        <LinearProgress/>
      ) : (
        <>
          {repositories}
          {pageInfo.hasNextPage && nextButton}
        </>
      )}
    </div>
  );
}

export default createPaginationContainer(
  RepositoryList,
    {
        user: graphql`
            fragment RepositoryList_user on User
            @argumentDefinitions(
                count: { type: "Int", defaultValue: 5 }
                orderBy: { type: "RepositoryOrder" }
                cursor: { type: "String" }
            ) {
                repositories(
                    first: $count
                    after: $cursor
                    orderBy: $orderBy
                    isFork: false
                ) @connection(key: "RepositoryList_repositories") {
                    pageInfo {
                        hasNextPage
                    }
                    edges {
                        node {
                            id
                            ...Repository_repository
                        }
                    }
                    totalCount
                }
            }
        `
    },
    {
      getVariables(props, {count, cursor}, variables) {
        return {
          ...variables,
          count,
          cursor
        };
      },
        query: graphql`
            query RepositoryListQuery(
                $count: Int!
                $cursor: String
                $orderBy: RepositoryOrder
            ) {
                viewer {
                    ...RepositoryList_user
                    @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
                }
            }
        `
    }
);
