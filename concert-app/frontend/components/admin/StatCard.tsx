interface Props {
  icon: string;
  label: string;
  value: number;
  color: "blue" | "green" | "red";
}

const colorMap = {
  blue: "bg-blue-600",
  green: "bg-emerald-500",
  red: "bg-red-400",
};

export default function StatCard({ icon, label, value, color }: Props) {
  return (
    <div
      className={`${colorMap[color]} rounded-lg p-6 flex-1 flex flex-col items-center justify-center gap-2 text-white`}
    >
      <span className="text-2xl">{icon}</span>
      <p className="text-sm">{label}</p>
      <p className="text-5xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
}
