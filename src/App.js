import React, { Component } from 'react'

import Sticky from './components/Sticky'
import uuid from './lib/uuid'

const electron = window.require('electron')
const store = electron.remote.getGlobal('store')

const SAVE_DELAY = 3000

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

    const stickies = store.get('stickies', [newSticky()])

    this.state = { stickies }
    this.saveTimer = null
  }

  componentDidMount() {
    window.addEventListener('keypress', this.keyListen)
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.keyListen)
  }

  scheduleDataSave = () => {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer)
      this.saveTimer = null
    }

    this.saveTimer = setTimeout(() => {
      store.set('stickies', this.state.stickies)
      this.saveTimer = null
    }, SAVE_DELAY)
  }

  keyListen = (e) => {
    if (e.ctrlKey && e.key == 'n') {
      this.addSticky(newSticky())
    }
  }

  addSticky(sticky) {
    this.setState(state => ({
      stickies: state.stickies.concat([sticky]),
    }), this.scheduleDataSave)
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
    }, this.scheduleDataSave)
  }

  onStickyRequestClose = (id) => {
    this.setState(state => {
      const index = state.stickies.findIndex(sticky => sticky.id == id)
      if (index === -1) {
        return null
      } else {
        const newStickies = state.stickies.slice(0, index)
          .concat(state.stickies.slice(index + 1))
        return {
          stickies: newStickies,
        }
      }
    }, this.scheduleDataSave)
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
            onRequestClose={this.onStickyRequestClose}
          />
        ))}
      </div>
    )
  }
}

export default App
