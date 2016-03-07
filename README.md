# refire-app

> Opinionated wrapper for quick prototyping with React, Redux and Firebase

## Usage

```js
import refireApp, { IndexRoute, Route } from 'refire-app'

import App from './components/App'
import Index from './components/Index'
import Board from './components/Board'
import Profile from './components/Profile'

const url = 'https://yourapp.firebaseio.com/'

const bindings = {
  "board": {
    type: "Object",
    path: (state) => {
      return state.routing.params.boardId
        ? `boards/${state.routing.params.boardId}`
        : null    
    }
  },
  "boardThreads": {
    type: "Array",
    path: (state) => {
      return state.routing.params.boardId
        ? `boards/${state.routing.params.boardId}/threads`
        : null
    },
    populate: (key) => `threads/${key}`
  },
  "profile": {
    type: "Object",
    path: (state) => {
      return state.routing.params.uid
        ? `users/${state.routing.params.uid}`
        : null
    }
  }
}

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Index} />
    <Route path="board/:boardId" component={Board} />
    <Route path="profile/:uid" component={Profile} />
  </Route>
)

refireApp({ url, bindings, routes })

```

## refireApp(options={})

Initializes redux, react-router, react-router-redux-params and refire.

### options

**url** *Firebase app url*

**bindings** *Refire bindings*

**routes** *React Router routes*

**reducers = {}** *Additional redux reducers*

**middleware = []** *Additional redux middleware*

**history = browserHistory** *Which type of history react-router should use*

**elementId = 'app'** *DOM element id for your app*

## Components

### bindings([])

```js
import React, { Component } from 'react'
import { bindings } from 'refire-app'
class YourComponent extends Component {
  render() {
    // board & boardThreads data available as props, re-rendered automatically as data changes
  }
}
export default bindings(["board", "boardThreads"])(YourComponent)
```

### styles({})

Wrapper for [react-free-style](https://github.com/blakeembrey/react-free-style), your styles will be automatically inserted to a style tag at app's root level with unique classnames.

```js
import React, { Component } from 'react'
import { styles } from 'refire-app'
class YourComponent extends Component {
  render() {
    const { styles } = this.props
    return (
      <div className={styles.container}>
        ...
      </div>
    )
  }
}
export default styles({
  container: {
    padding: "30px 0"
  }
}, YourComponent)
```

## Exports

### [refire](https://github.com/hoppula/refire)
* firebaseToProps
* FirebaseLogin
* FirebaseLogout
* FirebaseOAuth
* FirebaseRegistration
* FirebaseResetPassword
* FirebaseWrite
* [Firebase](https://www.npmjs.com/package/firebase)
* USER_AUTHENTICATED
* USER_UNAUTHENTICATED

### [react-redux](https://github.com/reactjs/react-redux)
* connect

### [redux](https://github.com/reactjs/redux)
* bindActionCreators

### [react-router](https://github.com/reactjs/react-router)
* Link
* IndexLink
* IndexRedirect
* IndexRoute
* Redirect
* Route
* browserHistory
* hashHistory

### [react-router-redux-params](https://github.com/hoppula/react-router-redux-params)
* routeActions

### [react-free-style](https://github.com/blakeembrey/react-free-style)
* create (as createStyles)

## Real world example

[refire-forum](https://github.com/hoppula/refire-forum) is built with refire-app.

[Live demo](https://refire.firebaseapp.com/)

## License

MIT
