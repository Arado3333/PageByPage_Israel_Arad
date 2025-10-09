"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import {
  Users,
  BookOpen,
  FileText,
  Activity,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react";
import { getLogStats, getAllUsersLogs } from "../../lib/logManager";
import { getTokenFromCookies } from "../../lib/clientAuth.js";

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBooks: 0,
    totalDrafts: 0,
    aiUsage: 0,
    recentActivity: [],
  });
  const [logStats, setLogStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Load log statistics
      const logs = getLogStats();
      setLogStats(logs);

      // Load user statistics (this would come from API in real implementation)
      const userStats = await fetchUserStats();
      setStats(userStats);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = getTokenFromCookies();

      // Fetch users data
      const usersResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/admin/users?limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch books data
      const booksResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/books`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch projects/drafts data
      const projectsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const usersData = usersResponse.ok
        ? await usersResponse.json()
        : { users: [] };
      const booksData = booksResponse.ok ? await booksResponse.json() : [];
      const projectsData = projectsResponse.ok
        ? await projectsResponse.json()
        : [];

      // Get all logs for AI usage calculation
      const allLogs = getAllUsersLogs();
      const aiUsageLogs = allLogs.filter((log) => log.eventType === "ai_usage");

      // Calculate active users (users who logged in within last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const activeUsers =
        usersData.users?.filter((user) => {
          if (!user.lastLogin) return false;
          return new Date(user.lastLogin) > sevenDaysAgo;
        }).length || 0;

      // Get recent activity from logs
      const recentActivity = allLogs.slice(0, 5).map((log) => ({
        action: log.action,
        user: log.userEmail || "System",
        time: getTimeAgo(new Date(log.timestamp)),
      }));

      return {
        totalUsers: usersData.users?.length || 0,
        activeUsers: activeUsers,
        totalBooks: Array.isArray(booksData)
          ? booksData.length
          : booksData.books?.length || 0,
        totalDrafts: Array.isArray(projectsData)
          ? projectsData.length
          : projectsData.projects?.length || 0,
        aiUsage: aiUsageLogs.length,
        recentActivity: recentActivity,
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      // Return default values if API calls fail
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalBooks: 0,
        totalDrafts: 0,
        aiUsage: 0,
        recentActivity: [],
      };
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getTodayAIUsage = () => {
    const allLogs = getAllUsersLogs();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allLogs.filter((log) => {
      if (log.eventType !== "ai_usage") return false;
      const logDate = new Date(log.timestamp);
      return logDate >= today;
    }).length;
  };

  const getThisWeekAIUsage = () => {
    const allLogs = getAllUsersLogs();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return allLogs.filter((log) => {
      if (log.eventType !== "ai_usage") return false;
      const logDate = new Date(log.timestamp);
      return logDate >= weekAgo;
    }).length;
  };

  const StatCard = ({ title, value, icon: Icon, description, trend }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-green-500">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Analytics Dashboard
        </h2>
        <p className="text-gray-600">System overview and activity metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="Registered users"
          trend="+12% from last month"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={Activity}
          description="Users active today"
          trend="+8% from yesterday"
        />
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          icon={BookOpen}
          description="Published books"
          trend="+3 this week"
        />
        <StatCard
          title="Total Drafts"
          value={stats.totalDrafts}
          icon={FileText}
          description="Saved drafts"
          trend="+15 this week"
        />
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Log Statistics */}
        {logStats && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                System Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Logs:</span>
                  <span className="font-medium">{logStats.total}</span>
                </div>

                <div>
                  <h4 className="font-medium mb-2">By Event Type:</h4>
                  <div className="space-y-2">
                    {Object.entries(logStats.byEventType).map(
                      ([type, count]) => (
                        <div
                          key={type}
                          className="flex justify-between text-sm"
                        >
                          <span className="capitalize">
                            {type.replace("_", " ")}:
                          </span>
                          <span>{count}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Top Actions:</h4>
                  <div className="space-y-2">
                    {Object.entries(logStats.byAction)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([action, count]) => (
                        <div
                          key={action}
                          className="flex justify-between text-sm"
                        >
                          <span className="capitalize">
                            {action.replace("_", " ")}:
                          </span>
                          <span>{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* AI Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AI Tool Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.aiUsage}
              </div>
              <div className="text-sm text-gray-600">Total AI Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getTodayAIUsage()}
              </div>
              <div className="text-sm text-gray-600">Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {getThisWeekAIUsage()}
              </div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
