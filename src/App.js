import React, { Component } from 'react'

import Sticky from './components/Sticky'
import uuid from './lib/uuid'

const electron = window.require('electron')
const store = electron.remote.getGlobal('store')

const SAVE_DELAY = 3000

function newSticky() {
  return {
    id: uuid(),
    title: '',
    content: '',
    top: 10,
    left: 10,
    height: 100,
    width: 200,
  }
}

function defaultSticky() {
  const sticky = newSticky()
  sticky.content = `Welcome to Eddie Note!
Hide and show notes with Windows key + Spacebar.
Add a new note with Ctrl + N.
To quit the app use the icon in the system tray.`
  sticky.width = 400
  sticky.height = 200
  return sticky
}

class App extends Component {
  constructor() {
    super()

    const stickies = store.get('stickies', [defaultSticky()])

    this.state = { stickies }
    this.saveTimer = null
  }

  componentDidMount() {
    window.addEventListener('keypress', this.keyListen)
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.keyListen)

    if (this.saveTimer) {
      clearTimeout(this.saveTimer)
      this.saveData()
    }
  }

  scheduleDataSave = () => {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer)
      this.saveTimer = null
    }

    this.saveTimer = setTimeout(this.saveData, SAVE_DELAY)
  }

  saveData = () => {
    store.set('stickies', this.state.stickies)
    this.saveTimer = null
  }

  keyListen = (e) => {
    if (e.ctrlKey && e.key === 'n') {
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
      const index = state.stickies.findIndex(sticky => sticky.id === updatedDetails.id)
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
      const index = state.stickies.findIndex(sticky => sticky.id === id)
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
