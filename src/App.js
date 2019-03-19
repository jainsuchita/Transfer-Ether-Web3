import React, { Component } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import getWeb3 from "./getWeb3";

class App extends Component {
  constructor() {
    super();

    this.state = {
      web3: {},
      nodeInfo: "",
      accountAddress: "",
      balance: "",
      txn_hash: {},
      transferFrom: "",
      transferTo: "",
      amount: "",
    }

    this.handleCheckBalance = this.handleCheckBalance.bind(this);
    this.handleTransfer = this.handleTransfer.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      if (web3 !== undefined) {
        const nodeInfo = await web3.eth.getNodeInfo();
        const accountAddress = await web3.eth.getAccounts();
        const balance = await web3.eth.getBalance(accountAddress[0]);

        this.setState({
          web3: web3,
          nodeInfo: nodeInfo,
          accountAddress: accountAddress[0],
          balance: web3.utils.fromWei(balance, 'ether')
        })
      }
    } catch (error) {
      alert("Check console for error")
      console.error(error);
    }
  }

  async handleCheckBalance() {
    const { web3 } = this.state;
    try {
      if (web3 !== undefined) {
        const balance = await web3.eth.getBalance(this.state.accountAddress);

        this.setState({
          ...this.state,
          balance: web3.utils.fromWei(balance, 'ether')
        })
      }
    } catch (error) {
      alert("Check console for error")
      console.error(error);
    }
  }

  async handleTransfer() {
    const { web3, accountAddress, transferFrom, transferTo, amount } = this.state;
    try {
      if (web3 !== undefined) {
        const nonce = await web3.eth.getTransactionCount(accountAddress);

        let txnObject = {
          "nonce": nonce,
          "from": transferFrom,
          "to": transferTo,
          "value": web3.utils.toWei(amount, 'ether'),
          // "gas": 21000,         (optional)
          // "gasPrice": 4500000,  (optional)
          // "data": 'For testing' (optional)
        }

        const txn_hash = await web3.eth.sendTransaction(txnObject);

        console.log(txn_hash);
        this.setState({
          ...this.state,
          txn_hash: txn_hash
        })
      }
    } catch (error) {
      alert("Check console for error")
      console.error(error);
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    return (
      <div className="container">

        <Typography variant="h4" align="center" gutterBottom>
          Transfer Ether
        </Typography>

        <div className="textfield-group">
          <TextField
            id="standard-nodeInfo"
            label="Node Info"
            value={this.state.nodeInfo}
            // onChange={this.handleChange('name')}
            margin="normal"
            variant="outlined"
          />
        </div>

        <div className="main-container">

          <div className="textfield-group">
            <Typography variant="h5" align="center" gutterBottom>
              Balance
          </Typography>

            <TextField
              id="account-info"
              label="Account"
              title={this.state.accountAddress}
              value={this.state.accountAddress}
              // onChange={this.handleChange('name')}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="balance-info"
              label="Balance"
              value={this.state.balance}
              // onChange={this.handleChange('name')}
              margin="normal"
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              id="checkBalance"
              onClick={this.handleCheckBalance}>Check Balance</Button>
          </div>

          <div className="textfield-group">
            <Typography variant="h5" align="center" gutterBottom>
              Transfer
            </Typography>

            <TextField
              id="transfer-from"
              label="From"
              title={this.state.transferFrom}
              value={this.state.transferFrom}
              onChange={this.handleChange('transferFrom')}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="transfer-to"
              label="To"
              title={this.state.transferTo}
              value={this.state.transferTo}
              onChange={this.handleChange('transferTo')}
              margin="normal"
              variant="outlined"
            />

            <TextField
              id="transfer-amount"
              label="Amount"
              value={this.state.amount}
              onChange={this.handleChange('amount')}
              margin="normal"
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              id="Transfer"
              onClick={this.handleTransfer}>
              Transfer
               </Button>
            {
              this.state.txn_hash.status &&
              <Typography variant="caption" align="center" gutterBottom>
                Transaction Hash :  <span id="Tx">{this.state.txn_hash.status}: {this.state.txn_hash.transactionHash}</span>
              </Typography>
            }

          </div>

        </div>

      </div>
    );
  }
}

export default App;
