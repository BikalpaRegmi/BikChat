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
    mapping(address => Profile) profiles;

//events
  event ProfileCreation(string _name , string _desc ,string  _img ,address _id);

    function createProfile (string memory _name , string memory _desc , string memory _image) external{

        require(profiles[msg.sender].id == address(0) , "Profile already created"); //u can also write profile[msg.sender].id == 0

        Profile memory profile = Profile(_name , msg.sender , _desc , _image) ;

        profiles[msg.sender] = profile ;

        emit ProfileCreation(_name , _desc , _image , msg.sender);
        
    }

    function editProfile (string memory _name , string memory _desc , string memory _image ) external {
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
}