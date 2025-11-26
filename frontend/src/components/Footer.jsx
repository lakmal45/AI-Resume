export default function Footer() {
  return (
    <footer className="w-full py-6 text-center text-gray-500 text-sm bg-gray-50">
      © {new Date().getFullYear()} AI Resume Builder. Nipuna Laxmii. All rights
      reserved.
      <br />
      Built with MERN, TailwindCSS, and AI.
    </footer>
  );
}
