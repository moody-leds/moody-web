import React, { Component } from 'react';

class Animations extends Component {
    constructor(props) {
        super(props);
    }
    
    handleAnimationSet = (name) => {
        this.props.setColor();
    }
    
    render() {
        const {container} = this.props;
        return <div>
            <a onClick={() => this.handleAnimationSet('christmas')}>Christmas</a>
        </div>
    }
}

export default Animations;