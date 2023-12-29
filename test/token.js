const { expect } = require("chai");

// using mocha hooks

describe("Token Contract", function () {
  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // sb se pehle ye run hoga
  beforeEach(async function () {
    // get signers
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy Contract
    Token = await ethers.getContractFactory("Token");
    hardhatToken = await Token.deploy();
  });

  // First Test case
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should assigns the total supply of tokens to the owner", async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);

      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transaction", function () {
    it("Should transfer tokens between accounts", async function () {
      // owner to addresss 1
      const ownerBalance = await hardhatToken.balanceOf(owner.address);

      await hardhatToken.transfer(addr1.address, 10);
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(10);

      // address 1 to address 2
      await hardhatToken.connect(addr1).transfer(addr2.address, 10);
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);

      expect(addr2Balance).to.equal(10);
    });

    it("Should update balance after transfer", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
      await hardhatToken.transfer(addr1.address, 5);
      await hardhatToken.transfer(addr2.address, 10);

      const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - BigInt(15)); // convert with bigint

      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(5);
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(10);
    });

    it("Should fail if sender does not have enough tokens", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not Enough tokens");

      // check balnce of owner
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});

// ************************************************************************************ //

// Repeated Code

// describe("Token Contract", function () {
//   it("Deployment should assign the total supply of tokens to the owner", async function () {
//     const [owner] = await ethers.getSigners();

//     // console.log("Signer Object", owner);

//     const Token = await ethers.getContractFactory("Token"); //  instance of Token

//     const hardhatToken = await Token.deploy(); // deploy token on local machine

//     const ownerBalance = await hardhatToken.balanceOf(owner.address);
//     // console.log("Owner Address", owner.address);

//     expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
//   });

//   // Test 2
//   it("Should Transfer Token between accounts", async function () {
//     const [owner, addr1, addr2] = await ethers.getSigners();
//     // console.log(await ethers.getSigners()); // List of Signers

//     const Token = await ethers.getContractFactory("Token"); //  instance of Token

//     const hardhatToken = await Token.deploy(); // deploy token on local machine

//     // Transfer from owner to address 1
//     await hardhatToken.transfer(addr1.address, 10);
//     expect(await hardhatToken.balanceOf(addr1.address)).to.equal(10);

//     // Transfer token from address1 to address 2
//     await hardhatToken.connect(addr1).transfer(addr2.address, 5);
//     expect(await hardhatToken.balanceOf(addr2.address)).to.equal(5);
//   });
// });
