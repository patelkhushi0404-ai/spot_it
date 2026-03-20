import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import AdminLayout from "../../components/admin/AdminLayout";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  assigned: {
    label: "Assigned",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  inprogress: {
    label: "In Progress",
    color: "#ea580c",
    bg: "#fff7ed",
    border: "#fed7aa",
  },
  cleared: {
    label: "Cleared",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
};

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [assignWorker, setAssignWorker] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchReports();
    fetchWorkers();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/reports");
      setReports(data.reports);
    } catch (error) {
      console.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      const { data } = await API.get("/workers");
      setWorkers(data.workers);
    } catch (error) {
      console.error("Failed to fetch workers");
    }
  };

  const handleAssign = async (reportId) => {
    if (!assignWorker) {
      toast.error("Please select a worker");
      return;
    }
    setAssigning(true);
    try {
      await API.put("/reports/" + reportId + "/assign", {
        workerId: assignWorker,
      });
      toast.success("Worker assigned successfully!");
      await fetchReports();
      setAssignWorker("");
      setSelectedReport(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign worker");
    } finally {
      setAssigning(false);
    }
  };

  const handleClear = async (reportId) => {
    setClearing(true);
    try {
      await API.put("/reports/" + reportId + "/clear", { points: 10 });
      toast.success("Report marked as cleared!");
      await fetchReports();
      setSelectedReport(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear report");
    } finally {
      setClearing(false);
    }
  };

  const handleStatusUpdate = async (reportId, status) => {
    try {
      await API.put("/reports/" + reportId + "/status", { status });
      toast.success("Status updated!");
      await fetchReports();
      setSelectedReport(null);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await API.get("/admin/export/reports", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "spotit_reports.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Reports exported successfully!");
    } catch (error) {
      toast.error("Failed to export reports");
    } finally {
      setExporting(false);
    }
  };

  const filteredReports =
    filter === "all" ? reports : reports.filter((r) => r.status === filter);

  const filters = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "assigned", label: "Assigned" },
    { value: "inprogress", label: "In Progress" },
    { value: "cleared", label: "Cleared" },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manage <span className="text-orange-500">Reports</span>
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {reports.length} total reports
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchReports}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 transition-all"
          >
            Refresh
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {exporting ? (
              <div className="w-4 h-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            )}
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap border"
            style={{
              background: filter === f.value ? "#f97316" : "#fff",
              color: filter === f.value ? "#fff" : "#6b7280",
              borderColor: filter === f.value ? "#f97316" : "#e5e7eb",
            }}
          >
            {f.label}{" "}
            {f.value !== "all" &&
              `(${reports.filter((r) => r.status === f.value).length})`}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white border border-gray-100">
          <div className="text-5xl mb-4">📍</div>
          <p className="text-gray-600 font-semibold text-lg">
            No reports found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => {
            const status = statusConfig[report.status] || statusConfig.pending;
            return (
              <div
                key={report._id}
                className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                onClick={() => {
                  setSelectedReport(report);
                  setAssignWorker("");
                }}
              >
                {/* Image */}
                <div className="h-40 overflow-hidden relative bg-gray-100">
                  <img
                    src={report.image?.url}
                    alt="report"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML =
                        '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:2.5rem;color:#9ca3af">📸</div>';
                    }}
                  />
                  <div
                    className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold border"
                    style={{
                      background: status.bg,
                      borderColor: status.border,
                      color: status.color,
                    }}
                  >
                    {status.label}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    <svg
                      className="w-3.5 h-3.5 text-orange-400 flex-shrink-0"
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
                    </svg>
                    <p className="text-orange-500 text-xs truncate">
                      {report.location?.address || "Unknown"}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {report.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-green-400 flex items-center justify-center text-xs font-bold text-white">
                        {report.user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <span className="text-gray-400 text-xs">
                        {report.user?.name || "Unknown"}
                      </span>
                    </div>
                    <span className="text-gray-300 text-xs">
                      {new Date(report.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) =>
            e.target === e.currentTarget && setSelectedReport(null)
          }
        >
          <div
            className="w-full max-w-lg rounded-2xl overflow-hidden bg-white shadow-2xl"
            style={{ maxHeight: "90vh", overflowY: "auto" }}
          >
            {/* Modal Header */}
            <div className="p-5 flex items-center justify-between border-b border-gray-100">
              <h3 className="text-gray-800 font-bold">Report Details</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Image */}
            <div className="h-48 overflow-hidden bg-gray-100">
              <img
                src={selectedReport.image?.url}
                alt="report"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML =
                    '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem">📸</div>';
                }}
              />
            </div>

            <div className="p-5 space-y-4">
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Status:</span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold border"
                  style={{
                    background: statusConfig[selectedReport.status]?.bg,
                    borderColor: statusConfig[selectedReport.status]?.border,
                    color: statusConfig[selectedReport.status]?.color,
                  }}
                >
                  {statusConfig[selectedReport.status]?.label}
                </span>
              </div>

              {/* Location */}
              <div>
                <p className="text-gray-400 text-xs mb-1 font-medium">
                  Location
                </p>
                <p className="text-gray-700 text-sm">
                  {selectedReport.location?.address || "Unknown"}
                </p>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-400 text-xs mb-1 font-medium">
                  Description
                </p>
                <p className="text-gray-700 text-sm">
                  {selectedReport.description}
                </p>
              </div>

              {/* Reporter */}
              <div>
                <p className="text-gray-400 text-xs mb-1 font-medium">
                  Reported By
                </p>
                <p className="text-gray-700 text-sm">
                  {selectedReport.user?.name} ({selectedReport.user?.email})
                </p>
              </div>

              {/* Assigned Worker */}
              {selectedReport.assignedWorker?.name && (
                <div>
                  <p className="text-gray-400 text-xs mb-1 font-medium">
                    Assigned Worker
                  </p>
                  <p className="text-gray-700 text-sm">
                    {selectedReport.assignedWorker.name} —{" "}
                    {selectedReport.assignedWorker.phone}
                  </p>
                </div>
              )}

              {/* Date */}
              <div>
                <p className="text-gray-400 text-xs mb-1 font-medium">
                  Submitted
                </p>
                <p className="text-gray-700 text-sm">
                  {new Date(selectedReport.createdAt).toLocaleString("en-IN")}
                </p>
              </div>

              {/* AI Analysis */}
              {selectedReport.aiAnalysis?.wasteType && (
                <div
                  className="rounded-xl p-4"
                  style={{ background: "#faf5ff", border: "1px solid #e9d5ff" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🤖</span>
                    <p className="text-purple-700 font-bold text-sm">
                      AI Waste Analysis
                    </p>
                    <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-600 border border-purple-200">
                      Gemini AI
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="rounded-lg p-2 bg-white border border-gray-100">
                      <p className="text-gray-400 text-xs mb-0.5">Waste Type</p>
                      <p className="text-gray-700 font-bold text-xs">
                        {selectedReport.aiAnalysis.wasteType}
                      </p>
                    </div>
                    <div
                      className="rounded-lg p-2 border"
                      style={{
                        background:
                          selectedReport.aiAnalysis.severity === "High"
                            ? "#fef2f2"
                            : selectedReport.aiAnalysis.severity === "Medium"
                              ? "#fffbeb"
                              : "#f0fdf4",
                        borderColor:
                          selectedReport.aiAnalysis.severity === "High"
                            ? "#fecaca"
                            : selectedReport.aiAnalysis.severity === "Medium"
                              ? "#fde68a"
                              : "#bbf7d0",
                      }}
                    >
                      <p className="text-gray-400 text-xs mb-0.5">Severity</p>
                      <p
                        className="font-bold text-xs"
                        style={{
                          color:
                            selectedReport.aiAnalysis.severity === "High"
                              ? "#dc2626"
                              : selectedReport.aiAnalysis.severity === "Medium"
                                ? "#d97706"
                                : "#16a34a",
                        }}
                      >
                        {selectedReport.aiAnalysis.severity === "High"
                          ? "🔴"
                          : selectedReport.aiAnalysis.severity === "Medium"
                            ? "🟡"
                            : "🟢"}{" "}
                        {selectedReport.aiAnalysis.severity}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg p-2 bg-white border border-gray-100 mb-2">
                    <p className="text-gray-400 text-xs mb-0.5">
                      ♻️ Disposal Method
                    </p>
                    <p className="text-gray-700 text-xs">
                      {selectedReport.aiAnalysis.disposalMethod}
                    </p>
                  </div>
                  <div className="rounded-lg p-2 bg-white border border-gray-100">
                    <p className="text-gray-400 text-xs mb-0.5">
                      🌍 Environmental Impact
                    </p>
                    <p className="text-gray-700 text-xs">
                      {selectedReport.aiAnalysis.environmentalImpact}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                {(selectedReport.status === "pending" ||
                  selectedReport.status === "assigned") && (
                  <div>
                    <p className="text-gray-400 text-xs mb-2 font-medium">
                      Assign Worker
                    </p>
                    {workers.length === 0 ? (
                      <p className="text-gray-400 text-xs">
                        No workers available. Add workers first.
                      </p>
                    ) : (
                      <div className="flex gap-2">
                        <select
                          value={assignWorker}
                          onChange={(e) => setAssignWorker(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl text-gray-700 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                        >
                          <option value="">Select worker...</option>
                          {workers.map((w) => (
                            <option key={w._id} value={w._id}>
                              {w.name} — {w.area}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssign(selectedReport._id)}
                          disabled={assigning}
                          className="px-4 py-2 rounded-xl font-semibold text-sm text-white bg-blue-500 hover:bg-blue-600 transition-all"
                        >
                          {assigning ? "..." : "Assign"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {selectedReport.status === "assigned" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedReport._id, "inprogress")
                    }
                    className="w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-orange-500 hover:bg-orange-600 transition-all"
                  >
                    Mark as In Progress
                  </button>
                )}

                {(selectedReport.status === "assigned" ||
                  selectedReport.status === "inprogress") && (
                  <button
                    onClick={() => handleClear(selectedReport._id)}
                    disabled={clearing}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-green-500 hover:bg-green-600 transition-all"
                  >
                    {clearing ? "Clearing..." : "Mark as Cleared ✓"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ReportsPage;
