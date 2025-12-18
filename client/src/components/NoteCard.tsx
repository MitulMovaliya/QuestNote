import { useNoteStore } from "@/stores/note.store";
import type { Note } from "@/types";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Archive,
  Edit,
  ExternalLink,
  MoreVertical,
  Pin,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { formatDistanceToNow, format } from "date-fns";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

function NoteCard({ note, onEdit }: NoteCardProps) {
  const { pinNote, archiveNote, deleteNote } = useNoteStore();
  const navigate = useNavigate();
  const togglePin = () => {
    pinNote(note._id);
  };
  const toggleArchive = () => {
    archiveNote(note._id);
  };
  const { isArchived } = note;

  const handleDelete = () => {
    deleteNote(note._id);
  };

  return (
    <Card
      onClick={() => navigate(`/note/${note._id}`)}
      className={`p-4 hover:border-primary/50 transition-colors `}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{note.title}</h3>
          <div className="group/time relative inline-block">
            <p className="text-xs text-muted-foreground hover:text-primary transition-colors">
              {formatDistanceToNow(new Date(note.createdAt), {
                addSuffix: true,
              })}
            </p>
            <Badge
              className="absolute bottom-full left-0 mb-2 px-3 py-1.5 text-xs 
              bg-popover text-popover-foreground border shadow-lg
              opacity-0 invisible group-hover/time:opacity-100 group-hover/time:visible 
              transition-all duration-200 ease-in-out
              whitespace-nowrap z-10 pointer-events-none
              before:content-[''] before:absolute before:top-full before:left-4
              before:border-4 before:border-transparent before:border-t-popover"
            >
              {format(new Date(note.createdAt), "dd MMM yyyy, h:mm a")}
            </Badge>
          </div>
        </div>
        <div
          className="flex items-center gap-1 ml-2"
          onClick={(e) => e.stopPropagation()}
        >
          {note.isPinned && (
            <Pin className="h-4 w-4 text-primary fill-primary" />
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant={"ghost"}>
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isArchived ? null : (
                <>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(note);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePin();
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
                  toggleArchive();
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
                  handleDelete();
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
        {note.content}
      </p>
      {note.link && (
        <a
          href={note.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center text-xs text-primary hover:underline mb-3"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          {note.link}
        </a>
      )}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}

export default NoteCard;
