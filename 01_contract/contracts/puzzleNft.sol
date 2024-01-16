// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import {IERC5192} from "./interfaces/IERC5192.sol";

contract puzzeleNft is ERC721, AccessControl, IERC5192 {
    bool private isLocked=true;
    error ErrLocked();
    error ErrNotFound();

    string private baseMedataURIPrefix;
    uint256 eventIdCount = 1;
    uint256 constant EVENT_PREFIX = 100000;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant DEVELOPER_ROLE = keccak256("DEVELOPER_ROLE");

    mapping(uint256 => uint256) piece; // eventId=>pieces for clear
    mapping(uint256 => uint256) counter; // eventId=>counts of mint
    mapping(uint256 => address[]) achievers; // envetId=>achievers
    mapping(uint256 => string) evntName; 

    //*********************************************
    //Initilizer
    //*********************************************
    constructor(string memory uriPrefix_) ERC721('DtuPuzzleNft', 'DPZL') {
        setMetadataPrefix(uriPrefix_);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(DEVELOPER_ROLE, msg.sender);
    }
    modifier checkLock() {
        if (isLocked) revert ErrLocked();
        _;
    }

    //*********************************************
    //Getter
    //*********************************************
    function tokenURI(uint256 tokenId_) public view override returns (string memory) {
        string memory _output = '';
        uint256 _eventId = tokenId_ / EVENT_PREFIX;
        uint256 _counter = tokenId_ % EVENT_PREFIX;

        _output = string(abi.encodePacked(
            baseMedataURIPrefix,
            toString(_eventId),
            '/',
            toString(_counter),
            '.json'
        ));
        return _output;
    }

    //*********************************************
    //Setter
    //*********************************************
    function setMinterRole(address granted_) public onlyRole(DEVELOPER_ROLE){
        _grantRole(MINTER_ROLE, granted_);
    }

    function setDeveloperRole(address granted_) public onlyRole(DEVELOPER_ROLE){
        _grantRole(DEVELOPER_ROLE, granted_);
    }

    function setMetadataPrefix(string memory uriPrefix_) public onlyRole(DEVELOPER_ROLE){
        baseMedataURIPrefix = uriPrefix_;
    }

    function setEvent(string memory eventName_, uint256 piece_) public onlyRole(DEVELOPER_ROLE){
        require(piece_ > 0 && piece_ < 101, 'puzzleNft.sol | Please set "0 < {piece} < 101"');
        eventIdCount++;
        uint256 _eventId = eventIdCount;
        
        piece[_eventId] = piece_;
        counter[_eventId] = 0;
        achievers[_eventId] = [];
        eventName[_eventId] = eventName_;
    }
    
    //*********************************************
    //Logic
    //*********************************************
    function mint(
        uint256 eventId_,
        address to_
    ) public onlyRole(MINTER_ROLE){
        require(counter[eventId_] > 0, 'puzzleNft.sol | This event-id is not registered');
        uint256 _counter = counter[eventId_] + 1;
        uint256 _tokenId = eventId_ * EVENT_PREFIX + _counter;  
        _mint(to_, _tokenId);

        if(_counter < piece[eventId_]){
            achievers[eventId_].push(to_);
        } else if(_counter == piece[eventId_]) {
            address[] memory _achievers = achievers[eventId_];
            for(uint256 i = 0; i < _achievers.length; ++i){
                _mint(_achievers[i], eventId_*EVENT_PREFIX);
            }
        }
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override checkLock {
        super.safeTransferFrom(from, to, tokenId, data);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId)
        public
        override
        checkLock
    {
        super.safeTransferFrom(from, to, tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId)
        public
        override
        checkLock
    {
        super.transferFrom(from, to, tokenId);
    }

    function approve(address approved, uint256 tokenId) public override checkLock {
        super.approve(approved, tokenId);
    }

    function setApprovalForAll(address operator, bool approved)
        public
        override
        checkLock
    {
        super.setApprovalForAll(operator, approved);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return interfaceId == type(IERC5192).interfaceId
        || super.supportsInterface(interfaceId);
    }
    function locked(uint256 tokenId) external view returns (bool) {
        if (!_exists(tokenId)) revert ErrNotFound();
        return isLocked;
    }
}