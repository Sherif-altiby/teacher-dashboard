const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: any, color: string }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 flex items-center gap-5 shadow-sm">
      <div className={`p-4 rounded-[1.5rem] ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
      </div>
    </div>
  );


  export default StatCard