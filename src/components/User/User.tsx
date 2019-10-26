import React from "react";
import { graphql, createFragmentContainer } from "react-relay";
import { User_user } from "./__generated__/User_user.graphql";
import AccountCircle from "@material-ui/icons/AccountCircle";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

type Props = {
  user: User_user;
};

class TopBar extends React.Component<Props> {
  render() {
    const { login, avatarUrl } = this.props.user;
    return (
      <AppBar position={"static"} style={{ marginBottom: 20 }}>
        <Container maxWidth={"md"}>
          <Toolbar>
            <Typography variant="h6" style={{ flex: 1 }}>
              gh-explorer
            </Typography>
            {avatarUrl ? <Avatar src={String(avatarUrl)} /> : <AccountCircle />}
            <Typography variant="body1" style={{ marginLeft: 8 }}>
              {login}
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }
}

export default createFragmentContainer(TopBar, {
  user: graphql`
    fragment User_user on User {
      email
      id
      login
      avatarUrl
    }
  `
});
