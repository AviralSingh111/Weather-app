export default function Loader() {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-xl font-semibold text-blue-500">Loading 3D model...</p>
      </div>
    );
  }