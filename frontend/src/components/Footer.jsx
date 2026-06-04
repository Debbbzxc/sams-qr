import { FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-emerald-100/80 bg-white/85 text-slate-600 shadow-sm backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between h-auto py-4 gap-4">
          {/* Left: Copyright */}
          <div className="text-sm font-medium">
            © {currentYear} SAMS QR. All rights reserved.
          </div>
          
          {/* Center: Technical Support */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Technical Support:</span>
            <a
              href="mailto:samsqr@duck.com"
              className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-600 transition duration-200"
              title="Report technical issues"
            >
              <FaEnvelope className="h-4 w-4" />
              <span className="text-sm font-medium hidden sm:inline">samsqr@duck.com</span>
            </a>
          </div>
          
          {/* Right: Developer Info */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Developed by Debbbzxc</span>
            <a
              href="https://github.com/Debbbzxc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-600 transition duration-200"
              title="Visit GitHub Profile"
            >
              <FaGithub className="h-4 w-4" />
              <span className="text-sm font-medium hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
