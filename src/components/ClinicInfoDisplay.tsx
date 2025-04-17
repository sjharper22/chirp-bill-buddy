
import { useSuperbill } from "@/context/superbill-context";

export function ClinicInfoDisplay() {
  const { clinicDefaults } = useSuperbill();
  
  return (
    <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-sm p-6 border">
      <h2 className="text-xl font-bold text-primary">{clinicDefaults.clinicName}</h2>
      <p className="mt-1">{clinicDefaults.clinicAddress}</p>
      <p className="mt-1">Phone: {clinicDefaults.clinicPhone}</p>
      <p className="mt-1">Email: {clinicDefaults.clinicEmail}</p>
      <div className="mt-2 pt-2 border-t border-dashed">
        <p className="text-sm">Tax ID (EIN): {clinicDefaults.ein}</p>
        {clinicDefaults.npi && <p className="text-sm">NPI: {clinicDefaults.npi}</p>}
      </div>
    </div>
  );
}
