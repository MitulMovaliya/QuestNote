import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PATHS } from "@/config/paths";
import { useNoteStore } from "@/stores/note.store";
import { FileText, TagIcon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Tags() {
  const { fetchTags, fetchNotes, notes, tags } = useNoteStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTags();
    fetchNotes({ isArchived: false });
  }, [fetchTags, fetchNotes]);

  const tagAndCounts = tags
    .map((tag) => {
      const count = notes.filter(
        (note) => note.tags.includes(tag) && !note.isArchived
      ).length;
      return { tag, count };
    })
    .filter(({ count }) => count > 0);

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tags</h1>
        {tagAndCounts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tagAndCounts.map(({ tag, count }) => (
                <Card
                  key={tag}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() =>
                    navigate(`${PATHS.NOTES}?tag=${encodeURIComponent(tag)}`)
                  }
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <TagIcon className="h-5 w-5 text-primary" />
                        <Badge variant="secondary">{tag}</Badge>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">
                        {count} {count === 1 ? "note" : "notes"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-center py-12">
              <TagIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No tags yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create notes with tags to see them here
              </p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Tags;
