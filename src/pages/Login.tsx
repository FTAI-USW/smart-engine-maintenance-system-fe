import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { getUsers } from "@/lib/storage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState("");
  const users = getUsers();

  const form = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginForm) => {
    // In a real app, we would check credentials
    // For this demo, we'll just use the user's ID
    const user = users.find((u) => u.email === data.email);
    if (user) {
      login(user.id);
      navigate("/dashboard");
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);

    // Auto-login for demo
    if (userId) {
      login(userId);
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Smart Engine Maintenance System
          </h1>
          <p className="text-muted-foreground mt-2">
            Aircraft Engine Maintenance Task Manager
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Sign in to access your tasks and projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Demo Quick Access */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Quick Access (Demo)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {users.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    className={`flex items-center justify-start p-2 h-auto ${
                      selectedUser === user.id ? "border-primary" : ""
                    }`}
                    onClick={() => handleUserSelect(user.id)}
                  >
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-xs font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user.role}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 mt-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </Form>

            <p className="text-center text-xs text-muted-foreground mt-4">
              This is a demo application. <br />
              All data is stored locally in browser cache. <br />©
              <a target="blank" href="https://github.com/br0sive">
                br0sive
              </a>{" "}
              2025.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
