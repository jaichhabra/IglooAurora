import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import Button from "material-ui-next/Button"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import polarBearWithBucket from "./styles/assets/polarBearWithBucket.svg"
import { Typography } from "material-ui-next"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

export default class Error404 extends Component {
  state = { wannaGoAway: false }

  render() {
    const { wannaGoAway } = this.state

    document.body.style.backgroundColor = "#0057cb"

    if (wannaGoAway) {
      this.setState({ wannaGoAway: false })
      return <Redirect to="/dashboard" />
    }

    return (
      <div
        style={{
          width: "400px",
          height: "100vh",
          margin: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            margin: "auto",
            textAlign: "center",
            width: "400px",
          }}
          className="notSelectable defaultCursor"
        >
          <br />
          <br />
          <Typography variant="display1" style={{ color: "white" }}>
            You seem to be lost
          </Typography>
          <br />
          <br />
          <br />
          <br />
          <img
            alt="Sleeping Polar Bear"
            src={polarBearWithBucket}
            className="notSelectable"
            style={{ height: "300px" }}
          />
          <br />
          <br />
          <br />
          <br />
          <Typography
            variant="headline"
            gutterBottom
            style={{ color: "white" }}
          >
            Click on the button below and we'll take you to a safe place
          </Typography>
          <br />
          <br />
          <br />
          <br />
          <MuiThemeProvider theme={theme}>
            <Button
              variant="raised"
              primary={true}
              onClick={() => this.setState({ wannaGoAway: true })}
              color="primary"
            >
              Take me away!
            </Button>
          </MuiThemeProvider>
          <br />
          <br /> <br />
        </div>
      </div>
    )
  }
}
