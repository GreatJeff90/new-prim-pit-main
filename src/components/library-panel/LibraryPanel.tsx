import React from "react";

const LibraryPanel = () => {
  return (
    <div
      className="text-white px-8 pt-8 pb-12 flex flex-col justify-between"
      style={{
        width: "334px",
        height: "700px",
        borderRadius: "50px",
        background:
          "linear-gradient(262.28deg, #071B24, #1F1F1F 1.13%, #2C2C2C 49.35%, #252525 97.58%)",
        opacity: 1,
        marginTop: "55px",
      }}
    >
      {/* Library Section */}
      <div className="w-full mb-10">
        <h3 className="font-bold text-lg mb-2">Library</h3>
        <p className="text-sm text-gray-400 text-center mt-[80px]">No Item</p>
      </div>

      {/* Mail Section with gradient background */}
      <div
        className="p-4 w-full mb-10"
        style={{
          height: "115px",
          borderRadius: "20px",
          background:
            "linear-gradient(95deg, rgba(29, 30, 34, 0.65) 7.54%, rgba(53, 53, 53, 0.582292) 152.45%)",
          opacity: 1,
        }}
      >
        <h3 className="font-bold text-lg mb-2">Mail</h3>
        <p className="text-sm text-gray-400">Nothing to show right now</p>
        
      </div>
      <div className="mt-4">
      <h3 className="font-bold text-lg mb-2 mt-[-120px]">Online Friends</h3>
      </div>


      {/* Online Friends Section centered */}
      <div className="flex flex-col items-center justify-center text-center w-full">
        <p className="text-sm text-gray-400 mt-[-250px]">No Friends</p>
      </div>
    </div>
  );
};

export default LibraryPanel;
