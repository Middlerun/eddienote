import React, { Component } from 'react'

import Sticky from './components/Sticky'

class App extends Component {
  constructor() {
    super()

    this.state = {
      stickies: [
        {
          id: 1,
          content: 'Hello world!',
          top: 10,
          left: 10,
          height: 100,
          width: 200,
        },
      ],
    }
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
