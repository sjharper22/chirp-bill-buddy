import { useSuperbill } from "@/context/superbill-context";
export function PracticeLogo() {
  const {
    clinicDefaults
  } = useSuperbill();
  return <div className="text-center mb-6">
      <h2 className="text-xl font-bold text-left">{clinicDefaults.clinicName}</h2>
      <p className="text-sm text-muted-foreground text-left">{clinicDefaults.clinicAddress}</p>
      <p className="text-sm text-muted-foreground text-left">
        Phone: {clinicDefaults.clinicPhone} | Email: {clinicDefaults.clinicEmail}
      </p>
      <p className="text-sm text-muted-foreground text-left">Tax ID (EIN): {clinicDefaults.ein}</p>
    </div>;
}