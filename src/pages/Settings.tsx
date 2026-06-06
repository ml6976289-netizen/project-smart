import { useState } from 'react';
import { useToast } from '../components/ui/Toast';
import { useAppContext } from '../context/AppContext';

export default function Settings() {
  const { show: showToast } = useToast();
  const { profile, updateProfile, changePassword } = useAppContext();

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);

  // Track edited values during edit mode
  const [tempFullName, setTempFullName] = useState(profile.fullName);
  const [tempEmail, setTempEmail] = useState(profile.email);
  const [tempTimezone, setTempTimezone] = useState(profile.timezone);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Get the first letter for avatar
  const avatarLetter = profile.fullName.charAt(0).toUpperCase() || 'A';

  /**
   * Enter edit mode and populate temp values
   */
  const handleStartEdit = () => {
    setTempFullName(profile.fullName);
    setTempEmail(profile.email);
    setTempTimezone(profile.timezone);
    setIsEditing(true);
  };

  /**
   * Save changes to AppContext and localStorage
   */
  const handleSaveChanges = () => {
    // Validate inputs
    if (!tempFullName.trim()) {
      showToast('Full Name cannot be empty', 'error');
      return;
    }
    if (!tempEmail.trim() || !tempEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    // Update profile in context (automatically saves to localStorage)
    updateProfile({
      fullName: tempFullName,
      email: tempEmail,
      timezone: tempTimezone,
    });

    setIsEditing(false);
    showToast('Profile updated successfully! ✓', 'success');
  };

  /**
   * Cancel edit mode and revert changes
   */
  const handleCancel = () => {
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      showToast('Please fill in all password fields.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    if (newPassword.length < 8) {
      showToast('New password should be at least 8 characters.', 'error');
      return;
    }

    const success = changePassword(currentPassword, newPassword);
    if (!success) {
      showToast('Current password is incorrect.', 'error');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password changed successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-[2rem] bg-white p-8 shadow-panel dark:bg-slate-900 dark:text-white">
        <h2 className="text-4xl font-semibold text-slate-950 dark:text-white">My Profile</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400">Manage your digital identity and preferences.</p>
      </div>

      {/* Profile Grid */}
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Avatar Card */}
        <div className="rounded-[2rem] bg-white p-8 shadow-panel dark:bg-slate-900">
          <div className="flex flex-col items-center gap-5 text-center">
            {/* Dynamic Avatar */}
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-5xl font-bold text-white shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50">
              {avatarLetter}
            </div>

            {/* Profile Info */}
            <div>
              <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">{profile.fullName}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">student</p>
            </div>

            {/* Edit/Cancel Button */}
            {!isEditing ? (
              <button
                type="button"
                onClick={handleStartEdit}
                className="rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 active:scale-95"
              >
                Edit Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-[2rem] bg-white p-8 shadow-panel dark:bg-slate-900">
          <div className="space-y-6">
            {/* Full Name & Email */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                Full Name
                {isEditing ? (
                  <input
                    type="text"
                    value={tempFullName}
                    onChange={(e) => setTempFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                  />
                ) : (
                  <div className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {profile.fullName}
                  </div>
                )}
              </label>

              <label className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                Email
                {isEditing ? (
                  <input
                    type="email"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                  />
                ) : (
                  <div className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {profile.email}
                  </div>
                )}
              </label>
            </div>

            {/* Timezone */}
            <label className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              Reports Timezone
              {isEditing ? (
                <select
                  value={tempTimezone}
                  onChange={(e) => setTempTimezone(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                >
                  <option>(UTC+03:00) Asia/Baghdad</option>
                  <option>(UTC+04:00) Asia/Dubai</option>
                  <option>(UTC+02:00) Africa/Cairo</option>
                  <option>(UTC+00:00) UTC</option>
                  <option>(UTC+01:00) Europe/London</option>
                </select>
              ) : (
                <div className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {profile.timezone}
                </div>
              )}
            </label>

            {/* Connected Account Info */}
            <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              <p className="font-semibold text-slate-950 dark:text-white">Connected account</p>
              <p className="mt-3">Log in to The Engineering with your Google, Facebook, or Apple account.</p>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
                Your password is not set, so we cannot disconnect you from your Google account. If you want to disconnect, please set up your password first.
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => showToast('Google login is a preview feature.', 'info')}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600"
              >
                Google
              </button>
              <button
                type="button"
                onClick={() => showToast('Facebook login is a preview feature.', 'info')}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600"
              >
                Facebook
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <p className="font-semibold text-slate-950 dark:text-white">Change password</p>
              <div className="mt-4 space-y-4">
                <label className="block text-sm text-slate-600 dark:text-slate-400">
                  Current password
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </label>
                <label className="block text-sm text-slate-600 dark:text-slate-400">
                  New password
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </label>
                <label className="block text-sm text-slate-600 dark:text-slate-400">
                  Confirm new password
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </label>
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  className="w-full rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Change password
                </button>
              </div>
            </div>

            {/* Save/Edit Actions */}
            {isEditing && (
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="flex-1 rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 active:scale-95"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
