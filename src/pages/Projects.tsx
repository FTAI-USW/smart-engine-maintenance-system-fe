
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProjects, createProject } from "@/lib/storage";
import { Project } from "@/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ProjectFormData = {
  name: string;
  description: string;
  tags: string;
};

const Projects = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const form = useForm<ProjectFormData>({
    defaultValues: {
      name: "",
      description: "",
      tags: ""
    }
  });
  
  // Load projects
  useEffect(() => {
    if (!currentUser) return;
    
    if (currentUser.role === "technician") {
      // For technicians, show only projects they are members of
      setProjects(getProjects().filter(project => 
        project.members.includes(currentUser.id)
      ));
    } else {
      // For supervisors and admins, show all projects
      setProjects(getProjects());
    }
  }, [currentUser]);
  
  // Filter projects based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = projects.filter(project => 
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.tags.some(tag => tag.toLowerCase().includes(query))
    );
    
    setFilteredProjects(filtered);
  }, [searchQuery, projects]);
  
  // Create project handler
  const handleCreateProject = (data: ProjectFormData) => {
    if (!currentUser) return;
    
    try {
      // Parse tags from comma-separated string
      const tags = data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];
      
      const newProject = createProject({
        name: data.name,
        description: data.description,
        ownerId: currentUser.id,
        members: [currentUser.id],
        tags
      });
      
      setProjects(prevProjects => [...prevProjects, newProject]);
      setIsCreateDialogOpen(false);
      form.reset();
      
      toast({
        title: "Project created",
        description: `"${data.name}" has been created successfully.`,
      });
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "Failed to create project.",
        variant: "destructive"
      });
    }
  };
  
  // Determine if user can create projects
  const canCreateProject = currentUser && (
    currentUser.role === "admin" || currentUser.role === "supervisor"
  );
  
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
            <p className="text-muted-foreground">
              Manage and view engine maintenance projects
            </p>
          </div>
          
          {canCreateProject && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          )}
        </div>
        
        <div className="flex items-center">
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        {filteredProjects.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Try a different search term"
                : canCreateProject
                  ? "Create a new project to get started"
                  : "You don't have any projects assigned to you yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
      
      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateProject)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Engine Maintenance A320" />
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
                        {...field}
                        placeholder="Describe the project objectives and scope"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma-separated)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="A320, Overhaul, Critical" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Project</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default Projects;
