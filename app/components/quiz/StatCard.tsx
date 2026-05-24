const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: any, color: string }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-100 flex items-center gap-4 shadow-sm">
      <div className={`p-3 rounded-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 mb-0.5">{label}</p>
        <p className="text-lg font-black text-slate-800 tracking-tight">{value}</p>
      </div>
    </div>
  );


  export default StatCard