// components/ui/metric-card.tsx
// export function MetricCard({ label, value, colorClass }: { label: string, value: string, colorClass: string }) {
//     return (
//       <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
//         <p className="text-slate-500 text-sm font-medium">{label}</p>
//         <p className={`text-3xl font-bold mt-2 ${colorClass}`}>{value}</p>
//       </div>
//     );
//   }
export function MetricCard({ 
  label, 
  value, 
  colorClass = "text-white", 
  bgColor = "bg-white", 
  icon: Icon, 
  className = "" 
}: any) {
  return (
    <div className={`p-6 rounded-2xl border shadow-sm ${bgColor} ${className} transition-all hover:scale-[1.02]`}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-[10px] font-bold tracking-widest uppercase opacity-80 ${colorClass}`}>
            {label}
          </p>
          <h3 className={`text-3xl font-extrabold mt-2 ${colorClass}`}>
            {value?.toLocaleString()}
          </h3>
        </div>
        {Icon && <Icon className={`opacity-50 ${colorClass}`} size={24} />}
      </div>
    </div>
  );
}