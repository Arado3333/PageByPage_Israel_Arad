"use client";

import { useState, useEffect } from "react";
import { Button } from "../../books/ui/button";
import { Input } from "../../books/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { Badge } from "../../books/ui/badge";
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  Activity,
} from "lucide-react";
import {
  getAllUsersFilteredLogs,
  exportLogsToCSV,
  exportLogsToJSON,
  EVENT_TYPES,
  logUserManagementEvent,
} from "../../lib/logManager";

export default function SystemLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    eventType: "",
    startDate: "",
    endDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showLogDetail, setShowLogDetail] = useState(false);
  const logsPerPage = 50;

  useEffect(() => {
    loadLogs();
  }, [filters, currentPage]);

  const loadLogs = () => {
    setLoading(true);
    try {
      const filteredLogs = getAllUsersFilteredLogs(filters);
      setLogs(filteredLogs);
    } catch (error) {
      console.error("Error loading logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleViewLog = (log) => {
    setSelectedLog(log);
    setShowLogDetail(true);
  };

  const handleExportCSV = () => {
    try {
      const csvContent = exportLogsToCSV(logs);
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `system-logs-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  const handleExportJSON = () => {
    try {
      const jsonContent = exportLogsToJSON(logs);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `system-logs-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting JSON:", error);
    }
  };

  const getEventTypeBadge = (eventType) => {
    const variants = {
      [EVENT_TYPES.AUTH]: "default",
      [EVENT_TYPES.USER_MANAGEMENT]: "destructive",
      [EVENT_TYPES.BOOK]: "secondary",
      [EVENT_TYPES.CHAPTER]: "secondary",
      [EVENT_TYPES.DRAFT]: "outline",
      [EVENT_TYPES.AI_USAGE]: "default",
      [EVENT_TYPES.EXPORT]: "secondary",
      [EVENT_TYPES.SETTINGS]: "outline",
    };

    return (
      <Badge variant={variants[eventType] || "secondary"}>{eventType}</Badge>
    );
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getPaginatedLogs = () => {
    const startIndex = (currentPage - 1) * logsPerPage;
    const endIndex = startIndex + logsPerPage;
    return logs.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(logs.length / logsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            System Logs
          </h2>
          <p className="text-gray-600">View and export system activity logs</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              // Test with current user info
              logUserManagementEvent(
                "Test log entry",
                null, // Let it auto-detect user ID
                null, // Let it auto-detect user email
                {
                  action: "test_log",
                  message:
                    "This is a test log entry to verify logging is working with cookie-based auth",
                  timestamp: new Date().toISOString(),
                }
              );
              loadLogs(); // Refresh logs to show the new entry
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            Test Log
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={handleExportJSON}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search logs..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <select
              value={filters.eventType}
              onChange={(e) => handleFilterChange("eventType", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Event Types</option>
              {Object.values(EVENT_TYPES).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <Input
              type="date"
              placeholder="Start Date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />

            <Input
              type="date"
              placeholder="End Date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Logs ({logs.length} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Timestamp</th>
                      <th className="text-left p-2">User</th>
                      <th className="text-left p-2">Event Type</th>
                      <th className="text-left p-2">Action</th>
                      <th className="text-left p-2">Resource</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPaginatedLogs().map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 text-sm">
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="font-medium">
                                {log.userEmail || "System"}
                              </div>
                              {log.userId && (
                                <div className="text-xs text-gray-500">
                                  {log.userId}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          {getEventTypeBadge(log.eventType)}
                        </td>
                        <td className="p-2 font-medium">{log.action}</td>
                        <td className="p-2 text-sm text-gray-600">
                          {log.resource || "-"}
                        </td>
                        <td className="p-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewLog(log)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}

              {logs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No logs found matching your criteria.
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Log Detail Modal */}
      {showLogDetail && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Log Details</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLogDetail(false)}
              >
                ×
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium">Timestamp:</label>
                    <p className="text-sm text-gray-600">
                      {formatTimestamp(selectedLog.timestamp)}
                    </p>
                  </div>
                  <div>
                    <label className="font-medium">Event Type:</label>
                    <div className="mt-1">
                      {getEventTypeBadge(selectedLog.eventType)}
                    </div>
                  </div>
                  <div>
                    <label className="font-medium">Action:</label>
                    <p className="text-sm text-gray-600">
                      {selectedLog.action}
                    </p>
                  </div>
                  <div>
                    <label className="font-medium">Resource:</label>
                    <p className="text-sm text-gray-600">
                      {selectedLog.resource || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="font-medium">User Email:</label>
                    <p className="text-sm text-gray-600">
                      {selectedLog.userEmail || "System"}
                    </p>
                  </div>
                  <div>
                    <label className="font-medium">User ID:</label>
                    <p className="text-sm text-gray-600">
                      {selectedLog.userId || "-"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="font-medium">Details:</label>
                  <pre className="mt-2 p-4 bg-gray-100 rounded-md text-sm overflow-x-auto">
                    {JSON.stringify(selectedLog.details || {}, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
