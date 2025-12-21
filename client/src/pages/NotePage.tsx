import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNoteStore } from "@/stores/note.store";
import type { Message, Note } from "@/types";
import {
  Archive,
  Bot,
  Calendar,
  ExternalLink,
  Loader2,
  Pin,
  Send,
  Tag,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { useMessageStore } from "@/stores/message.store";
import { Input } from "@/components/ui/input";

function NotePage() {
  const { id } = useParams<{ id: string }>();
  const { fetchNoteById } = useNoteStore();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiChatOpen, setAiChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const scrollToDown = useRef<HTMLDivElement>(null);

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const {
    fetchMessages,
    sendMessage,
    messages,
    isLoading: isSending,
  } = useMessageStore();

  useEffect(() => {
    const fetchNote = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const res = await fetchNoteById(id);
          setNote(res);
        } catch (error) {
          toast.error("Failed to load note");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const fetchMessage = async () => {
      if (id) {
        try {
          await fetchMessages(id);
        } catch (error) {
          console.error("Failed to load messages:", error);
        }
      }
    };
    fetchNote();
    fetchMessage();
  }, [id, fetchNoteById, fetchMessages]);

  const handleScrollToBottom = () => {
    if (scrollToDown.current) {
      scrollToDown.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    setChatMessages(messages);
    if (messages.length == 0) {
      setChatMessages([
        {
          role: "assistant",
          content: "Hello! How can I assist you with this note?",
        },
      ]);
    }
  }, [messages]);

  useEffect(() => {
    handleScrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isSending) return;

    setChatInput("");

    try {
      if (!id) return;

      await sendMessage(id, chatInput.trim());
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderMessageWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading note...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!note) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Note not found</h2>
            <p className="text-muted-foreground">
              The note you're looking for doesn't exist or has been deleted.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] lg:h-screen">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="shrink-0 max-w-4xl mx-auto w-full px-8 pt-8 pb-4">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-4xl font-bold flex-1">{note.title}</h1>
                <div className="flex gap-2">
                  {note.isPinned && (
                    <Badge variant="secondary" className="gap-1">
                      <Pin className="h-3 w-3" />
                      Pinned
                    </Badge>
                  )}
                  {note.isArchived && (
                    <Badge variant="secondary" className="gap-1">
                      <Archive className="h-3 w-3" />
                      Archived
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created {formatDate(note.createdAt)}</span>
                </div>
                {note.updatedAt !== note.createdAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {formatDate(note.updatedAt)}</span>
                  </div>
                )}
              </div>

              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {note.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {note.link && (
                <a
                  href={note.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline w-fit"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm">View source</span>
                </a>
              )}
              <div className="border-t border-border" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="max-w-4xl mx-auto px-8 pb-8">
              <div className="whitespace-pre-wrap text-base leading-relaxed">
                {note.content}
              </div>
            </div>
          </div>
        </div>

        {isAiChatOpen && (
          <div className="w-96 bg-card border-l border-border pt-5 flex flex-col">
            <div className="flex px-5 items-center justify-between border-b border-border pb-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary p-2 rounded-full shrink-0">
                  <Bot className="text-white h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h1 className="text-md font-semibold">AI Assistant</h1>
                  <p className="text-sm text-muted-foreground">
                    Ask questions about your note
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="group/close"
                onClick={() => setAiChatOpen(false)}
              >
                <X className="h-5 w-5 text-muted-foreground group-hover/close:text-foreground" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="shrink-0 mt-1">
                    {msg.role === "assistant" ? (
                      <div className="bg-secondary p-2 rounded-full">
                        <Bot className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                  <div
                    className={`${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    } whitespace-pre-wrap max-w-[75%] py-2.5 px-4 rounded-2xl shadow-sm`}
                  >
                    {renderMessageWithBold(msg.content)}
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex items-start gap-2">
                  <div className="shrink-0 mt-1">
                    <div className="bg-secondary p-2 rounded-full">
                      <Bot className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="bg-secondary text-secondary-foreground py-2.5 px-4 rounded-2xl shadow-sm">
                    <div className="flex gap-1.5 items-center">
                      <div className="size-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0ms]"></div>
                      <div className="size-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:150ms]"></div>
                      <div className="size-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:300ms]"></div>
                      <span className="text-muted-foreground text-sm ml-1">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollToDown} />
            </div>

            <div className="flex gap-2 px-5 py-4 border-t border-border relative">
              <Textarea
                rows={1}
                className="flex-1 bg-accent! resize-none overflow-y-auto scrollbar-thin max-h-[40vh]"
                placeholder="Ask about this note..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isSending}
              />
              <button
                className="shrink-0 absolute right-6 bottom-5 p-2 rounded-full bg-primary text-white cursor-pointer transition disabled:cursor-auto disabled:opacity-50 not-disabled:hover:bg-primary/80"
                onClick={handleSendMessage}
                disabled={isSending || !chatInput.trim()}
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        )}

        {!isAiChatOpen && !note.isArchived && (
          <div className="fixed bottom-6 right-6">
            <Button
              size="lg"
              onClick={() => setAiChatOpen(true)}
              className="rounded-full shadow-lg"
            >
              <Bot className="h-5 w-5 mr-2" />
              Open AI Assistant
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default NotePage;
