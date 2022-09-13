import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import QRCodeHashing from '../abis/QRCodeHashing.json'
//import { create } from 'ipfs-http-client'
//import CID from 'cids'
const ipfsClient = require('ipfs-http-client')
//import Hash from 'object-hash'
const Hash = require('ipfs-only-hash')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

var arr2=['QmRPonRYWqWY2oshA5F6fS5c3zXJTkGkNDSa8dKDvsqT6Y','QmPimA1CFvKwtaq7NS9e2qeDn7L9BMkbhLZMRnU8nP4b37','QmYH1eL9LiQMipmfDcjYAz8XcUk3dbwWZk97GwErrBAvWo','QmTpctcLWCa7FPLedzKE1c4j9gxyTwRqjdWSu2spEBFBJX']
 // const ipfs1 = ipfsClient({ host: 'ipfs.infura.io', port: 5003, protocol: 'https' }) // leaving out the arguments will default to these values

var arr=[]
var arr1=[]
var buffer1
var hash
class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    console.log("Account ",this.state.account)
    const networkId = await web3.eth.net.getId()
    const networkData = QRCodeHashing.networks[networkId]
    //console.log('NID,ND',networkId,networkData)
    if(networkData) {
      const contract = web3.eth.Contract(Meme.abi, networkData.address)
      this.setState({ contract })
      console.log("contract",this.state.contract)
      const memeHash = await contract.methods.get().call()
      this.setState({ memeHash })
    //console.log("state memhash",this.state.memeHash)
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      memeHash: '',
      contract: null,
      web3: null,
      buffer: null,
      account: null
    }
  }

  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }


  captureFile1 = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      buffer1= Buffer(reader.result) 
      console.log('buffer1', buffer1)
      hash =  Hash.of(buffer1)
    console.log("hash ",hash,typeof(hash))
    arr1.push(hash)
    var keys = Object.entries(hash)
    console.log("keys ", keys)
    for( var i=0;i<arr.length;i++){
      if(arr[i]===hash.toString){
          console.log("Original")
      }
      else{
        console.log("fake")
      }}
    
  }
}
  
  onSubmit = (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }
      console.log('result 0',result[0].hash)
      console.log('this state acc',this.state.account)
      console.log('method con ',this.state.contract)
      arr.push(result[0].hash)
      console.log("Array of stored Products", arr)
       this.state.contract.methods.set(result[0].hash).send({ from: this.state.account }).then((r) => {
       // console.log("result of memmm ",this.state.memeHash)
         return this.setState({ memeHash: result[0].hash })
       })
    })
  }

  
   /* abc() {
    //ipfs1.add(this.state.buffer,(error,result) => {
  /*  const hash = await Hash.of(this.state.buffer)
  //  const cid = new CID(hash)
      console.log('Ipfs hash of the scanned image', hash)
      
      if(error) {
        console.error(error)
        return
      }
    
      var hash_scannedqr=hash
      
       // event.preventDefault()
        console.log("Submitting file to ipfs1...")
        ipfs1.hash(this.state.buffer)/*, (error, result) => {
          console.log('Ipfs1 result', result)
          if(error) {
            console.error(error)
            return
          }
          console.log('result 0',result[0].hash)
          console.log('this state acc',this.state.account)
         // console.log('method con ',this.state.contract)
          //arr1.push(result[0].hash)
          console.log("Array of scanned Products", arr1)
         /*  this.state.contract.methods.set(result[0].hash).send({ from: this.state.account }).then((r) => {
           // console.log("result of memmm ",this.state.memeHash)
             return this.setState({ memeHash: result[0].hash })})
           
        }
      
        async t() {
         // const data = Buffer.from('TEST' + Date.now())
          const ipfs2 = new Ipfs({ repo: path.join(os.tmpdir(), `${Date.now()}`) })
        
          await new Promise((resolve, reject) => {
            ipfs2.on('ready', resolve).on('error', reject)
          })
        
        //  const files = await ipfs.add(data)
          const hash = await Hash.of(data)
        
console.log("hash offf",hash)       
 }
      
    
  */

    
  
    
  

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fake Product Identification
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a       
                  target="_blank"
                  rel="noopener noreferrer"
                >

                  <img src={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`} />
                </a>
                <p>&nbsp;</p>
                <h2>Upload Product QR</h2>
                <form onSubmit={this.onSubmit} >
                  <input type='file' onChange={this.captureFile} />
                  <input type='submit' />
                </form>
              </div>
            </main>
          </div>
        </div>
        <div>
          <h2>Scan Product QR </h2>
          <form  >
                  <input type='file' onChange={this.captureFile1} />
                  <input type='submit' />
                </form>
          
        </div>
      </div>
    );
  }
}

export default App;
