import React, { Component } from "react"
import Sidebar from "./components/Sidebar"
import SidebarHeader from "./components/SidebarHeader"
import MainBody from "./components/MainBody"
import MainBodyHeader from "./components/MainBodyHeader"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import SettingsDialog from "./components/settings/SettingsDialog"
import { Offline, Online } from "react-detect-offline"
import "./styles/App.css"
import "./styles/Tiles.css"
import { hotkeys } from "react-keyboard-shortcuts"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Main extends Component {
  state = {
    drawer: false,
    showMainHidden: false,
    hiddenNotifications: false,
    slideIndex: 0,
    areSettingsOpen: false,
  }

  changeDrawerState = () => {
    if (!this.state.areSettingsOpen)
      this.setState(oldState => ({
        drawer: !oldState.drawer,
      }))
  }

  hot_keys = {
    "alt+s": {
      priority: 1,
      handler: event => {
        !this.state.drawer
          ? this.setState(oldState => ({
              showMainHidden: !oldState.showMainHidden,
            }))
          : this.setState(oldState => ({
              hiddenNotifications: !oldState.hiddenNotifications,
            }))
      },
    },
    "alt+1": {
      priority: 1,
      handler: event => {
        if (
          this.props.userData.user.devices[0] &&
          !this.state.areSettingsOpen
        ) {
          this.selectDevice(this.props.userData.user.devices[0].id)
        }
        if (this.state.areSettingsOpen) {
          this.setState({ slideIndex: 0 })
        }
      },
    },
    "alt+2": {
      priority: 1,
      handler: event => {
        if (
          this.props.userData.user.devices[1] &&
          !this.state.areSettingsOpen
        ) {
          this.selectDevice(this.props.userData.user.devices[1].id)
        }
        if (this.state.areSettingsOpen) {
          this.setState({ slideIndex: 1 })
        }
      },
    },
    "alt+3": {
      priority: 1,
      handler: event => {
        if (
          this.props.userData.user.devices[2] &&
          !this.state.areSettingsOpen
        ) {
          this.selectDevice(this.props.userData.user.devices[2].id)
        }
        if (this.state.areSettingsOpen) {
          this.setState({ slideIndex: 2 })
        }
      },
    },
    "alt+4": {
      priority: 1,
      handler: event => {
        if (
          this.props.userData.user.devices[3] &&
          !this.state.areSettingsOpen
        ) {
          this.selectDevice(this.props.userData.user.devices[3].id)
        }
      },
    },
    "alt+5": {
      priority: 1,
      handler: event => {
        if (
          this.props.userData.user.devices[4] &&
          !this.state.areSettingsOpen
        ) {
          this.selectDevice(this.props.userData.user.devices[4].id)
        }
      },
    },
    "alt+6": {
      priority: 1,
      handler: event => {
        if (
          this.props.userData.user.devices[5] &&
          !this.state.areSettingsOpen
        ) {
          this.selectDevice(this.props.userData.user.devices[5].id)
        }
      },
    },
    "alt+7": {
      priority: 1,
      handler: event => {
        if (
          this.props.userData.user.devices[6] &&
          !this.state.areSettingsOpen
        ) {
          this.selectDevice(this.props.userData.user.devices[6].id)
        }
      },
    },
    "alt+8": {
      priority: 1,
      handler: event => {
        if (
          this.props.userData.user.devices[7] &&
          !this.state.areSettingsOpen
        ) {
          this.selectDevice(this.props.userData.user.devices[7].id)
        }
      },
    },
    "alt+9": {
      priority: 1,
      handler: event => {
        if (
          this.props.userData.user.devices[8] &&
          !this.state.areSettingsOpen
        ) {
          this.selectDevice(this.props.userData.user.devices[8].id)
        }
      },
    },
  }

  constructor() {
    super()

    this.state = {
      showHidden: false,
      selectedDevice: null,
      areSettingsOpen: false,
      isTileFullScreen: false,
    }
  }

  selectDevice = id => this.setState({ selectedDevice: id })

  componentDidMount() {
    const subscriptionQuery = gql`
      subscription {
        deviceCreated {
          id
          customName
          icon
          notifications {
            id
            content
            date
            visualized
          }
        }
      }
    `

    this.props.userData.subscribeToMore({
      document: subscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newDevices = [
          ...prev.user.devices,
          subscriptionData.data.deviceCreated,
        ]
        return {
          user: {
            ...prev.user,
            devices: newDevices,
          },
        }
      },
    })
  }

  changeShowHiddenState = () =>
    this.setState(oldState => ({
      showMainHidden: !oldState.showMainHidden,
    }))

  showHiddenNotifications = () =>
    this.setState(oldState => ({
      hiddenNotifications: !oldState.hiddenNotifications,
    }))

  handleSettingsTabChanged = value => {
    this.setState({
      slideIndex: value,
    })
  }

  render() {
    return (
      <MuiThemeProvider>
        <React.Fragment>
        <Online>
          <div className="main">
            <SettingsDialog
              isOpen={this.state.areSettingsOpen}
              closeSettingsDialog={() => {
                this.setState({ areSettingsOpen: false })
              }}
              handleChange={this.handleSettingsTabChanged}
              slideIndex={this.state.slideIndex}
            />
            <div className="invisibleHeader" key="invisibleHeader" />
            <SidebarHeader
              logOut={this.props.logOut}
              key="sidebarHeader"
              openSettingsDialog={() => {
                this.setState({ areSettingsOpen: true })
              }}
              changeSettingsState={() =>
                this.setState(oldState => ({
                  areSettingsOpen: !oldState.areSettingsOpen,
                  drawer: false,
                }))
              }
              selectDevice={id => this.setState({ selectedDevice: id })}
            />
            <div className="sidebar" key="sidebar">
              <Sidebar
                selectDevice={id => this.setState({ selectedDevice: id })}
                selectedDevice={this.state.selectedDevice}
                changeDrawerState={this.changeDrawerState}
              />
            </div>
            {this.state.selectedDevice !== null ? (
              <MainBodyHeader
                deviceId={this.state.selectedDevice}
                key="mainBodyHeader"
                drawer={this.state.drawer}
                changeDrawerState={this.changeDrawerState}
                hiddenNotifications={this.state.hiddenNotifications}
                showHiddenNotifications={this.showHiddenNotifications}
              />
            ) : (
              <div className="mainBodyHeader" key="mainBodyHeader" />
            )}
            {this.state.selectedDevice !== null ? (
              <MainBody
                deviceId={this.state.selectedDevice}
                showHidden={this.state.showMainHidden}
                changeShowHiddenState={this.changeShowHiddenState}
              />
            ) : (
              <div className="mainBody" />
            )}
          </div>
        </Online>
        <Offline key="offlineMainBody">
          <div className="main">
            <div className="invisibleHeader" key="invisibleHeader" />
            <SidebarHeader logOut={this.props.logOut} key="sidebarHeader" />
            <div className="sidebar" key="sidebar" />
            <div className="mainBodyHeader" key="mainBodyHeader" />
            <div className="offlineBody mainBody">
              <font size="6">You are not connected, try again in a while</font>
              <br />
              <br />

              <font size="5">In the meantime, why don't you have a nap?</font>
              <br />
              <img
                alt="Sleeping Polar Bear"
                src="/assets/polarBear.svg"
                width="400"
                height="400"
                className="logo notSelectable"
              />
            </div>
          </div>
        </Offline>
        </React.Fragment>
      </MuiThemeProvider>
    )
  }
}

export default graphql(
  gql`
    query {
      user {
        devices {
          id
          customName
          icon
          notifications {
            id
            content
            date
            visualized
          }
        }
      }
    }
  `,
  { name: "userData" }
)(hotkeys(Main))
