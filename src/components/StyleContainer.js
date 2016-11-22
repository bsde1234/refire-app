import React, { Component } from 'react'
import { wrap } from 'react-free-style'

class StyleRoot extends Component {
  render() {
    return (
      <div className="app-container">
        {this.props.children}
      </div>
    )
  }
}

export default wrap(StyleRoot)
