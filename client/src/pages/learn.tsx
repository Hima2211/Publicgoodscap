import { useState } from 'react';

const docsMenu = [
  { id: 'intro', label: 'Introduction' },
  { id: 'discovery', label: 'Project Discovery' },
  { id: 'naming', label: 'Naming Services' },
  { id: 'profiles', label: 'Profiles & Social' },
  { id: 'community', label: 'Discussions & Community' },
  { id: 'wallet', label: 'Wallet & Security' },
  { id: 'faq', label: 'FAQ' },
  // { id: 'api', label: 'API & Integrations' }, // Uncomment if public API
];

const docsContent: Record<string, JSX.Element> = {
  intro: (
    <>
      <h2 className="text-2xl font-bold mb-4 text-foreground">Welcome to YouBuidl Docs</h2>
      <p className="mb-4 text-foreground">YouBuidl is a platform for digital identity, project discovery, and public goods. Register your .youbuidl or .givestation name, join communities, and build your web3 presence.</p>
      <ul className="list-disc pl-6 text-lg text-foreground">
        <li>Decentralized naming for projects, DAOs, and individuals</li>
        <li>Easy onboarding and wallet integration</li>
        <li>Community-driven curation and discovery</li>
        <li>Modern, responsive UI with dark/light mode</li>
      </ul>
    </>
  ),
  discovery: (
    <>
      <h2 className="text-2xl font-bold mb-4 text-foreground">Project Discovery</h2>
      <p className="mb-4 text-foreground">Find and explore projects, DAOs, and communities using:</p>
      <ul className="list-disc pl-6 text-lg text-foreground">
        <li><b>Home</b> — Curated and trending projects</li>
        <li><b>Leaderboard</b> — Top projects by impact, activity, or votes</li>
        <li><b>YouBuidl Names</b> — Browse by name or type</li>
        <li><b>Search</b> — Find projects by name, tag, or description</li>
      </ul>
    </>
  ),
  naming: (
    <>
      <h2 className="text-2xl font-bold mb-4 text-foreground">Naming Services</h2>
      <p className="mb-4 text-foreground">YouBuidl offers two types of names: <b>.youbuidl</b> and <b>.givestation</b>. These are unique, human-readable handles for your project, DAO, or personal identity.</p>
      <ul className="list-disc pl-6 text-lg text-foreground mb-4">
        <li><b>.youbuidl</b> — For projects, DAOs, and individuals. Use as your web3 handle, login, and for discovery.</li>
        <li><b>.givestation</b> — For communities, DAOs, and public goods. Organize, fund, and grow your collective impact.</li>
      </ul>
      <ol className="list-decimal pl-6 text-lg text-foreground mb-4">
        <li>Search for an available name</li>
        <li>Connect your wallet</li>
        <li>Register and confirm the transaction</li>
        <li>Manage your name (transfer, renew, update profile)</li>
      </ol>
      <p className="text-foreground">Names are owned by your wallet and can be transferred. Use your name to build reputation and connect across the platform.</p>
    </>
  ),
  profiles: (
    <>
      <h2 className="text-2xl font-bold mb-4 text-foreground">Profiles & Social</h2>
      <p className="mb-4 text-foreground">Set up your profile, view stats, and track your activity. Engage with others through comments, likes, and replies.</p>
      <ul className="list-disc pl-6 text-lg text-foreground">
        <li>Personal and project profiles</li>
        <li>Stats: contributions, impact, and more</li>
        <li>Activity feed and notifications</li>
      </ul>
    </>
  ),
  community: (
    <>
      <h2 className="text-2xl font-bold mb-4 text-foreground">Discussions & Community</h2>
      <p className="mb-4 text-foreground">Join real-time discussions on projects. Like, reply, and connect with the community. All comments update live via WebSocket.</p>
      <ul className="list-disc pl-6 text-lg text-foreground">
        <li>Comment, like, and reply on project pages</li>
        <li>Live updates and notifications</li>
        <li>Community guidelines for positive engagement</li>
      </ul>
    </>
  ),
  wallet: (
    <>
      <h2 className="text-2xl font-bold mb-4 text-foreground">Wallet & Security</h2>
      <p className="mb-4 text-foreground">Connect your wallet (WalletConnect, etc.) to register names, manage your profile, and interact with the platform. Your wallet is your key to ownership and security.</p>
      <ul className="list-disc pl-6 text-lg text-foreground">
        <li>Supported wallets: WalletConnect, MetaMask, and more</li>
        <li>How to connect/disconnect</li>
        <li>Security best practices: never share your seed phrase</li>
      </ul>
    </>
  ),
  faq: (
    <>
      <h2 className="text-2xl font-bold mb-4 text-foreground">FAQ</h2>
      <ul className="list-disc pl-6 text-lg text-foreground">
        <li><b>What is YouBuidl?</b> — A platform for digital identity, project discovery, and public goods.</li>
        <li><b>How do I register a name?</b> — Search, connect your wallet, and register.</li>
        <li><b>Can I transfer my name?</b> — Yes, names are NFTs and can be transferred.</li>
        <li><b>What is a .givestation name?</b> — A name for communities and DAOs.</li>
        <li><b>How do I join discussions?</b> — Go to a project page and comment, like, or reply.</li>
        <li><b>Is my data secure?</b> — Yes, your wallet controls your identity and assets.</li>
      </ul>
    </>
  ),
  // api: (
  //   <>
  //     <h2 className="text-2xl font-bold mb-4 text-foreground">API & Integrations</h2>
  //     <p className="mb-4 text-foreground">(Coming soon) Use our API to integrate YouBuidl with your own apps and tools.</p>
  //   </>
  // ),
};

export default function LearnDocs() {
  const [active, setActive] = useState('intro');

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row transition-colors duration-500">
      <aside className="w-full md:w-64 bg-muted border-r border-border p-6 md:min-h-screen transition-colors duration-500">
        <nav className="flex flex-row md:flex-col gap-2 md:gap-4">
          {docsMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`text-left px-4 py-2 rounded-lg font-semibold transition-colors text-base md:text-lg ${active === item.id ? 'bg-accent/20 text-accent' : 'text-foreground hover:bg-muted'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 md:p-12 max-w-3xl mx-auto">
        {docsContent[active]}
      </main>
    </div>
  );
}
