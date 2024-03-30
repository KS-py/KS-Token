const hre = require("hardhat");

async function main() {
  const KSToken = await hre.ethers.getContractFactory("KSToken");
  const ksToken = await KSToken.deploy(100000000, 25);

  await ksToken.deployed();

  console.log("KS Token deployed: ", ksToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
