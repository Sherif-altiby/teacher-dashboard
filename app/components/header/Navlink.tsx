import Link from "next/link";

const NavLink = ({icon: Icon, href}: {icon: React.ComponentType<{size?: number; strokeWidth?: number}>; href: string}) => {
  return (
    <Link
      href={href}
      className="p-2.5 rounded-xl text-nav-icon hover:bg-slate-100 hover:text-text-main transition-all active:scale-95"
    >
      <Icon size={22} strokeWidth={2} />
    </Link>
  );
};

export default NavLink;
