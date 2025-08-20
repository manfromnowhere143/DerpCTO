const hre = require("hardhat");

async function main() {
  console.log("Testing DERP Token Allocation...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  
  const DerpToken = await hre.ethers.getContractFactory("DerpToken");
  const derpToken = await DerpToken.deploy();
  await derpToken.deployed();
  
  console.log("Contract deployed to:", derpToken.address);
  
  // Check team wallet balance
  const teamWallet = "0x69fccadc506D79Fd30F2d26a3F41aF8929f298f9";
  const teamBalance = await derpToken.balanceOf(teamWallet);
  const teamTokens = hre.ethers.utils.formatEther(teamBalance);
  
  // Check deployer balance
  const deployerBalance = await derpToken.balanceOf(deployer.address);
  const deployerTokens = hre.ethers.utils.formatEther(deployerBalance);
  
  // Check total supply
  const totalSupply = await derpToken.totalSupply();
  const totalTokens = hre.ethers.utils.formatEther(totalSupply);
  
  console.log("\n📊 TOKEN DISTRIBUTION:");
  console.log("========================");
  console.log(`Total Supply: ${totalTokens} DERP`);
  console.log(`Team Wallet (10%): ${teamTokens} DERP`);
  console.log(`Deployer (90%): ${deployerTokens} DERP`);
  
  // Verify percentages
  const teamPercent = (parseFloat(teamTokens) / parseFloat(totalTokens)) * 100;
  const deployerPercent = (parseFloat(deployerTokens) / parseFloat(totalTokens)) * 100;
  
  console.log("\n✅ VERIFICATION:");
  console.log(`Team has ${teamPercent.toFixed(1)}% (should be 10%)`);
  console.log(`Deployer has ${deployerPercent.toFixed(1)}% (should be 90%)`);
  
  if (Math.abs(teamPercent - 10) < 0.1 && Math.abs(deployerPercent - 90) < 0.1) {
    console.log("\n🎉 SUCCESS! Allocation is correct!");
  } else {
    console.log("\n❌ ERROR! Allocation percentages are wrong!");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
