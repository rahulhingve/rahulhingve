// ─────────────────────────────────────────────────────────
// Personal info — the "human" you, not the resume you
// ─────────────────────────────────────────────────────────
export const profile = {
  name: "Rahul",
  fullName: "Rahul Hingve",
  tagline: "just a guy who builds things, listens to too much music, and wonders about everything.",
  bio: "i'm rahul. i live in india, work with servers and code, get obsessed with songs for weeks at a time, and keep a running list of films and books i love. this little corner of the internet is where i collect bits of me — what i'm into right now, the music on repeat, the things that made me feel something. scroll around, press play, stay a while.",
  email: "rahulpawar2001.rp@gmail.com",
  phone: "+918839244681",
  github: "https://github.com/rahulhingve",
  linkedin: "https://www.linkedin.com/in/rahul-hingve-b5a582263/",
  instagram: "https://instagram.com/rahulhingve", // update if different
  twitter: "https://twitter.com/rahulhingve",     // update if different
  website: "https://rahulhingve.vercel.app",
  resume: "/Rahul_Hingve.pdf",
  location: "Bhopal, India",
  avatar: "/rahul.jpg",
};

// ─────────────────────────────────────────────────────────
// Currently — your "now" page. Update this as life changes.
// ─────────────────────────────────────────────────────────
export const currently = [
  { label: "location", value: "Bhopal, India", emoji: "📍" },
  { label: "mood", value: "calm but curious", emoji: "🌿" },
  { label: "reading", value: "Atomic Habits — James Clear", emoji: "📖" },
  { label: "watching", value: "Severance S2", emoji: "📺" },
  { label: "learning", value: "Kubernetes & Terraform", emoji: "🛠️" },
  { label: "drinking", value: "way too much chai", emoji: "☕" },
];

// ─────────────────────────────────────────────────────────
// Top 5 songs on repeat
// Drop your .m4a files in /public/music/ and cover art in /public/covers/
// Then update src + cover paths below.
// ─────────────────────────────────────────────────────────
export const topMusic = [
  {
    id: 1,
    title: "Song Title 1",
    artist: "Artist Name",
    cover: "/covers/song1.jpg",       // place at /public/covers/song1.jpg
    src: "/music/song1.m4a",          // place at /public/music/song1.m4a
    why: "this one hits at 2am on a long drive. the bridge breaks me every single time.",
    mood: "late night drives",
  },
  {
    id: 2,
    title: "Song Title 2",
    artist: "Artist Name",
    cover: "/covers/song2.jpg",
    src: "/music/song2.m4a",
    why: "found it on a random sunday and it's been stuck in my head ever since. pure serotonin.",
    mood: "sunday mornings",
  },
  {
    id: 3,
    title: "Song Title 3",
    artist: "Artist Name",
    cover: "/covers/song3.jpg",
    src: "/music/song3.m4a",
    why: "the kind of song you put on when you want to feel everything at once. lyrics like a punch.",
    mood: "feeling everything",
  },
  {
    id: 4,
    title: "Song Title 4",
    artist: "Artist Name",
    cover: "/covers/song4.jpg",
    src: "/music/song4.m4a",
    why: "i listen to this when i'm coding at midnight. it's basically my focus drug.",
    mood: "deep work",
  },
  {
    id: 5,
    title: "Song Title 5",
    artist: "Artist Name",
    cover: "/covers/song5.jpg",
    src: "/music/song5.m4a",
    why: "one of those songs that feels like a hug. plays on every walk home.",
    mood: "walks home",
  },
];

// ─────────────────────────────────────────────────────────
// Full playlist link — drop your Spotify / Apple Music URL
// ─────────────────────────────────────────────────────────
export const playlist = {
  name: "the everything playlist",
  description: "everything i've loved enough to save. updated whenever a song refuses to leave my head.",
  trackCount: 0, // update with real number
  spotify: "https://open.spotify.com/playlist/YOUR_PLAYLIST_ID",  // replace
  appleMusic: "",  // optional
  youtube: "",     // optional
};

// ─────────────────────────────────────────────────────────
// Things I love — quick personality dump
// ─────────────────────────────────────────────────────────
export const loves = [
  { category: "films", items: ["Interstellar", "Whiplash", "Spirited Away", "La La Land", "The Social Network"] },
  { category: "shows",  items: ["Severance", "Mr. Robot", "Dark", "Better Call Saul"] },
  { category: "books",  items: ["Atomic Habits", "Sapiens", "The Alchemist", "Deep Work"] },
  { category: "food",   items: ["maa ke haath ka khana", "biryani", "south indian filter coffee", "midnight maggi"] },
  { category: "places", items: ["any hill station", "Hyderabad streets at night", "old book shops", "rooftops"] },
  { category: "small joys", items: ["first sip of chai", "rain on tin roofs", "clean terminal screens", "late night code that finally works"] },
];

// ─────────────────────────────────────────────────────────
// Builder side — kept lighter, tucked further down
// ─────────────────────────────────────────────────────────
export const builderIntro = {
  heading: "lowkey a builder too",
  text: "when i'm not lost in a song, i'm building things. servers, websites, little tools that solve my own problems. here's some of it.",
  role: "Infrastructure & DevOps Engineer",
  shortBio: "1.5+ years across DevOps, network admin, and full-stack. Docker, Kubernetes, AWS, CI/CD — the usual suspects. currently looking for DevOps/SRE roles.",
};

export const experience = [
  {
    role: "Network Administrator",
    company: "CSK Infotech",
    client: "India Government Mint, Hyderabad",
    period: "Dec 2025 — Feb 2026",
    location: "Hyderabad, India",
    points: [
      "Managed network infrastructure for a government facility, ensuring 99%+ uptime of critical systems",
      "Administered Linux and Windows servers — system monitoring, patch management, and security hardening",
      "Configured and troubleshot switches, routers, firewalls, and VPN connections",
      "Managed DNS, DHCP, and TCP/IP configurations across the network environment",
    ],
  },
  {
    role: "IT Infrastructure Support",
    company: "Keypoint Technologies",
    client: "India Government Mint, Hyderabad",
    period: "Aug 2025 — Dec 2025",
    location: "Hyderabad, India",
    points: [
      "Provided IT infrastructure support and system administration at a high-security government facility",
      "Managed server deployments and maintained production environments for critical applications",
      "Assisted in implementing security policies and access control measures for sensitive systems",
      "Coordinated with cross-functional teams for system upgrades and infrastructure improvements",
    ],
  },
  {
    role: "Frontend Developer Intern",
    company: "MDP Infra (India) Pvt. Ltd.",
    period: "Oct 2023 — Jan 2024",
    location: "Bhopal, India",
    points: [
      "Redesigned MDP-attendance system, improving UX by 40% and reducing page load time by 25%",
      "Built interactive data visualization dashboards with 5+ analytical components",
      "Integrated frontend with backend APIs using RESTful architecture",
    ],
  },
];

export const projects = [
  {
    title: "KistCompare",
    description: "Price comparison platform with containerized deployment, monitoring with Prometheus & Grafana, CI/CD pipeline, and Nginx reverse proxy on AWS EC2.",
    tech: ["React", "Flask", "Docker", "Prometheus", "Grafana", "Nginx", "AWS"],
    github: "https://github.com/rahulhingve/KistCompare",
    live: "https://kistcompare.in",
  },
  {
    title: "MeetHub",
    description: "Real-time video conferencing with peer-to-peer WebRTC connections, screen sharing, and in-call chat.",
    tech: ["React", "WebRTC", "Node.js", "Socket.io"],
    github: "https://github.com/rahulhingve/rtma",
    live: "https://meetshub.vercel.app",
  },
  {
    title: "SyncroCode",
    description: "Collaborative code editor for real-time pair programming with syntax highlighting and multi-cursor support.",
    tech: ["React", "Node.js", "Socket.io", "Monaco Editor"],
    github: "https://github.com/rahulhingve/rtctd",
    live: "https://syncrocode.vercel.app",
  },
  {
    title: "Spotify-DL Bot",
    description: "Telegram bot for downloading Spotify tracks. Dockerized with multi-port wrapper setup for reliability.",
    tech: ["Python", "Docker", "yt-dlp", "Telegram API"],
    github: "https://github.com/rahulhingve/spotify-dl-on-steroids",
  },
  {
    title: "Airdrop-SOL",
    description: "Developer tool for requesting SOL airdrops on Solana devnet/testnet with wallet management.",
    tech: ["React", "Solana", "Web3.js"],
    github: "https://github.com/rahulhingve/Airdrop-Sol",
    live: "https://sol-dapp-zeta.vercel.app",
  },
  {
    title: "Web Crypto Wallet",
    description: "Multi-chain cryptocurrency wallet — generate HD wallets, manage keys, and track balances across networks.",
    tech: ["React", "Web3.js", "Ethers.js"],
    github: "https://github.com/rahulhingve/web-crypto-wallet",
    live: "https://wallx-one.vercel.app",
  },
];

export const skills = {
  "DevOps & Cloud": ["Docker", "Kubernetes", "GitHub Actions", "AWS (EC2, EKS, ECR, ECS, S3, ASG)", "Nginx", "Cloudflare", "Vercel"],
  "Monitoring": ["Prometheus", "Grafana", "New Relic", "prom-client", "Custom Metrics"],
  "Networking": ["TCP/IP", "DNS", "DHCP", "Firewalls", "VPN", "SSH", "Load Balancing", "Subnetting"],
  "OS & Scripting": ["Linux (Ubuntu, CentOS, Kali)", "Windows Server", "Bash/Shell", "Python"],
  "Web & Backend": ["Node.js", "Express", "React", "Next.js", "TypeScript", "REST APIs"],
  "Databases": ["PostgreSQL", "MongoDB", "Prisma ORM"],
  "Security": ["Wireshark", "Nmap", "SSL/TLS", "SIEM Basics", "Rate Limiting", "CORS"],
  "Learning": ["Helm", "Terraform", "Ansible", "Jenkins"],
};
