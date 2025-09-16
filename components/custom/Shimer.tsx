// components/ui/ShimmerLoader.tsx
const ShimmerLoader = () => {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 animate-pulse space-y-6">
      {/* Header */}
      <div className="h-8 w-1/3 rounded-md bg-muted"></div>
      <div className="h-4 w-2/3 rounded-md bg-muted"></div>

      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-4 border rounded-xl space-y-3 bg-card shadow-sm"
        >
          <div className="h-5 w-1/4 rounded bg-muted"></div>
          <div className="space-y-2">
            <div className="h-4 w-1/2 rounded bg-muted"></div>
            <div className="h-4 w-1/3 rounded bg-muted"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShimmerLoader;
