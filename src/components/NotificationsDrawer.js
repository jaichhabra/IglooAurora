import React from "react"
import CenteredSpinner from "./CenteredSpinner"
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  AppBar,
  Typography,
  Icon,
  Badge,
  Tooltip,
  SwipeableDrawer,
  IconButton,
} from "@material-ui/core"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import FlatButton from "material-ui/FlatButton"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import { hotkeys } from "react-keyboard-shortcuts"
import moment from "moment"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#ff4081" },
  },
})

const sleep = time =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), time)
  })

class NotificationsDrawer extends React.Component {
  state = { showVisualized: false }
  hot_keys = {
    "alt+n": {
      priority: 1,
      handler: event => {
        this.props.changeDrawerState()
      },
    },
  }

  componentDidMount() {
    const subscriptionQuery = gql`
      subscription {
        notificationCreated {
          id
          content
          date
          visualized
          device {
            id
          }
        }
      }
    `

    this.props.notifications.subscribeToMore({
      document: subscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newNotifications = [
          ...prev.user.notifications,
          subscriptionData.data.notificationCreated,
        ]
        return {
          user: {
            ...prev.user,
            notifications: newNotifications,
          },
        }
      },
    })

    const updateQuery = gql`
      subscription {
        notificationUpdated {
          id
          content
          date
          visualized
          device {
            id
          }
        }
      }
    `

    this.props.notifications.subscribeToMore({
      document: updateQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newNotification = subscriptionData.data.notificationUpdated

        const newNotifications = prev.user.notifications.map(
          notification =>
            notification.id === newNotification.id
              ? newNotification
              : notification
        )
        return {
          user: {
            ...prev.user,
            notifications: newNotifications,
          },
        }
      },
    })

    const subscribeToNotificationsDeletes = gql`
      subscription {
        notificationDeleted
      }
    `

    this.props.notifications.subscribeToMore({
      document: subscribeToNotificationsDeletes,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newNotifications = prev.user.notifications.filter(
          notification =>
            notification.id !== subscriptionData.data.notificationDeleted
        )

        return {
          user: {
            ...prev.user,
            notifications: newNotifications,
          },
        }
      },
    })
  }

  render() {
    const {
      notifications: { loading, error, user },
    } = this.props

    let clearNotification = id => {
      this.props["ClearNotification"]({
        variables: {
          id: id,
        },
        optimisticResponse: {
          __typename: "Mutation",
          notification: {
            id: id,
            visualized: true,
            __typename: "Notification",
          },
        },
      })
    }

    let markAsUnread = id => {
      this.props["MarkAsUnread"]({
        variables: {
          id: id,
        },
        optimisticResponse: {
          __typename: "Mutation",
          notification: {
            id: id,
            visualized: false,
            __typename: "Notification",
          },
        },
      })
    }

    let deleteNotification = id => {
      this.props["DeleteNotification"]({
        variables: {
          id: id,
        },
        optimisticResponse: {
          __typename: "Mutation",
          deleteNotification: {
            id: id,
            __typename: "Notification",
          },
        },
      })
    }

    let clearAllNotifications = () => {
      const notificationsToFlush = user.notifications.filter(
        notification =>
          notification.device.id === this.props.device.id &&
          notification.visualized === false
      )

      for (let i = 0; i < notificationsToFlush.length; i++) {
        clearNotification(notificationsToFlush[i].id)
      }
    }

    let notifications = ""
    let readNotifications = ""

    let notificationCount = ""

    let noNotificationsUI = ""
    let readNotificationsUI = ""

    if (error) notifications = "Unexpected error"

    if (loading) notifications = <CenteredSpinner />

    if (user) {
      notifications = (
        <List style={{ padding: "0" }}>
          <ReactCSSTransitionGroup
            transitionName="notification"
            transitionEnterTimeout={5000}
            transitionLeaveTimeout={3000}
          >
            {user.notifications &&
              user.notifications
                .filter(
                  notification =>
                    notification.device.id === this.props.device.id
                )
                .filter(notification => notification.visualized === false)
                .map(notification => (
                  <ListItem
                    className="notSelectable"
                    key={notification.id}
                    id={notification.id}
                    onClick={() => clearNotification(notification.id)}
                  >
                    <ListItemText
                      primary={notification.content}
                      secondary={moment
                        .utc(
                          notification.date.split(".")[0],
                          "YYYY-MM-DDTh:mm:ss"
                        )
                        .fromNow()}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        aria-label="Delete"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <i class="material-icons">delete</i>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
                .reverse()}
          </ReactCSSTransitionGroup>
        </List>
      )

      readNotifications = (
        <List style={{ padding: "0" }}>
          <ReactCSSTransitionGroup
            transitionName="notification"
            transitionEnterTimeout={5000}
            transitionLeaveTimeout={3000}
          >
            {user.notifications &&
              user.notifications
                .filter(
                  notification =>
                    notification.device.id === this.props.device.id
                )
                .filter(notification => notification.visualized === true)
                .map(notification => (
                  <ListItem
                    button
                    key={notification.id}
                    className="notSelectable"
                    id={notification.id}
                  >
                    <ListItemText
                      primary={notification.content}
                      secondary={moment
                        .utc(
                          notification.date.split(".")[0],
                          "YYYY-MM-DDTh:mm:ss"
                        )
                        .fromNow()}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        aria-label="Mark as unread"
                        onClick={() => markAsUnread(notification.id)}
                      >
                        <i class="material-icons">markunread</i>
                      </IconButton>
                      <IconButton
                        aria-label="Delete"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <i class="material-icons">delete</i>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
                .reverse()}
          </ReactCSSTransitionGroup>
        </List>
      )

      notificationCount =
        user.notifications &&
        user.notifications
          .filter(
            notification => notification.device.id === this.props.device.id
          )
          .filter(notification => notification.visualized === false).length

      const readNotificationCount =
        user.notifications &&
        user.notifications
          .filter(
            notification => notification.device.id === this.props.device.id
          )
          .filter(notification => notification.visualized === true).length

      if (!notificationCount) {
        noNotificationsUI = (
          <Typography
            variant="headline"
            style={{
              textAlign: "center",
              marginTop: "32px",
              marginBottom: "32px",
            }}
          >
            No new notifications
          </Typography>
        )
      }

      if (readNotificationCount) {
        readNotificationsUI = (
          <FlatButton
            onClick={() => this.props.showHiddenNotifications()}
            label={
              this.props.hiddenNotifications
                ? "Hide read notifications"
                : "Show read notifications"
            }
            icon={
              this.props.hiddenNotifications ? (
                <Icon>keyboard_arrow_up</Icon>
              ) : (
                <Icon>keyboard_arrow_down</Icon>
              )
            }
            fullWidth={true}
            className="divider"
            key="showMoreLessButton"
            style={
              this.props.hiddenNotifications
                ? this.props.nightMode
                  ? { backgroundColor: "#282c34" }
                  : { backgroundColor: "#d4d4d4" }
                : null
            }
          />
        )
      }
    }

    return (
      <React.Fragment>
        <IconButton
          style={{
            padding: "0",
            color: "white",
          }}
          onClick={() => this.props.changeDrawerState()}
        >
          <Tooltip title="Notifications" placement="bottom">
            <MuiThemeProvider theme={theme}>
              {notificationCount ? (
                <Badge badgeContent={notificationCount} color="primary">
                  <Icon>notifications</Icon>
                </Badge>
              ) : (
                <Icon>notifications_none</Icon>
              )}
            </MuiThemeProvider>
          </Tooltip>
        </IconButton>
        <SwipeableDrawer
          variant="temporary"
          anchor="right"
          open={this.props.drawer}
          onClose={async time => {
            this.props.changeDrawerState()
            await sleep(200)
            clearAllNotifications()
          }}
          swipeAreaWidth={0}
          disableBackdropTransition={false}
          disableDiscovery={true}
        >
          <div
            style={
              this.props.nightMode
                ? { background: "#2f333d", height: "100%" }
                : { background: "white", height: "100%" }
            }
          >
            <div>
              <AppBar position="sticky" style={{ height: "64px" }}>
                <div
                  className="notSelectable"
                  style={{
                    height: "64px",
                    backgroundColor: "#0083ff",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    onClick={() => {
                      this.props.changeDrawerState()
                      clearAllNotifications()
                    }}
                    style={{
                      padding: "0",
                      color: "white",
                      marginTop: "auto",
                      marginBottom: "auto",
                      marginLeft: "8px",
                    }}
                  >
                    <Tooltip
                      id="tooltip-bottom"
                      title="Close drawer"
                      placement="bottom"
                    >
                      <Icon>chevron_right</Icon>
                    </Tooltip>
                  </IconButton>

                  <IconButton
                    style={{
                      padding: "0",
                      color: "white",
                      marginTop: "auto",
                      marginBottom: "auto",
                      marginRight: "8px",
                      marginLeft: "auto",
                      float: "right",
                    }}
                  >
                    <Tooltip
                      id="tooltip-bottom"
                      title="Mute device"
                      placement="bottom"
                    >
                      <Icon>notifications_off</Icon>
                    </Tooltip>
                  </IconButton>
                </div>
              </AppBar>
              <div
                className="notSelectable"
                style={{ overflowY: "auto", height: "100%", width: "320px" }}
              >
                {noNotificationsUI}
                {notifications}
                {readNotificationsUI}
                {readNotificationsUI
                  ? this.props.hiddenNotifications
                    ? readNotifications
                    : ""
                  : ""}
              </div>
            </div>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query {
      user {
        id
        notifications {
          id
          content
          date
          visualized
          device {
            id
          }
        }
      }
    }
  `,
  { name: "notifications" }
)(
  graphql(
    gql`
      mutation ClearNotification($id: ID!) {
        notification(id: $id, visualized: true) {
          id
          visualized
        }
      }
    `,
    {
      name: "ClearNotification",
    }
  )(
    graphql(
      gql`
        mutation MarkAsUnread($id: ID!) {
          notification(id: $id, visualized: false) {
            id
            visualized
          }
        }
      `,
      {
        name: "MarkAsUnread",
      }
    )(
      graphql(
        gql`
          mutation DeleteNotification($id: ID!) {
            deleteNotification(id: $id)
          }
        `,
        {
          name: "DeleteNotification",
        }
      )(hotkeys(NotificationsDrawer))
    )
  )
)
