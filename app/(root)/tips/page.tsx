"use client";

import React from "react";
import axios from "axios";

type VideoItem = {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  url: string;
  thumbnail: string;
};

export default function YoutubeRssPage() {
  const [channel, setChannel] = React.useState(
    "https://www.youtube.com/@bionzofficial",
  ); 
  
  const [items, setItems] = React.useState<VideoItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const PAGE_SIZE = 12;
  const [page, setPage] = React.useState(1);

  const load = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/getYouTubeVideos", { channel });
      setItems(res.data.items || []);
      setPage(1);
    } catch (e) {
      console.error(e);
      alert("Failed to load videos. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));

  const pageItems = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  React.useEffect(() => {
    load();
  }, []);

return (
  <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-10">
    <div className="mx-auto mt-15 max-w-6xl">
      {/* Content Card */}
      <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6">
        {items.length === 0 && !loading ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-gray-700">No videos found</p>
            <p className="mt-1 text-xs text-gray-500">
              Try reloading or check the channel link.
            </p>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((v) => (
                <a
                  key={v.videoId}
                  href={v.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-2xl bg-gray-50 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                >
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-4">
                    <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                      {v.title}
                    </p>

                    <p className="mt-2 line-clamp-3 text-xs text-gray-600">
                      {v.description || "No description"}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-[11px] text-gray-500">
                        {v.publishedAt
                          ? new Date(v.publishedAt).toLocaleDateString()
                          : ""}
                      </p>
                      <span className="rounded-full bg-gray-900/90 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                        Watch
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Pagination Footer */}
            {items.length > 0 && (
              <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                <p className="text-sm text-gray-500">
                  Page{" "}
                  <span className="font-semibold text-gray-900">{page}</span> of{" "}
                  <span className="font-semibold text-gray-900">
                    {totalPages}
                  </span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  </div>
);

}
