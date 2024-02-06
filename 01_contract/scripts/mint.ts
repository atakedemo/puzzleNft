import { ethers } from "hardhat";
import { erc721PuzzleNFTAbi } from './abi/erc721-puzzleNFT';

async function main() {
  const [signer] = await ethers.getSigners();
  console.log('Signer is ... ', signer.address);

  const puzzeleNft = new ethers.Contract('0xCCAd304E9B5a6B69168DD2E791F01021cf3295B9', erc721PuzzleNFTAbi, signer);
  
//   const result = await puzzeleNft.setMetadataPrefix('https://dtu-dao-aws-core-function-dtudaonftmetadatabucket4-fxn0v8mx0mur.s3.ap-northeast-1.amazonaws.com/astarEVM/0xCCAd304E9B5a6B69168DD2E791F01021cf3295B9/metadata/');
//   result.wait();
//   console.log(result);
  const uri = await puzzeleNft.getMetadataPrefix();
//   uri.wait();
  console.log('uri prefix is... ', uri);

  // await puzzeleNft.mint(2, signer.address);
  // console.log('NFT is mint');

  const tokenUri = await puzzeleNft.tokenURI(200001);
  console.log('Token URI #1 is ...', tokenUri);

  // const owner = await puzzeleNft.ownerOf(200001);
  // console.log(owner)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
