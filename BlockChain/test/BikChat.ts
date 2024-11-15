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
            await contract.createProfile('Owner', 'Ola i am Owner', 'owner.png');
            await contract.createGroupChat([addr1.getAddress(), addr2.getAddress()], 'Guff', '1');
            await contract.connect(addr2).createGroupChat([owner.getAddress()], 'Ntg', '3');
        });

        describe('createGrp', () => {     
            it("Should add the details on groupChats", async () => {
                const res = await contract.returnGc('1');
                expect(res.latestMessage).to.eq(`${(await owner.getAddress()).toLowerCase()} Created the group`);
                expect(res.members[0]).to.eq(await addr1.getAddress());
            });

            it("Should add to userGroupChats", async () => {
                const res = await contract.userGroupChats(owner,0);
           expect(res[0]).to.eq("1");
            });

        });
        
        describe('editGroup',  () => {
            it("Should edit the groupChat", async () => {
                await contract.editGroup('lol', 'img.png', '3');
                const res = await contract.returnGc('3');
                expect(res.chatName).to.eq('lol');
                expect(res.gcPic).to.eq('img.png');
            });

            it('Should revert if not a member', async () => {
                await expect(
                    contract.connect(addr1).editGroup("", "", "3")
                ).to.be.revertedWith("U need to be member to edit grp info");
            });

            it("Should add a member", async () => {
                const resBefore = await contract.returnGc("3");
                expect(resBefore.members.length).to.eq(1);
                await contract.connect(addr2).addMember(addr1, '3');
                const res = await contract.returnGc('3');
                expect(res.members.length).to.eq(2);
                await expect(
                  contract.connect(addr2).addMember(addr1, "3")
                ).to.be.revertedWith("The member is already added");
            });

            it("Should remove member when admin wants", async () => {
                await contract.removeMember(addr1, '1');
                const res = await contract.returnGc('1');
                expect(res.members.length).to.eq(1);
                expect(res.members[0]).to.eq(addr2);
            });

            it("Should let the member to leave group", async () => {
                await contract.connect(addr2).leaveGroup('1');
                const res = await contract.returnGc('1');
                expect(res.members[0]).to.eq(addr1);
                expect(res.members.length).to.eq(1);
            });
        })
        describe('Group Messages and Group Chats', () => {
            it("Should add message on the chat", async () => {
                await contract.connect(addr2).addMessage('Hii i am addr2', '1');
                const res = await contract.returnGc('1');
                expect(res.messages[0].text).to.eq("Hii i am addr2");
                expect(res.messages.length).to.eq(1);
            });

            it("Should provide all groupChats", async () => {
                const res = await contract.getAllGroupChats();
                expect(res.length).to.eq(2);
                expect(res[0].id).to.eq('1');
                expect(res[1].id).to.eq('3');
            });

            it("Should delete the group if admin calls", async () => {
                await contract.deleteGroup('1');
                const res = await contract.getAllGroupChats();
                const newRes = res.filter((curval: any) => curval.id != '');
                expect(newRes[0].id).to.eq('3')
                expect(newRes.length).to.eq(1);
            });

            it('Should get all the messages from the group', async () => {
                await contract.addMessage('Hello', '1');
                await contract.connect(addr1).addMessage('Hello i am addr1', '1');
                await contract.connect(addr2).addMessage('Hello i am addr2', '1');
                const res = await contract.getAllMessageOfGroup('1');

                expect(res.length).to.eq(3);
                expect(res[0].text).to.eq("Hello");
                expect(res[1].text).to.eq("Hello i am addr1");
                expect(res[2].text).to.eq("Hello i am addr2");
            })
        })
    })
}) 