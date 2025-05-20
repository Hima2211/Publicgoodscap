import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface SubmitFormProps {
  isAdmin?: boolean;
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["public_goods", "defi", "nft", "dao", "infrastructure", "social"]),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  twitter: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  discord: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  telegram: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  logo: z.string().url("Must be a valid URL").min(1, "Logo URL is required"),
  totalFunding: z.number().min(0, "Funding amount must be positive").optional(),
  inFundingRound: z.boolean().default(false),
  fundingRoundLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  isHot: z.boolean().default(false),
  isTrending: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

export default function SubmitForm({ isAdmin = false }: SubmitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "public_goods",
      website: "",
      github: "",
      twitter: "",
      discord: "",
      telegram: "",
      logo: "",
      totalFunding: 0,
      inFundingRound: false,
      fundingRoundLink: "",
      isHot: false,
      isTrending: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit project");
      }
      
      setIsSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Error submitting project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your project (min. 10 characters)" 
                    className="resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public_goods">Public Goods</SelectItem>
                    <SelectItem value="defi">DeFi</SelectItem>
                    <SelectItem value="nft">NFT</SelectItem>
                    <SelectItem value="dao">DAO</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://your-logo-url.com/image.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://your-project.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/your-project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <Input placeholder="https://twitter.com/your-project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discord"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discord</FormLabel>
                  <FormControl>
                    <Input placeholder="https://discord.gg/your-project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telegram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telegram</FormLabel>
                  <FormControl>
                    <Input placeholder="https://t.me/your-project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Funding Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Funding Information</h3>
          
          <FormField
            control={form.control}
            name="totalFunding"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Funding (in USD)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inFundingRound"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-darkBorder p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Funding Round</FormLabel>
                  <div className="text-sm text-darkText">
                    Project is currently in an active funding round
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("inFundingRound") && (
            <FormField
              control={form.control}
              name="fundingRoundLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funding Round Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://funding-platform.com/your-project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Admin-only fields */}
        {isAdmin && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Admin Controls</h3>
            
            <FormField
              control={form.control}
              name="isHot"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-darkBorder p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Hot Project</FormLabel>
                    <div className="text-sm text-darkText">
                      Mark this project as "Hot" to feature it prominently
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isTrending"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-darkBorder p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Trending Project</FormLabel>
                    <div className="text-sm text-darkText">
                      Mark this project as "Trending" to increase visibility
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : isSuccess ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Project Submitted
            </>
          ) : (
            'Submit Project'
          )}
        </Button>
      </form>
    </Form>
  );
}
