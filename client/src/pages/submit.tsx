import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import SubmitForm from "@/components/projects/submit-form";
import ExternalSubmitForm from "@/components/projects/external-submit-form";

export default function Submit() {
  const [activeTab, setActiveTab] = useState("direct");

  return (
    <div className="min-h-screen">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white">Submit Project</h1>
          <p className="text-darkText mt-1">Add your project to the Public Goods Market Cap platform.</p>
        </div>

        <Card className="bg-darkCard border-darkBorder">
          <CardHeader>
            <CardTitle>Submit Your Project</CardTitle>
            <CardDescription>Choose how you want to submit your project</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="direct" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="direct">Direct Submission</TabsTrigger>
                <TabsTrigger value="external">External Platform</TabsTrigger>
              </TabsList>
              <TabsContent value="direct">
                <div className="space-y-6 pt-4">
                  <SubmitForm />
                </div>
              </TabsContent>
              <TabsContent value="external">
                <div className="space-y-6 pt-4">
                  <ExternalSubmitForm />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
