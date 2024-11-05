import { expect } from "chai";
import { ethers } from 'hardhat';
import { Signer } from "ethers";
import { BIKCHAT } from "../typechain-types";

describe("BikChat", () => {
    let addr1: Signer, addr2: Signer, owner: Signer, contract: BIKCHAT, transaction:any;
 
    const name: string = "Bikalpa";
    const description: string = "Hii i am bikalpa regmi";
    const image: string = "BIKALPA.png";
    const name2: string = "Bikalpa2";
    const description2: string = "Hii i am bikalpa regmi2";
    const image2: string = "BIKALPA.png2";

    beforeEach(async () => {
        const contractFactory = await ethers.getContractFactory("BIKCHAT");
        [owner, addr1, addr2] = await ethers.getSigners();
        contract = await contractFactory.deploy();
        transaction = await contract.connect(addr1).createProfile(name, description, image);
        transaction = await contract.connect(addr2).createProfile(name2, description2, image2);
        await transaction.wait();
    });

    describe("Deployment", () => {
        it("Should assign the right owner", async () => {
            expect(await contract.owner()).to.eq(owner);
        });

        it("Should assign the right name", async () => {
            expect(await contract.name()).to.eq("BikChat");
        });
    });

    describe("Profile", () => {
        describe('CreateProfile', () => {
            
            it("Should revert if account already exists", async () => {
                await expect(
                    contract.connect(addr1).createProfile(name, description, image)
                ).to.be.revertedWith("Profile already exists");
            });
            
            it("Should find Profile", async () => {
                const res = await contract.connect(addr1).profiles(addr1);
                expect(res.id).to.eq(addr1);
                expect(res.name).to.eq(name);
                expect(res.description).to.eq(description);
                expect(res.image).to.eq(image);
            });
            
            it("Should emit if profile created", async () => {
                expect(transaction).to.emit(contract, 'ProfileCreation');
            });
        });

        describe("EditProfile", () => {
            it("Should revert if others try to edit", async () => {
               await expect(
                 contract.connect(owner).editProfile("f", "f", "f")
               ).to.be.revertedWith("Only dont own the profile");
            });

            it("Should update if previous details")ayera bana yo sabai!!!
        })
    });


}) 