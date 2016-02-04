import { connect } from 'react-redux'
import { firebaseToProps } from 'refire'
import isArray from 'lodash/lang/isArray'

function generateProps(stores) {
  return (state) => {
    return stores.reduce((result, storeId) => {
      return { ...result, [storeId]: state[storeId] }
    }, {})
  }
}

export default function(args = [], mapStateToProps = null) {
  const mapStateToPropsFn = typeof mapStateToProps === "function"
    ? mapStateToProps
    : (isArray(mapStateToProps) ? generateProps(mapStateToProps) : null)

  return WrappedComponent => {
    return connect(firebaseToProps(args, mapStateToPropsFn))(WrappedComponent)
  }
}
