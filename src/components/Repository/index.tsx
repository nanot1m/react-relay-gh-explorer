import {Repository_repository} from "./__generated__/Repository_repository.graphql";

import React from "react";
import {createFragmentContainer, graphql} from "react-relay";
import StarIcon from "@material-ui/icons/Star";

import Badge from '@material-ui/core/Badge';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

type Props = {
  repository: Repository_repository;
};

const Repository: React.FC<Props> = props => {
  const {
    name,
    createdAt,
    description,
    stargazers,
    updatedAt
  } = props.repository;
  return (
    <ListItem>
      <ListItemIcon>
        <Badge badgeContent={stargazers.totalCount} color={"secondary"}>
          <StarIcon/>
        </Badge>
      </ListItemIcon>
      <ListItemText
        primary={name}
        secondary={
          <>
            <Typography component="div" variant="body2" color="textPrimary">
              {description}
            </Typography>
            Created at: {new Date(String(createdAt)).toLocaleDateString()}
            <br/>
            Updated at: {new Date(String(updatedAt)).toLocaleString()}
          </>
        }
      />
    </ListItem>
  );
};

export default createFragmentContainer(Repository, {
    repository: graphql`
        fragment Repository_repository on Repository {
            name
            stargazers {
                totalCount
            }
            createdAt
            updatedAt
            description
        }
    `
});
