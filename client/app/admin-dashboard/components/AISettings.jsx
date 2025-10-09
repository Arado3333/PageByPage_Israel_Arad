"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "../../books/ui/button";
import { Input } from "../../books/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../books/ui/tabs";
import {
  Bot,
  Save,
  RotateCcw,
  Eye,
  Settings,
  Users,
  Globe,
  Plus,
  Trash2,
} from "lucide-react";
import {
  getUserAISettings,
  saveUserAISettings,
  getGlobalAISettings,
  saveGlobalAISettings,
  getMergedAISettings,
  addCustomPrompt,
  updateCustomPrompt,
  deleteCustomPrompt,
  getAllUsersWithAISettings,
} from "../../lib/aiSettingsManager";
import { logAIUsageEvent } from "../../lib/logManager";

// Move PromptEditor outside to prevent re-creation on every render
const PromptEditor = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
    />
    <div className="text-xs text-gray-500">{value.length} characters</div>
  </div>
);

const TokenLimitInput = ({ label, value, onChange, min, max }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium">{label}</label>
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      max={max}
      className="w-full"
    />
  </div>
);

export default function AISettings() {
  const [activeTab, setActiveTab] = useState("global");
  const [globalSettings, setGlobalSettings] = useState({
    promptOverrides: {
      rewrite: "",
      summarize: "",
      brainstorm: "",
      edit: "",
      expand: "",
    },
    tokenLimits: {
      maxInputTokens: 4000,
      maxOutputTokens: 2000,
    },
    customPrompts: [],
    systemInstructions: "",
    temperature: 0.7,
    model: "gemini-2.5-flash",
  });
  const [userSettings, setUserSettings] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [newCustomPrompt, setNewCustomPrompt] = useState({
    name: "",
    content: "",
    type: "general",
  });

  // Optimize input handlers to prevent re-renders
  const handleCustomPromptNameChange = useCallback((value) => {
    setNewCustomPrompt((prev) => ({ ...prev, name: value }));
  }, []);

  const handleCustomPromptContentChange = useCallback((value) => {
    setNewCustomPrompt((prev) => ({ ...prev, content: value }));
  }, []);

  const handleCustomPromptTypeChange = useCallback((value) => {
    setNewCustomPrompt((prev) => ({ ...prev, type: value }));
  }, []);
  const [editingUser, setEditingUser] = useState(null);
  const [userEditSettings, setUserEditSettings] = useState(null);
  const [showUserEditModal, setShowUserEditModal] = useState(false);

  useEffect(() => {
    loadGlobalSettings();
    loadUserSettings();
  }, []);

  const loadGlobalSettings = async () => {
    try {
      setLoading(true);
      const settings = getGlobalAISettings();
      setGlobalSettings(settings);
    } catch (error) {
      console.error("Error loading global settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserSettings = async () => {
    try {
      const usersWithSettings = getAllUsersWithAISettings();
      const userSettingsList = usersWithSettings.map((userId) => ({
        userId,
        settings: getUserAISettings(userId),
      }));
      setUserSettings(userSettingsList);
    } catch (error) {
      console.error("Error loading user settings:", error);
    }
  };

  const handleGlobalSettingsChange = useCallback((field, value) => {
    setGlobalSettings((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        ...value,
      },
    }));
  }, []);

  const handleTokenLimitChange = useCallback((field, value) => {
    setGlobalSettings((prev) => ({
      ...prev,
      tokenLimits: {
        ...prev.tokenLimits,
        [field]: parseInt(value) || 0,
      },
    }));
  }, []);

  const saveGlobalSettings = async () => {
    try {
      setSaving(true);
      const success = saveGlobalAISettings(globalSettings);

      if (success) {
        // Log the AI settings change
        logAIUsageEvent(
          "Global AI settings updated",
          null, // No specific user for global settings
          "admin",
          {
            action: "update_global_ai_settings",
            settings: globalSettings,
            timestamp: new Date().toISOString(),
          }
        );

        alert("Global AI settings saved successfully!");
      } else {
        alert("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving global settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm("Are you sure you want to reset to default settings?")) {
      setGlobalSettings({
        promptOverrides: {
          rewrite:
            "Please rewrite the following text to improve clarity and flow:",
          summarize: "Please provide a concise summary of the following text:",
          brainstorm: "Please help brainstorm ideas for the following topic:",
          edit: "Please help edit and improve the following text:",
          expand: "Please expand on the following text with more detail:",
        },
        tokenLimits: {
          maxInputTokens: 4000,
          maxOutputTokens: 2000,
        },
        customPrompts: [],
        systemInstructions: "",
        temperature: 0.7,
        model: "gemini-2.5-flash",
      });
    }
  };

  const handleAddCustomPrompt = useCallback(() => {
    if (newCustomPrompt.name && newCustomPrompt.content) {
      addCustomPrompt(newCustomPrompt);
      setNewCustomPrompt({ name: "", content: "", type: "general" });
      loadGlobalSettings(); // Refresh to show new prompt
    }
  }, [newCustomPrompt]);

  const handleDeleteCustomPrompt = useCallback((promptId) => {
    if (confirm("Are you sure you want to delete this custom prompt?")) {
      deleteCustomPrompt(promptId);
      loadGlobalSettings(); // Refresh to remove deleted prompt
    }
  }, []);

  const handleUpdateCustomPrompt = useCallback((promptId, updates) => {
    updateCustomPrompt(promptId, updates);
    loadGlobalSettings(); // Refresh to show updates
  }, []);

  const handleEditUserSettings = useCallback((userId) => {
    const userSettings = getUserAISettings(userId);
    setEditingUser(userId);
    setUserEditSettings({ ...userSettings });
    setShowUserEditModal(true);
  }, []);

  const handleSaveUserSettings = useCallback(() => {
    if (editingUser && userEditSettings) {
      const success = saveUserAISettings(userEditSettings, editingUser);

      if (success) {
        // Log the user AI settings change
        logAIUsageEvent("User AI settings updated", editingUser, "admin", {
          action: "update_user_ai_settings",
          targetUserId: editingUser,
          settings: userEditSettings,
          timestamp: new Date().toISOString(),
        });
      }

      setShowUserEditModal(false);
      setEditingUser(null);
      setUserEditSettings(null);
      loadUserSettings(); // Refresh the list
    }
  }, [editingUser, userEditSettings]);

  const handleAddUserCustomPrompt = useCallback(() => {
    if (
      editingUser &&
      userEditSettings &&
      newCustomPrompt.name &&
      newCustomPrompt.content
    ) {
      const newPrompt = addCustomPrompt(newCustomPrompt, editingUser);
      if (newPrompt) {
        setUserEditSettings((prev) => ({
          ...prev,
          customPrompts: [...(prev.customPrompts || []), newPrompt],
        }));
        setNewCustomPrompt({ name: "", content: "", type: "general" });
      }
    }
  }, [editingUser, userEditSettings, newCustomPrompt]);

  const handleDeleteUserCustomPrompt = useCallback(
    (promptId) => {
      if (
        editingUser &&
        confirm("Are you sure you want to delete this custom prompt?")
      ) {
        deleteCustomPrompt(promptId, editingUser);
        setUserEditSettings((prev) => ({
          ...prev,
          customPrompts: prev.customPrompts.filter((p) => p.id !== promptId),
        }));
      }
    },
    [editingUser]
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI Settings
          </h2>
          <p className="text-gray-600">Configure AI prompts and token limits</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {previewMode ? "Edit Mode" : "Preview Mode"}
          </Button>
          <Button
            variant="outline"
            onClick={resetToDefaults}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Global Settings
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User-Specific Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Global AI Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prompt Overrides */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Prompt Templates</h3>
                <div className="space-y-4">
                  <PromptEditor
                    label="Rewrite Prompt"
                    value={globalSettings.promptOverrides.rewrite}
                    onChange={(value) =>
                      handleGlobalSettingsChange("promptOverrides", {
                        rewrite: value,
                      })
                    }
                    placeholder="Please rewrite the following text to improve clarity and flow:"
                  />

                  <PromptEditor
                    label="Summarize Prompt"
                    value={globalSettings.promptOverrides.summarize}
                    onChange={(value) =>
                      handleGlobalSettingsChange("promptOverrides", {
                        summarize: value,
                      })
                    }
                    placeholder="Please provide a concise summary of the following text:"
                  />

                  <PromptEditor
                    label="Brainstorm Prompt"
                    value={globalSettings.promptOverrides.brainstorm}
                    onChange={(value) =>
                      handleGlobalSettingsChange("promptOverrides", {
                        brainstorm: value,
                      })
                    }
                    placeholder="Please help brainstorm ideas for the following topic:"
                  />
                </div>
              </div>

              {/* Token Limits */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Token Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TokenLimitInput
                    label="Max Input Tokens"
                    value={globalSettings.tokenLimits.maxInputTokens}
                    onChange={(value) =>
                      handleTokenLimitChange("maxInputTokens", value)
                    }
                    min={100}
                    max={10000}
                  />

                  <TokenLimitInput
                    label="Max Output Tokens"
                    value={globalSettings.tokenLimits.maxOutputTokens}
                    onChange={(value) =>
                      handleTokenLimitChange("maxOutputTokens", value)
                    }
                    min={50}
                    max={5000}
                  />
                </div>
              </div>

              {/* Custom Prompts */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Custom Prompts</h3>
                <div className="space-y-4">
                  {/* Add New Custom Prompt */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-3">Add New Custom Prompt</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Name
                        </label>
                        <Input
                          value={newCustomPrompt.name}
                          onChange={(e) =>
                            handleCustomPromptNameChange(e.target.value)
                          }
                          placeholder="Prompt name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Type
                        </label>
                        <select
                          value={newCustomPrompt.type}
                          onChange={(e) =>
                            handleCustomPromptTypeChange(e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="general">General</option>
                          <option value="rewrite">Rewrite</option>
                          <option value="summarize">Summarize</option>
                          <option value="brainstorm">Brainstorm</option>
                          <option value="edit">Edit</option>
                          <option value="expand">Expand</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        Content
                      </label>
                      <textarea
                        value={newCustomPrompt.content}
                        onChange={(e) =>
                          handleCustomPromptContentChange(e.target.value)
                        }
                        placeholder="Enter your custom prompt..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                      />
                    </div>
                    <Button
                      onClick={handleAddCustomPrompt}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Custom Prompt
                    </Button>
                  </div>

                  {/* Existing Custom Prompts */}
                  {globalSettings.customPrompts &&
                    globalSettings.customPrompts.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium">Existing Custom Prompts</h4>
                        {globalSettings.customPrompts.map((prompt) => (
                          <div
                            key={prompt.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="font-medium">{prompt.name}</h5>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {prompt.type}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleDeleteCustomPrompt(prompt.id)
                                }
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600">
                              {prompt.content}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              Created:{" "}
                              {new Date(prompt.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={saveGlobalSettings}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Global Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User-Specific Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userSettings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No user-specific AI settings found.</p>
                  <p className="text-sm">
                    Users will use global settings by default.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userSettings.map((userSetting) => (
                    <div
                      key={userSetting.userId}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">
                            User ID: {userSetting.userId}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Custom prompts:{" "}
                            {userSetting.settings.customPrompts?.length || 0}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const merged = getMergedAISettings(
                                userSetting.userId
                              );
                              console.log(
                                "Merged settings for user:",
                                userSetting.userId,
                                merged
                              );
                            }}
                          >
                            View Merged
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleEditUserSettings(userSetting.userId)
                            }
                          >
                            Edit
                          </Button>
                        </div>
                      </div>

                      {userSetting.settings.customPrompts &&
                        userSetting.settings.customPrompts.length > 0 && (
                          <div className="mt-3">
                            <h5 className="font-medium text-sm mb-2">
                              Custom Prompts:
                            </h5>
                            <div className="space-y-2">
                              {userSetting.settings.customPrompts.map(
                                (prompt) => (
                                  <div
                                    key={prompt.id}
                                    className="bg-gray-50 p-2 rounded text-sm"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <span className="font-medium">
                                          {prompt.name}
                                        </span>
                                        <span className="text-gray-500 ml-2">
                                          ({prompt.type})
                                        </span>
                                      </div>
                                    </div>
                                    <p className="text-gray-600 mt-1">
                                      {prompt.content}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Edit Modal */}
      {showUserEditModal && editingUser && userEditSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Edit AI Settings for User: {editingUser}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserEditModal(false)}
              >
                ×
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Custom Prompts Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Custom Prompts</h3>

                {/* Add New Custom Prompt */}
                <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                  <h4 className="font-medium mb-3">Add New Custom Prompt</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Name
                      </label>
                      <Input
                        value={newCustomPrompt.name}
                        onChange={(e) =>
                          handleCustomPromptNameChange(e.target.value)
                        }
                        placeholder="Prompt name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Type
                      </label>
                      <select
                        value={newCustomPrompt.type}
                        onChange={(e) =>
                          handleCustomPromptTypeChange(e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="general">General</option>
                        <option value="rewrite">Rewrite</option>
                        <option value="summarize">Summarize</option>
                        <option value="brainstorm">Brainstorm</option>
                        <option value="edit">Edit</option>
                        <option value="expand">Expand</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      Content
                    </label>
                    <textarea
                      value={newCustomPrompt.content}
                      onChange={(e) =>
                        handleCustomPromptContentChange(e.target.value)
                      }
                      placeholder="Enter your custom prompt..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                    />
                  </div>
                  <Button
                    onClick={handleAddUserCustomPrompt}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Custom Prompt
                  </Button>
                </div>

                {/* Existing Custom Prompts */}
                {userEditSettings.customPrompts &&
                  userEditSettings.customPrompts.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Existing Custom Prompts</h4>
                      {userEditSettings.customPrompts.map((prompt) => (
                        <div key={prompt.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium">{prompt.name}</h5>
                              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {prompt.type}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleDeleteUserCustomPrompt(prompt.id)
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600">
                            {prompt.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Created:{" "}
                            {new Date(prompt.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* System Instructions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  System Instructions
                </h3>
                <PromptEditor
                  label="Custom System Instructions"
                  value={userEditSettings.systemInstructions || ""}
                  onChange={(value) =>
                    setUserEditSettings((prev) => ({
                      ...prev,
                      systemInstructions: value,
                    }))
                  }
                  placeholder="Enter custom system instructions for this user..."
                />
              </div>

              {/* Token Limits */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Token Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TokenLimitInput
                    label="Max Input Tokens"
                    value={userEditSettings.tokenLimits?.maxInputTokens || 4000}
                    onChange={(value) =>
                      setUserEditSettings((prev) => ({
                        ...prev,
                        tokenLimits: {
                          ...prev.tokenLimits,
                          maxInputTokens: parseInt(value) || 4000,
                        },
                      }))
                    }
                    min={100}
                    max={10000}
                  />
                  <TokenLimitInput
                    label="Max Output Tokens"
                    value={
                      userEditSettings.tokenLimits?.maxOutputTokens || 2000
                    }
                    onChange={(value) =>
                      setUserEditSettings((prev) => ({
                        ...prev,
                        tokenLimits: {
                          ...prev.tokenLimits,
                          maxOutputTokens: parseInt(value) || 2000,
                        },
                      }))
                    }
                    min={50}
                    max={5000}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveUserSettings}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save User Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
