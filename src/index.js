import React from "react"
import ReactDOM from "react-dom"

import { syncFirebase, firebaseReducer, firebaseActions } from "refire"
import { Provider } from "react-redux"
import { createStore, applyMiddleware, combineReducers } from "redux"
import thunk from "redux-thunk"
import { Router, Route, browserHistory } from "react-router"
import {
  syncHistory,
  syncParams,
  routeParamsReducer
} from "react-router-redux-params"

import StyleContainer from "./components/StyleContainer"

export { firebase } from "refire"
import { RefireProvider } from "refire-react"
export {
  firebaseToProps,
  FirebaseLogin,
  FirebaseLogout,
  FirebaseOAuth,
  FirebaseRegistration,
  FirebaseResetPassword,
  FirebaseWrite,
  RefireProvider,
  Bind
} from "refire-react"
export { connect } from "react-redux"
export { bindActionCreators } from "redux"
export {
  Link,
  IndexLink,
  IndexRedirect,
  IndexRoute,
  Redirect,
  Route,
  browserHistory,
  hashHistory
} from "react-router"
export { routeActions } from "react-router-redux-params"
export { create as createStyles } from "react-free-style"

const { USER_AUTHENTICATED, USER_UNAUTHENTICATED } = firebaseActions
export { USER_AUTHENTICATED, USER_UNAUTHENTICATED }

export { default as bindings } from "./components/bindings"
export { default as styles } from "./components/styles"

export default function refireApp({
  apiKey,
  projectId,
  bindings,
  routes,
  pathParams,
  onAuth,
  reducers = {},
  middleware = [],
  history = browserHistory,
  elementId = "app"
}) {
  if (typeof projectId === "undefined") {
    throw new Error("refire-app: no projectId provided")
  }

  if (typeof apiKey === "undefined") {
    throw new Error("refire-app: no apiKey provided")
  }

  if (typeof url !== "undefined") {
    throw new Error(
      "refire-app: url is deprecated in options, use projectId & apiKey instead"
    )
  }

  if (typeof bindings === "undefined") {
    throw new Error("refire-app: No bindings provided")
  }

  if (typeof routes === "undefined") {
    throw new Error("refire-app: No react-router routes provided")
  }

  const createStoreWithMiddleware = applyMiddleware(
    ...middleware,
    thunk,
    syncHistory(history)
  )(createStore)

  const componentBindings = React.isValidElement(bindings)
  const syncBindings = componentBindings ? {} : bindings

  const store = createStoreWithMiddleware(
    combineReducers({
      routing: routeParamsReducer,
      firebase: firebaseReducer(syncBindings),
      ...reducers
    })
  )

  syncParams(store, routes, history)

  const sync = syncFirebase({
    apiKey: apiKey,
    projectId: projectId,
    store: store,
    bindings: syncBindings,
    pathParams: pathParams,
    onAuth: onAuth
  })

  ReactDOM.render(
    <RefireProvider syncFirebase={sync}>
      <Provider store={store}>
        <StyleContainer>
          {componentBindings && bindings}
          <Router history={history}>{routes}</Router>
        </StyleContainer>
      </Provider>
    </RefireProvider>,
    document.getElementById(elementId)
  )

  return store
}
