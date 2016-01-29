import React from 'react'
import ReactDOM from 'react-dom'

import { syncFirebase, firebaseReducer } from 'refire'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistory, syncParams, routeParamsReducer } from 'react-router-redux-params'

export {
  firebaseToProps, FirebaseLogin, FirebaseOAuth, FirebaseRegistration,
  FirebaseResetPassword, FirebaseWrite, Firebase
} from 'refire'
export { connect } from 'react-redux'
export { bindActionCreators } from 'redux'
export { Link, IndexLink, IndexRedirect, IndexRoute, Redirect, Route } from 'react-router'
export { routeActions } from 'react-router-redux-params'

export { default as bindings } from './components/bindings'

export default function refireApp({ url, bindings, routes, reducers = {} }) {

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
    syncHistory(browserHistory)
  )(createStore)

  const store = createStoreWithMiddleware(
    combineReducers({
      routing: routeParamsReducer,
      firebase: firebaseReducer(bindings),
      ...reducers
    })
  )

  syncParams(store, routes, browserHistory)

  syncFirebase({
    store: store,
    url: url,
    bindings: bindings
  })

  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory}>
        {routes}
      </Router>
    </Provider>
    , document.getElementById('app')
  )
}
