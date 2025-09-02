// components/Navbar.tsx
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center">
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          Learnly
        </h1>
      </div>
    </nav>
  );
}
