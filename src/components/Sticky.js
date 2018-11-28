import React, {Component} from 'react'
import styled from 'styled-components'

import resizeHandle from '../img/resize-handle.png'
import closeIcon from '../img/close.png'

const LEFT_MOUSE_BUTTON = 0
const DEFAULT_MIN_WIDTH = 200
const DEFAULT_MIN_HEIGHT = 100

const Root = styled.div`
  position: absolute;
  background-color: #fbe87c;
  border: 1px solid #cab773;
  display: flex;
  flex-direction: column;
  color: rgba(0, 0, 0, .85);
`

const TopBar = styled.div`
  position: relative;
  height: 16px;
  background-color: #cab773;
  cursor: move;
  user-select: none;
  padding-left: 2px;
  padding-right: 16px;
  font-size: 12px;
  font-weight: bold;
  line-height: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const TitleInput = styled.input.attrs({
  'data-nodrag': true,
  autoFocus: true,
})`
  display: block;
  height: 16px;
  background-color: transparent;
  border: 1px dashed black;
  outline: 0;
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
  font-family: inherit;
  font-size: 14px;
  color: inherit;
`

const CloseButton = styled.button.attrs({
  'data-nodrag': true,
})`
  position: absolute;
  top: 0;
  right: 0;
  height: 16px;
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: 0;
  outline: 0;
  opacity: .5;
  padding: -5px;
  background-image: url(${closeIcon});
  background-position: center;
  background-repeat: no-repeat;
  
  :hover {
    opacity: 1;
  }
`

class Sticky extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editingTitle: false,
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
    const clickedWindowButton = !!e.target.dataset.nodrag
    if (this.state.dragging || e.button !== LEFT_MOUSE_BUTTON || clickedWindowButton) {
      return
    }
    e.preventDefault()

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

  onCloseClick = () => {
    if (window.confirm('Delete sticky? This can\'t be undone!')) {
      this.props.onRequestClose(this.props.details.id)
    }
  }

  startEditTitle = () => {
    this.setState({ editingTitle: true })
  }

  finishEditTitle = () => {
    this.setState({ editingTitle: false })
  }

  onTitleChange = (e) => {
    this.updateDetails({
      title: e.target.value,
    })
  }

  render() {
    const {
      details: {
        title,
        content,
        top,
        left,
        height,
        width
      },
    } = this.props
    const {
      editingTitle,
    } = this.state

    const geometry = { top, left, height, width }

    const textAreaHeight = height - 18 // 16px top bar + 2px of borders

    return (
      <Root style={geometry}>
        <TopBar onMouseDown={this.dragStart} onDoubleClick={this.startEditTitle}>
          {editingTitle
            ? <TitleInput value={title} onChange={this.onTitleChange} onBlur={this.finishEditTitle}/>
            : title}
          <CloseButton onClick={this.onCloseClick}/>
        </TopBar>
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
