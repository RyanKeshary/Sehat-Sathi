import { Cross } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0C2D43] text-white/80 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <Cross className="text-white w-5 h-5 rotate-45" />
              </div>
              <span className="text-xl font-bold text-white">Sehat Sathi</span>
            </div>
            <p className="text-sm leading-relaxed">
              Democratizing quality healthcare across Bharat through innovative, 
              offline-first digital health ecosystems.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">For Patients</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">For Doctors</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">For Clinics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Mobile App</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Career</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Partners</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Newsroom</a></li>
            </ul>
          </div>

          {/* Compliance */}
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">DPDPA Compliance</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
            <div className="mt-8 flex gap-4 grayscale brightness-200 opacity-50">
               {/* Mock badges */}
               <div className="px-2 py-1 border border-white/20 rounded text-[10px] font-bold">ABDM READY</div>
               <div className="px-2 py-1 border border-white/20 rounded text-[10px] font-bold">ISO 27001</div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 Sehat Sathi. All rights reserved.</p>
          <p>Built with ❤️ for Bharat.</p>
        </div>
      </div>
    </footer>
  );
}
