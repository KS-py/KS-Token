const { expect } = require("chai");
const hre = require("hardhat");

describe("KSToken contract", function() {
  // global vars
  let Token;
  let ksToken;
  let owner;
  let addr1;
  let addr2;
  let tokenCap = 100000000;
  let tokenBlockReward = 25;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("KSToken");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    ksToken = await Token.deploy(tokenCap, tokenBlockReward);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await ksToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await ksToken.balanceOf(owner.address);
      expect(await ksToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped supply to the argument provided during deployment", async function () {
      const cap = await ksToken.cap();
      expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokenCap);
    });

    it("Should set the blockReward to the argument provided during deployment", async function () {
      const blockReward = await ksToken.blockReward();
      expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(tokenBlockReward);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 25 tokens from owner to addr1
      await ksToken.transfer(addr1.address, 25);
      const addr1Balance = await ksToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(25);

      // Transfer 25 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await ksToken.connect(addr1).transfer(addr2.address, 25);
      const addr2Balance = await ksToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(25);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await ksToken.balanceOf(owner.address);
      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        ksToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await ksToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await ksToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await ksToken.transfer(addr1.address, 100);

      // Transfer another 25 tokens from owner to addr2.
      await ksToken.transfer(addr2.address, 25);

      // Check balances.
      const finalOwnerBalance = await ksToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(125));

      const addr1Balance = await ksToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await ksToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(25);
    });
  });
  
});