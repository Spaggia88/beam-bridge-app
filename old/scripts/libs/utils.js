import * as consts from "./../consts/consts.js";

export default class Utils {
    static reload () {
        window.location.reload()
    }

    //
    // API Exposed by the wallet itself
    //
    BEAM = null

    static onLoad(cback) {
        window.addEventListener('load', () => new QWebChannel(qt.webChannelTransport, (channel) => {
            Utils.BEAM = channel.objects.BEAM
            this.loadStyles();
            // Notify application
            cback(Utils.BEAM)
        }))
    }

    static loadStyles() {
        let topColor =  [this.BEAM.style.appsGradientOffset, "px,"].join('');
        let mainColor = [this.BEAM.style.appsGradientTop, "px,"].join('');

        $('#bg').css('background-image', [
            "linear-gradient(to bottom,",
            Utils.BEAM.style.background_main_top, topColor, 
            Utils.BEAM.style.background_main, mainColor,
            Utils.BEAM.style.background_main
        ].join(' '));
        document.body.style.color = this.BEAM.style.content_main;
        document.querySelectorAll('.popup').forEach(item => {
            item.style.backgroundImage = `linear-gradient(to bottom, 
                ${this.hex2rgba(this.BEAM.style.background_main_top, 0.6)} ${topColor}
                ${this.hex2rgba(this.BEAM.style.background_main, 0.6)} ${mainColor}
                ${this.hex2rgba(this.BEAM.style.background_main, 0.6)}`;
        });
        document.querySelectorAll('.popup__content').forEach(item => {
            item.style.backgroundColor = this.hex2rgba(this.BEAM.style.background_popup, 1);
        });
    }

    static hex2rgba = (hex, alpha = 1) => {
        const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
        return `rgba(${r},${g},${b},${alpha})`;
    };

    static callApi(callid, method, params) {
        let request = {
            "jsonrpc": "2.0",
            "id":      callid,
            "method":  method,
            "params":  params
        }
        Utils.BEAM.api.callWalletApi(JSON.stringify(request))
    }

    static download(url, cback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    let buffer    = xhr.response
                    let byteArray = new Uint8Array(buffer);
                    let array     = Array.from(byteArray)

                    if (!array || !array.length) {
                        return cback("empty shader")
                    }
                
                    return cback(null, array)
                } else {
                    let errMsg = ["code", xhr.status].join(" ")
                    return cback(errMsg)
                }
            }
        }
        xhr.open('GET', url, true)
        xhr.responseType = "arraybuffer";
        xhr.send(null)
    }
}
