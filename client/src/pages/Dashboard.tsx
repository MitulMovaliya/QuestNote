import Layout from "@/components/Layout";
import NoteModel from "@/components/NoteModel";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuthStore from "@/stores/auth.store";
import { useNoteStore } from "@/stores/note.store";
import type { Note } from "@/types";
import {
  Archive,
  Edit,
  FileText,
  Loader2,
  MoreVertical,
  Pin,
  StickyNote,
  TagIcon,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { fetchNotes, notes, isLoading, tags, fetchTags } = useNoteStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

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
  const tagCount = tags
    .map((tag) => {
      const count = notes.filter(
        (note) => note.tags.includes(tag) && !note.isArchived
      ).length;
      return count;
    })
    .filter((count) => count > 0).length;
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
      count: tagCount,
      icon: TagIcon,
    },
  ];

  const [isEditModelOpen, setIsEditModelOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { pinNote, archiveNote, deleteNote } = useNoteStore();
  const togglePin = (note: Note) => {
    pinNote(note._id);
  };
  const toggleArchive = (note: Note) => {
    archiveNote(note._id);
  };
  const handleDelete = (note: Note) => {
    deleteNote(note._id);
    setIsDeleteDialogOpen(false);
  };

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
                  <Button
                    onClick={() => navigate("/notes")}
                    variant="ghost"
                    size="sm"
                  >
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
                    {recentNotes.map((note) => {
                      const isArchived = note.isArchived;
                      return (
                        <div
                          key={note._id}
                          onClick={() => navigate(`/note/${note._id}`)}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        >
                          <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />

                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">
                              {note.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {note.content}
                            </p>
                          </div>
                          {note.isPinned && (
                            <Pin className="h-4 w-4 text-primary fill-primary" />
                          )}
                          <div className="self-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  onClick={(e) => e.stopPropagation()}
                                  size="icon"
                                  variant={"ghost"}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" side="left">
                                {isArchived ? null : (
                                  <>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setNoteToEdit(note);
                                        setIsEditModelOpen(true);
                                      }}
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        togglePin(note);
                                      }}
                                    >
                                      <Pin className="mr-2 h-4 w-4" />
                                      {note.isPinned ? "Unpin" : "Pin"}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                  </>
                                )}
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleArchive(note);
                                  }}
                                >
                                  <Archive className="mr-2 h-4 w-4" />
                                  {note.isArchived ? "Unarchive" : "Archive"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive hover:bg-destructive/30!"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNoteToEdit(note);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })}
                    <AlertDialog
                      open={isDeleteDialogOpen}
                      onOpenChange={setIsDeleteDialogOpen}
                    >
                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Note?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete "{noteToEdit?.title}" and remove it from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={(e) => e.stopPropagation()}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(noteToEdit!);
                            }}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <NoteModel
        isOpen={isEditModelOpen}
        onClose={() => setIsEditModelOpen(false)}
        note={noteToEdit}
      />
    </Layout>
  );
}

export default Dashboard;
