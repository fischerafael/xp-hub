"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/src/contexts/auth-context";

export default function Home() {
  const router = useRouter();
  const { signIn } = useAuth();

  const handleStartNow = async () => {
    try {
      // Dados mock - serão substituídos por dados do Google no futuro
      const mockEmail = "user@example.com";
      const mockName = "Test User";

      await signIn(mockEmail, mockName);
      router.push("/app");
    } catch (error) {
      console.error("Erro ao fazer sign in:", error);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to <span className="text-primary">XP Hub</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Track, register, and organize your daily experiences with ease.
            Create XP entries with title, duration, date, and custom tags to
            keep everything organized.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={handleStartNow}
            >
              Start Now
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Key Features
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to track and organize your experiences
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>📝 Experience Tracking</CardTitle>
                <CardDescription>
                  Track your XP entries with title, duration, date, and tags
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Easily record and manage your experiences with detailed
                  information to keep track of everything you do.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📅 Date Filtering</CardTitle>
                <CardDescription>
                  Filter your experiences by specific dates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Quickly find experiences from any date using the intuitive
                  date selector to navigate through your history.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🏷️ Category Management</CardTitle>
                <CardDescription>
                  Organize your experiences with tags and categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create and manage custom categories to organize your
                  experiences and filter by tags for better organization.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⏱️ Duration Tracking</CardTitle>
                <CardDescription>
                  Track time spent on each experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Record how long you spend on each activity and view total
                  duration for filtered experiences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚡ Quick Actions</CardTitle>
                <CardDescription>
                  Copy, edit, and delete experiences with ease
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Quickly copy titles to clipboard, edit entries, or remove
                  experiences you no longer need.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📊 Organized View</CardTitle>
                <CardDescription>
                  Clean and organized experience list
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View all your experiences in a clean, organized list sorted by
                  date with powerful filtering options.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
