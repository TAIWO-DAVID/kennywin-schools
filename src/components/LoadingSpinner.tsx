"use client"

const LoadingSpinner = () => {
  return (
    <div className="grid place-items-center h-screen">
      {/* Loader */}
      <div className="loading flex gap-2">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default LoadingSpinner