
import { useSuperbill } from "@/context/superbill-context";

export function PracticeLogo() {
  const { clinicDefaults } = useSuperbill();
  
  return (
    <div className="text-center mb-6">
      <h2 className="text-xl font-bold">{clinicDefaults.clinicName}</h2>
      <p className="text-sm text-muted-foreground">{clinicDefaults.clinicAddress}</p>
      <p className="text-sm text-muted-foreground">
        Phone: {clinicDefaults.clinicPhone} | Email: {clinicDefaults.clinicEmail}
      </p>
      <p className="text-sm text-muted-foreground">Tax ID (EIN): {clinicDefaults.ein}</p>
    </div>
  );
}
