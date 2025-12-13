import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAuthStore from "@/stores/auth.store";
import { useNoteStore } from "@/stores/note.store";
import {
  Archive,
  FileText,
  Loader2,
  Pin,
  StickyNote,
  TagIcon,
} from "lucide-react";
import { useEffect } from "react";

function Dashboard() {
  const { fetchNotes, notes, isLoading, tags, fetchTags } = useNoteStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchNotes();
    fetchTags();
  }, [fetchNotes]);
  const notesCount = notes.length;
  const pinnedNotesCount = notes.filter(
    (note) => note.isPinned && !note.isArchived
  ).length;
  const archivedNotesCount = notes.filter((note) => note.isArchived).length;
  const recentNotes = notes.filter((note) => !note.isArchived).slice(0, 5);

  const cards = [
    {
      title: "Total Notes",
      count: notesCount,
      icon: StickyNote,
    },
    {
      title: "Pinned Notes",
      count: pinnedNotesCount,
      icon: Pin,
    },
    {
      title: "Archived Notes",
      count: archivedNotesCount,
      icon: Archive,
    },
    {
      title: "Total Tags",
      count: tags.length,
      icon: TagIcon,
    },
  ];

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 mb-8">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card
                    key={card.title}
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {card.title}
                      </CardTitle>
                      <Icon className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{card.count}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Notes</CardTitle>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentNotes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No notes yet. Create your first note to get started!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentNotes.map((note) => (
                      <div
                        key={note._id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      >
                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{note.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {note.content}
                          </p>
                        </div>
                        {note.isPinned && (
                          <Pin className="h-4 w-4 text-primary fill-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;
