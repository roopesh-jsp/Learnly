// components/ui/ShimmerLoader.tsx
const ShimmerLoader = () => {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 animate-pulse space-y-6">
      {/* Header */}
      <div className="h-8 w-1/3 bg-gray-300 rounded-md"></div>
      <div className="h-4 w-2/3 bg-gray-300 rounded-md"></div>

      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-4 border rounded-xl space-y-3 bg-foreground/10"
        >
          <div className="h-5 w-1/4 bg-gray-300 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
            <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShimmerLoader;
