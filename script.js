class Utils {
    static getColor = ({h, s, l}) => "hsl(" + h + ", " + s + "%, " + l + "%)";
    
    static rgbToHex = (r, g, b) => {
        var bin = r << 16 | g << 8 | b;
        return (function(h){
            return new Array(7-h.length).join("0")+h
        })(bin.toString(16).toUpperCase())
    }
}
class Info extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {container} = this.props;
        return <div>
            {container.map(item => {
                return <div>{item.id} {item.title}</div>
            })}
        </div>
    }
}

class ColorInput extends React.Component {
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
        const {setColor} = this.props;
        return <div>
            <div style={{backgroundColor: Utils.getColor(color)}} className="color-example js-color-example input"></div>
            <div className="input--slider">
                <input value={color.h} onInput={e => this.handleColorChange(e, 'h')} className="input js-color-h" type="range" min="0" max="360" step="1" />
            </div>
            <div className="input--slider">
                <input value={color.s} onInput={e => this.handleColorChange(e, 's')} className="input js-color-s" type="range" min="0" max="100" step="1" />
            </div>
            <div className="input--slider">
                <input value={color.l} onInput={e => this.handleColorChange(e, 'l')} className="input js-color-l" type="range" min="0" max="100" step="1" />
            </div>
            <button className="input btn" onClick={() => setColor([Utils.getColor(color)])}>Set</button>
        </div>
    }
}

class ImageInput extends React.Component {
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

class Content extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        const {setColor, container} = this.props;
        
        switch(this.props.page){
            case 'color':
                return <ColorInput setColor={setColor}/>;
            case 'image':
                return <ImageInput setColor={setColor} />;
            case 'info':
                return <Info container={container} />;
            default:
                return false;
        }
    }
}

class Nav extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        const {changePage} = this.props;
        return <div className="nav">
            <a onClick={() => changePage('color')} className="nav__item">Color</a>
            <a onClick={() => changePage('image')} className="nav__item">Image</a>
            <a onClick={() => changePage('info')} className="nav__item">Info</a>
        </div>
    }
}

class App extends React.Component {
    constructor(props){
        super(props);
        
        this.initSocket();
        
        this.state = {
            page: 'color',
            container: []
        }
    }
    
    changePage = (page) => {
        this.setState({page});
    }
    
    initSocket = () => {
        this.socket = io(config.uri);
        
        this.socket.on('connect', () => {
            this.socket.emit('init');

            this.socket.on('initSuccess', response => {
                this.setState(prev => ({
                    container: [].concat(prev.container, response)
                }));
            });
        });
    }
    
    handleSet = (color) => {
        this.socket.emit('set', {
            id: 0,
            color: [color]
        });
    }
    
    render() {
        const {page, container} = this.state;
        return <div>
            <Nav changePage={this.changePage} />
            <Content setColor={this.handleSet} page={page} container={container} />
        </div>;
    }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);