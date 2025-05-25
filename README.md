# BuidlMark

BuidlMark is a platform for showcasing and discovering web3 projects.

## Core Technologies and Architecture

This section details the core technologies and architecture used in BuidlMark.

### Frontend

*   **Framework/Library**: React (with Vite)
*   **Language**: TypeScript
*   **UI Components**: Radix UI, shadcn/ui
*   **State Management**: Zustand

### Backend

*   **Runtime Environment**: Node.js
*   **Framework**: Express
*   **Language**: TypeScript
*   **API Style**: RESTful APIs
*   **Real-time Communication**: WebSocket

### Database

*   **Platform**: Supabase (PostgreSQL)
*   **ORM**: Drizzle ORM
*   **Usage**: Stores off-chain data such as user information, project details, and comments.

### Smart Contracts

*   **Language**: Solidity
*   **Development Environment**: Hardhat
*   **Usage**: Manages on-chain logic, including user profiles, reputation systems, and project interactions.

### Overall Architecture

The BuidlMark platform follows a client-server architecture:

1.  **Client (Frontend)**: The React-based frontend allows users to interact with the platform. It communicates with the backend via RESTful APIs and WebSocket for real-time updates.
2.  **Backend Server**: The Node.js/Express server handles business logic, processes API requests, and interacts with both the Supabase database (for off-chain data) and the Ethereum blockchain (for on-chain data via smart contracts).
3.  **Database (Supabase)**: Stores relational data that doesn't need to be on-chain, providing a persistent storage layer.
4.  **Smart Contracts (Blockchain)**: Deployed on an Ethereum-compatible blockchain, these contracts govern core on-chain functionalities like user identity, reputation, and potentially project funding or governance mechanisms.

This architecture allows for a separation of concerns, with the frontend handling user interface and experience, the backend managing application logic and data orchestration, and smart contracts ensuring decentralized and transparent on-chain operations.

## Frontend Features

This section describes the user-facing pages and their functionalities within the BuidlMark application.

### Admin Area

*   **`admin/dashboard.tsx`**: Provides a central interface for platform administrators to manage users, projects, and other aspects of the BuidlMark application.
*   **`admin/login.tsx`**: Secure login page for administrators to access the admin dashboard.

### Core Application Pages

*   **`home.tsx`**: The main landing page of BuidlMark. It likely serves as an entry point, showcasing featured projects, recent activity, or a general overview of the platform's purpose.
*   **`leaderboard.tsx`**: Displays a leaderboard, potentially ranking users based on their impact scores, contributions, or other metrics, fostering a competitive and engaging environment.
*   **`learn.tsx`**: Offers educational resources, guides, or documentation to help users understand how to use the BuidlMark platform, learn about web3 concepts, or discover best practices for project submission and participation.

### User Profile

*   **`profile/index.tsx` & `profile.tsx`**: These pages are dedicated to user profiles. Users can likely view and manage their personal information, track their submitted projects, view their reputation or impact scores, and customize their public-facing profile.

### Projects

*   **`project-details.tsx`**: Displays comprehensive information about a specific project. This would include the project's description, goals, team members, progress, funding status, community discussion, and links to external resources.
*   **`submit.tsx`**: A form or a series of steps allowing users to submit their own web3 projects to the BuidlMark platform for discovery and potential support.

### "Names" Feature

*   **`names-assets.tsx` & `names.tsx`**: These pages appear to be related to a "Names" feature. While the exact functionality isn't fully clear from the filenames alone, it could be linked to a system for claiming or managing unique identifiers, possibly integrated with ENS (Ethereum Name Service) or an internal naming/identity system for users or projects.

### Utility Pages

*   **`not-found.tsx`**: A standard 404 error page that is displayed when a user tries to access a URL that does not exist on the platform, guiding them back to valid sections of the site.

## Backend API Endpoints and Functionality

The backend API, built with Node.js and Express, provides the data and services for the BuidlMark platform. It interacts with the Supabase database (via a storage abstraction layer) and external services.

### Project Management API (`/api/projects`)

*   **GET `/`**: Retrieves all projects. Supports filtering by category or search terms, and sorting by criteria such as total funding, recently added, most supported, and trending.
*   **GET `/:id`**: Fetches details for a single project by its unique identifier.
*   **POST `/`**: Creates a new project. (TODO: Implement authentication for this endpoint).
*   **POST `/import`**: Imports projects from external platforms like Gitcoin or Giveth. (TODO: This feature may not be fully implemented or may require further development).

### User Management API (`/api/users`)

Endpoints for managing user profiles and related data.

*   **GET `/:address`**: Retrieves the public profile information for a user based on their wallet address.
*   **PATCH `/:address`**: Updates a user's profile. This endpoint is protected by a token verification middleware, ensuring only the authenticated user can modify their own profile.
*   **GET `/:address/projects`**: Fetches a list of projects owned or created by the specified user.
*   **GET `/:address/stats`**: Retrieves user statistics, including their contributions, platform points, number of projects owned, and overall impact score.

### Comments API

Endpoints for managing comments on projects. Real-time updates for comments are handled via WebSockets.

*   **GET `/api/projects/:projectId/comments`**: Fetches all comments for a specific project.
*   **POST `/api/projects/:projectId/comments`**: Creates a new comment for a project. (TODO: Clarify how user ID is associated with the comment, e.g., from authenticated session). Real-time updates are sent to connected clients.
*   **POST `/api/comments/:id/vote`**: Allows users to upvote or "like" a comment. Real-time updates are sent to connected clients.
*   **DELETE `/api/comments/:id`**: Deletes a specific comment. (TODO: Implement proper permission checks to ensure only the comment owner or an admin can delete). Real-time updates are sent to connected clients.

### Activities API

*   **GET `/api/projects/:projectId/activities`**: Retrieves the activity feed for a specific project, showing recent actions or updates related to it.

### Proxy Endpoints

These endpoints proxy requests to external services, abstracting direct frontend interaction with them.

*   **`/api/gitcoin`**: Proxies requests to Gitcoin's GraphQL API, likely for fetching project or user data from the Gitcoin platform.
*   **`/api/giveth`**: Proxies requests to Giveth's GraphQL API, for similar purposes related to the Giveth platform.

### Admin Endpoints (`/api/admin`)

Endpoints intended for administrative purposes. (TODO: Implement robust admin authentication for these endpoints).

*   **`/sync-giveth`**: Triggers a process to fetch project data from the Giveth API and store it locally within the BuidlMark database.
*   **`/scrape-giveth-web`**: Initiates a script to scrape project data from the Giveth website.

### WebSockets

*   The backend utilizes **Socket.IO** for real-time communication. This is primarily used for features like instant updates to comments (creation, upvotes, deletion) across all connected clients viewing a project.

### Storage Abstraction

*   The backend includes a `storage` abstraction layer. This layer is responsible for handling data persistence and likely interacts with Supabase (PostgreSQL) to store and retrieve application data such as user profiles, project details, and comments.

## Smart Contract (ProfileSystem.sol) Features

The `ProfileSystem.sol` smart contract, built with Solidity and deployed on an Ethereum-compatible blockchain, forms the core of on-chain user identity, reputation, and interaction within BuidlMark.

### Core Profile System

*   **`Profile` struct**: This is the central data structure for user profiles. Key fields include:
    *   `profileDataHash`: An IPFS hash pointing to a JSON object containing off-chain profile details (e.g., bio, social links, avatar).
    *   `createdAt`, `updatedAt`: Timestamps for profile creation and last update.
    *   `followers`, `following`: Counts of users following and being followed.
    *   `points`: Total reputation points accumulated by the user.
    *   `status`: User status (e.g., Active, Inactive).
    *   `passportScore`: Score from Gitcoin Passport verification, indicating Sybil resistance.
    *   `ensName`: Linked ENS (Ethereum Name Service) name, if any.
    *   `ownedProjects`, `supportedProjects`, `signaledProjects`: Lists of project identifiers associated with the user.
    *   `badges`: A list or mapping of badges awarded to the user.
    *   `contributions`: Tracks user contributions (e.g., to projects).
    *   `impactScore`: A calculated score representing the user's overall impact on the platform.
    *   `isProjectManager`: Boolean flag indicating if the user has project manager privileges within the contract.

*   **Profile Management Functions**:
    *   `createProfile(string memory _profileDataHash, string memory _ensName)`: Allows a user to create their on-chain profile, linking to their off-chain data via an IPFS hash.
    *   `updateProfile(string memory _profileDataHash, string memory _ensName)`: Enables users to update their profile data hash and ENS name.

### Social Features

*   **Following System**:
    *   `followUser(address _userToFollow)`: Allows a user to follow another user.
    *   `unfollowUser(address _userToUnfollow)`: Allows a user to unfollow another user.
*   **Social Events**: Events like `UserFollowed(address indexed follower, address indexed followed)` and `UserUnfollowed(address indexed follower, address indexed unfollowed)` are emitted for these actions.

### Reputation and Engagement

*   **Points System**:
    *   `addPoints(address _user, uint256 _amount, PointActionType _actionType)`: A function to add points to a user's profile for various actions. (TODO: Access control for this function needs to be clearly defined, likely restricted to managers or specific contract logic).
    *   `PointAction` struct: Stores details about each point-accruing action (e.g., `actionType`, `amount`, `timestamp`).
    *   `pointHistory` mapping: `mapping(address => PointAction[]) public pointHistory;` tracks the history of points awarded to a user.
*   **Gitcoin Passport Verification**:
    *   `verifyPassport(address _user, uint256 _score)`: Called by a manager to record a user's Gitcoin Passport verification score. Awards `PASSPORT_VERIFICATION_POINTS`.
*   **Badge Awarding**:
    *   `awardBadge(address _user, string memory _badgeName, string memory _badgeURI)`: Allows managers to award badges (represented by a name and URI, possibly pointing to metadata/image) to users.
*   **Point Constants**: The contract defines constants for points awarded for specific actions, e.g., `PASSPORT_VERIFICATION_POINTS`, `PROJECT_SIGNAL_POINTS`.

### Project Interaction

*   **Supporting Projects**:
    *   `supportProject(address _projectContract, uint256 _amount)`: Allows users to send funds (e.g., ETH or ERC20 tokens) to a project contract. Users earn points proportional to their contribution.
*   **Signaling Projects**:
    *   `signalProject(address _projectContract)`: Enables users to signal their interest or endorsement for a project without necessarily sending funds, earning `PROJECT_SIGNAL_POINTS`.
*   **Project Ownership**:
    *   `grantProjectOwnership(address _user, address _projectContract)`: Allows managers to assign ownership or administrative rights of a project (represented by its contract address) to a user within the `ProfileSystem`.

### Impact Score

*   **`impactScore` Field**: Stored within the `Profile` struct.
*   **`_updateImpactScore(address _user)`**: An internal function automatically triggered by actions like project support, signaling, point accrual, and Passport verification.
    *   **Calculation Overview**: The impact score is a weighted combination of:
        *   Total financial contributions made.
        *   Gitcoin Passport score (as a measure of trustworthiness/uniqueness).
        *   Total accumulated points from various platform activities.
        *   Engagement metrics (e.g., number of projects supported/signaled, followers).

### Roles and Permissions

*   **Contract Owner**: The address that deploys the contract implicitly has `owner` privileges, primarily used for managing the list of platform managers.
    *   `addManager(address _manager)`: Allows the owner to grant manager roles.
    *   `removeManager(address _manager)`: Allows the owner to revoke manager roles.
*   **Manager Role (`isManager` mapping)**:
    *   `mapping(address => bool) public isManager;`
    *   Managers have elevated privileges, including:
        *   Verifying Gitcoin Passports (`verifyPassport`).
        *   Awarding badges (`awardBadge`).
        *   Granting project ownership/association (`grantProjectOwnership`).
        *   Potentially other administrative functions (e.g., `addPoints` if restricted).
*   **`profileExists(address _user)` Modifier**: Used to ensure functions that operate on profiles only execute if the target user has an existing profile.

### Data Retrieval (Getter Functions)

The contract provides several public getter functions to retrieve on-chain data:

*   `getPointHistory(address _user) returns (PointAction[] memory)`: Retrieves the array of `PointAction` structs for a user.
*   `getProjectsData(address _user) returns (address[] memory owned, address[] memory supported, address[] memory signaled)`: Returns lists of project contract addresses associated with a user in different capacities.
*   `getExtendedProfile(address _user) returns (Profile memory, uint256 followersCount, uint256 followingCount)`: Fetches a comprehensive view of a user's profile, including details from the `Profile` struct and their follower/following counts.
*   `hasBadge(address _user, string memory _badgeName) returns (bool)`: Checks if a user has been awarded a specific badge.

### Events

The contract emits various events to signal important state changes, enabling off-chain services to track activity:

*   `ProfileCreated(address indexed user, string profileDataHash, uint256 timestamp)`
*   `ProfileUpdated(address indexed user, string newProfileDataHash, uint256 timestamp)`
*   `UserFollowed(address indexed follower, address indexed followed, uint256 timestamp)`
*   `UserUnfollowed(address indexed follower, address indexed unfollowed, uint256 timestamp)`
*   `PassportVerified(address indexed user, uint256 score, uint256 pointsAwarded, uint256 timestamp)`
*   `BadgeAwarded(address indexed user, string badgeName, string badgeURI, address indexed awardedBy, uint256 timestamp)`
*   `PointsAdded(address indexed user, uint256 amount, PointActionType actionType, uint256 timestamp)`
*   `ProjectSupported(address indexed user, address indexed projectContract, uint256 amount, uint256 pointsAwarded, uint256 timestamp)`
*   `ProjectSignaled(address indexed user, address indexed projectContract, uint256 pointsAwarded, uint256 timestamp)`
*   `ProjectOwnershipGranted(address indexed user, address indexed projectContract, address indexed grantedBy, uint256 timestamp)`
*   `ImpactScoreUpdated(address indexed user, uint256 newImpactScore, uint256 timestamp)`
*   `ManagerAdded(address indexed manager, address indexed addedBy)`
*   `ManagerRemoved(address indexed manager, address indexed removedBy)`

## External Service Integrations

BuidlMark leverages several external services to enhance its functionality, data sources, and user experience.

### IPFS (InterPlanetary File System)

*   **Usage**: IPFS is used for decentralized storage of off-chain user profile data.
*   **Implementation**: When a user creates or updates their profile, detailed information (like bio, social media links, avatar image URL) is compiled into a JSON object, which is then uploaded to IPFS. The resulting IPFS content hash (CID) is stored on-chain in the `profileDataHash` field of the user's `Profile` struct within the `ProfileSystem.sol` smart contract. This approach keeps mutable and potentially large data off-chain while maintaining a verifiable link from the on-chain profile.

### Gitcoin Passport

*   **Usage**: Gitcoin Passport is integrated to provide Sybil resistance and enhance user identity verification. By verifying "stamps" from various online services, users can prove their uniqueness and trustworthiness.
*   **Implementation**:
    *   **Backend**: The backend utilizes the `@gitcoinco/passport-sdk-reader` and `@gitcoinco/passport-sdk-verifier` libraries to interact with the Gitcoin Passport system. It likely fetches and verifies a user's Passport score.
    *   **Smart Contract**: The `ProfileSystem.sol` contract includes a `passportScore` field in the `Profile` struct to store a user's verified score. A manager-restricted function (`verifyPassport`) is available to update this score on-chain, which can then contribute to the user's overall `impactScore`.

### Giveth API

*   **Usage**: The Giveth platform is a source for existing web3 and public goods projects. BuidlMark integrates with Giveth to import and display these projects.
*   **Implementation**:
    *   **Proxy Endpoint**: The backend provides a proxy endpoint (`/api/giveth`) that forwards requests to Giveth's GraphQL API. This allows the frontend to query Giveth data without direct exposure or CORS issues.
    *   **Data Synchronization**: An administrative endpoint (`/api/admin/sync-giveth`) triggers a process to fetch project data from the Giveth API and store it locally (e.g., potentially in a file like `client/src/data/giveth-projects.json` or directly into the Supabase database).
    *   **Web Scraping**: A script (`scripts/scrape-giveth.js` or similar) is also available for scraping project data directly from the Giveth website, likely as a supplementary method for data collection.

### Gitcoin Grants Stack API

*   **Usage**: The Gitcoin Grants Stack provides infrastructure for quadratic funding and grant programs. Integration with its API allows BuidlMark to source data about projects participating in Gitcoin grants, their funding status, and potentially other grant-related information.
*   **Implementation**:
    *   **Proxy Endpoint**: The backend includes a proxy endpoint (`/api/gitcoin`) that queries the Gitcoin Grants Stack Indexer GraphQL API. This enables the platform to fetch and display relevant grant and project information.

### Supabase

*   **Usage**: Supabase serves as the primary off-chain data storage solution, providing a managed PostgreSQL database, authentication services, and other backend utilities.
*   **Implementation**:
    *   **Database**: The backend interacts with Supabase using the `@supabase/supabase-js` client library. It's used to store data that is not suitable for the blockchain due to size, cost, or mutability. This includes:
        *   Detailed project information beyond what's on IPFS.
        *   User account details (potentially linked to wallet addresses).
        *   User activity logs, comments on projects, and other relational data.
    *   **Authentication**: Supabase likely handles user authentication, possibly using its built-in support for wallet-based logins (e.g., Sign-In with Ethereum).

## Key Data Models/Schemas

BuidlMark utilizes several key data models to represent its core entities, both on-chain and off-chain.

Detailed schema definitions for off-chain data, managed primarily in Supabase (PostgreSQL), are defined using Drizzle ORM. Validation for this data is typically handled using Zod. These definitions can be found in `shared/schema.ts`.

The core entities include:

*   **User**: Represents users of the BuidlMark platform.
    *   **Off-chain (Supabase)**: Stores detailed user information, authentication details, and preferences. This is typically linked to a user's on-chain Ethereum address.
    *   **On-chain (`ProfileSystem.sol`)**: Represented by an Ethereum address, which is the key to their `Profile` struct.

*   **Project**: Represents projects listed on the platform.
    *   **Off-chain (Supabase)**: Contains comprehensive details about each project, such as description, team information, images/videos, funding goals, and links to external resources. Projects might be created directly on the platform or imported from external sources like Giveth or Gitcoin.
    *   **On-chain**: While full project details are off-chain, projects might have an on-chain representation (e.g., a smart contract address if they are a DApp or have their own token) which can be linked in the `ProfileSystem.sol` contract (e.g., in `ownedProjects`, `supportedProjects`).

*   **Comment**: User-generated comments or discussions related to projects.
    *   **Off-chain (Supabase)**: Stores the comment text, the author (user ID), the associated project ID, and timestamps.

*   **Activity**: Records significant actions or updates related to users or projects.
    *   **Off-chain (Supabase)**: Used for creating activity feeds, such as new project submissions, major project milestones, or significant user achievements.

*   **Profile (On-chain)**: The primary on-chain data structure defined as the `Profile` struct within the `ProfileSystem.sol` smart contract.
    *   **On-chain (`ProfileSystem.sol`)**: Holds user-specific on-chain data including their reputation (points, impact score), social graph connections (followers, following), Gitcoin Passport score, linked ENS name, references to owned/supported/signaled projects, awarded badges, and the IPFS hash (`profileDataHash`) pointing to their detailed off-chain profile JSON.

*   **Contribution**: Records of users financially supporting projects.
    *   **Off-chain (Supabase)**: Likely stores details of each contribution, such as the user, project, amount, transaction hash (if applicable), and timestamp. This complements the on-chain `supportProject` interactions in `ProfileSystem.sol`.

*   **UserActivity / PointAction**: Records specific user activities that result in earning points or other forms of reputation.
    *   **On-chain (`ProfileSystem.sol`)**: The `PointAction` struct and `pointHistory` mapping within the smart contract log actions that directly modify a user's points on-chain.
    *   **Off-chain (Supabase)**: May store a more granular log of all user activities, including those that might not directly translate to on-chain points but are relevant for analytics or user-facing history.
