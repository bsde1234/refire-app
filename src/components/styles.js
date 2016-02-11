import React from 'react'
import { create } from 'react-free-style'

export default (styles, Component) => {
  const Style = create()

  const stylesProp =  Object.keys(styles).reduce((result, id) => {
    return {
      ...result,
      [id]: Style.registerStyle(styles[id])
    }
  }, {})

  class StyledComponent extends React.Component {
    render() {
      return <Component {...this.props} styles={stylesProp} />
    }
  }

  return Style.component(StyledComponent)
}
