// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.27;
import "@openzeppelin/contracts/utils/Strings.sol";

contract BIKCHAT {
        using Strings for address ;

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
    string id ;
string chatName;
Messages[] messages;
address[] members;
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
    mapping(address=>mapping(address=>Chat)) public indChats;
    mapping (address=>address[]) public chatPartners;
    
    //Group chats
    mapping(string=>GroupChat) public groupChats;
    mapping(address=>string[]) public userGroupChats;


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

indChats[_id][msg.sender] = strtCht;

strtCht.messages.push(newMsg);
indChats[_id][msg.sender].messages.push(newMsg);


chatPartners[msg.sender].push(_id);
chatPartners[_id].push(msg.sender);
  }

  function getIndividualChat(address _id) external view returns (Chat memory){
   return indChats[msg.sender][_id];
  }

function getAllChats() external view returns (Profile[] memory){
  uint chatPartnerLength = chatPartners[msg.sender].length ;
  Profile[] memory chats = new Profile[](chatPartnerLength);

  for(uint i=0 ; i<chatPartnerLength ; i++){
    address partner = chatPartners[msg.sender][i];
   chats[i] = profiles[partner];
  }
  return chats;
}
function getAllPartners() external view returns(address[] memory){
    return chatPartners[msg.sender];
}

function getAllMessage(address _id) external view returns (Messages[] memory){
    Chat memory indCht = indChats[msg.sender][_id];
    uint msgcount = indCht.messages.length;
    Messages[] memory messages = new Messages[](msgcount);

    for(uint i=0 ; i<msgcount ;i++){
        messages[i] = indCht.messages[i];
    }
    return messages;
}

function sendMessage(string memory _text , address _to) external {
    Chat storage chat = indChats[msg.sender][_to];

    Messages memory message = Messages({
        text:_text,
time:block.timestamp,
sender:msg.sender
    });
    chat.messages.push(message);
    indChats[_to][msg.sender].messages.push(message);
    
    chat.latestMessage = _text;
    
}

  function createGroupChat(address[] memory _peoples , string memory _name , string memory _id) external shouldOwnProfile{
    GroupChat storage gc = groupChats[_id] ;
    gc.id = _id ;
    gc.admin = msg.sender;
    gc.chatName = _name;
    gc.members = _peoples;
    gc.latestMessage = string(abi.encodePacked(profiles[msg.sender].name , ' Created the group'));

    for(uint i=0 ; i<_peoples.length ; i++){
        userGroupChats[_peoples[i]].push(_id);
    }
        userGroupChats[msg.sender].push(_id);
  }

function returnGc(string memory _id) external view returns (GroupChat memory){
return groupChats[_id];
}

  function editGroup(string memory _chtName , string memory _pic , string memory _id) external {
GroupChat storage gc = groupChats[_id];
bool isMember = false ;

for(uint i=0 ; i<gc.members.length ; i++){
 if(gc.members[i]==msg.sender ||gc.admin==msg.sender) {
    isMember = true;
 }
}
require(isMember , "U need to be member to edit grp info");
if(keccak256(bytes(gc.chatName)) != keccak256(bytes(_chtName))){
gc.chatName = _chtName;
}
if(keccak256(bytes(gc.gcPic)) != keccak256(bytes(_pic))){
gc.gcPic = _pic;
}
  }

  function deleteUserGrpCht(string memory _id , address _rmMember) internal {
    uint length = userGroupChats[_rmMember].length;
    for(uint i=0 ; i<length ; i++){
    if(keccak256(abi.encodePacked(userGroupChats[_rmMember][i])) == keccak256(abi.encodePacked(_id))){
     userGroupChats[_rmMember][i] = userGroupChats[_rmMember][length-1];
     userGroupChats[_rmMember].pop();
     break;
    }
    }
  }

function addMember(address _newMem , string memory _id) external {
    GroupChat storage gc = groupChats[_id] ;
    require(gc.admin == msg.sender , 'only admin can add and remove a member');
    bool alreadyMember = false ;
    for(uint i=0;i<gc.members.length ; i++){
        if(gc.members[i]==_newMem){
            alreadyMember=true;
        }
    }
    require(alreadyMember == false , 'The member is already added');
    gc.members.push(_newMem);
    userGroupChats[_newMem].push(_id);
}

function removeMember(address _rmMber , string memory _id ) external {
    GroupChat storage gc = groupChats[_id];
    require(gc.admin == msg.sender , 'Only admin can add or delete a user');
    uint gcMemberCount = gc.members.length;

    for(uint i=0 ; i<gcMemberCount ; i++){
     if(gc.members[i] == _rmMber){
        gc.members[i] = gc.members[gcMemberCount-1];
        gc.members.pop();
        deleteUserGrpCht(_id , _rmMber);
        break;
     }
    }
}

function leaveGroup(string memory _id) external {
    GroupChat storage gc = groupChats[_id];
    uint gcMemCnt = gc.members.length;
 bool isMem = false;
uint indexToRemove ;

    for(uint i=0 ; i<gcMemCnt ; i++) {
       if(gc.members[i]==msg.sender){
        isMem = true;
        indexToRemove = i;
        deleteUserGrpCht(_id , msg.sender);
        break;
       }
    }
    
    if(isMem){
     gc.members[indexToRemove] = gc.members[gcMemCnt-1];
     gc.members.pop();
    }
}

function getIndividualGroupChat(string memory _id) external view returns(GroupChat memory){
return groupChats[_id];
}

function addMessage (string memory _text , string memory _id) external {
GroupChat storage gc = groupChats[_id];

Messages memory mssg = Messages({
text : _text,
time:block.timestamp,
sender:msg.sender
});

gc.messages.push(mssg);

}

function getAllGroupChats() external view returns (GroupChat[] memory) {
 uint length = userGroupChats[msg.sender].length;
 GroupChat[] memory gcs = new GroupChat[](length);

 for(uint i=0 ; i<length ; i++){
   string memory ids = userGroupChats[msg.sender][i];
   gcs[i] = groupChats[ids];
 }
 return gcs ;
}

function deleteGroup(string memory _id) external {
GroupChat storage gc = groupChats[_id];
require(gc.admin == msg.sender , 'only admin can delete group');

for(uint i=0 ; i<gc.members.length ; i++){
    address member = gc.members[i];
   deleteUserGrpCht(_id , member);
}
delete groupChats[_id];
}

function getAllMessageOfGroup(string memory _id) external view returns (Messages[] memory){
    uint length = groupChats[_id].messages.length;
 Messages[] memory mssg = new Messages[](length);

 for(uint i=0 ; i<length ; i++){
    mssg[i] = groupChats[_id].messages[i];
 }
 return mssg;
}
  }


