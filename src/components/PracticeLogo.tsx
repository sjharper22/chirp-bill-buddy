
import { useSuperbill } from "@/context/superbill-context";

export function PracticeLogo() {
  const { clinicDefaults } = useSuperbill();
  
  return (
    <div className="space-y-1">
      <h2 className="text-lg font-bold">{clinicDefaults.clinicName}</h2>
      <div className="text-xs text-muted-foreground space-y-0.5">
        <p className="line-clamp-1">{clinicDefaults.clinicAddress}</p>
        <p>Phone: {clinicDefaults.clinicPhone}</p>
        <p className="truncate">Email: {clinicDefaults.clinicEmail}</p>
      </div>
    </div>
  );
}
