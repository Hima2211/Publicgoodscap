import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Project } from "@shared/schema";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditProjectDialog from "./edit-project-dialog";

interface ProjectsTableProps {
  projects: Project[];
}

export default function ProjectsTable({ projects }: ProjectsTableProps) {
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: number) => {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete project');
      return projectId;
    },
    onSuccess: () => {
      // Invalidate both admin and regular project queries
      queryClient.invalidateQueries({ queryKey: ['api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
      setProjectToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (project: Project) => {
    setProjectToEdit(project);
  };

  const getCategoryBadge = (category: string) => {
    const categories: Record<string, { class: string; label: string }> = {
      defi: { class: "bg-blue-500/10 text-blue-500", label: "DeFi" },
      nft: { class: "bg-purple-500/10 text-purple-500", label: "NFT" },
      dao: { class: "bg-green-500/10 text-green-500", label: "DAO" },
      infrastructure: { class: "bg-orange-500/10 text-orange-500", label: "Infrastructure" },
      public_goods: { class: "bg-primary/10 text-primary", label: "Public Goods" },
      social: { class: "bg-pink-500/10 text-pink-500", label: "Social" },
    };

    const categoryInfo = categories[category] || { class: "bg-gray-500/10 text-gray-500", label: category };
    return (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.class}`}>
        {categoryInfo.label}
      </div>
    );
  };

  return (
    <>
      <div className="rounded-md border border-darkBorder">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total Funding</TableHead>
              <TableHead className="text-center">Progress</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-mono">{project.id}</TableCell>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>{getCategoryBadge(project.category)}</TableCell>
                <TableCell>
                  {project.inFundingRound ? (
                    <div className="flex items-center space-x-1 text-green-500">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-gray-500">
                      <XCircle className="h-4 w-4" />
                      <span>Inactive</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">{formatCurrency(project.totalFunding)}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-full h-2 bg-darkBorder rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary"
                        style={{ width: `${project.fundingProgress}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-darkText">{project.fundingProgress}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleEdit(project)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setProjectToDelete(project)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project "{projectToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProjectMutation.mutate(projectToDelete!.id)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {projectToEdit && (
        <EditProjectDialog
          project={projectToEdit}
          open={!!projectToEdit}
          onOpenChange={(open) => !open && setProjectToEdit(null)}
        />
      )}
    </>
  );
}
