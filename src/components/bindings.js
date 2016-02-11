import { connect } from 'react-redux'
import { firebaseToProps } from 'refire'
import isArray from 'lodash/lang/isArray'

function generateProps(storeIds) {
  return (state) => {
    return storeIds.reduce((result, storeId) => {
      return { ...result, [storeId]: state[storeId] }
    }, {})
  }
}

export default function(args = [], mapStateToProps = null, mapDispatchToProps = null) {
  const mapStateToPropsFn = typeof mapStateToProps === "function"
    ? mapStateToProps
    : (isArray(mapStateToProps) ? generateProps(mapStateToProps) : null)

  return WrappedComponent => {
    return connect(firebaseToProps(args, mapStateToPropsFn), mapDispatchToProps)(WrappedComponent)
  }
}
