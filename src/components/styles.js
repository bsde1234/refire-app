import React from 'react'
import { wrap } from 'react-free-style'
import hoistNonReactStatics from 'hoist-non-react-statics'

function createStyles(Style, styleProps) {
  return Object.keys(styleProps || {}).reduce((result, id) => {
    // register global style rules when id is ":global"
    if (id === ":global") {
      Object.keys(styleProps[id]).forEach((rule) => {
        Style.registerRule(rule, styleProps[id][rule])
      })
      return result
    } else {
      return {
        ...result,
        [id]: Style.registerStyle(styleProps[id])
      }
    }
  }, {})
}

function concatenateClassnames(componentStyles, userStyles={}) {
  return Object.keys(componentStyles).reduce((result, id) => {
    return {
      ...result,
      [id]: [componentStyles[id], userStyles[id]].filter(Boolean).join(" ")
    }
  }, {})
}

export default (styles, Component) => {

  class StyledComponent extends React.Component {

    constructor(props) {
      super(props)
      this.state = { styles: {}, userStyles: {} }
    }

    componentWillMount() {
      this.setState({styles: createStyles(this.context.freeStyle, styles)}, () => {
        if (this.props.styles) {
          this.setState({userStyles: createStyles(this.context.freeStyle, this.props.styles)})
        }
      })
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.styles !== this.props.styles) {
        this.setState({userStyles: createStyles(this.context.freeStyle, nextProps.styles)})
      }
    }

    render() {
      return (
        <Component
          {...this.props}
          styles={concatenateClassnames(this.state.styles, this.state.userStyles)}
        />
      )
    }

  }

  StyledComponent.contextTypes = {
    freeStyle: React.PropTypes.object.isRequired
  }

  return hoistNonReactStatics(
    wrap(StyledComponent),
    Component
  )

}
