"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Book,
  Edit,
  FileText,
  Settings,
  Calendar,
  Clock,
  Save,
  MessageSquare,
  Menu,
  X,
  Search,
  Moon,
  LogOut,
  Home,
  Target,
  FolderOpen,
} from "lucide-react";

export default function AppLayoutV2({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const pathname = usePathname();

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time and date
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formattedDt = {
    time: formatTime(currentTime),
    date: formatDate(currentTime),
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const logout = () => {
    // Implement logout logic
    console.log("Logout clicked");
  };

  // Navigation groups
  const sidebarNavGroups = [
    {
      group: "Main",
      items: [
        {
          href: "/dashboard-v2",
          label: "Dashboard",
          icon: Home,
          aria: "Go to Dashboard",
        },
        {
          href: "/books",
          label: "My Books",
          icon: Book,
          aria: "Go to My Books",
        },
        {
          href: "/drafts",
          label: "Drafts",
          icon: FileText,
          aria: "Go to Drafts",
        },
      ],
    },
    {
      group: "Tools",
      items: [
        {
          href: "/book-editor-v2",
          label: "Book Editor",
          icon: Edit,
          aria: "Go to Book Editor",
        },
        {
          href: "/ai-consultant",
          label: "AI Consultant",
          icon: MessageSquare,
          aria: "Go to AI Consultant",
        },
        {
          href: "/task-manager",
          label: "Task Manager",
          icon: Target,
          aria: "Go to Task Manager",
        },
      ],
    },
    {
      group: "Management",
      items: [
        {
          href: "/storage",
          label: "Storage",
          icon: Save,
          aria: "Go to Storage",
        },
        {
          href: "/version-history",
          label: "Version History",
          icon: Clock,
          aria: "Go to Version History",
        },
        {
          href: "/settings",
          label: "Settings",
          icon: Settings,
          aria: "Go to Settings",
        },
      ],
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 2xl:w-72 3xl:w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 2xl:p-8 3xl:p-10 border-b border-slate-200">
            <Link
              href="/dashboard-v2"
              className="flex items-center gap-2 text-lg 2xl:text-xl 3xl:text-2xl font-semibold text-slate-800 hover:text-indigo-600 transition-colors"
            >
              <Book className="h-6 w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 text-indigo-600" />
              <span>Page by Page</span>
            </Link>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 2xl:p-3 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 2xl:h-6 2xl:w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 2xl:p-6 3xl:p-8 space-y-6 2xl:space-y-8 overflow-y-auto">
            {sidebarNavGroups.map((group, idx) => (
              <div key={group.group || idx}>
                <h3 className="text-xs 2xl:text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 2xl:mb-4">
                  {group.group}
                </h3>
                <ul className="space-y-1 2xl:space-y-2">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2 2xl:px-4 2xl:py-3 3xl:px-5 3xl:py-4 rounded-lg text-sm 2xl:text-base 3xl:text-lg font-medium transition-colors ${
                            isActive
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                          aria-label={item.aria}
                        >
                          <Icon className="h-5 w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 2xl:p-6 3xl:p-8 border-t border-slate-200 space-y-4 2xl:space-y-6">
            <div className="text-center text-sm 2xl:text-base 3xl:text-lg text-slate-600">
              <div className="font-medium">{formattedDt.time}</div>
              <div>{formattedDt.date}</div>
            </div>
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-3 py-2 2xl:px-4 2xl:py-3 3xl:px-5 3xl:py-4 text-sm 2xl:text-base 3xl:text-lg font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
              aria-label="Sign Out"
            >
              <LogOut className="h-5 w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-0 2xl:pl-4 3xl:pl-6">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8 2xl:px-12 3xl:px-16 2xl:py-6 3xl:py-8">
            <div className="flex items-center gap-4 2xl:gap-6">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 2xl:p-3 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5 2xl:h-6 2xl:w-6" />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 2xl:h-5 2xl:w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search drafts, tasks, commands..."
                  className="pl-10 pr-4 py-2 2xl:py-3 3xl:py-4 w-64 lg:w-80 2xl:w-96 3xl:w-[28rem] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm 2xl:text-base 3xl:text-lg"
                  aria-label="Search"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 2xl:gap-4 3xl:gap-6">
              <button
                className="p-2 2xl:p-3 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Toggle theme"
              >
                <Moon className="h-5 w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7 text-slate-600" />
              </button>
              <Link
                href="/settings"
                className="p-2 2xl:p-3 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Go to Settings"
              >
                <Settings className="h-5 w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7 text-slate-600" />
              </Link>
              <div className="h-8 w-8 2xl:h-10 2xl:w-10 3xl:h-12 3xl:w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm 2xl:text-base 3xl:text-lg">
                U
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
