import logo from '../../logo.svg';
import './style.css';
import React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ZoomIn from '../../assets/image/zoom-in.svg'
import ZoomOut from '../../assets/image/zoom-out.svg'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listOfImages: [],
      imagePath: '',
      imageData: {},
      height: null,
      width: null,
      back: "<- Back",
      next: "Next ->"
    }
    this.getImageData(props.imageName)
    this.handleZoomIn = this.handleZoomIn.bind(this)
    this.handleZoomOut = this.handleZoomOut.bind(this)

    this.imgRef = React.createRef()
  }

  componentDidMount() {

    this.setState({
      listOfImages: this.props.imageList
    })
    this.getImageData(this.props.imageName)

    this.initialHeight = this.imgRef.current.clientHeight
    this.initialWidth = this.imgRef.current.clientWidth
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.imageName != nextProps.imageName) {
      this.getImageData(nextProps.imageName)
    }
    return true
  }

  getImageData = (imageName) => {
    try {
      this.setState({
        imageData: {}
      }, (res) => {
        axios.get('http://127.0.0.1:5003/image-details/' + imageName).then(
          res => {
            this.setState({
              fileName: imageName,
              imageData: res.data.Data,
              imagePath: res.data.Data['image']

            })
          }
        )
      })

    } catch (error) {

    }
  }

  getNextImageData = (e, imageName) => {
    let imgIndex = this.state.listOfImages.indexOf(imageName)
    if (imgIndex + 1 != this.state.listOfImages.length) {
      this.getImageData(this.state.listOfImages[imgIndex + 1])
    }
  }

  getPreviousImageData = (e, imageName) => {
    let imgIndex = this.state.listOfImages.indexOf(imageName)
    if (imgIndex != 0) {
      this.getImageData(this.state.listOfImages[imgIndex - 1])
    }
  }


  handleChange = (event, keyName) => {
    const { imageData } = this.state
    imageData[keyName] = event.target.value
    this.setState({
      imageData
    })
  }

  saveChange = () => {
    const { imageData } = this.state
    const { fileName } = this.state

    axios.post('http://127.0.0.1:5003/update-detail/' + fileName, imageData).then(
      res => {
      }
    )
  }

  handleZoomIn() {

    this.setState({
      height: this.imgRef.current.clientHeight + 10,
      width: this.imgRef.current.clientWidth + 10,
    })
  }

  handleZoomOut() {

    this.setState({
      height: this.imgRef.current.clientHeight - 10,
      width: this.imgRef.current.clientWidth - 10,
    })
  }


  render() {
    const { imageData } = this.state
    const imgStyle = { height: this.state.height, width: this.state.width }

    return (
      <div className="data-container">
        <div className='image-name'>
          <img className='image-zoom-style' src={ZoomIn} onClick={this.handleZoomIn}></img>&nbsp;&nbsp;&nbsp;
            <img className='image-zoom-style' src={ZoomOut} onClick={this.handleZoomOut}></img>
          <TextField className='file-name-display' id="standard-secondary" label="File Name:" disabled color="secondary" />
          <TextField className='file-value-display' id="standard-secondary" label={this.state.fileName} color="secondary" disabled />
        </div>
        <div className='image-display'>
          <img className='image-view' style={imgStyle} ref={this.imgRef} src={`data:image/jpeg;base64,${this.state.imagePath}`}></img><br></br>
        </div>

        <div className='data-display'><br></br><br></br>
          <label className='key-class'>KEY</label>
          <label className='value-class'>VALUE</label>
          <br></br><br></br>
          {
            delete imageData['image']
          }
          {Object.keys(imageData).map((keyName) =>
            <form> <TextField id="standard-multiline-static" className='key-display' disabled defaultValue={keyName} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <TextField id="standard-read-only-input" className='value-display' defaultValue={imageData[keyName]} onChange={(e) => this.handleChange(e, keyName)} />
              <br></br>
            </form>
          )}<br></br>
          <Button className='save-button' variant="contained" color="primary" onClick={this.saveChange}>Save</Button>
          <div className='back-button'>
            <Button variant="contained" color="primary" onClick={(e) => this.getPreviousImageData(e, this.state.fileName)}>{this.state.back}</Button>
          </div>
          <div className='next-button'>
            <Button variant="contained" color="primary" onClick={(e) => this.getNextImageData(e, this.state.fileName)}>{this.state.next}</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
