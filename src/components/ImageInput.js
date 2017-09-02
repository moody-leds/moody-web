import React, { Component } from 'react';
import Utils from '../classes/Utils';

class ImageInput extends Component {
    constructor(props){
        super(props);
    }
    handleLineSelect = (e) => {
        this.countAvg(this.canvas.getContext('2d'), e.layerY);
    }
    handleImageChange = (e) => {
        var ctx = this.canvas.getContext('2d');
        var reader = new FileReader();

        reader.onload = function (e) {
            const url = e.target.result;
            this.prev.src = url;
            this.prev.onload = (e) => {
                this.canvas.width = this.prev.offsetWidth;
                this.canvas.height = this.prev.offsetHeight;
                ctx.drawImage(this.prev, 0, 0, this.prev.offsetWidth, this.prev.offsetHeight);
                this.countAvg(ctx);
            }
        }.bind(this);

        reader.readAsDataURL(e.target.files[0]);
        
    }
    countAvg = (ctx, line) => {
        const {setColor} = this.props;
        // var x = 0;
        // setInterval(() => {
            var map = [];
            var y = line ? line : 20;
            for(var j = 0; j < 30; j++){
                const offset = ctx.canvas.width / 30;
                const dist = j * offset;
                var avg = [0,0,0];
                for(var i = dist; i < dist + offset; i++){
                    avg[0] += ctx.getImageData(i, y, 1, 1).data[0];
                    avg[1] += ctx.getImageData(i, y, 1, 1).data[1];
                    avg[2] += ctx.getImageData(i, y, 1, 1).data[2];
                }
                avg[0] /= offset;
                avg[1] /= offset;
                avg[2] /= offset;
                map.push('#' + Utils.rgbToHex(parseInt(avg[0]), parseInt(avg[1]), parseInt(avg[2])));
            }
            
            setColor(map);
            // x++;
        // }, 1);
    }
    render() {
        return <div>
            <input type="file" className="js-input inputfile" id="file" onChange={this.handleImageChange}/>
            <label className="input" htmlFor="file">Choose a picture</label>
            
            <canvas ref={c => this.canvas = c} className="image js-image"></canvas>
            <img ref={c => this.prev = c} className="js-image-preview image-preview" onClick={this.handleLineSelect} />
        </div>
    }
}

export default ImageInput;