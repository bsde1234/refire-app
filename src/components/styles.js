import React from 'react'
import { create } from 'react-free-style'

export default (styles, Component) => {
  const Style = create()

  function createStyles(styles) {
    return Object.keys(styles).reduce((result, id) => {
      return {
        ...result,
        [id]: Style.registerStyle(styles[id])
      }
    }, {})
  }

  const stylesProp = createStyles(styles)

  class StyledComponent extends React.Component {

    constructor(props) {
      super(props)
      this.state = { userStyles: null }
    }

    componentWillMount() {
      if (this.props.styles) {
        const userStyles = Object.keys(this.props.styles).reduce((result, id) => {
          return {
            ...result,
            [id]: {...styles[id], ...this.props.styles[id]}
          }
        }, {})
        this.setState({userStyles: createStyles(userStyles)})
      }
    }

    render() {
      return (
        <Component
          {...this.props}
          styles={{...stylesProp, ...this.state.userStyles}}
        />
      )
    }
  }

  return Style.component(StyledComponent)
}
