import React, { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import API from "../../api/axios";
import toast from "react-hot-toast";
import Navbar from "../../components/common/Navbar";

const SpotNowPage = () => {
  const webcamRef = useRef(null);
  const [step, setStep] = useState(1);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraMode, setCameraMode] = useState("environment");
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [form, setForm] = useState({
    description: "",
    address: "",
    lat: "",
    lng: "",
  });

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setStep(2);
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
    setStep(1);
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            "https://nominatim.openstreetmap.org/reverse?lat=" +
              latitude +
              "&lon=" +
              longitude +
              "&format=json",
          );
          const data = await res.json();
          setForm((prev) => ({
            ...prev,
            lat: latitude,
            lng: longitude,
            address: data.display_name || latitude + ", " + longitude,
          }));
          toast.success("Location detected!");
        } catch (error) {
          setForm((prev) => ({
            ...prev,
            lat: latitude,
            lng: longitude,
            address: latitude + ", " + longitude,
          }));
          toast.success("Location detected!");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        toast.error("Failed to get location.");
        setLocationLoading(false);
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description) {
      toast.error("Please add a description");
      return;
    }
    if (!form.address) {
      toast.error("Please add location");
      return;
    }
    setLoading(true);
    try {
      const blob = await fetch(capturedImage).then((r) => r.blob());
      const file = new File([blob], "waste-report.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("image", file);
      formData.append("description", form.description);
      formData.append("address", form.address);
      formData.append("lat", form.lat);
      formData.append("lng", form.lng);
      const { data } = await API.post("/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.report?.aiAnalysis) {
        setAiAnalysis(data.report.aiAnalysis);
      }
      setStep(3);
      toast.success("Report submitted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCapturedImage(null);
    setAiAnalysis(null);
    setForm({ description: "", address: "", lat: "", lng: "" });
    setStep(1);
  };

  const severityConfig = {
    Low: {
      color: "#4ade80",
      bg: "rgba(74,222,128,0.15)",
      border: "rgba(74,222,128,0.3)",
    },
    Medium: {
      color: "#fbbf24",
      bg: "rgba(251,191,36,0.15)",
      border: "rgba(251,191,36,0.3)",
    },
    High: {
      color: "#f87171",
      bg: "rgba(239,68,68,0.15)",
      border: "rgba(239,68,68,0.3)",
    },
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #0d1f3c 50%, #0f172a 100%)",
      }}
    >
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Spot{" "}
            <span className="bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
              Waste Now
            </span>
          </h1>
          <p className="text-slate-400">
            Capture waste, submit report, earn points!
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                style={{
                  background:
                    step >= s
                      ? "linear-gradient(135deg, #fb923c, #ea580c)"
                      : "rgba(30,41,59,0.8)",
                  border:
                    step >= s
                      ? "1px solid #fb923c"
                      : "1px solid rgba(100,116,139,0.4)",
                  color: step >= s ? "#fff" : "#64748b",
                  boxShadow:
                    step >= s ? "0 4px 15px rgba(249,115,22,0.3)" : "none",
                }}
              >
                {step > s ? "✓" : s}
              </div>
              {s < 3 && (
                <div
                  className="w-16 h-0.5 rounded transition-all duration-300"
                  style={{
                    background:
                      step > s
                        ? "linear-gradient(90deg, #fb923c, #4ade80)"
                        : "rgba(100,116,139,0.3)",
                  }}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-center gap-12 mb-8 text-xs">
          <span
            style={{
              color: step >= 1 ? "#fb923c" : "#64748b",
              fontWeight: step >= 1 ? "600" : "400",
            }}
          >
            Capture
          </span>
          <span
            style={{
              color: step >= 2 ? "#fb923c" : "#64748b",
              fontWeight: step >= 2 ? "600" : "400",
            }}
          >
            Details
          </span>
          <span
            style={{
              color: step >= 3 ? "#fb923c" : "#64748b",
              fontWeight: step >= 3 ? "600" : "400",
            }}
          >
            Done
          </span>
        </div>

        {/* Step 1: Camera */}
        {step === 1 && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(100,116,139,0.3)",
            }}
          >
            <div
              className="p-5"
              style={{ borderBottom: "1px solid rgba(100,116,139,0.2)" }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold">Capture Waste Image</h2>
                <button
                  onClick={() =>
                    setCameraMode(
                      cameraMode === "environment" ? "user" : "environment",
                    )
                  }
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Flip Camera
                </button>
              </div>
            </div>
            <div className="relative">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: cameraMode }}
                className="w-full"
                style={{ maxHeight: "400px", objectFit: "cover" }}
                onUserMediaError={(err) => {
                  console.error("Camera error:", err);
                  toast.error(
                    "Camera access denied. Please allow camera permission.",
                  );
                }}
                onUserMedia={() => {
                  console.log("Camera opened successfully");
                }}
              />
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute top-4 left-4 w-8 h-8"
                  style={{
                    borderTop: "2px solid #fb923c",
                    borderLeft: "2px solid #fb923c",
                    borderRadius: "4px 0 0 0",
                  }}
                ></div>
                <div
                  className="absolute top-4 right-4 w-8 h-8"
                  style={{
                    borderTop: "2px solid #fb923c",
                    borderRight: "2px solid #fb923c",
                    borderRadius: "0 4px 0 0",
                  }}
                ></div>
                <div
                  className="absolute bottom-4 left-4 w-8 h-8"
                  style={{
                    borderBottom: "2px solid #fb923c",
                    borderLeft: "2px solid #fb923c",
                    borderRadius: "0 0 0 4px",
                  }}
                ></div>
                <div
                  className="absolute bottom-4 right-4 w-8 h-8"
                  style={{
                    borderBottom: "2px solid #fb923c",
                    borderRight: "2px solid #fb923c",
                    borderRadius: "0 0 4px 0",
                  }}
                ></div>
              </div>
            </div>
            <div className="p-5">
              <button
                onClick={capture}
                className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #fb923c, #ea580c)",
                  boxShadow: "0 10px 30px rgba(249,115,22,0.3)",
                }}
              >
                Capture Photo
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(100,116,139,0.3)",
            }}
          >
            <div
              className="p-5"
              style={{ borderBottom: "1px solid rgba(100,116,139,0.2)" }}
            >
              <h2 className="text-white font-bold">Add Report Details</h2>
            </div>
            <div className="p-5">
              <div className="relative rounded-xl overflow-hidden mb-5">
                <img
                  src={capturedImage}
                  alt="captured"
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={retake}
                  className="absolute top-2 right-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                  style={{
                    background: "rgba(0,0,0,0.7)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  Retake
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Describe the waste (type, quantity, condition...)"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                    style={{
                      background: "rgba(30,41,59,0.8)",
                      border: "1px solid rgba(100,116,139,0.4)",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Location *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      placeholder="Enter address or use GPS"
                      className="flex-1 px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                      style={{
                        background: "rgba(30,41,59,0.8)",
                        border: "1px solid rgba(100,116,139,0.4)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={getLocation}
                      disabled={locationLoading}
                      className="px-4 py-3 rounded-xl font-semibold transition-all flex-shrink-0"
                      style={{
                        background: "rgba(34,197,94,0.2)",
                        border: "1px solid rgba(34,197,94,0.4)",
                        color: "#4ade80",
                      }}
                    >
                      {locationLoading ? (
                        <div
                          className="w-5 h-5 border-2 rounded-full animate-spin"
                          style={{
                            borderColor: "rgba(74,222,128,0.3)",
                            borderTopColor: "#4ade80",
                          }}
                        ></div>
                      ) : (
                        "GPS"
                      )}
                    </button>
                  </div>
                  {form.lat && form.lng && (
                    <p className="text-xs mt-1" style={{ color: "#4ade80" }}>
                      GPS: {parseFloat(form.lat).toFixed(4)},{" "}
                      {parseFloat(form.lng).toFixed(4)}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-200"
                  style={{
                    background: loading
                      ? "rgba(249,115,22,0.5)"
                      : "linear-gradient(135deg, #fb923c, #ea580c)",
                    boxShadow: loading
                      ? "none"
                      : "0 10px 30px rgba(249,115,22,0.3)",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div
                        className="w-5 h-5 border-2 rounded-full animate-spin"
                        style={{
                          borderColor: "rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                        }}
                      ></div>
                      Analyzing & Submitting...
                    </span>
                  ) : (
                    "Submit Report"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="space-y-4">
            {/* Success Card */}
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(59,130,246,0.15) 100%)",
                border: "1px solid rgba(34,197,94,0.3)",
              }}
            >
              <div className="text-7xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Report Submitted!
              </h2>
              <p className="text-slate-300 mb-2">
                Your waste report has been submitted successfully.
              </p>
              <p className="text-sm mb-8" style={{ color: "#4ade80" }}>
                You will earn 10 points once the waste is cleared!
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={resetForm}
                  className="py-3 rounded-xl font-bold text-white transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #fb923c, #ea580c)",
                    boxShadow: "0 10px 30px rgba(249,115,22,0.3)",
                  }}
                >
                  Spot Another
                </button>
                <Link
                  to="/profile"
                  className="py-3 rounded-xl font-bold text-center block transition-all duration-200"
                  style={{
                    background: "rgba(59,130,246,0.2)",
                    border: "1px solid rgba(59,130,246,0.4)",
                    color: "#60a5fa",
                  }}
                >
                  My Reports
                </Link>
              </div>
            </div>

            {/* AI Analysis Card */}
            {aiAnalysis && (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(15,23,42,0.9)",
                  border: `1px solid ${aiAnalysis.isWaste ? "rgba(139,92,246,0.3)" : "rgba(74,222,128,0.3)"}`,
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🤖</span>
                  <h3 className="text-white font-bold">
                    {aiAnalysis.isWaste
                      ? "AI Waste Analysis"
                      : "AI Analysis Result"}
                  </h3>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold ml-auto"
                    style={{
                      background: "rgba(139,92,246,0.2)",
                      border: "1px solid rgba(139,92,246,0.4)",
                      color: "#a78bfa",
                    }}
                  >
                    Powered by Gemini AI
                  </span>
                </div>
                {!aiAnalysis.isWaste && (
                  <div
                    className="rounded-xl p-3 mb-4"
                    style={{
                      background: "rgba(74,222,128,0.1)",
                      border: "1px solid rgba(74,222,128,0.3)",
                    }}
                  >
                    <p className="text-green-400 text-sm font-medium">
                      ✅ No waste detected. Please capture a clear waste image
                      for accurate analysis.
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Waste Type */}
                  <div
                    className="rounded-xl p-3"
                    style={{
                      background: "rgba(30,41,59,0.8)",
                      border: "1px solid rgba(100,116,139,0.3)",
                    }}
                  >
                    <p className="text-slate-400 text-xs mb-1">Waste Type</p>
                    <p className="text-white font-bold text-sm">
                      {aiAnalysis.wasteType}
                    </p>
                  </div>

                  {/* Severity */}
                  <div
                    className="rounded-xl p-3"
                    style={{
                      background:
                        severityConfig[aiAnalysis.severity]?.bg ||
                        "rgba(30,41,59,0.8)",
                      border: `1px solid ${severityConfig[aiAnalysis.severity]?.border || "rgba(100,116,139,0.3)"}`,
                    }}
                  >
                    <p className="text-slate-400 text-xs mb-1">Severity</p>
                    <p
                      className="font-bold text-sm"
                      style={{
                        color:
                          severityConfig[aiAnalysis.severity]?.color || "#fff",
                      }}
                    >
                      {aiAnalysis.severity === "High"
                        ? "🔴"
                        : aiAnalysis.severity === "Medium"
                          ? "🟡"
                          : "🟢"}{" "}
                      {aiAnalysis.severity}
                    </p>
                  </div>
                </div>

                {/* Disposal Method */}
                <div
                  className="rounded-xl p-3 mb-3"
                  style={{
                    background: "rgba(30,41,59,0.8)",
                    border: "1px solid rgba(100,116,139,0.3)",
                  }}
                >
                  <p className="text-slate-400 text-xs mb-1">
                    ♻️ Disposal Method
                  </p>
                  <p className="text-white text-sm">
                    {aiAnalysis.disposalMethod}
                  </p>
                </div>

                {/* Environmental Impact */}
                <div
                  className="rounded-xl p-3"
                  style={{
                    background: "rgba(30,41,59,0.8)",
                    border: "1px solid rgba(100,116,139,0.3)",
                  }}
                >
                  <p className="text-slate-400 text-xs mb-1">
                    🌍 Environmental Impact
                  </p>
                  <p className="text-white text-sm">
                    {aiAnalysis.environmentalImpact}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotNowPage;
