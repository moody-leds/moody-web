import React, { Component } from 'react';
import Utils from '../classes/Utils';

class ColorInput extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            color: {h: 0, s: 50, l: 50}
        }
    }
    handleColorChange = (e, item) => {
        this.setState({
            color: Object.assign({}, this.state.color, {
                [item]: e.target.value
            })
        })
    }
    render() {
        const {color} = this.state;
        const {setColor, container} = this.props;
        return <div>
            <div style={{backgroundColor: Utils.getColor(color)}} className="color-example js-color-example input"></div>
            <div className="input--slider">
                <input
                    value={color.h}
                    onInput={e => this.handleColorChange(e, 'h')}
                    onChange={() => {}}
                    className="input js-color-h"
                    type="range" min="0" max="360" step="1" 
                />
            </div>
            <div className="input--slider">
                <input 
                    value={color.s} 
                    onInput={e => this.handleColorChange(e, 's')} 
                    onChange={() => {}} 
                    className="input js-color-s" 
                    type="range" min="0" max="100" step="1" />
            </div>
            <div className="input--slider">
                <input 
                    value={color.l} 
                    onInput={e => this.handleColorChange(e, 'l')} 
                    onChange={() => {}} 
                    className="input js-color-l" 
                    type="range" min="0" max="100" step="1" />
            </div>
            <button className="input btn" onClick={() => setColor('solid', [Utils.getColor(color)])}>Set</button>
        </div>
    }
}

export default ColorInput;