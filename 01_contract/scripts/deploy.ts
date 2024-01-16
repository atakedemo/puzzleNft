import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deployer is ... ', deployer.address);

  const f0 = await ethers.getContractFactory("puzzeleNft", deployer);
  const puzzeleNft = await f0.deploy(
    'https://d37p9y4lne9njv.cloudfront.net/metadata/'
  );
  console.log('puzzleNFT is deployed!!', puzzeleNft.address);
  
  await puzzeleNft.setEvent('Sample', 9);
  await puzzeleNft.mint(100001, deployer.address);
  console.log('NFT is mint');
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
