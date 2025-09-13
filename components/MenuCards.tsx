"use client";
import { X } from "lucide-react";

import React, { useEffect } from "react";
import { useState } from "react";
import CardsLayer from "./CardsLayer";

export default function MainMenuCards(props: any) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <YouTubeModal />
      <CommunityModal {...props} />
    </div>
  );
}

const YouTubeModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const youtubeVideoId = "9DpejbEJ5Gs";

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Your existing link - modified to open modal */}
      <button
        onClick={openModal}
        className="block bg-gradient-to-b from-[#0a3747] to-[#344b5c] rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow w-full"
      >
        <div className="relative h-16 w-full flex flex-col items-center justify-center">
          <h3 className="text-white font-semibold text-center text-xs sm:text-sm md:text-base">
            See how it works
          </h3>
          <h4 className="text-white text-center text-xs sm:text-sm">
            {/* ( For Recruiters) */}
          </h4>
        </div>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-75 transition-opacity"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl container mx-auto max-w-md w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                See how it works
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Container */}
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CommunityModal: React.FC<any> = ({ communities }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const [sheetData, setSheetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/sheets?category=all`);

        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const data = await res.json();
        setSheetData(data.sheetData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(`No communities found with jobs. Please check back later.`);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <button
        onClick={openModal}
        className="block bg-[#F7931A] rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div className="relative h-16 w-full flex flex-col items-center justify-center">
          <h3 className="text-white font-semibold text-center text-xs sm:text-sm md:text-base">
            Join our community
          </h3>
          <h4 className="text-white text-center text-xs sm:text-sm">
            (whatsapp)
          </h4>
        </div>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-75 transition-opacity"
            onClick={closeModal}
          />

          {/* Modal Content - Now with proper height constraints and scrolling */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header - Fixed at top */}
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">
                Join our community
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <CardsLayer data={sheetData} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
