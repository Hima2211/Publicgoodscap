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
    <div className="min-h-screen bg-background transition-colors duration-500">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Card className="bg-card border-border text-foreground transition-colors duration-500">
          <CardHeader>
            <CardTitle>Submit Your Project</CardTitle>
            <CardDescription className="font-normal">Choose how you want to submit your project</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="direct" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="direct" className="font-medium">Direct Submission</TabsTrigger>
                <TabsTrigger value="external" className="font-medium">External Platform</TabsTrigger>
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
