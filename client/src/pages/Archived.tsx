import Layout from "@/components/Layout";
import NoteCard from "@/components/NoteCard";
import { useNoteStore } from "@/stores/note.store";
import { ArchiveIcon, Loader2 } from "lucide-react";
import { useEffect } from "react";

function Archived() {
  const { notes, fetchNotes, isLoading } = useNoteStore();

  useEffect(() => {
    fetchNotes({ isArchived: true });
  }, [fetchNotes]);

  const archivedNotes = notes.filter((note) => note.isArchived);

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Archived Notes</h1>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : archivedNotes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {archivedNotes.map((note) => (
                <>
                  <NoteCard key={note._id} note={note} onEdit={() => {}} />
                </>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-center py-12">
              <ArchiveIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No archived notes</p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Archived;
