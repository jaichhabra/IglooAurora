import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import IconButton from "material-ui/IconButton"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import Tooltip from "material-ui-next/Tooltip"
import NotificationsDrawer from "./NotificationsDrawer"
import Icon from "material-ui-next/Icon"

class MainBodyHeader extends Component {
  state = {
    open: false,
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    const actions = [<Button onClick={this.handleClose}>Close</Button>]

    const { loading, error, device } = this.props.data
    if (loading) {
      return <div className="mainBodyHeader" />
    }

    if (error) {
      console.error(error)
      return <div className="mainBodyHeader" />
    }

    return (
      <React.Fragment>
        <div className="mobileMainBodyHeader notSelectable">
          <IconButton
            className="mobileBackIcon"
            style={{
              width: "32px",
              height: "32px",
              color: "white",
              verticalAlign: "middle",
              lineHeight: "60px",
              textAlign: "center",
            }}
            onClick={() => this.props.selectDevice(null)}
          >
            <Tooltip id="tooltip-bottom" title="Back" placement="bottom">
              <Icon>arrow_back_ios</Icon>
            </Tooltip>
          </IconButton>
          {device.icon ? (
            <img
              className="mobileDeviceIconBig"
              src={device.icon}
              alt="device logo"
            />
          ) : (
            <i
              className="mobileDeviceIconBig material-icons"
              style={{ cursor: "default" }}
            >
              lightbulb_outline
            </i>
          )}
          <p className="title" style={{ cursor: "default" }}>
            {device.customName}
          </p>
          <div className="mainBodyHeaderIcon">
            <IconButton
              className="mainBodyHeaderIcon"
              style={{
                padding: "0",
                margin: "0 4px 0 4px",
                width: "32px",
                height: "32px",
              }}
            >
              <Tooltip
                id="tooltip-bottom"
                title="See on the map"
                placement="bottom"
              >
                <Icon>place</Icon>
              </Tooltip>
            </IconButton>
            <IconButton
              className="mainBodyHeaderIcon"
              style={{
                padding: "0",
                margin: "0 4px 0 4px",
                width: "32px",
                height: "32px",
              }}
              onClick={() => this.setState({ infoOpen: true })}
            >
              <Tooltip
                id="tooltip-bottom"
                title="Device information"
                placement="bottom"
              >
                <Icon>info</Icon>
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={this.handleOpen}
              className="mainBodyHeaderIcon"
              style={{
                padding: "0",
                margin: "0 4px 0 4px",
                width: "32px",
                height: "32px",
              }}
            >
              <Tooltip
                id="tooltip-bottom"
                title="Rearrange cards"
                placement="bottom"
              >
                <Icon>mode_edit</Icon>
              </Tooltip>
            </IconButton>
            <NotificationsDrawer
              device={device}
              drawer={this.props.drawer}
              changeDrawerState={this.props.changeDrawerState}
              hiddenNotifications={this.props.hiddenNotifications}
              showHiddenNotifications={this.props.showHiddenNotifications}
              nightMode={this.props.nightMode}
            />
          </div>
        </div>
        <Dialog
          title="Rearrange cards"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          className="notSelectable"
        >
          [FILL WITH DRAG 'N' DROPPABLE LIST]
        </Dialog>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query($id: ID!) {
      device(id: $id) {
        id
        customName
        icon
      }
    }
  `,
  {
    options: ({ deviceId }) => ({
      variables: {
        id: deviceId,
      },
    }),
  }
)(MainBodyHeader)
