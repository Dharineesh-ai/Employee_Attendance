import { useSelector } from 'react-redux';

export default function EmployeeProfilePage() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600">No user loaded. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Your account details.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4 max-w-xl">
        <ProfileRow label="Full Name" value={user.name} />
        <ProfileRow label="Email" value={user.email} />
        <ProfileRow label="Employee ID" value={user.employeeId} />
        <ProfileRow label="Department" value={user.department} />
        <ProfileRow label="Role" value={user.role} />
        <ProfileRow
          label="Joined At"
          value={user.createdAt ? user.createdAt.slice(0, 10) : '-'}
        />
      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="mt-1 sm:mt-0 text-sm text-gray-900">{value || '-'}</span>
    </div>
  );
}
