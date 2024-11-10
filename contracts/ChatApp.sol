// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.27;

contract BIKCHAT {

    address public owner;
     string public name ;
    
    constructor() {
        owner = msg.sender;
        name = "BikChat";
    }

    struct Profile{
       string name ;
       address id;
       string description;
       string image ;
    }

struct Messages{
string text ;
uint time;
address sender;
}

    struct Chat {
address[2] members;
Messages[] messages;
string latestMessage;
    }

struct GroupChat {
string chatName;
Messages[] messages;
string latestMessage;
address admin;
string gcPic;
}

//profiles
    mapping(address => Profile) public profiles;
    address[] public profileAddress;

    //contacts
    mapping(address=>mapping(address=>bool)) public contacts;    

    //Chats
    mapping(address=>mapping (address => Chat)) public indChats ;
    mapping(address=>address[]) chatPartners;

//events
  event ProfileCreation(string _name , string _desc ,string  _img ,address _id);

modifier shouldOwnProfile(){
    require(profiles[msg.sender].id == msg.sender , "You dont own any profile plz create a profile to continue");
    _;
}
    function createProfile (string memory _name , string memory _desc , string memory _image) external {

        require(profiles[msg.sender].id == address(0) , "Profile already exists"); //u can also write profile[msg.sender].id == 0

        Profile memory profile = Profile(_name , msg.sender , _desc , _image) ;

        profiles[msg.sender] = profile ;

        profileAddress.push(msg.sender);

        emit ProfileCreation(_name , _desc , _image , msg.sender);
        
    }

    function editProfile (string memory _name , string memory _desc , string memory _image ) external shouldOwnProfile{

      Profile storage profile = profiles[msg.sender];
     
     if(keccak256(bytes(_name)) != keccak256(bytes(profile.name))) {
        profile.name = _name ;
     }

     if(keccak256(bytes(_desc)) != keccak256(bytes(profile.description))) {
        profile.description = _desc;

     }

     if(keccak256(bytes(_image)) != keccak256(bytes(profile.image))) {
        profile.image = _image ;
     }
    }

    function addToContact (address _profileToBeAdded) external shouldOwnProfile{
        require(!contacts[msg.sender][_profileToBeAdded] , "The profile already exists");
require(_profileToBeAdded != msg.sender , 'You cant add urself');
contacts[msg.sender][_profileToBeAdded] =true;
contacts[_profileToBeAdded][msg.sender] = true;
    }

    function deleteContact(address _profileToBeDeleted) external shouldOwnProfile{
require(contacts[msg.sender][_profileToBeDeleted]==true , 'You can only remove if the person is already on contact');
contacts[msg.sender][_profileToBeDeleted] = false ;
    }

  function getAllProfiles() external view returns(Profile[] memory) {
       Profile[] memory allprofiles = new Profile[](profileAddress.length);

       for(uint i=0 ; i<profileAddress.length ; i++){
        allprofiles[i] = profiles[profileAddress[i]];
       }
       return allprofiles ;
    }

  function startChat(address _id , string memory _msg) external shouldOwnProfile{
    require(contacts[msg.sender][_id]==true , "The person is not in ur contact");
    require(_id != msg.sender , 'u cnt msg urslf');

    Chat storage strtCht = indChats[msg.sender][_id];
    strtCht.members[0] = msg.sender ;
    strtCht.members[1] = _id ;
    strtCht.latestMessage = _msg ;

Messages memory newMsg = Messages({
    text:_msg,
    time:block.timestamp,
    sender:msg.sender
});

strtCht.messages.push(newMsg);
chatPartners[msg.sender].push(_id);
chatPartners[_id].push(msg.sender);
  }

  function getIndividualChat(address _id) external view returns (Chat memory){
   return indChats[msg.sender][_id];
  }

function getAllChats() external view returns (Chat[] memory){
    
}
  }
