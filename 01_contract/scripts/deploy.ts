import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deployer is ... ', deployer.address);

  const f0 = await ethers.getContractFactory("puzzeleNft", deployer);
  const puzzeleNft = await f0.deploy();
  await puzzeleNft.deployed();
  // 'https://d37p9y4lne9njv.cloudfront.net/metadata/'
  
  console.log('puzzleNFT is deployed!!', puzzeleNft.address);
  
  await puzzeleNft.setMetadataPrefix('https://d37p9y4lne9njv.cloudfront.net/metadata/');
  const uri = await puzzeleNft.getMetadataPrefix();
  console.log('uri prefix is... ', uri);

  await puzzeleNft.setEvent('web3/Metaverce Comunity Share News Campaign 2024-2', 9);
  console.log('Event is set');

  // await puzzeleNft.mint(2, deployer.address);
  // console.log('NFT is mint');

  // const tokenUri = await puzzeleNft.tokenURI(200001);
  // console.log('Token URI #1 is ...', tokenUri);

  // const owner = await puzzeleNft.ownerOf(200001);
  // console.log(owner)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
