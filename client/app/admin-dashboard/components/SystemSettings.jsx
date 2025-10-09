"use client";

import { useState, useEffect } from "react";
import { Button } from "../../books/ui/button";
import { Input } from "../../books/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../books/ui/tabs";
import {
  Settings,
  Save,
  MessageSquare,
  FileText,
  Shield,
  Globe,
} from "lucide-react";

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      siteName: "Page by Page",
      allowRegistration: true,
      storageLimit: 1000,
      maxFileSize: 10,
    },
    messages: {
      welcomeMessage:
        "Welcome to Page by Page! Start writing your story today.",
      systemAnnouncement: "",
      showAnnouncement: false,
    },
    legal: {
      termsOfService:
        "# Terms of Service\n\n## 1. Acceptance of Terms\n\nBy using Page by Page...",
      privacyPolicy:
        "# Privacy Policy\n\n## Information We Collect\n\nWe collect information you provide directly to us...",
      lastUpdated: new Date().toISOString(),
    },
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would load from the API
      // For now, using default values
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (category, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      // In a real implementation, this would save to the API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            System Settings
          </h2>
          <p className="text-gray-600">Configure global system settings</p>
        </div>
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="legal" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Legal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Site Name
                </label>
                <Input
                  value={settings.general.siteName}
                  onChange={(e) =>
                    handleSettingChange("general", "siteName", e.target.value)
                  }
                  placeholder="Page by Page"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Storage Limit (MB)
                </label>
                <Input
                  type="number"
                  value={settings.general.storageLimit}
                  onChange={(e) =>
                    handleSettingChange(
                      "general",
                      "storageLimit",
                      parseInt(e.target.value)
                    )
                  }
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Max File Size (MB)
                </label>
                <Input
                  type="number"
                  value={settings.general.maxFileSize}
                  onChange={(e) =>
                    handleSettingChange(
                      "general",
                      "maxFileSize",
                      parseInt(e.target.value)
                    )
                  }
                  placeholder="10"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowRegistration"
                  checked={settings.general.allowRegistration}
                  onChange={(e) =>
                    handleSettingChange(
                      "general",
                      "allowRegistration",
                      e.target.checked
                    )
                  }
                  className="rounded"
                />
                <label
                  htmlFor="allowRegistration"
                  className="text-sm font-medium"
                >
                  Allow User Registration
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages & Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Welcome Message
                </label>
                <textarea
                  value={settings.messages.welcomeMessage}
                  onChange={(e) =>
                    handleSettingChange(
                      "messages",
                      "welcomeMessage",
                      e.target.value
                    )
                  }
                  placeholder="Welcome to Page by Page!"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  System Announcement
                </label>
                <textarea
                  value={settings.messages.systemAnnouncement}
                  onChange={(e) =>
                    handleSettingChange(
                      "messages",
                      "systemAnnouncement",
                      e.target.value
                    )
                  }
                  placeholder="Enter system-wide announcement..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showAnnouncement"
                  checked={settings.messages.showAnnouncement}
                  onChange={(e) =>
                    handleSettingChange(
                      "messages",
                      "showAnnouncement",
                      e.target.checked
                    )
                  }
                  className="rounded"
                />
                <label
                  htmlFor="showAnnouncement"
                  className="text-sm font-medium"
                >
                  Show System Announcement
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Legal Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Terms of Service
                </label>
                <textarea
                  value={settings.legal.termsOfService}
                  onChange={(e) =>
                    handleSettingChange(
                      "legal",
                      "termsOfService",
                      e.target.value
                    )
                  }
                  placeholder="Enter terms of service..."
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports Markdown formatting
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Privacy Policy
                </label>
                <textarea
                  value={settings.legal.privacyPolicy}
                  onChange={(e) =>
                    handleSettingChange(
                      "legal",
                      "privacyPolicy",
                      e.target.value
                    )
                  }
                  placeholder="Enter privacy policy..."
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports Markdown formatting
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm">
                  <div>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(settings.legal.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
