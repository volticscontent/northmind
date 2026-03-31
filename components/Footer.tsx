import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0c0c0b] border-t border-white/5 pt-16 pb-8 px-4 text-white/60">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1">
          <Image
            src="/assets/logo.svg"
            alt="North Mind"
            width={100}
            height={30}
            className="mb-6"
          />
          <p className="text-sm leading-relaxed mb-6">
            Premium British Heritage menswear. Crafted for durability and style.
          </p>
        </div>

        <div>
          <h4 className="text-white text-xs uppercase font-bold tracking-widest mb-6">Customer Care</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
            <li><Link href="/shipping" className="hover:text-gold transition-colors">Shipping Policy</Link></li>
            <li><Link href="#" className="hover:text-gold transition-colors">Returns & Refunds</Link></li>
            <li><Link href="#" className="hover:text-gold transition-colors">Warranty Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-xs uppercase font-bold tracking-widest mb-6">Our House</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/about" className="hover:text-gold transition-colors">About Us</Link></li>
            <li><Link href="#" className="hover:text-gold transition-colors">Careers</Link></li>
            <li><Link href="#" className="hover:text-gold transition-colors">Press & Collaborations</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-xs uppercase font-bold tracking-widest mb-6">Contact</h4>
          <p className="text-sm mb-4"><strong>support@northmind.store</strong></p>
          <div className="pt-4 border-t border-white/5">
            <p className="text-[10px] uppercase font-bold tracking-widest">Subscribe to our newsletter</p>
            <div className="mt-4 flex">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="bg-transparent border border-white/10 px-4 py-2 text-xs flex-grow focus:outline-none focus:border-gold transition-colors"
              />
              <button className="bg-white text-black px-4 py-2 text-[10px] font-bold hover:bg-gold transition-colors">
                JOIN
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] font-medium tracking-[0.2em] uppercase">
          © {currentYear} NORTH MIND. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-6">
          {/* Payment Icons would go here */}
        </div>
      </div>
    </footer>
  );
}
