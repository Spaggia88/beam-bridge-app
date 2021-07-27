
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

const ethTokenSender = '0x627306090abab3a6e1400e9345bc60c78a8bef57';
const ethTokenContract = '0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0';
const ethPipeUserContract = '0x345cA3e014Aaf5dcA488057592ee47305D9B3e10';
const ethSenderPrivateKey = '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3';

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

const requestToContract = async (sender, receiver, privateKey, abi) => {
    let nonce = await window.web3.eth.getTransactionCount(sender);
    let signedTx = await window.web3.eth.accounts.signTransaction({
        from: sender,
        to: receiver,
        data: abi,
        gas: 2000000,
        nonce: nonce,
    }, privateKey);

    console.log('signed tx: ', signedTx);
    try {
        let createReceipt = await window.web3.eth.sendSignedTransaction(
            signedTx.rawTransaction
        );

        return createReceipt;
    } catch (err) {
        console.log('exception: ', err);
    }
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
    

    await requestToContract(
        ethTokenSender, 
        ethTokenContract, 
        ethSenderPrivateKey, 
        approveTx.encodeABI());
    let lockTxReceipt = await requestToContract(
        ethTokenSender, 
        ethPipeUserContract,
        ethSenderPrivateKey, 
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

    let receiveTxReceipt = await requestToContract(
        ethTokenSender, 
        ethPipeUserContract,
        ethSenderPrivateKey, 
        receiveTx.encodeABI());

    console.log('receive receipt: ', receiveTxReceipt);
}