
import { SuperbillForm } from "@/components/SuperbillForm";

export default function NewSuperbill() {
  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Create New Superbill</h1>
      <SuperbillForm />
    </div>
  );
}
