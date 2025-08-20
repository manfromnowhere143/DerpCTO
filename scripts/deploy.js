const hre = require("hardhat");

async function main() {
  console.log("Deploying DERP Token...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "BNB");
  
  const DerpToken = await hre.ethers.getContractFactory("DerpToken");
  const derpToken = await DerpToken.deploy();
  
  await derpToken.deployed();
  
  console.log("DERP Token deployed to:", derpToken.address);
  console.log("Total Supply: 369,000,000 DERP");
  console.log("\nNext steps:");
  console.log("1. Add liquidity on PancakeSwap");
  console.log("2. Enable trading");
  console.log("3. Verify contract on BSCScan");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
