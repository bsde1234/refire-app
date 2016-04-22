import React from 'react'
import { create } from 'react-free-style'
import hoistNonReactStatics from 'hoist-non-react-statics'

export default (styles, Component) => {
  const Style = create()
  const globalStyles = {}

  function createStyles(styleProps) {
    return Object.keys(styleProps || {}).reduce((result, id) => {
      // register global styles when id is "registerRule"
      if (id === "registerRule") {
        Object.keys(styleProps[id]).forEach((rule) => {
          if (globalStyles[rule]) {
            // remove existing global styles
            const existing = Object.keys(Style._children).filter((childId) => {
              return Style._children[childId].rule === rule
            }).forEach((ruleId) => {
              Style.remove(Style._children[ruleId])
            })
          }
          // merge new global styles with existing styles
          globalStyles[rule] = {...globalStyles[rule], ...styleProps[id][rule]}
          Style.registerRule(rule, globalStyles[rule])
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

  const stylesProp = createStyles(styles)

  class StyledComponent extends React.Component {

    constructor(props) {
      super(props)
      this.state = { userStyles: {} }
    }

    componentWillMount() {
      if (this.props.styles) {
        this.setState({userStyles: createStyles(this.props.styles)})
      }
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.styles !== this.props.styles) {
        this.setState({userStyles: createStyles(nextProps.styles)})
      }
    }

    render() {
      return (
        <Component
          {...this.props}
          styles={concatenateClassnames(stylesProp, this.state.userStyles)}
        />
      )
    }
  }

  return hoistNonReactStatics(
    Style.component(StyledComponent),
    Component
  )
}
