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
                ).to.be.revertedWith(
                  "You dont own any profile plz create a profile to continue"
                );
            });

            it("Should update if previous details matches", async () => {
                await contract.connect(addr1).editProfile('BKL', 'Hii i am BKL', 'BKL.png');
                const resAfterEdit = await contract.profiles(addr1);
                expect(resAfterEdit.name).to.be.eq("BKL")
                expect(resAfterEdit.description).to.be.eq("Hii i am BKL");
                expect(resAfterEdit.image).to.be.eq("BKL.png")
            })
        });

        describe("GetProfiles", () => {
            it("Should provide all the profiles", async () => {
                const profiles = await contract.getAllProfiles();

                expect(profiles[0].name).to.eq(name);
                expect(profiles[1].name).to.eq(name2);
                expect(profiles[1].image).to.eq(image2);
            });
        })
    });
    describe("Contact", () => {
        
        describe("addToContact", () => {
            it("Should assign true if add to contact", async () => {
                await contract.connect(addr1).addToContact(addr2);
                const contact = await contract.contacts(addr1, addr2);
                expect(contact).to.eq(true);
            });
            it("Should revert if added urself", async () => {
                await expect(
                    contract.connect(addr2).addToContact(addr2)
                ).to.be.revertedWith("You cant add urself");
            });
            it("Should revert if profile alreadt exist", async () => {
                await contract.connect(addr1).addToContact(addr2);
            
                await expect(
                    contract.connect(addr1).addToContact(addr2)
                ).to.be.revertedWith("The profile already exists");
            });
            it("Should revert if u dont own any profile", async () => {
                await expect(contract.addToContact(addr2)).to.be.revertedWith(
                  "You dont own any profile plz create a profile to continue"
                );
            })
        })
        describe('RemoveContact', () => {
            it("Should delete a person from contact", async () => {
                await contract.connect(addr1).addToContact(addr2);
                expect(await contract.contacts(addr1, addr2)).to.eq(true);
                await contract.connect(addr1).deleteContact(addr2);
                expect(await contract.contacts(addr1, addr2)).to.eq(false);
            });
            it("Should revert if u dont own any profile", async () => {
                await expect(contract.addToContact(addr2)).to.be.revertedWith(
                  "You dont own any profile plz create a profile to continue"
                );
            });
            it("Should revert if a person is not in contact", async () => {
                await expect(
                    contract.connect(addr2).deleteContact(addr1)
                ).to.be.revertedWith(
                    "You can only remove if the person is already on contact"
                );
            });
        })
    });
    describe("IndividualChats", () => {
        describe("StartChat", () => {
            it('Should revert if the person is not in contact', async () => {
                await expect(
                  contract.connect(addr1).startChat(addr2, "hii")
                ).to.be.revertedWith(
                  "The person is not in ur contact"
                );
            });
            it('Should revert if the person didnt created any profile', async () => {
                await expect(
                  contract.connect(owner).startChat(addr2, "hii")
                ).to.be.revertedWith(
                  "You dont own any profile plz create a profile to continue"
                );
            });
            it("Should make details of chat available", async () => {
                await contract.connect(addr1).addToContact(addr2);
                await contract.connect(addr2).startChat(addr1, 'hii addr1');
                const res: any = await contract.connect(addr2).getIndividualChat(addr1);
                expect(res.latestMessage).to.eq('hii addr1');
                expect(res.members[0]).to.eq(addr2);
                expect(res.members[1]).to.eq(addr1);
                expect(res.messages[0].sender).to.eq(addr2);
            });
        });
        describe('GetAllChats & messages', () => {
            it('Should provide All chat if called', async () => {
                await contract.connect(addr1).addToContact(addr2);
                await contract.connect(addr2).startChat(addr1, "hii addr1");
                const res = await contract.connect(addr1).getAllChats();
                const res2 = await contract.connect(addr2).getAllChats();
                expect(res[0].members[0]).to.eq(addr2);
                expect(res2[0].members[1]).to.eq(addr1);
            });
           it("Should provide all the messages when called", async () => {
             await contract.connect(addr1).addToContact(addr2);
             await contract.connect(addr1).startChat(addr2, "hola addr2");
             await contract.connect(addr2).startChat(addr1, "How u doin addr1");

             const res = await contract.connect(addr1).getAllMessage(addr2);
             const res1 = await contract.connect(addr2).getAllMessage(addr1);

               expect(res[0].text).to.eq("hola addr2");
               expect(res1[0].text).to.eq("hola addr2");
               expect(res[1].text).to.eq("How u doin addr1");
               expect(res1[1].text).to.eq("How u doin addr1");
           });
          

        });
    });
    describe("GroupChat", () => {
        beforeEach(async () => {
            await contract.createProfile()
        })
    })
}) 