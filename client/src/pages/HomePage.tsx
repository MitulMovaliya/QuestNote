import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PATHS } from "@/config/paths";
import {
  Brain,
  Search,
  Tags,
  MessageSquare,
  Archive,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

function HomePage() {
  const features = [
    {
      icon: MessageSquare,
      title: "AI Chat with Notes",
      description:
        "Have conversations with your notes. Ask questions and get instant answers using AI.",
    },
    {
      icon: Search,
      title: "Smart Search",
      description:
        "Search through your notes by title or content to find exactly what you need.",
    },
    {
      icon: Tags,
      title: "Tag Organization",
      description:
        "Organize and filter your notes with custom tags for easy categorization.",
    },
    {
      icon: Archive,
      title: "Archive & Pin",
      description:
        "Archive old notes to keep your workspace clean and pin important ones for quick access.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create & Organize",
      description: "Write notes and tag them for easy organization.",
    },
    {
      number: "02",
      title: "Search & Filter",
      description: "Quickly find notes using search and tag filters.",
    },
    {
      number: "03",
      title: "Chat with AI",
      description: "Ask AI questions about your note content.",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-secondary/20">
      {/* Navigation */}
      <nav className="border-b bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-7xl">
          <div className="flex items-center gap-2">
            <Brain className="size-8 text-primary" />
            <span className="text-2xl font-bold text-primary">QuestNote</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" asChild>
              <Link to={PATHS.LOGIN}>Login</Link>
            </Button>
            <Button asChild>
              <Link to={PATHS.REGISTER}>Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 md:py-36 max-w-7xl">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="size-4" />
            AI-Powered Note Taking
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Take Notes, <span className="text-primary">Chat with AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Organize your thoughts with notes and chat with AI to get instant
            answers from your knowledge base.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild className="text-lg">
              <Link to={PATHS.REGISTER}>
                Start Free <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg">
              <Link to={PATHS.LOGIN}>Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20 max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Core Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple yet powerful tools for note-taking and knowledge retrieval
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="size-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-20 max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center space-y-4">
                <div className="size-16 mx-auto rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute top-8 -right-8 text-muted-foreground/30 size-6" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-20 max-w-7xl">
        <div className="max-w-5xl mx-auto bg-linear-to-br from-primary/5 to-primary/10 rounded-3xl p-10 md:p-14 border border-primary/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Why Choose QuestNote?
              </h2>
              <ul className="space-y-4">
                {[
                  "Capture and organize notes with tags",
                  "Search through your notes instantly",
                  "Chat with AI about your note content",
                  "Archive old notes to stay focused",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="size-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-2xl blur-2xl opacity-20"></div>
                <Brain className="size-48 text-primary relative" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card m-0 rounded-xl shadow-sm border">
        <div className="w-full max-w-7xl mx-auto p-6 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0 gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="size-6 text-primary" />
              </div>
              <span className="text-foreground text-2xl font-semibold whitespace-nowrap">
                QuestNote
              </span>
            </div>
            <ul className="flex flex-wrap items-center mb-6 sm:mb-0 gap-4 md:gap-6">
              <li>
                <Link
                  to={PATHS.LOGIN}
                  className="text-muted-foreground hover:underline font-medium"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to={PATHS.REGISTER}
                  className="text-muted-foreground hover:underline font-medium"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-border sm:mx-auto lg:my-8" />
          <span className="block text-sm text-muted-foreground sm:text-center">
            © {new Date().getFullYear()}{" "}
            <span className="hover:underline font-medium">QuestNote</span>. Your
            intelligent note-taking companion.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
