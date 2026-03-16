import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { Link } from "react-router-dom";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.15)",
    border: "rgba(251,191,36,0.3)",
  },
  assigned: {
    label: "Assigned",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.15)",
    border: "rgba(96,165,250,0.3)",
  },
  inprogress: {
    label: "In Progress",
    color: "#fb923c",
    bg: "rgba(249,115,22,0.15)",
    border: "rgba(249,115,22,0.3)",
  },
  cleared: {
    label: "Cleared",
    color: "#4ade80",
    bg: "rgba(74,222,128,0.15)",
    border: "rgba(74,222,128,0.3)",
  },
};

const RecentReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await API.get("/reports/recent");
        setReports(data.reports);
      } catch (error) {
        console.error("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <section id="recent" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Live Updates
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Recent{" "}
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Reports
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            See what our community is reporting and cleaning up right now.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* No Reports */}
        {!loading && reports.length === 0 && (
          <div
            className="text-center py-16 rounded-2xl"
            style={{
              background: "rgba(30,41,59,0.5)",
              border: "1px solid rgba(100,116,139,0.3)",
            }}
          >
            <div className="text-5xl mb-4">🌿</div>
            <p className="text-slate-400 text-lg">
              No reports yet. Be the first to spot waste!
            </p>
          </div>
        )}

        {/* Reports Grid */}
        {!loading && reports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => {
              const status =
                statusConfig[report.status] || statusConfig.pending;
              return (
                <div
                  key={report._id}
                  className="rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    background: "rgba(15,23,42,0.8)",
                    border: "1px solid rgba(100,116,139,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.border =
                      "1px solid rgba(249,115,22,0.4)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(249,115,22,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.border =
                      "1px solid rgba(100,116,139,0.3)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={report.image?.url}
                      alt="waste report"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.style.background =
                          "rgba(30,41,59,0.8)";
                        e.target.parentElement.innerHTML =
                          '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem">📸</div>';
                      }}
                    />
                    {/* Status Badge on image */}
                    <div
                      className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: status.bg,
                        border: `1px solid ${status.border}`,
                        color: status.color,
                      }}
                    >
                      {status.label}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Location */}
                    <div className="flex items-center gap-2 mb-3">
                      <svg
                        className="w-4 h-4 text-orange-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <p className="text-orange-400 text-sm font-medium truncate">
                        {report.location?.address || "Unknown Location"}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2">
                      {report.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{
                            background:
                              "linear-gradient(135deg, #fb923c, #4ade80)",
                          }}
                        >
                          {report.user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <span className="text-slate-400 text-xs">
                          {report.user?.name || "Anonymous"}
                        </span>
                      </div>
                      <span className="text-slate-500 text-xs">
                        {new Date(report.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-slate-400 mb-4">Want to see your report here?</p>
          <Link
            to="/register"
            className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            Start Reporting Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentReports;
