import React from "react"
import Dialog from "material-ui/Dialog"
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton"
import {Icon,Button} from "@material-ui/core"

export default class TimeFormatDialog extends React.Component {
  render() {
    const timeFormatActions = [
      <Button onClick={this.props.handleTimeFormatDialogClose}>Close</Button>,
    ]

    return (
      <Dialog
        title="Change date and time format"
        actions={timeFormatActions}
        open={this.props.timeFormatDialogOpen}
        onRequestClose={this.props.handleTimeFormatDialogClose}
        className="notSelectable defaultCursor"
        contentStyle={{
          width: "350px",
        }}
        bodyStyle={{
          paddingBottom: "0px",
        }}
        titleClassName="notSelectable defaultCursor"
      >
        Date
        <RadioButtonGroup name="date" defaultSelected="dmy">
          <RadioButton
            value="dmy"
            label="DD/MM/YYYY"
            style={{
              marginTop: 12,
              marginBottom: 16,
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
            }
            uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
          />
          <RadioButton
            value="mdy"
            label="MM/DD/YYYY"
            style={{
              marginBottom: 16,
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
            }
            uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
          />
          <RadioButton
            value="ymd"
            label="YYYY/MM/DD"
            style={{
              marginBottom: 16,
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
            }
            uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
          />
          <RadioButton
            value="ydm"
            label="YYYY/DD/MM"
            style={{
              marginBottom: 16,
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
            }
            uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
          />
        </RadioButtonGroup>
        <br />
        Time
        <RadioButtonGroup name="time" defaultSelected="auto">
          <RadioButton
            value="24"
            label="24-hour clock"
            style={{
              marginTop: 12,
              marginBottom: 16,
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
            }
            uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
          />
          <RadioButton
            value="12"
            label="12-hour clock"
            style={{
              marginBottom: 16,
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
            }
            uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
          />
        </RadioButtonGroup>
      </Dialog>
    )
  }
}
