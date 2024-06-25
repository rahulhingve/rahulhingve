import { link } from "fs";

export const navItems = [
    { name: "About", link: "#about" },
    { name: "Projects", link: "#projects" },
    { name: "Testimonials", link: "#projects" },
    { name: "Contact", link: "#contact" },
  ];
  
  export const gridItems = [
    {
      id: 1,
      title: "I prioritize client collaboration, fostering open communication ",
      description: "",
      className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
      imgClassName: "w-full h-full",
      titleClassName: "justify-end",
      img: "/b1.svg",
      spareImg: "",
    },
    {
      id: 2,
      title: "I'm very flexible with time zone communications",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-2",
      imgClassName: "",
      titleClassName: "justify-start",
      img: "",
      spareImg: "",
    },
    {
      id: 3,
      title: "My tech stack",
      description: "I constantly try to improve",
      className: "lg:col-span-2 md:col-span-3 md:row-span-2",
      imgClassName: "",
      titleClassName: "justify-center",
      img: "",
      spareImg: "",
    },
    {
      id: 4,
      title: "Tech enthusiast with a passion for development.",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-1",
      imgClassName: "",
      titleClassName: "justify-start",
      img: "/grid.svg",
      spareImg: "/b4.svg",
    },
  
    {
      id: 5,
      title: "Currently building a Real-Time Collaboration Tool for Developers With TurboRepo",
      description: "The Inside Scoop",
      className: "md:col-span-3 md:row-span-2",
      imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
      titleClassName: "justify-center md:justify-start lg:justify-center",
      img: "/b5.svg",
      spareImg: "/grid.svg",
    },
    {
      id: 6,
      title: "Do you want to start a project together?",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-1",
      imgClassName: "",
      titleClassName: "justify-center md:max-w-full max-w-60 text-center",
      img: "",
      spareImg: "",
    },
  ];
  
  export const projects = [
    {
      id: 1,
      title: "Working on Real-Time Collaboration Tool for Developers",
      des: "Working on A robust and feature-rich real-time collaboration tool for developers",
      img: "/rtctd.png",
      iconLists: ["/turborepo.svg","/next.svg", "/express.svg","/tail.svg", "/ts.svg", "/postgresql.svg",],
      link: "https://github.com/rahulhingve/rtctd",
    },
    {
      id: 2,
      title: "A bloging Website",
      des: "The website is a blog platform where users can sign up, sign in, create, view, and update blog posts",
      img: "/p1.png",
      iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/postgresql.svg", "/hono.svg", "/cf.svg"],
      link: "https://github.com/rahulhingve/medium-blog-clone",
    },
    {
      id: 3,
      title: "Payments Website",
      des: "A Payment App is a ready-made solution that replicates the core features and functionalities of a popular payment app. It offers a pre-built digital wallet experience, allowing users to make payments",
      img: "/banking.jpg",
      iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/express.svg", "/prisma.svg" , "/turborepo.svg"],
      link: "https://github.com/rahulhingve/Payment-App/",
    },
    {
      id: 4,
      title: "Portfolio Website",
      des: "An website to showcase my portfolio",
      img: "/portfolio.png",
      iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/three.svg", "/aceternity.svg"],
      link: "https://rahulhingve.vercel.app",
    },
 
  ];
  
  export const testimonials = [
    {
      quote:
        "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
      name: "",
      title: "",
    },
    {
      quote:
        "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
      name: "",
      title: "",
    },
    {
      quote:
        "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
      name: "",
      title: "",
    },
    {
      quote:
        "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
      name: "",
      title: "",
    },
    {
      quote:
        "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
      name: "",
      title: "",
    },
  ];
  
  export const companies = [
    {
      id: 1,
      name: "cloudinary",
      img: "/cloud.svg",
      nameImg: "/cloudName.svg",
    },
    {
      id: 2,
      name: "appwrite",
      img: "/app.svg",
      nameImg: "/appName.svg",
    },
    {
      id: 3,
      name: "HOSTINGER",
      img: "/host.svg",
      nameImg: "/hostName.svg",
    },
    {
      id: 4,
      name: "stream",
      img: "/s.svg",
      nameImg: "/streamName.svg",
    },
    {
      id: 5,
      name: "docker.",
      img: "/dock.svg",
      nameImg: "/dockerName.svg",
    },
  ];
  
  export const workExperience = [
    {
      id: 1,
      title: "Frontend Engineer Intern",
      desc: "Assisted in the development of a web-based platform using HTML , CSS & JavaScript, enhancing interactivity.",
      className: "md:col-span-2",
      thumbnail: "/exp1.svg",
    },
    {
      id: 2,
      title: "Freelancing",
      desc: "Learning and developing with modern tech stack like MERN & Next.js.",
      className: "md:col-span-2",
      thumbnail: "/exp2.svg",
    },
    {
      id: 3,
      title: "Working on RTCTD",
      desc: "Building Real-Time Collaboration Tool for Developers",
      className: "md:col-span-2",
      thumbnail: "/exp4.svg",
    },
   
  ];
  
  export const socialMedia = [
    {
      id: 1,
      img: "/git.svg",
      link:"https://github.com/rahulhingve"
    },
    {
      id: 2,
      img: "/twit.svg",
      link:"https://www.instagram.com/real_rahul_hingve/"

    },
    {
      id: 3,
      img: "/link.svg",
      link:"https://www.linkedin.com/in/rahul-hingve-b5a582263/"
    },
  ];