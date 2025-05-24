const hre = require("hardhat");

async function main() {
  console.log("Deploying ProfileSystem contract...");

  const ProfileSystem = await hre.ethers.getContractFactory("ProfileSystem");
  const profileSystem = await ProfileSystem.deploy();

  await profileSystem.deployed();

  console.log("ProfileSystem deployed to:", profileSystem.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
