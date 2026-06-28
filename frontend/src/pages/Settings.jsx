import { Bell, Shield, Moon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Settings</h1>

      <div className="space-y-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary-600" />
            <div>
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-sm text-slate-500">Email and push notification preferences</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {['Daily study reminders', 'Streak alerts', 'New achievement badges', 'Placement tips'].map((item) => (
              <label key={item} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{item}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-primary-600" />
              </label>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary-600" />
            <div>
              <h3 className="font-semibold">Privacy & Security</h3>
              <p className="text-sm text-slate-500">Manage your account security</p>
            </div>
          </div>
          <button className="btn-secondary mt-4">Change Password</button>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <Moon className="h-5 w-5 text-primary-600" />
            <div>
              <h3 className="font-semibold">Appearance</h3>
              <p className="text-sm text-slate-500">Theme and display settings</p>
            </div>
          </div>
          <select className="input-field mt-4 max-w-xs">
            <option>Light Mode</option>
            <option>Dark Mode</option>
            <option>System Default</option>
          </select>
        </div>
      </div>
    </div>
  );
}
