export default function Footer() {
  return (
    <footer className="border-t border-base-border bg-base-card mt-8">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-base-subt">
        <p>
          © {new Date().getFullYear()} AI Resume Builder. Nipuna Lakmal. All
          rights reserved.
        </p>
        <p className="hidden sm:block">Built with MERN, TailwindCSS, and AI.</p>
      </div>
    </footer>
  );
}
