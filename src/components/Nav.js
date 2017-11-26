import React, { Component } from 'react';

class Nav extends Component {
    constructor(props){
        super(props);
    }
    render() {
        const {changePage} = this.props;
        return <div className="nav">
            <a onClick={() => changePage('color')} className="nav__item">Color</a>
            <a onClick={() => changePage('image')} className="nav__item">Image</a>
            <a onClick={() => changePage('animations')} className="nav__item">Animations</a>
            <a onClick={() => changePage('info')} className="nav__item">Info</a>
        </div>
    }
}

export default Nav;