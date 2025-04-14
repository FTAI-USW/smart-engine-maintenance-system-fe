
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types";
import { getUserById } from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { UsersIcon } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const owner = getUserById(project.ownerId);
  
  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>
            Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">{project.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <UsersIcon className="h-4 w-4 mr-1" />
            <span>{project.members.length} members</span>
          </div>
          
          <div className="mt-2 text-sm">
            <span className="text-muted-foreground">Owner: </span>
            <span>{owner?.name || "Unknown"}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
