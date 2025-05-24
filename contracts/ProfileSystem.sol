// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProfileSystem {
    struct Profile {
        string ipfsHash;              // IPFS hash containing profile data
        uint256 createdAt;            // Timestamp of profile creation
        uint256 updatedAt;            // Timestamp of last update
        address[] followers;           // List of followers
        address[] following;           // List of addresses this user follows
        uint256 totalPoints;          // Total points earned
        bool isActive;                // Profile status
        uint256 passportScore;        // Gitcoin Passport score
        bool isPassportVerified;      // Whether the user has verified their Passport
        string ensName;               // ENS name if registered
        address[] projectsOwned;      // Projects owned by this user
        address[] projectsSupported;  // Projects supported (funded) by this user
        address[] projectsSignaled;   // Projects signaled (endorsed) by this user
        mapping(string => bool) badges;// Achievement badges earned
        uint256 totalContributions;   // Total amount contributed to projects
        uint256 impactScore;          // Calculated impact score
        bool isProjectManager;        // Whether the user can manage projects
    }

    mapping(address => Profile) public profiles;
    mapping(address => mapping(address => bool)) public isFollowing;
    uint256 public totalProfiles;

    event ProfileCreated(address indexed user, string ipfsHash);
    event ProfileUpdated(address indexed user, string ipfsHash);
    event UserFollowed(address indexed follower, address indexed following);
    event UserUnfollowed(address indexed follower, address indexed following);
    event PassportVerified(address indexed user, uint256 score);
    event BadgeEarned(address indexed user, string badgeName);
    event ProjectSupported(address indexed user, address indexed project, uint256 amount);
    event ProjectSignaled(address indexed user, address indexed project);
    event ProjectOwnershipGranted(address indexed user, address indexed project);
    event ProjectManagerAdded(address indexed user);
    event ImpactScoreUpdated(address indexed user, uint256 newScore);
    event ContributionAdded(address indexed user, uint256 amount, string contributionType);

    // Struct for point history
    struct PointAction {
        string actionType;
        uint256 points;
        uint256 timestamp;
        string metadata;
    }

    // Mapping to store point history
    mapping(address => PointAction[]) public pointHistory;
    // Mapping for project managers
    mapping(address => bool) public isManager;
    // Mapping for project ownership verification
    mapping(address => mapping(address => bool)) public isProjectOwner;

    // Constants for point rewards
    uint256 public constant PASSPORT_VERIFICATION_POINTS = 100;
    uint256 public constant PROJECT_SIGNAL_POINTS = 5;
    uint256 public constant MIN_CONTRIBUTION_POINTS = 10;
    
    modifier profileExists(address _user) {
        require(profiles[_user].isActive, "Profile does not exist");
        _;
    }

    function createProfile(string memory _ipfsHash) external {
        require(!profiles[msg.sender].isActive, "Profile already exists");
        
        profiles[msg.sender] = Profile({
            ipfsHash: _ipfsHash,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            followers: new address[](0),
            following: new address[](0),
            totalPoints: 0,
            isActive: true
        });
        
        totalProfiles++;
        emit ProfileCreated(msg.sender, _ipfsHash);
    }

    function updateProfile(string memory _ipfsHash) external profileExists(msg.sender) {
        profiles[msg.sender].ipfsHash = _ipfsHash;
        profiles[msg.sender].updatedAt = block.timestamp;
        emit ProfileUpdated(msg.sender, _ipfsHash);
    }

    function followUser(address _user) external profileExists(msg.sender) profileExists(_user) {
        require(msg.sender != _user, "Cannot follow yourself");
        require(!isFollowing[msg.sender][_user], "Already following");

        isFollowing[msg.sender][_user] = true;
        profiles[msg.sender].following.push(_user);
        profiles[_user].followers.push(msg.sender);
        
        emit UserFollowed(msg.sender, _user);
    }

    function unfollowUser(address _user) external profileExists(msg.sender) profileExists(_user) {
        require(isFollowing[msg.sender][_user], "Not following");

        isFollowing[msg.sender][_user] = false;
        
        // Remove from following array
        _removeFromArray(profiles[msg.sender].following, _user);
        // Remove from followers array
        _removeFromArray(profiles[_user].followers, msg.sender);
        
        emit UserUnfollowed(msg.sender, _user);
    }

    function addPoints(address _user, uint256 _points) external profileExists(_user) {
        // TODO: Add access control to restrict who can add points
        profiles[_user].totalPoints += _points;
    }

    function verifyPassport(address _user, uint256 _score) external {
        require(isManager[msg.sender], "Only managers can verify passports");
        require(_score > 0, "Invalid passport score");
        
        profiles[_user].passportScore = _score;
        profiles[_user].isPassportVerified = true;
        
        // Award points for passport verification
        _addPoints(_user, PASSPORT_VERIFICATION_POINTS, "PASSPORT_VERIFIED", "");
        
        emit PassportVerified(_user, _score);
    }

    function awardBadge(address _user, string memory _badgeName) external {
        require(isManager[msg.sender], "Only managers can award badges");
        require(!profiles[_user].badges[_badgeName], "Badge already awarded");
        
        profiles[_user].badges[_badgeName] = true;
        emit BadgeEarned(_user, _badgeName);
    }

    function setENSName(string memory _ensName) external profileExists(msg.sender) {
        profiles[msg.sender].ensName = _ensName;
        emit ProfileUpdated(msg.sender, profiles[msg.sender].ipfsHash);
    }

    function addProjectManager(address _manager) external {
        require(msg.sender == owner(), "Only owner can add managers");
        isManager[_manager] = true;
        emit ProjectManagerAdded(_manager);
    }
    
    function supportProject(address _project, uint256 _amount) external profileExists(msg.sender) {
        require(_amount > 0, "Amount must be positive");
        
        if (!_contains(profiles[msg.sender].projectsSupported, _project)) {
            profiles[msg.sender].projectsSupported.push(_project);
        }
        
        profiles[msg.sender].totalContributions += _amount;
        
        // Calculate points based on contribution amount
        uint256 points = (_amount / 1 ether) * MIN_CONTRIBUTION_POINTS;
        _addPoints(msg.sender, points, "PROJECT_SUPPORTED", string(abi.encodePacked("Supported project: ", _addressToString(_project))));
        
        emit ProjectSupported(msg.sender, _project, _amount);
        _updateImpactScore(msg.sender);
    }

    function signalProject(address _project) external profileExists(msg.sender) {
        require(!_contains(profiles[msg.sender].projectsSignaled, _project), "Already signaled this project");
        
        profiles[msg.sender].projectsSignaled.push(_project);
        _addPoints(msg.sender, PROJECT_SIGNAL_POINTS, "PROJECT_SIGNALED", string(abi.encodePacked("Signaled support for: ", _addressToString(_project))));
        
        emit ProjectSignaled(msg.sender, _project);
        _updateImpactScore(msg.sender);
    }

    function grantProjectOwnership(address _user, address _project) external {
        require(isManager[msg.sender], "Only managers can grant project ownership");
        require(!isProjectOwner[_user][_project], "Already owner of this project");
        
        isProjectOwner[_user][_project] = true;
        profiles[_user].projectsOwned.push(_project);
        
        emit ProjectOwnershipGranted(_user, _project);
    }

    function _updateImpactScore(address _user) internal {
        // Impact score calculation:
        // - 40% based on total contributions
        // - 30% based on passport score
        // - 20% based on total points
        // - 10% based on community engagement (followers + following)
        
        uint256 contributionScore = (profiles[_user].totalContributions * 40) / 100;
        uint256 passportScore = (profiles[_user].passportScore * 30) / 100;
        uint256 pointScore = (profiles[_user].totalPoints * 20) / 100;
        uint256 engagementScore = ((profiles[_user].followers.length + profiles[_user].following.length) * 10) / 100;
        
        profiles[_user].impactScore = contributionScore + passportScore + pointScore + engagementScore;
        
        emit ImpactScoreUpdated(_user, profiles[_user].impactScore);
    }

    function _addPoints(address _user, uint256 _points, string memory _actionType, string memory _metadata) internal {
        profiles[_user].totalPoints += _points;
        pointHistory[_user].push(PointAction({
            actionType: _actionType,
            points: _points,
            timestamp: block.timestamp,
            metadata: _metadata
        }));
        
        emit ContributionAdded(_user, _points, _actionType);
    }

    function _removeFromArray(address[] storage array, address value) internal {
        for (uint i = 0; i < array.length; i++) {
            if (array[i] == value) {
                array[i] = array[array.length - 1];
                array.pop();
                break;
            }
        }
    }

    function _contains(address[] storage array, address value) internal view returns (bool) {
        for (uint i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return true;
            }
        }
        return false;
    }

    function _addressToString(address _addr) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(_addr)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);            
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    function getPointHistory(address _user) external view returns (
        string[] memory actionTypes,
        uint256[] memory points,
        uint256[] memory timestamps,
        string[] memory metadata
    ) {
        PointAction[] storage history = pointHistory[_user];
        uint256 length = history.length;
        
        actionTypes = new string[](length);
        points = new uint256[](length);
        timestamps = new uint256[](length);
        metadata = new string[](length);
        
        for (uint i = 0; i < length; i++) {
            actionTypes[i] = history[i].actionType;
            points[i] = history[i].points;
            timestamps[i] = history[i].timestamp;
            metadata[i] = history[i].metadata;
        }
        
        return (actionTypes, points, timestamps, metadata);
    }

    function getProjectsData(address _user) external view returns (
        address[] memory owned,
        address[] memory supported,
        address[] memory signaled
    ) {
        return (
            profiles[_user].projectsOwned,
            profiles[_user].projectsSupported,
            profiles[_user].projectsSignaled
        );
    }

    function getExtendedProfile(address _user) external view returns (
        string memory ipfsHash,
        string memory ensName,
        uint256 passportScore,
        bool isPassportVerified,
        uint256 totalPoints,
        uint256 totalContributions,
        uint256 impactScore,
        uint256 followersCount,
        uint256 followingCount,
        bool isProjectManager
    ) {
        Profile storage profile = profiles[_user];
        return (
            profile.ipfsHash,
            profile.ensName,
            profile.passportScore,
            profile.isPassportVerified,
            profile.totalPoints,
            profile.totalContributions,
            profile.impactScore,
            profile.followers.length,
            profile.following.length,
            profile.isProjectManager
        );
    }

    function hasBadge(address _user, string memory _badgeName) external view returns (bool) {
        return profiles[_user].badges[_badgeName];
    }
}
