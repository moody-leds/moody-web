import React, { Component } from 'react';
import ColorInput from './ColorInput';
import ImageInput from './ImageInput';
import Info from './Info';
import Animations from './Animations';

class Content extends Component {
    constructor(props){
        super(props);
    }
    render() {
        const {setColor, container} = this.props;
        
        switch(this.props.page){
            case 'color':
                return <ColorInput setColor={setColor} container={container}/>;
            case 'image':
                return <ImageInput setColor={setColor} />;
            case 'animations':
                return <Animations setColor={setColor} container={container} />;
            case 'info':
                return <Info container={container} />;
            default:
                return false;
        }
    }
}

export default Content;