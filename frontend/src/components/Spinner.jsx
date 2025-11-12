const Spinner = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-600',
    red: 'border-red-600',
    green: 'border-green-600'
  };

  return (
    <div className={`${sizeClasses[size]} border-4 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}></div>
  );
};

export const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Spinner size="xl" color="blue" />
      <p className="mt-4 text-lg text-gray-600">{message}</p>
    </div>
  );
};

export const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-xl">
        <Spinner size="lg" color="blue" />
        <p className="mt-4 text-lg text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default Spinner;

