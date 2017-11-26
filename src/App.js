import React, {Component} from 'react';

import Content from './components/Content';
import Nav from './components/Nav';
import Loader from './components/Loader';
import ioClient from 'socket.io-client';
import {config} from './config';

import './assets/css/style.css';

class App extends Component {
    constructor(props){
        super(props);
        
        this.initSocket();
        
        this.state = {
            page: 'color',
            container: [],
            connected: false,
            units: []
        }
    }
    
    changePage = (page) => {
        this.setState({page});
    }
    
    initSocket = () => {
        this.socket = ioClient(config.uri);
        
        this.socket.on('connect', () => {
            this.setState({
                connected: true
            })
            
            this.socket.emit('init');

            this.socket.on('initSuccess', response => {
                this.setState(prev => ({
                    container: [].concat(prev.container, response)
                }));
            });
        });
    }
    
    handleSet = (type, value) => {
        const {units} = this.state;
        units.map(unit => {
            this.socket.emit('set', {
                id: unit,
                type,
                value
            });
        });
    }
    
    handleUnitToggle = (id) => {
        const {units} = this.state;
        const index = units.indexOf(id);
        this.setState({
            units: index > -1 ?
                units.slice(0, index).concat(units.slice(index + 1)) :
                [].concat(units, [id])
        });
    }
    
    render() {
        const {page, container, connected, units} = this.state;
        
        if(!connected){
            return <div className="connection-error">
                <Loader />
                <div>Brak połączenia</div>
            </div>
        }
        
        return <div>
            <Nav changePage={this.changePage} />
            {container.map((item, index) => 
                <div
                    key={index}
                    className={
                        'input btn unit ' +
                        (units.indexOf(item.id) > -1 ? 'unit--selected ' : '')
                    }
                    onClick={() => this.handleUnitToggle(item.id)}
                >
                    {item.id}
                </div>
            )}
            <Content setColor={this.handleSet} page={page} container={container} />
        </div>;
    }
}

export default App;