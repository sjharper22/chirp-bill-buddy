import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Merge, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MultiSuperbillMerger } from "@/components/advanced-superbill/MultiSuperbillMerger";
import { DateRangeSuperbillGenerator } from "@/components/advanced-superbill/DateRangeSuperbillGenerator";

export default function AdvancedSuperbill() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("merge");

  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold">Advanced Superbill Creation</h1>
          <p className="text-muted-foreground">
            Merge existing superbills or generate new ones from date ranges
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="merge" className="flex items-center gap-2">
            <Merge className="h-4 w-4" />
            Merge Superbills
          </TabsTrigger>
          <TabsTrigger value="daterange" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date Range Generation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="merge">
          <Card>
            <CardHeader>
              <CardTitle>Merge Multiple Superbills</CardTitle>
              <p className="text-sm text-muted-foreground">
                Combine multiple existing superbills for a patient into a single consolidated superbill.
                This is useful for creating comprehensive billing documents or meeting insurance requirements.
              </p>
            </CardHeader>
            <CardContent>
              <MultiSuperbillMerger />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daterange">
          <Card>
            <CardHeader>
              <CardTitle>Generate Superbill from Date Range</CardTitle>
              <p className="text-sm text-muted-foreground">
                Create a new superbill by selecting visits within a specific date range.
                Perfect for monthly billing or custom reporting periods.
              </p>
            </CardHeader>
            <CardContent>
              <DateRangeSuperbillGenerator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}