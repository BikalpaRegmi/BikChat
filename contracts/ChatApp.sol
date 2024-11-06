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

//profiles
    mapping(address => Profile) public profiles;
    address[] public profileAddress;

    //contacts
    mapping(address=>mapping(address=>bool)) public contacts;    

//events
  event ProfileCreation(string _name , string _desc ,string  _img ,address _id);

    function createProfile (string memory _name , string memory _desc , string memory _image) external{

        require(profiles[msg.sender].id == address(0) , "Profile already exists"); //u can also write profile[msg.sender].id == 0

        Profile memory profile = Profile(_name , msg.sender , _desc , _image) ;

        profiles[msg.sender] = profile ;

        profileAddress.push(msg.sender);

        emit ProfileCreation(_name , _desc , _image , msg.sender);
        
    }

    function editProfile (string memory _name , string memory _desc , string memory _image ) external {
        require(msg.sender == profiles[msg.sender].id , "Only dont own any profile");

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

   

    function addToContact (address _profileToBeAdded) external {
                require(msg.sender == profiles[msg.sender].id , "Only dont own any profile");
        require(!contacts[msg.sender][_profileToBeAdded] , "The profile already exists");
require(_profileToBeAdded != msg.sender , 'You cant add urself');
contacts[msg.sender][_profileToBeAdded] =true;
    }

  function getAllProfiles() external view returns(Profile[] memory){
       Profile[] memory allprofiles = new Profile[](profileAddress.length);

       for(uint i=0 ; i<profileAddress.length ; i++){
        allprofiles[i] = profiles[profileAddress[i]];
       }
       return allprofiles ;
    }


}