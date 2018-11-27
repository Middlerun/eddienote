import React, {Component} from 'react'
import styled from 'styled-components'

import resizeHandle from '../img/resize-handle.png'

const LEFT_MOUSE_BUTTON = 0
const DEFAULT_MIN_WIDTH = 200
const DEFAULT_MIN_HEIGHT = 100

const Root = styled.div`
  position: absolute;
  background-color: #fbe87c;
  border: 1px solid #cab773;
  display: flex;
  flex-direction: column;
`

const TopBar = styled.div`
  height: 10px;
  background-color: #cab773;
  cursor: move;
`

const Main = styled.div`
  flex: 1;
`

const ResizeHandle = styled.div`
  background-image: url(${resizeHandle});
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 16px;
  height: 16px;
  cursor: se-resize;
`

const TextArea = styled.textarea`
  resize: none;
  width: 100%;
  background-color: transparent;
  border: 0;
  outline: 0;
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
`

class Sticky extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dragging: false,
      resizing: false,
      dragStart: {},
    }
  }

  updateContent = (e) => {
    this.updateDetails({ content: e.target.value })
  }

  updateDetails(detailsUpdate) {
    this.props.onUpdate({
      ...this.props.details,
      ...detailsUpdate,
    })
  }

  dragStart = (e) => {
    const clickedWindowButton = !!e.target.dataset.button
    if (this.state.dragging || e.button !== LEFT_MOUSE_BUTTON || clickedWindowButton) {
      return
    }

    const mouseCoords = { x: e.screenX, y: e.screenY }
    this.setState({
      dragging: true,
      dragStart: {
        mouseCoords,
        details: this.props.details,
      }
    })

    window.addEventListener('mousemove', this.onDragMove)
    window.addEventListener('mouseup', this.onDragEnd)
  }

  onDragMove = (e) => {
    const { dragStart } = this.state

    const newX = e.screenX
    const newY = e.screenY

    this.updateDetails({
      left: dragStart.details.left + (newX - dragStart.mouseCoords.x),
      top:  dragStart.details.top  + (newY - dragStart.mouseCoords.y),
    })
  }

  onDragEnd = () => {
    this.setState({ dragging: false })

    window.removeEventListener('mousemove', this.onDragMove)
    window.removeEventListener('mouseup', this.onDragEnd)
  }

  resizeStart = (e) => {
    if (this.state.resizing || e.button !== LEFT_MOUSE_BUTTON) {
      return
    }
    e.preventDefault()

    const mouseCoords = { x: e.screenX, y: e.screenY }
    this.setState({
      resizing: true,
      dragStart: {
        mouseCoords,
        details: this.props.details,
      }
    })

    window.addEventListener('mousemove', this.onResizeMove)
    window.addEventListener('mouseup', this.onResizeEnd)
  }

  onResizeMove = (e) => {
    const { minWidth, minHeight } = this.props
    const { dragStart } = this.state

    const newX = e.screenX
    const newY = e.screenY

    const draggedWidth  = dragStart.details.width  + (newX - dragStart.mouseCoords.x)
    const draggedHeight = dragStart.details.height + (newY - dragStart.mouseCoords.y)

    this.updateDetails({
      width: Math.max((minWidth || DEFAULT_MIN_WIDTH), draggedWidth),
      height: Math.max((minHeight || DEFAULT_MIN_HEIGHT), draggedHeight),
    })
  }

  onResizeEnd = () => {
    this.setState({ resizing: false })

    window.removeEventListener('mousemove', this.onResizeMove)
    window.removeEventListener('mouseup', this.onResizeEnd)
  }

  render() {
    const {
      details: {
        content,
        top,
        left,
        height,
        width
      },
    } = this.props

    const geometry = { top, left, height, width }

    const textAreaHeight = height - 12 // 10px top bar + 2px of borders

    return (
      <Root style={geometry}>
        <TopBar onMouseDown={this.dragStart}/>
        <Main>
          <TextArea
            value={content}
            onChange={this.updateContent}
            style={{ height: textAreaHeight }}
          />
        </Main>
        <ResizeHandle onMouseDown={this.resizeStart}/>
      </Root>
    )
  }
}

export default Sticky
