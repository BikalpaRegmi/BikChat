import { expect } from "chai";
import { ethers } from 'hardhat';
import { Signer } from "ethers";
import { BIKCHAT } from "../typechain-types";

describe("BikChat", () => {
    let addr1: Signer, addr2: Signer, owner: Signer, contract: BIKCHAT, transaction:any;
 
    const name: string = "Bikalpa";
    const description: string = "Hii i am bikalpa regmi";
    const image: string = "BIKALPA.png";

    beforeEach(async () => {
        const contractFactory = await ethers.getContractFactory("BIKCHAT");
        [addr1, addr2, owner] = await ethers.getSigners();
        contract = await contractFactory.deploy();
        transaction = await contract.connect(addr1).createProfile(name , description , image );
    })
}) 