export const profile = {
  name: "Rahul Hingve",
  role: "Infrastructure & DevOps Engineer",
  bio: "1.5+ years of professional experience across network administration, IT infrastructure, and full-stack development. Hands-on with Docker, CI/CD pipelines, AWS (EC2, EKS, ECR, ECS), and production monitoring with Prometheus, Grafana, and New Relic. Experienced in managing production Linux servers at a high-security government facility. Seeking DevOps/SRE roles to drive infrastructure automation and reliability at scale.",
  email: "rahulpawar2001.rp@gmail.com",
  phone: "+918839244681",
  github: "https://github.com/rahulhingve",
  linkedin: "https://www.linkedin.com/in/rahul-hingve-b5a582263/",
  website: "https://rahulhingve.vercel.app",
  resume: "/Rahul_Hingve.pdf",
  location: "Bhopal, India",
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
