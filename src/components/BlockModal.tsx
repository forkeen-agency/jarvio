import { Dialog } from "@headlessui/react";
import { useState } from "react";

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: any;
  onSave: (id: string, data: any) => void;
}

export default function BlockModal({ isOpen, onClose, node, onSave }: BlockModalProps) {
  const [activeTab, setActiveTab] = useState("current");
  const [mode, setMode] = useState("structured"); // structured | json
  const [form, setForm] = useState(node?.data || {});

  // Verificação de segurança
  if (!node || !node.data) return null;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(node.id, form);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-lg w-[960px] max-h-[90vh] overflow-y-auto border">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 flex items-center justify-center rounded-md bg-blue-100 text-blue-700 font-bold uppercase">
              {node.data.label?.[0] || "?"}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {node.data.label || "New Step"}
              </h2>
              <p className="text-sm text-gray-500">New Step</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Save Parameters
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 font-medium"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-6">
          {[
            { key: "input", label: "INPUT" },
            { key: "current", label: "CURRENT BLOCK" },
            { key: "output", label: "OUTPUT" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Mode toggle */}
          <div className="ml-auto flex items-center space-x-2">
            <button
              onClick={() => setMode("structured")}
              className={`text-xs px-2 py-1 rounded ${
                mode === "structured"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Structured
            </button>
            <button
              onClick={() => setMode("json")}
              className={`text-xs px-2 py-1 rounded ${
                mode === "json"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              JSON
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {activeTab === "input" && (
            <div className="text-center text-gray-500 py-16">
              <p>No input data yet</p>
              <p className="text-sm">Execute previous nodes</p>
            </div>
          )}

          {activeTab === "current" && (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block mb-1 text-sm text-gray-700 font-medium">
                  AI Instructions
                </label>
                <textarea
                  className="w-full border rounded-md p-2"
                  placeholder="Description for new step"
                  value={form.instructions || ""}
                  onChange={(e) =>
                    handleChange("instructions", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-gray-700 font-medium">
                  Date Range
                </label>
                <input
                  type="text"
                  placeholder="2024-01-01,2024-01-31"
                  className="w-full border rounded-md p-2"
                  value={form.dateRange || ""}
                  onChange={(e) => handleChange("dateRange", e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Date range for the Amazon sales and traffic report.
                </p>
              </div>

              <div>
                <label className="block mb-1 text-sm text-gray-700 font-medium">
                  Date Granularity
                </label>
                <input
                  type="text"
                  placeholder="DAY"
                  className="w-full border rounded-md p-2"
                  value={form.dateGranularity || ""}
                  onChange={(e) =>
                    handleChange("dateGranularity", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-gray-700 font-medium">
                  ASIN Granularity
                </label>
                <input
                  type="text"
                  placeholder="PARENT"
                  className="w-full border rounded-md p-2"
                  value={form.asinGranularity || ""}
                  onChange={(e) =>
                    handleChange("asinGranularity", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {activeTab === "output" && (
            <div className="text-center text-gray-500 py-16">
              <p>Execute this node to view data</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-4">
          <button
            onClick={() => alert("Simulated Test Run")}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            ▶ Test Step
          </button>
        </div>
      </div>
    </Dialog>
  );
}
