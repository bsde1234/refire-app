import React from 'react'
import ReactDOM from 'react-dom'

import { syncFirebase, firebaseReducer, firebaseActions } from 'refire'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistory, syncParams, routeParamsReducer } from 'react-router-redux-params'

import StyleContainer from './components/StyleContainer'

export {
  firebaseToProps, FirebaseLogin, FirebaseOAuth, FirebaseRegistration,
  FirebaseResetPassword, FirebaseWrite, Firebase
} from 'refire'
export { connect } from 'react-redux'
export { bindActionCreators } from 'redux'
export { Link, IndexLink, IndexRedirect, IndexRoute, Redirect, Route, browserHistory, hashHistory } from 'react-router'
export { routeActions } from 'react-router-redux-params'
export { create as createStyles } from 'react-free-style'

const { USER_AUTHENTICATED, USER_UNAUTHENTICATED } = firebaseActions
export { USER_AUTHENTICATED, USER_UNAUTHENTICATED }

export { default as bindings } from './components/bindings'
export { default as styles } from './components/styles'

export default function refireApp({
  url,
  bindings,
  routes,
  reducers = {},
  history = browserHistory,
  elementId = 'app'
}) {

  if (typeof url !== "string") {
    throw new Error("refire-app: No Firebase url provided in options")
  }

  if (typeof bindings === "undefined") {
    throw new Error("refire-app: No bindings provided")
  }

  if (typeof routes === "undefined") {
    throw new Error("refire-app: No react-router routes provided")
  }

  const createStoreWithMiddleware = applyMiddleware(
    thunk,
    syncHistory(history)
  )(createStore)

  const store = createStoreWithMiddleware(
    combineReducers({
      routing: routeParamsReducer,
      firebase: firebaseReducer(bindings),
      ...reducers
    })
  )

  syncParams(store, routes, history)

  syncFirebase({
    store: store,
    url: url,
    bindings: bindings
  })

  ReactDOM.render(
    <Provider store={store}>
      <StyleContainer>
        <Router history={history}>
          {routes}
        </Router>
      </StyleContainer>
    </Provider>
    , document.getElementById(elementId)
  )

  return store
}
