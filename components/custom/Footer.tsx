// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1  md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-primary text-center">
            Learnly
          </h2>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Your personalized AI-powered learning tracker.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-center">
            Quick Links
          </h3>
          <ul className="space-y-2 text-center text-sm text-muted-foreground">
            <li>
              <a href="/" className="hover:text-primary">
                Home
              </a>
            </li>
            <li>
              <a href="/features" className="hover:text-primary">
                Features
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-primary">
                About
              </a>
            </li>
          </ul>
        </div>

        {/* Copyright */}
        <div className="flex items-start w-fit mx-auto">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Learnly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
