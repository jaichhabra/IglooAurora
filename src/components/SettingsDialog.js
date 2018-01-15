import React from "react"
import Dialog from "material-ui/Dialog"
import FlatButton from "material-ui/FlatButton"
import RaisedButton from "material-ui/RaisedButton"
import { Tabs, Tab } from "material-ui/Tabs"
import TextField from "material-ui/TextField"
import FontIcon from "material-ui/FontIcon"
import Toggle from "material-ui/Toggle"

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
}

const deleteDialogContentStyle = {
  width: "500px",
}

export default class SettingsDialog extends React.Component {
  state = {
    deleteDialogOpen: false,
    isDeleteDisabled: true,
  }

  handleDeleteDialogOpen = () => {
    this.setState({ deleteDialogOpen: true })
    setTimeout(this.timer, 5000)
  }

  handleDeleteDialogClose = () => {
    this.setState({ deleteDialogOpen: false })
  }

  timer = () => {
    this.setState({ isDeleteDisabled: false })
  }

  render() {
    const actions = [
      <FlatButton label="Discard" />,
      <RaisedButton
        label="Apply"
        primary={true}
        buttonStyle={{ backgroundColor: "#0083ff" }}
      />,
    ]

    const deleteDialogActions = [
      <FlatButton
        label="Discard"
        keyboardFocused={true}
        onClick={this.handleDeleteDialogClose}
      />,
      <RaisedButton
        label="Delete"
        primary={true}
        buttonStyle={{ backgroundColor: "#F44336" }}
        disabled={this.state.isDeleteDisabled}
      />,
    ]

    return (
      <Dialog
        actions={actions}
        modal={false}
        open={this.props.isOpen}
        onRequestClose={this.props.closeSettingsDialog}
        bodyStyle={{ padding: "0" }}
        repositionOnUpdate={true}
        contentStyle={{ width: "600px" }}
      >
        <Tabs>
          <Tab
            icon={<FontIcon className="material-icons">dashboard</FontIcon>}
            label="Interface"
            buttonStyle={{ backgroundColor: "#0083ff" }}
          >
            <div
              style={{
                overflowY: "scroll",
                height: "500px",
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >
              <h2 style={styles.headline}>Tiles</h2>
              Enable advanced options for color selector
              <Toggle
                thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
                trackSwitchedStyle={{ backgroundColor: "#93ceff" }}
                rippleStyle={{ color: "#0083ff" }}
              />
            </div>
          </Tab>
          <Tab
            icon={<FontIcon className="material-icons">account_box</FontIcon>}
            label="Account"
            buttonStyle={{ backgroundColor: "#0083ff" }}
          >
            <div
              style={{
                overflowY: "scroll",
                height: "500px",
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >
              <h2 style={styles.headline}>Change your password</h2>
              <TextField
                hintText="Old Password"
                floatingLabelShrinkStyle={{ color: "#0083ff" }}
                underlineFocusStyle={{ borderColor: "#0083ff" }}
                floatingLabelText="Old Password"
                type="password"
              />
              <br />
              <TextField
                hintText="New Password"
                floatingLabelShrinkStyle={{ color: "#0083ff" }}
                underlineFocusStyle={{ borderColor: "#0083ff" }}
                floatingLabelText="New Password"
                type="password"
              />
              <br />
              <br />
              <RaisedButton
                label="Change password"
                primary={true}
                buttonStyle={{ backgroundColor: "#0083ff" }}
              />
              <br />
              <h2 style={styles.headline}>Two-factor authentication</h2>
              <Toggle
                thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
                trackSwitchedStyle={{ backgroundColor: "#93ceff" }}
                rippleStyle={{ color: "#0083ff" }}
              />
              <h2 style={styles.headline}>Delete your account</h2>
              <RaisedButton
                label="Delete your account"
                primary={true}
                onClick={this.handleDeleteDialogOpen}
                buttonStyle={{ backgroundColor: "#F44336" }}
              />
            </div>
          </Tab>
        </Tabs>
        <Dialog
          title="Are you sure you want to delete your account?"
          actions={deleteDialogActions}
          modal={true}
          open={this.state.deleteDialogOpen}
          contentStyle={deleteDialogContentStyle}
        >
          Lorem Ipsum
        </Dialog>
      </Dialog>
    )
  }
}