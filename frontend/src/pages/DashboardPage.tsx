import { useAuthStore } from '../store/useAuthStore';

export function DashboardPage(): React.ReactElement {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome back, {user?.full_name || 'User'}! 🎉
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Email: {user?.email}
          </p>
        </div>        
      </div>
    </div>
  );
}