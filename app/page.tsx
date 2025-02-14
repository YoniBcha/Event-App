import React from "react";

const Home: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col md:flex-row">
      <div className="w-full md:hidden flex gap-2 px-5 justify-evenly">
        <div
          className="w-1/3 h-80"
          style={{
            backgroundImage: "url('/images/Rectangle 2202.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div
          className="w-1/3 h-80"
          style={{
            backgroundImage: "url('/images/Rectangle 220.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div
          className="w-1/3 h-80"
          style={{
            backgroundImage: "url('/images/recr.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>

      <div className="w-full md:w-1/2 px-5 md:px-20 flex flex-col gap-3 text-start items-start md:justify-center">
        <div className="text-start">Welcome to</div>
        <div className="text-5xl text-primary font-bold">FENZO</div>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro odio
          quam accusantium rerum provident pariatur odit officia voluptatibus
          vitae aliquid molestiae ea laudantium qui, atque necessitatibus
          voluptate possimus nam neque!
        </div>
        <div className="p-2 text-gray-100 bg-primary rounded">
          Start My Journey
        </div>
      </div>

      <div className="w-1/2 sm:hidden md:flex flex-row gap-2 mx-3 justify-evenly">
        <div
          className="w-1/3"
          style={{
            backgroundImage: "url('/images/Rectangle 2202.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div
          className="w-1/3"
          style={{
            backgroundImage: "url('/images/Rectangle 220.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div
          className="w-1/3"
          style={{
            backgroundImage: "url('/images/recr.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Home;
