class Utils {
    static getColor = ({h, s, l}) => "hsl(" + h + ", " + s + "%, " + l + "%)";
    
    static rgbToHex = (r, g, b) => {
        var bin = r << 16 | g << 8 | b;
        return (function(h){
            return new Array(7-h.length).join("0")+h
        })(bin.toString(16).toUpperCase())
    }
}

export default Utils;