
import { useState } from "react";
import { useSuperbill } from "@/context/superbill-context";
import { usePatient } from "@/context/patient-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatDate } from "@/lib/utils/superbill-utils";
import { Calendar, Download } from "lucide-react";

export default function Reports() {
  const { superbills } = useSuperbill();
  const { patients } = usePatient();
  const [timeframe, setTimeframe] = useState("30days");
  
  // Calculate visits and revenue for the monthly chart
  const now = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Create monthly data (last 6 months)
  const monthlyData = Array(6).fill(null).map((_, index) => {
    const month = new Date();
    month.setMonth(now.getMonth() - (5 - index));
    
    const monthName = monthNames[month.getMonth()];
    const year = month.getFullYear();
    
    const monthStart = new Date(year, month.getMonth(), 1);
    const monthEnd = new Date(year, month.getMonth() + 1, 0);
    
    // Count visits and revenue in this month
    const monthlyVisits = superbills.reduce((total, bill) => {
      return total + bill.visits.filter(visit => {
        const visitDate = new Date(visit.date);
        return visitDate >= monthStart && visitDate <= monthEnd;
      }).length;
    }, 0);
    
    const monthlyRevenue = superbills.reduce((total, bill) => {
      return total + bill.visits.filter(visit => {
        const visitDate = new Date(visit.date);
        return visitDate >= monthStart && visitDate <= monthEnd;
      }).reduce((sum, visit) => sum + visit.fee, 0);
    }, 0);
    
    return {
      name: `${monthName} ${year}`,
      visits: monthlyVisits,
      revenue: monthlyRevenue
    };
  });
  
  // Get top patients by revenue
  const patientRevenue = patients.map(patient => {
    const patientBills = superbills.filter(bill => 
      bill.patientName === patient.name
    );
    
    const totalRevenue = patientBills.reduce((total, bill) => {
      return total + bill.visits.reduce((sum, visit) => sum + visit.fee, 0);
    }, 0);
    
    const visitCount = patientBills.reduce((total, bill) => {
      return total + bill.visits.length;
    }, 0);
    
    return {
      id: patient.id,
      name: patient.name,
      revenue: totalRevenue,
      visits: visitCount
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  
  // Get revenue by ICD codes
  const icdRevenue: Record<string, number> = {};
  superbills.forEach(bill => {
    bill.visits.forEach(visit => {
      visit.icdCodes.forEach(code => {
        if (icdRevenue[code]) {
          icdRevenue[code] += visit.fee / visit.icdCodes.length; // Distribute fee across codes
        } else {
          icdRevenue[code] = visit.fee / visit.icdCodes.length;
        }
      });
    });
  });
  
  const topIcdCodes = Object.entries(icdRevenue)
    .map(([code, revenue]) => ({ code, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  
  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            View insights and statistics about your superbills and patients
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <Select defaultValue={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="12months">Last 12 months</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Revenue</CardTitle>
            <CardDescription>All time earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(superbills.reduce((total, bill) => {
                return total + bill.visits.reduce((sum, visit) => sum + visit.fee, 0);
              }, 0))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {superbills.length} superbills and {patients.length} patients
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Visit Fee</CardTitle>
            <CardDescription>Per visit revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(
                superbills.reduce((total, bill) => total + bill.visits.reduce((sum, visit) => sum + visit.fee, 0), 0) / 
                superbills.reduce((total, bill) => total + bill.visits.length, 0) || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {superbills.reduce((total, bill) => total + bill.visits.length, 0)} total visits
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Last submission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {superbills.length > 0 
                ? formatDate(
                    new Date(Math.max(...superbills.map(bill => new Date(bill.issueDate).getTime())))
                  )
                : "No activity yet"
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {superbills.length > 0 
                ? `${superbills.length} total submissions`
                : "Create your first superbill"
              }
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="trends" className="mb-8">
        <TabsList>
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
          <TabsTrigger value="patients">Patient Analysis</TabsTrigger>
          <TabsTrigger value="codes">Diagnosis Codes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue & Visit Trends</CardTitle>
              <CardDescription>
                Track your practice performance over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="visits" name="Visits" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="patients" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Patients by Revenue</CardTitle>
                <CardDescription>
                  Patients who generate the most revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead className="text-right">Visits</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientRevenue.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell className="text-right">{patient.visits}</TableCell>
                        <TableCell className="text-right">{formatCurrency(patient.revenue)}</TableCell>
                      </TableRow>
                    ))}
                    {patientRevenue.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          No patient data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Patient Revenue Distribution</CardTitle>
                <CardDescription>
                  Visual breakdown of revenue by patient
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={patientRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="codes" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Diagnosis Codes by Revenue</CardTitle>
              <CardDescription>
                Most profitable diagnostic codes used in your practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topIcdCodes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="code" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Bar dataKey="revenue" name="Revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ICD Code</TableHead>
                    <TableHead className="text-right">Associated Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topIcdCodes.map((icd) => (
                    <TableRow key={icd.code}>
                      <TableCell className="font-medium">{icd.code}</TableCell>
                      <TableCell className="text-right">{formatCurrency(icd.revenue)}</TableCell>
                    </TableRow>
                  ))}
                  {topIcdCodes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-4">
                        No ICD code data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
