import React, { useState } from 'react';
import { useWaaSStore } from '../store/waasStore';
import { Save, Download, Upload, Trash2, Key, Database, Bell, Shield, Users, Settings as SettingsIcon } from 'lucide-react';

interface UserSettings {
  apiKeys: {
    gemini: string;
    openai: string;
    anthropic: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    autoSave: boolean;
    maxSimulationTime: number;
    defaultOrganization: string;
  };
  security: {
    sessionTimeout: number;
    requireConfirmation: boolean;
    enableAuditLog: boolean;
  };
}

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('general');
  const { getAllOrganizations, clearPersistentState } = useWaaSStore();
  const organizations = getAllOrganizations();

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('userSettings');
    return saved ? JSON.parse(saved) : {
      apiKeys: {
        gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
        openai: '',
        anthropic: ''
      },
      preferences: {
        theme: 'light',
        notifications: true,
        autoSave: true,
        maxSimulationTime: 300,
        defaultOrganization: ''
      },
      security: {
        sessionTimeout: 60,
        requireConfirmation: true,
        enableAuditLog: false
      }
    };
  });

  const [members] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active',
      lastActive: '2 hours ago',
      joinedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Editor',
      status: 'Active',
      lastActive: '1 day ago',
      joinedAt: new Date('2024-01-20')
    },
    {
      id: '3',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      role: 'Viewer',
      status: 'Inactive',
      lastActive: '1 week ago',
      joinedAt: new Date('2024-02-01')
    }
  ]);

  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'Viewer'
  });

  const saveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    // Update environment variables if API keys changed
    if (settings.apiKeys.gemini) {
      // Note: In a real app, this would be handled more securely
      console.log('Gemini API key updated');
    }
    
    alert('Settings saved successfully!');
  };

  const exportSettings = () => {
    const exportData = {
      settings,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waas-settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.settings) {
          setSettings(data.settings);
          alert('Settings imported successfully!');
        } else {
          alert('Invalid settings file format');
        }
      } catch (error) {
        alert('Error reading settings file');
      }
    };
    reader.readAsText(file);
  };

  const inviteMember = () => {
    if (!inviteForm.email) return;
    
    // In a real app, this would send an invitation email
    alert(`Invitation sent to ${inviteForm.email} with role: ${inviteForm.role}`);
    setInviteForm({ email: '', role: 'Viewer' });
  };

  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const resetAllData = async () => {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      if (confirm('This will delete all organizations, tasks, and settings. Are you absolutely sure?')) {
        await clearPersistentState();
        localStorage.removeItem('userSettings');
        localStorage.removeItem('playgroundSessions');
        alert('All data has been reset. The page will reload.');
        window.location.reload();
      }
    }
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight">Settings</p>
            <p className="text-[#5c748a] text-sm font-normal leading-normal">
              Manage your account, preferences, and system configuration
            </p>
          </div>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Import Settings
              <input
                type="file"
                accept=".json"
                onChange={importSettings}
                className="hidden"
              />
            </label>
            <button
              onClick={exportSettings}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Settings
            </button>
            <button
              onClick={saveSettings}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#d4dce2] px-4">
          {[
            { id: 'general', label: 'General', icon: SettingsIcon },
            { id: 'api-keys', label: 'API Keys', icon: Key },
            { id: 'members', label: 'Team Members', icon: Users },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'data', label: 'Data Management', icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#0c7ff2] text-[#0c7ff2]'
                    : 'border-transparent text-[#5c748a] hover:text-[#101518]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                <h3 className="text-[#101518] text-lg font-semibold mb-4">Preferences</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select
                      value={settings.preferences.theme}
                      onChange={(e) => updateSettings('preferences', 'theme', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Organization</label>
                    <select
                      value={settings.preferences.defaultOrganization}
                      onChange={(e) => updateSettings('preferences', 'defaultOrganization', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">None</option>
                      {organizations.map(org => (
                        <option key={org.id} value={org.name}>{org.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Simulation Time (seconds)</label>
                    <input
                      type="number"
                      value={settings.preferences.maxSimulationTime}
                      onChange={(e) => updateSettings('preferences', 'maxSimulationTime', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="60"
                      max="3600"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.preferences.notifications}
                      onChange={(e) => updateSettings('preferences', 'notifications', e.target.checked)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Enable notifications</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.preferences.autoSave}
                      onChange={(e) => updateSettings('preferences', 'autoSave', e.target.checked)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Auto-save sessions</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api-keys' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                <h3 className="text-[#101518] text-lg font-semibold mb-4">API Keys</h3>
                <p className="text-[#5c748a] text-sm mb-6">
                  Configure API keys for different LLM providers. Keys are stored locally and never sent to our servers.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Gemini API Key
                      <span className="text-green-600 ml-2">✓ Active</span>
                    </label>
                    <input
                      type="password"
                      value={settings.apiKeys.gemini}
                      onChange={(e) => updateSettings('apiKeys', 'gemini', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your Gemini API key"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OpenAI API Key
                      <span className="text-gray-400 ml-2">Coming Soon</span>
                    </label>
                    <input
                      type="password"
                      value={settings.apiKeys.openai}
                      onChange={(e) => updateSettings('apiKeys', 'openai', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent opacity-50"
                      placeholder="Enter your OpenAI API key"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anthropic API Key
                      <span className="text-gray-400 ml-2">Coming Soon</span>
                    </label>
                    <input
                      type="password"
                      value={settings.apiKeys.anthropic}
                      onChange={(e) => updateSettings('apiKeys', 'anthropic', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent opacity-50"
                      placeholder="Enter your Anthropic API key"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                <h3 className="text-[#101518] text-lg font-semibold mb-4">Invite Team Member</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <input
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="teammate@example.com"
                    />
                  </div>
                  <div>
                    <select
                      value={inviteForm.role}
                      onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Viewer">Viewer</option>
                      <option value="Editor">Editor</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={inviteMember}
                  disabled={!inviteForm.email}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send Invitation
                </button>
              </div>

              <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                <h3 className="text-[#101518] text-lg font-semibold mb-4">Team Members</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#d4dce2]">
                        <th className="text-left py-3 px-4 text-[#5c748a] font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-[#5c748a] font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-[#5c748a] font-medium">Role</th>
                        <th className="text-left py-3 px-4 text-[#5c748a] font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-[#5c748a] font-medium">Last Active</th>
                        <th className="text-left py-3 px-4 text-[#5c748a] font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.id} className="border-b border-[#d4dce2] last:border-b-0">
                          <td className="py-3 px-4 text-[#101518] font-medium">{member.name}</td>
                          <td className="py-3 px-4 text-[#5c748a]">{member.email}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              member.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                              member.role === 'Editor' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {member.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {member.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#5c748a]">{member.lastActive}</td>
                          <td className="py-3 px-4">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                <h3 className="text-[#101518] text-lg font-semibold mb-4">Security Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="5"
                      max="480"
                    />
                    <p className="text-xs text-gray-500 mt-1">Automatically log out after this period of inactivity</p>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.requireConfirmation}
                        onChange={(e) => updateSettings('security', 'requireConfirmation', e.target.checked)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Require confirmation for destructive actions</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.enableAuditLog}
                        onChange={(e) => updateSettings('security', 'enableAuditLog', e.target.checked)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Enable audit logging</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                <h3 className="text-[#101518] text-lg font-semibold mb-4">Data Management</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[#101518] font-medium mb-2">Storage Usage</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{organizations.length}</div>
                        <div className="text-[#5c748a] text-sm">Organizations</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {JSON.parse(localStorage.getItem('playgroundSessions') || '[]').length}
                        </div>
                        <div className="text-[#5c748a] text-sm">Playground Sessions</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.round((JSON.stringify(localStorage).length / 1024))}KB
                        </div>
                        <div className="text-[#5c748a] text-sm">Local Storage</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[#101518] font-medium mb-2">Data Export</h4>
                    <p className="text-[#5c748a] text-sm mb-4">
                      Export all your data including organizations, sessions, and settings for backup or migration.
                    </p>
                    <button
                      onClick={exportSettings}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export All Data
                    </button>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-red-600 font-medium mb-2">Danger Zone</h4>
                    <p className="text-[#5c748a] text-sm mb-4">
                      Permanently delete all data including organizations, tasks, sessions, and settings. This action cannot be undone.
                    </p>
                    <button
                      onClick={resetAllData}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Reset All Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}