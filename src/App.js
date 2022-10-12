import React from 'react';
import './App.css';
import {configureWeb3} from './lib';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import logo from './images/logo.png';
const axios = require('axios').default;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
      gas_price: 0,
      input_address: "",
      input_passcode: "",
      success_text: "",
      success_hash: "",
      error_text: "",
      is_success: false,
      is_error: false,
    };
  }

  componentWillMount() {
    window.web3 = configureWeb3(`https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_AK}`);
    window.ethTx = require("ethereumjs-tx").Transaction;
    //console.log(window.web3);
    this.initAndFetchBal([{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeSub","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeDiv","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"data","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeMul","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferAnyERC20Token","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeAdd","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenOwner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}], "0xb8080B8B6BAffadb5DC50f9D31Dc126f2b99c7aA");
    this.fetchGasPrice();
  }

  fetchGasPrice() {
    let that = this;
    axios.get("https://ethgasstation.info/json/ethgasAPI.json").then(function(g) {
      let fastest = window.web3.utils.fromWei(window.web3.utils.toWei((g.data.fastest / 10).toString(), "gwei"), "ether");
      that.setState({ gas_price: fastest })
    }).catch(function (error) {
      //console.log(error);
    });
  }

  async initAndFetchBal(abi, address) {
    window.token = await new window.web3.eth.Contract(abi, address);
    this.fetchTokenBal("0xca84b6581d325e6a497d875c4ca093ac3ba2ccaf");
    //console.log(window.token);
  }

  async fetchTokenBal(address) {
    await window.token.methods.balanceOf(address).call((error, result) => {
      if(error)
        console.error("Error: ", error);
      this.setState({ balance: window.web3.utils.fromWei(result, "ether") });
    });
  }

  async estimateGasLimit (fromAddress, toAddress, amount) {
    const estimatedGasLimit = new Promise((resolve, reject) => {
      const amountInHex = window.web3.utils.toHex(window.web3.utils.toWei(amount, "ether"));
      let tx = {
        from: fromAddress,
        to: window.token._address,
        data: window.token.methods.transfer(toAddress, amountInHex).encodeABI()
      };
      // Estimate gas limit
      window.web3.eth.estimateGas(tx, (err, gasLimit) => {
        if (err)
          reject(err);
        resolve({gasLimit: gasLimit, data: tx.data });
      });
    });
    return await estimatedGasLimit;
  }

  async sendFaucetToken() {
    this.setState({ is_success: false, is_error: false, success_message: "", error_message: "" });
    
    if (this.state.input_address === "") {
      this.setState({ is_error: true, error_message: "Please input all fields." });
    } else if(this.state.input_passcode !== process.env.REACT_APP_Password) {
      this.setState({ is_error: true, error_message: "Wrong passcode." });
    } else {
      if (window.web3.utils.isAddress(this.state.input_address)) {
        const privateKey = new Buffer.from(process.env.REACT_APP_FAUCET_PK, "hex");
        this.estimateGasLimit("0xca84b6581d325e6a497d875c4ca093ac3ba2ccaf", this.state.input_address, "10").then((g) => {
          window.web3.eth.getTransactionCount("0xca84b6581d325e6a497d875c4ca093ac3ba2ccaf", "pending", (error, txCount) => {
            if (error){
              //console.log(error);
              this.setState({ is_error: true, error_message: "Something has occurred. Please try again." });
            } else {
              // prepare tx
              let rawTx = {};
              rawTx.from = "0xca84b6581d325e6a497d875c4ca093ac3ba2ccaf";
              rawTx.to = window.token._address;
              rawTx.data = g.data;
              rawTx.gasLimit = window.web3.utils.toHex(g.gasLimit);
              rawTx.gasPrice = window.web3.utils.toHex(global.web3.utils.toWei(this.state.gas_price, "ether"));
              rawTx.nonce = window.web3.utils.toHex(txCount);
              //console.log(rawTx);

              // build tx
              const tx = new window.ethTx(rawTx, { chain: "goerli" });
              tx.sign(privateKey);
              //console.log(tx);
              window.web3.eth.sendSignedTransaction(`0x${tx.serialize().toString("hex")}`, (err, receipt) => {
                if (err){
                  //console.log(err);
                  this.setState({ is_error: true, error_message: "Something has occurred. Please try again." });
                } else{
                  //console.log(receipt.toString());
                  this.setState({ input_address: "", input_passcode: "", is_success: true, success_hash: receipt.toString(), success_message: "Sending 10 test SRK. Please wait for a few minutes." });
                }
              });
            }
          }).catch((error) => {
            //console.log(error);
            this.setState({ is_error: true, error_message: "Something has occurred. Please try again." });
          });
        });
      } else {
        this.setState({ is_error: true, error_message: "Invalid Address" });
      }
    }
  }

  handleInput(state, event) {
    this.setState({ [state]: event.target.value });
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="align-items-center justify-content-center">
            <br/>
            <div className="card">
              <div className="card-header text-center">
                <img alt="logo" className="align-self-center" src={logo} height="69" width="80" />
                <h3>SparkLearn EdTech Test SRK Faucet</h3>
              </div>
              <div className="card-body">
                <Tabs defaultActiveKey="second">
                  <Tab eventKey="first" title="ETH Ropsten">
                    <div className="container">
                      <div className="row">
                        <div className="col-12">
                          <br/>
                          <div key={1} className="alert alert-danger">
                            <strong>Warning!</strong><br/>
                            Ropsten is shutting down Q4 of 2022. More info <a href="https://blog.ethereum.org/2022/06/21/testnet-deprecation/" target="_blank" rel="noreferrer">here</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="second" title="ETH Goerli">
                    <br/>
                    <center><small>Remaining faucet balance: {this.state.balance} test SRK</small></center><br/>
                    <form>
                      <div className="container">
                        <div className="row">
                          <div className="form-group col-6">
                            <input type="name" className="form-control form-control-lg" value={this.state.input_passcode} onChange={(e) => this.handleInput("input_passcode", e)} placeholder="Passcode" />
                          </div>
                          <div className="form-group col-6">
                            <input type="name" value={this.state.input_address} className="form-control form-control-lg" onChange={(e) => this.handleInput("input_address", e)} placeholder="Enter address to receive funds here" />
                          </div>
                          <div className="col-12">
                            { this.state.is_success &&
                              [
                                <br key={0} />,
                                <div key={1} className="alert alert-success">
                                  <strong>Success!</strong>{ " " + this.state.success_message }
                                  <br/><a href={"https://goerli.etherscan.io/tx/" + this.state.success_hash} target="_blank" rel="noreferrer">{ "https://goerli.etherscan.io/tx/" + this.state.success_hash }</a>
                                </div>
                              ]
                            }
                            { this.state.is_error &&
                              [
                                <br key={0} />,
                                <div key={1} className="alert alert-danger">
                                  <strong>Error!</strong> { this.state.error_message }
                                </div>
                              ]
                            }
                          </div>
                        </div>
                      </div>
                    </form>
                    <br/>
                    <center><button className="btn btn-primary" onClick={this.sendFaucetToken.bind(this)}>Request 10 test SRK</button></center>
                    <div className="container">
                      <div className="row">
                        <div className="col-12">
                          <br/>
                          <div className="alert alert-warning">
                            <strong>Why is there a passcode?</strong><br/>
                            For now, we only allow and limit the access of this faucet to <a href="https://lrn.ac/bdb" target="_blank" rel="noreferrer">BDB 2022</a> students. As for the passcode, mentor <code>harvz</code> will provide it on <code>🔒bdb2022</code> Slack channel.
                          </div>
                          <div key={1} className="alert alert-warning">
                            <strong>Did not receive your test SRK?</strong><br/>
                            EVM blockchains in general and Goerli in particular are incredibly fragile, unreliable and hostile environments. Transactions do get lost, sometimes fail to mine, gas limits are estimated incorrectly, network explorer loses records, and Infura sometimes misreport nonces.
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="third" title="BSC Testnet">
                    <div className="container">
                      <div className="row">
                        <div className="col-12">
                          <br/>
                          <div key={1} className="alert alert-info">
                            <strong>Coming Soon!</strong><br/>
                            This feature is still under development.
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="fourth" title="MATIC Mumbai">
                    <div className="container">
                      <div className="row">
                        <div className="col-12">
                          <br/>
                          <div key={1} className="alert alert-info">
                            <strong>Coming Soon!</strong><br/>
                            This feature is still under development.
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </div>
              <div className="card-footer text-muted text-center">
                <small>© <a href="https://sparklearn-edtech.com/" target="_blank" rel="noreferrer">SparkLearn EdTech Inc.</a></small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
