var App = {
    container: [],
    canvas: null,
    file: null,
    colorPage: document.getElementsByClassName('js-page-color')[0],
    imagePage: document.getElementsByClassName('js-page-image')[0],
    inputH: document.getElementsByClassName('js-color-h')[0],
    inputS: document.getElementsByClassName('js-color-s')[0],
    inputL: document.getElementsByClassName('js-color-l')[0],
    colorPreview: document.getElementsByClassName('js-color-example')[0],
    
    init: function() {
        this.initSocket();
        
        this.file = document.getElementsByClassName('js-input')[0];
        this.file.addEventListener('change', this.handleImageChange.bind(this));
        
        this.canvas = document.getElementsByClassName('js-image')[0];
        this.canvas.addEventListener('click', this.handleLineSelect.bind(this));
        
        this.colorPage.style.display = 'block';
        this.imagePage.style.display = 'none';
        
        this.handleColorChange();
    },
    
    getColor: function() {
        const h = this.inputH.value;
        const s = this.inputS.value;
        const l = this.inputL.value;
        
        return "hsl(" + h + ", " + s + "%, " + l + "%)";
    },
    
    handleColorChange: function(e) {
        this.colorPreview.style.backgroundColor = this.getColor();
    },
    
    handleChangePage: function(page) {
        switch(page){
            case 'color':
                this.colorPage.style.display = 'block';
                this.imagePage.style.display = 'none';
                break;
            case 'image':
                this.colorPage.style.display = 'none';
                this.imagePage.style.display = 'block';
                break;
        }
    },
    
    handleLineSelect: function (e) {
        this.countAvg(this.canvas.getContext('2d'), e.layerY);
    },
    
    initSocket: function() {
        this.socket = io(config.uri);
        
        this.socket.on('connect', () => {
            this.socket.emit('init');

            this.socket.on('initSuccess', response => {
                this.container.push(response);
            });
        });
    },
    
    countAvg: function(ctx, line) {
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
                map.push('#' + this.rgbToHex(parseInt(avg[0]), parseInt(avg[1]), parseInt(avg[2])));
            }
            
            this.handleSet(map);
            // x++;
        // }, 1);
    },
    
    handleImageChange: function(e) {
        var ctx = this.canvas.getContext('2d');
        var prev = document.getElementsByClassName('js-image-preview')[0];
        var reader = new FileReader();

        reader.onload = function (e) {
            const url = e.target.result;
            prev.src = url;
            prev.onload = (e) => {
                this.canvas.width = prev.offsetWidth;
                this.canvas.height = prev.offsetHeight;
                ctx.drawImage(prev, 0, 0, prev.offsetWidth, prev.offsetHeight);
                this.countAvg(ctx);
            }
        }.bind(this);

        reader.readAsDataURL(this.file.files[0]);
        
    },
    
    rgbToHex: function(r, g, b) {
        var bin = r << 16 | g << 8 | b;
        return (function(h){
            return new Array(7-h.length).join("0")+h
        })(bin.toString(16).toUpperCase())
    },
    
    hexToRgb: function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    handleSet: function(map) {
        // const col = document.getElementsByClassName('js-color')[0].value;
        this.socket.emit('set', {
            id: 0,
            color: map
        });
    },
    
    handleSetColor: function() {
        this.socket.emit('set', {
            id: 0,
            color: [this.getColor()]
        });
    }
}

App.init();