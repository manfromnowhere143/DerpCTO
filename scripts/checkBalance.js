const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("\n🔍 Checking Wallet Balance...");
  console.log("================================");
  console.log("Wallet Address:", deployer.address);
  
  const balance = await deployer.getBalance();
  const balanceInBNB = hre.ethers.utils.formatEther(balance);
  
  console.log("BNB Balance:", balanceInBNB, "BNB");
  
  // BNB at $830
  const bnbPrice = 830;
  const balanceInUSD = (parseFloat(balanceInBNB) * bnbPrice).toFixed(2);
  console.log("USD Value: $" + balanceInUSD);
  
  // At $830/BNB, $100 = 0.1205 BNB
  const requiredBNB = 0.121;
  if (parseFloat(balanceInBNB) >= requiredBNB) {
    console.log("\n✅ READY TO DEPLOY!");
    console.log(`You have enough BNB (need ${requiredBNB} BNB for $100)`);
    
    // Show breakdown
    console.log("\n💰 Budget Allocation:");
    console.log("Deploy Contract: ~0.013 BNB ($10.79)");
    console.log("Add Liquidity:   ~0.105 BNB ($87.15)");
    console.log("Gas Reserve:     ~0.005 BNB ($4.15)");
    console.log("────────────────────────────────");
    console.log("Total Needed:     0.121 BNB ($100)");
    console.log("You Have:        ", balanceInBNB, "BNB ($" + balanceInUSD + ")");
  } else {
    console.log("\n❌ INSUFFICIENT BALANCE!");
    console.log(`You need at least ${requiredBNB} BNB ($100)`);
    console.log(`You need ${(requiredBNB - parseFloat(balanceInBNB)).toFixed(6)} more BNB`);
  }
  console.log("================================\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
