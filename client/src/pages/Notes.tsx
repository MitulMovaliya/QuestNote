import Layout from "@/components/Layout";
import NoteCard from "@/components/NoteCard";
import NoteModel from "@/components/NoteModel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useNoteStore } from "@/stores/note.store";
import type { Note } from "@/types";
import {
  Filter,
  Loader2,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function Notes() {
  const { notes, fetchNotes, fetchTags, tags, pagination } = useNoteStore();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const tagParam = searchParams.get("tag");
    if (tagParam) {
      setSelectedTags([tagParam]);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  useEffect(() => {
    setLocalLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchNotes({
        search: search || undefined,
        tags: selectedTags.length > 0 ? selectedTags.join(",") : undefined,
        isArchived: false,
        page: currentPage,
      }).finally(() => setLocalLoading(false));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedTags, currentPage, fetchNotes]);

  const onEdit = (note: Note) => {
    setSelectedNote(note);
    setIsModelOpen(true);
  };
  const onCloseModel = (shouldResetPage?: boolean) => {
    setSelectedNote(null);
    setIsModelOpen(false);
    if (shouldResetPage) {
      setCurrentPage(1);
    }
  };
  const onCreate = () => {
    setSelectedNote(null);
    setIsModelOpen(true);
  };
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pinnedNotes = notes.filter((note) => note.isPinned && !note.isArchived);
  const regularNotes = notes.filter(
    (note) => !note.isPinned && !note.isArchived
  );

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Notes</h1>
          <Button onClick={onCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter Tags
                {selectedTags.length > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                    {selectedTags.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by tags</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tags.length === 0 ? (
                <div className="px-2 py-2 text-sm text-muted-foreground">
                  No tags yet
                </div>
              ) : (
                tags.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => toggleTag(tag)}
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {localLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {pinnedNotes.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
                  Pinned
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pinnedNotes.map((note) => (
                    <NoteCard key={note._id} note={note} onEdit={onEdit} />
                  ))}
                </div>
              </div>
            )}
            {regularNotes.length > 0 ? (
              <div className="flex-1">
                {pinnedNotes.length > 0 && (
                  <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
                    All Notes
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regularNotes.map((note) => (
                    <NoteCard key={note._id} note={note} onEdit={onEdit} />
                  ))}
                </div>
              </div>
            ) : pinnedNotes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No notes found</p>
                <Button onClick={onCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first note
                </Button>
              </div>
            ) : null}

            <div>
              {pagination.pages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: pagination.pages },
                      (_, i) => i + 1
                    ).map((page) => {
                      const showPage =
                        page === 1 ||
                        page === pagination.pages ||
                        (page >= currentPage - 1 && page <= currentPage + 1);

                      const showEllipsisBefore =
                        page === currentPage - 2 && currentPage > 3;
                      const showEllipsisAfter =
                        page === currentPage + 2 &&
                        currentPage < pagination.pages - 2;

                      if (showEllipsisBefore || showEllipsisAfter) {
                        return (
                          <span
                            key={page}
                            className="px-2 text-muted-foreground"
                          >
                            ...
                          </span>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="min-w-[40px]"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {notes.length > 0 && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                  {Math.min(currentPage * pagination.limit, pagination.total)}{" "}
                  of {pagination.total} notes
                </div>
              )}
            </div>
          </>
        )}
        <NoteModel
          isOpen={isModelOpen}
          note={selectedNote}
          onClose={onCloseModel}
        />
      </div>
    </Layout>
  );
}

export default Notes;
