import React, { Component } from 'react'

import Sticky from './components/Sticky'
import uuid from './lib/uuid'

function newSticky() {
  return {
    id: uuid(),
    content: '',
    top: 10,
    left: 10,
    height: 100,
    width: 200,
  }
}

class App extends Component {
  constructor() {
    super()

    this.state = {
      stickies: [newSticky()],
    }
  }

  componentDidMount() {
    window.addEventListener('keypress', this.keyListen)
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.keyListen)
  }

  keyListen = (e) => {
    if (e.ctrlKey && e.key == 'n') {
      this.addSticky(newSticky())
    }
  }

  addSticky(sticky) {
    this.setState(state => ({
        stickies: state.stickies.concat([sticky]),
    }))
  }

  onStickyUpdate = (updatedDetails) => {
    this.setState(state => {
      const index = state.stickies.findIndex(sticky => sticky.id == updatedDetails.id)
      if (index === -1) {
        return null
      } else {
        const newStickies = state.stickies.slice(0, index)
          .concat([updatedDetails])
          .concat(state.stickies.slice(index + 1))
        return {
          stickies: newStickies,
        }
      }
    })
  }

  render() {
    const { stickies } = this.state

    return (
      <div className="App">
        {stickies.map(sticky => (
          <Sticky
            key={sticky.id}
            details={sticky}
            onUpdate={this.onStickyUpdate}
          />
        ))}
      </div>
    )
  }
}

export default App
