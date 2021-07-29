import Utils from "./libs/utils.js";

const CONTRACT_ID = "5ed7f2d7821ae50e775d4d6951cc446b3cd56b9d50626d9f37b8ad02a9e95c4e";
const REJECTED_CALL_ID = -32021;
const TIMEOUT = 3000;

class BrigesPlugin {
    constructor() {
        this.timeout = undefined;
        this.pluginData = {
            mainLoaded: false,
            pkValue: '',
            incomingTrs: []
        }
    }

    clearInputs = () => {
        $('#receiver-input').val('');
        $('#amount-input').val('');
        $('#msgid-input').val('');
    }

    pluginInit = () => {
        $('#receive-popup').hide();
        $('#send-popup').hide();

        $('#receive-cancel').click(() => {
            $('#receive-popup').hide();
            this.clearInputs();
        });

        $('#send-cancel').click(() => {
            $('#send-popup').hide();
            this.clearInputs();
        });

        $('#send-confirm').click(this.sendConfirmClicked);
        $('#receive-confirm').click(this.receiveConfirmClicked);
        $('#receive-popup-open').click(this.receiveClicked);
        $('#send-popup-open').click(this.sendClicked);
    }

    setError = (errmsg) => {
        let errorElementId = "#error-common";
        if ($('#main-page').css('display') === 'none') {
            errorElementId = "#error-full";
            $('#error-full-container').show();
        } else {
            $('#error-common').show();
        }

        $(errorElementId).text(errmsg);
        if (this.timeout) {
            clearTimeout(this.timeout);   
        }
        this.timeout = setTimeout(() => {
            $(errorElementId).text(errmsg);
            this.start();
        }, TIMEOUT)
    }

    start = () => {
        Utils.download("./bridgesManager.wasm", (err, bytes) => {
            if (err) {
                let errTemplate = "Failed to load shader,";
                let errMsg = [errTemplate, err].join(" ");
                return this.setError(errMsg);
            }
    
            Utils.callApi("get_pk", "invoke_contract", {
                contract: bytes,
                create_tx: false,
                args: "role=user,action=get_pk,cid=" + CONTRACT_ID
            });
        })
    }
    
    parseShaderResult = (apiResult) => {
        if (typeof(apiResult.output) != 'string') {
            throw "Empty shader response";
        }
    
        let shaderOut = JSON.parse(apiResult.output)
        if (shaderOut.error) {
            throw ["Shader error: ", shaderOut.error].join("")
        }
    
        return shaderOut;
    }

    refresh = (now) => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
            this.loadTransactions();
        }, now ? 0 : 3000)
    }

    showPlugin = () => {
        if (!this.pluginData.mainLoaded) {
            this.pluginData.mainLoaded = true;

            $('#main-page').show();
        }
        this.refresh(false);
    }
   
    loadTransactions = () => {
        Utils.callApi("view_incoming", "invoke_contract", {
            create_tx: false,
            args: "role=manager,action=view_incoming,iStartFrom=0,cid=" + CONTRACT_ID
        });
    }

    onApiResult = (json) => {    
        try {
            const apiAnswer = JSON.parse(json);
            if (apiAnswer.error) {
                if (apiAnswer.error.code == REJECTED_CALL_ID) {
                    return;
                }
                
                throw JSON.stringify(apiAnswer.error)
            }
    
            const apiCallId = apiAnswer.id;
            const apiResult = apiAnswer.result;
            if (!apiResult) {
                throw "Failed to call wallet API";
            }

            if (apiCallId === "get_pk") {
                let shaderOut = this.parseShaderResult(apiResult);
                if (shaderOut.pk === undefined) {
                    throw "Failed to load private key";    
                }

                this.pluginData.pkValue = shaderOut.pk;
                $('#pk-value').text(this.pluginData.pkValue);
                this.loadTransactions();
            } else if (apiCallId === "view_incoming") {
                let shaderOut = this.parseShaderResult(apiResult);
                if (shaderOut.incoming === undefined) {
                    throw "Failed to load incoming transactions";    
                }
                this.pluginData.incomingTrs = shaderOut.incoming;
                shaderOut.incoming.length > 0 ? $('#incoming').show() : $('#incoming').hide();
                $(".row-elem").remove();
                for(const [i, elem] of shaderOut.incoming.entries()) {
                    let tableElem = document.getElementById('incoming');
                    let rowElem = document.createElement('tr');
                    rowElem.className = 'row-elem';

                    let colElemId = document.createElement('td');
                    colElemId.appendChild(document.createTextNode(elem.MsgId));

                    let colElemUser = document.createElement('td');
                    colElemUser.appendChild(document.createTextNode(elem.User));

                    let colElemAmount = document.createElement('td');
                    colElemAmount.appendChild(document.createTextNode(elem.amount));

                    let colElemReceive = document.createElement('td');
                    colElemReceive.appendChild(document.createTextNode('receive'));
                    colElemReceive.className = "receive-control";
                    colElemReceive.setAttribute("index", i);
                    rowElem.appendChild(colElemId);
                    rowElem.appendChild(colElemUser);
                    rowElem.appendChild(colElemAmount);
                    rowElem.appendChild(colElemReceive);

                    tableElem.appendChild(rowElem);

                    $('.receive-control').click((ev) => {
                        const id = $(ev.target).attr('index');
                        const clickedTr = this.pluginData.incomingTrs[id];
                        Utils.callApi("receive", "invoke_contract", {
                            create_tx: false,
                            args: "role=user,action=receive,cid=" + CONTRACT_ID + ",msgId=" + clickedTr.MsgId
                        });
                    })
                }

                this.showPlugin();
            } else if (apiCallId === "receive" || apiCallId === "send") {
                if (apiResult.raw_data === undefined || apiResult.raw_data.length === 0) {
                    throw 'Failed to load raw data';
                }
                
                Utils.callApi("process_invoke_data", "process_invoke_data", {
                    data: apiResult.raw_data,
                    confirm_comment: ""
                });
            } else if (apiCallId === "process_invoke_data") {

            }
        } catch(err) {
            return this.setError(err.toString());
        }
    }

    receiveClicked = () => {
        $('#receive-popup').show();
    }

    sendClicked = () => {
        $('#send-popup').show();
    }

    sendConfirmClicked  = () => {
        Utils.callApi("send", "invoke_contract", {
            create_tx: false,
            args: "role=user,action=send,cid=" + CONTRACT_ID + 
                ",amount=" + $('#amount-input').val() + 
                ",receiver=" + $('#receiver-input').val()
        });
        this.clearInputs();
        $('#send-popup').hide();
    }

    receiveConfirmClicked  = () => {
        Utils.callApi("receive", "invoke_contract", {
            create_tx: false,
            args: "role=user,action=receive,cid=" + CONTRACT_ID + ",msgId=" + $('#msgid-input').val()
        });
        this.clearInputs();
        $('#receive-popup').hide();
    }
}

Utils.onLoad(async (beamAPI) => {
    let bridgesPlugin = new BrigesPlugin();
    bridgesPlugin.pluginInit();
    $('#error-full-container').css('color', beamAPI.style.validator_error);
    $('#error-common').css('color', beamAPI.style.validator_error);
    beamAPI.api.callWalletApiResult.connect(bridgesPlugin.onApiResult);
    bridgesPlugin.start();
});