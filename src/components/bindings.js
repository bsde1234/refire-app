import { connect } from 'react-redux'
import { firebaseToProps } from 'refire'

export default function(...args) {
  return WrappedComponent => {
    return connect(firebaseToProps(args))(WrappedComponent)
  }
}
