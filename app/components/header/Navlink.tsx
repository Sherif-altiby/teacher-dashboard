import Link from "next/link";

const NavLink = ({icon: Icon, href}: {icon: any; href: string}) => {
  return (
    <Link
      href={href}
      className="p-2.5 rounded-xl text-nav-icon hover:bg-slate-100 hover:text-text-main transition-all active:scale-95"
    >
      <Icon className="size-5 md:size-6" />
    </Link>
  );
};

export default NavLink;
