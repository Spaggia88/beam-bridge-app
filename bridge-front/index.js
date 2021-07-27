
// web3 provider with fallback for old version
window.addEventListener('load', async () => {
    // New web3 provider
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            // ask user for permission
            await window.ethereum.enable();
            // user approved permission
        } catch (error) {
            // user rejected permission
            console.log('user rejected permission');
        }
    }
    // Old web3 provider
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // no need to ask for permission
    }
    // No web3 provider
    else {
        console.log('No web3 provider detected');
    }
});

const ethTokenContract = '0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0';
const ethPipeUserContract = '0x345cA3e014Aaf5dcA488057592ee47305D9B3e10';

async function getBalance() {
    let accounts = await window.web3.eth.getAccounts();

    let balance = await window.web3.eth.getBalance(accounts[0]);

    document.getElementById("resultBalance").innerHTML = "balance: " + balance;

    console.log('account = ', accounts[0]);
    console.log('balance = ', balance);

    const tokenContract = new window.web3.eth.Contract(
        BeamTokenContract.abi,
        ethTokenContract
    );

    let tokenBalance = await tokenContract.methods.balanceOf(accounts[0]).call();
    document.getElementById("resultBalance").innerHTML = "Ethereum balance: " + balance + "<br/>Token balance: " + tokenBalance;

    console.log("token balance: ", tokenBalance);
}

const requestToContract = async (sender, receiver, abi) => {
    let nonce = await window.web3.eth.getTransactionCount(sender);
    let hashTx = await window.web3.eth.sendTransaction({
        from: sender,
        to: receiver,
        data: abi,
        gas: 2000000,
        nonce: nonce,
    });

    console.log('hash tx: ', hashTx);
}

async function sendToken() {
    const tokenContract = new window.web3.eth.Contract(
        BeamTokenContract.abi,
        ethTokenContract
    );
    const pipeUserContract = new window.web3.eth.Contract(
        PipeUserContract.abi,
        ethPipeUserContract
    );
    const sendValue = parseInt(document.getElementById("amount").value);
    const pubKey = document.getElementById("publicKey").value;
    const approveTx = tokenContract.methods.approve(ethPipeUserContract, sendValue);
    const lockTx = pipeUserContract.methods.sendFunds(sendValue, pubKey);
    let accounts = await window.web3.eth.getAccounts();
    

    await requestToContract(
        accounts[0], 
        ethTokenContract, 
        approveTx.encodeABI());
    let lockTxReceipt = await requestToContract(
        accounts[0], 
        ethPipeUserContract,
        lockTx.encodeABI());

    console.log('receipt: ', lockTxReceipt);
}

async function receiveToken() {
    const pipeUserContract = new window.web3.eth.Contract(
        PipeUserContract.abi,
        ethPipeUserContract
    );
    const msgId = parseInt(document.getElementById("msgId").value);
    const receiveTx = pipeUserContract.methods.receiveFunds(msgId);
    let accounts = await window.web3.eth.getAccounts();

    let receiveTxReceipt = await requestToContract(
        accounts[0], 
        ethPipeUserContract,
        receiveTx.encodeABI());

    console.log('receive receipt: ', receiveTxReceipt);
}