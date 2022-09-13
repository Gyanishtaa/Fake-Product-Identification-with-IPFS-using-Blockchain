const Meme = artifacts.require("QRCodeHashing");

module.exports = function(deployer) {
  deployer.deploy(Meme);
};
