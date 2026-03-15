"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/Topbar";

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = "high" | "medium" | "low";
type ColumnId = "todo" | "inprogress" | "review" | "done";

interface Task {
  id: string;
  title: string;
  description?: string;
  tags: { label: string; color: string; bg: string }[];
  priority: Priority;
  dueDate?: string;
  overdue?: boolean;
  progress?: number;
  comments: number;
  assignees: { initials: string; color: string; bg: string }[];
  columnId: ColumnId;
}

interface Comment {
  initials: string;
  color: string;
  bg: string;
  name: string;
  text: string;
  time: string;
}

// ─── Priority Badge ───────────────────────────────────────────────────────────

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  if (priority === "high")
    return (
      <span style={{
        fontSize: 10, padding: "3px 9px", borderRadius: 7, fontWeight: 600,
        display: "flex", alignItems: "center", gap: 4,
        background: "linear-gradient(135deg,#fff0f5,#ffd6eb)",
        color: "#e84393", border: "1px solid rgba(232,67,147,0.2)",
      }}>⚡ High</span>
    );
  if (priority === "medium")
    return (
      <span style={{
        fontSize: 10, padding: "3px 9px", borderRadius: 7, fontWeight: 600,
        display: "flex", alignItems: "center", gap: 4,
        background: "#f2f2f2", color: "#1a1a1a",
        border: "1px solid rgba(0,0,0,0.12)",
      }}>🔺 Medium</span>
    );
  return (
    <span style={{
      fontSize: 10, padding: "3px 9px", borderRadius: 7, fontWeight: 600,
      display: "flex", alignItems: "center", gap: 4,
      background: "linear-gradient(135deg,#f0fff8,#c8fff0)",
      color: "#007a56", border: "1px solid rgba(0,184,148,0.2)",
    }}>● Low</span>
  );
};

// ─── Column Config ────────────────────────────────────────────────────────────

const COLUMNS: { id: ColumnId; label: string; icon: string; color: string; bg: string; border: string; addBorder: string }[] = [
  { id: "todo",       label: "To Do",       icon: "📋", color: "#6c5ce7", bg: "linear-gradient(180deg,#f0eeff,#f8f6ff)", border: "rgba(108,92,231,0.15)", addBorder: "rgba(108,92,231,0.2)" },
  { id: "inprogress", label: "In Progress", icon: "⚡", color: "#0099cc", bg: "linear-gradient(180deg,#e0f5ff,#f8fbff)", border: "rgba(0,153,204,0.15)",   addBorder: "rgba(0,153,204,0.2)" },
  { id: "review",     label: "Review",      icon: "👀", color: "#e17055", bg: "linear-gradient(180deg,#fff0eb,#fffaf8)", border: "rgba(225,112,85,0.15)",  addBorder: "rgba(225,112,85,0.2)" },
  { id: "done",       label: "Done",        icon: "✅", color: "#00b894", bg: "linear-gradient(180deg,#e0fff6,#f8fffc)", border: "rgba(0,184,148,0.15)",   addBorder: "rgba(0,184,148,0.2)" },
];

// ─── Initial Tasks ────────────────────────────────────────────────────────────

const INITIAL_TASKS: Task[] = [
  {
    id: "t1", columnId: "todo", title: "Design new onboarding flow",
    description: "Create wireframes for new user onboarding",
    tags: [{ label: "Design", color: "#6c5ce7", bg: "#f0eeff" }, { label: "UX", color: "#0099cc", bg: "#e0f5ff" }],
    priority: "high", dueDate: "📅 Mar 20", comments: 3,
    assignees: [{ initials: "AJ", color: "#6c5ce7", bg: "#f0eeff" }, { initials: "SR", color: "#e84393", bg: "#ffeaf5" }],
  },
  {
    id: "t2", columnId: "todo", title: "Set up CI/CD pipeline",
    tags: [{ label: "DevOps", color: "#00b894", bg: "#e0fff6" }],
    priority: "medium", dueDate: "📅 Mar 25", comments: 0,
    assignees: [{ initials: "JM", color: "#00b894", bg: "#e0fff6" }],
  },
  {
    id: "t3", columnId: "todo", title: "Write unit tests for auth",
    tags: [{ label: "Testing", color: "#d4a000", bg: "#fffbe0" }],
    priority: "low", comments: 0,
    assignees: [{ initials: "AJ", color: "#6c5ce7", bg: "#f0eeff" }],
  },
  {
    id: "t4", columnId: "inprogress", title: "Build dashboard UI components",
    description: "Create reusable dashboard components",
    tags: [{ label: "Frontend", color: "#6c5ce7", bg: "#f0eeff" }],
    priority: "high", dueDate: "📅 Mar 15 ⚠️", overdue: true, progress: 65, comments: 7,
    assignees: [{ initials: "AJ", color: "#6c5ce7", bg: "#f0eeff" }, { initials: "JM", color: "#00b894", bg: "#e0fff6" }],
  },
  {
    id: "t5", columnId: "inprogress", title: "API integration for tasks",
    tags: [{ label: "Backend", color: "#00b894", bg: "#e0fff6" }],
    priority: "high", dueDate: "📅 Mar 18", progress: 40, comments: 0,
    assignees: [{ initials: "JM", color: "#00b894", bg: "#e0fff6" }],
  },
  {
    id: "t6", columnId: "review", title: "Auth module code review",
    tags: [{ label: "Review", color: "#e17055", bg: "#fff0eb" }],
    priority: "medium", comments: 2,
    assignees: [{ initials: "SR", color: "#e84393", bg: "#ffeaf5" }],
  },
  {
    id: "t7", columnId: "review", title: "Landing page design review",
    tags: [{ label: "Design", color: "#6c5ce7", bg: "#f0eeff" }],
    priority: "low", comments: 0,
    assignees: [{ initials: "AJ", color: "#6c5ce7", bg: "#f0eeff" }],
  },
  {
    id: "t8", columnId: "done", title: "Setup Neon PostgreSQL",
    tags: [{ label: "Backend", color: "#00b894", bg: "#e0fff6" }],
    priority: "high", dueDate: "✅ Mar 10", comments: 0,
    assignees: [{ initials: "AJ", color: "#6c5ce7", bg: "#f0eeff" }],
  },
  {
    id: "t9", columnId: "done", title: "Design landing page",
    tags: [{ label: "Design", color: "#6c5ce7", bg: "#f0eeff" }],
    priority: "medium", dueDate: "✅ Mar 8", comments: 0,
    assignees: [{ initials: "SR", color: "#e84393", bg: "#ffeaf5" }],
  },
  {
    id: "t10", columnId: "done", title: "Deploy to Vercel",
    tags: [{ label: "DevOps", color: "#0099cc", bg: "#e0f5ff" }],
    priority: "high", dueDate: "✅ Mar 14", comments: 0,
    assignees: [{ initials: "AJ", color: "#6c5ce7", bg: "#f0eeff" }],
  },
];

const INITIAL_COMMENTS: Comment[] = [
  { initials: "AJ", color: "#6c5ce7", bg: "#f0eeff", name: "Ajith M.", text: "Started working on the wireframes. Will share first draft by tomorrow.", time: "2 hours ago" },
  { initials: "SR", color: "#e84393", bg: "#ffeaf5", name: "Sarah R.", text: "Looks great! Can you also include the mobile view?", time: "1 hour ago" },
];

// ─── Task Card ────────────────────────────────────────────────────────────────

const TaskCard = ({
  task,
  onDragStart,
  onClick,
}: {
  task: Task;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onClick: (task: Task) => void;
}) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, task.id)}
    onClick={() => onClick(task)}
    style={{
      background: "#fff", borderRadius: 14, padding: "1rem", marginBottom: 10,
      border: "1.5px solid transparent", cursor: "grab", transition: "all .25s",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(108,92,231,0.12)";
      (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(108,92,231,0.15)";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
      (e.currentTarget as HTMLDivElement).style.borderColor = "transparent";
    }}
  >
    {/* Top row: tags + menu */}
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", flex: 1 }}>
        {task.tags.map((tag) => (
          <span key={tag.label} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, fontWeight: 600, background: tag.bg, color: tag.color }}>
            {tag.label}
          </span>
        ))}
      </div>
      <span style={{ fontSize: 16, color: "#ccc", cursor: "pointer" }}>⋮</span>
    </div>

    {/* Title */}
    <div style={{ fontSize: 13, fontWeight: 600, color: "#0a0814", marginBottom: task.description ? 6 : 10, lineHeight: 1.4 }}>
      {task.title}
    </div>

    {/* Description */}
    {task.description && (
      <div style={{ fontSize: 11, color: "#6b6b8a", marginBottom: 10, lineHeight: 1.5, fontWeight: 300 }}>
        {task.description}
      </div>
    )}

    {/* Progress bar */}
    {task.progress !== undefined && (
      <>
        <div style={{ background: "#f0eeff", borderRadius: 4, height: 4, marginBottom: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#6c5ce7,#e84393)", width: `${task.progress}%` }} />
        </div>
        <div style={{ fontSize: 10, color: "#6b6b8a", marginBottom: 8 }}>{task.progress}% complete</div>
      </>
    )}

    {/* Footer */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <PriorityBadge priority={task.priority} />
        {task.dueDate && (
          <span style={{ fontSize: 10, color: task.overdue ? "#e84393" : "#6b6b8a", fontWeight: task.overdue ? 500 : 400 }}>
            {task.dueDate}
          </span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {task.comments > 0 && <span style={{ fontSize: 10, color: "#6b6b8a" }}>💬 {task.comments}</span>}
        <div style={{ display: "flex" }}>
          {task.assignees.map((a, i) => (
            <div key={i} style={{
              width: 22, height: 22, borderRadius: "50%", border: "2px solid #fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 8, fontWeight: 700, marginLeft: i === 0 ? 0 : -6,
              background: a.bg, color: a.color,
            }}>{a.initials}</div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── Column ───────────────────────────────────────────────────────────────────

const Column = ({
  col,
  tasks,
  onDragStart,
  onDragOver,
  onDrop,
  onTaskClick,
  onAddTask,
}: {
  col: typeof COLUMNS[0];
  tasks: Task[];
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, colId: ColumnId) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: () => void;
}) => (
  <div
    onDragOver={onDragOver}
    onDrop={(e) => onDrop(e, col.id)}
    style={{ borderRadius: 16, padding: "1rem", minHeight: 450, background: col.bg, border: `1.5px solid ${col.border}` }}
  >
    {/* Column header */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: `${col.color}1a`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
          {col.icon}
        </div>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: col.color }}>{col.label}</span>
        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 100, fontWeight: 600, background: `${col.color}1a`, color: col.color }}>
          {tasks.length}
        </span>
      </div>
      <button
        onClick={onAddTask}
        style={{ width: 26, height: 26, borderRadius: 7, background: `${col.color}1a`, color: col.color, border: "none", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
      >+</button>
    </div>

    {/* Tasks */}
    {tasks.map((task) => (
      <TaskCard key={task.id} task={task} onDragStart={onDragStart} onClick={onTaskClick} />
    ))}

    {/* Add task button */}
    <button
      onClick={onAddTask}
      style={{
        width: "100%", border: `2px dashed ${col.addBorder}`, borderRadius: 12, padding: 12,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        cursor: "pointer", fontSize: 12, color: "#6b6b8a", fontWeight: 500,
        background: "transparent", fontFamily: "'DM Sans', sans-serif", transition: "all .2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = col.color;
        (e.currentTarget as HTMLButtonElement).style.color = col.color;
        (e.currentTarget as HTMLButtonElement).style.background = `${col.color}0d`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = col.addBorder;
        (e.currentTarget as HTMLButtonElement).style.color = "#6b6b8a";
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >+ Add task</button>
  </div>
);

// ─── Add Task Modal ───────────────────────────────────────────────────────────

const AddTaskModal = ({
  columnId,
  onClose,
  onAdd,
}: {
  columnId: ColumnId;
  onClose: () => void;
  onAdd: (task: Task) => void;
}) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const submit = () => {
    if (!title.trim()) return;
    onAdd({
      id: `task-${Date.now()}`,
      title: title.trim(),
      tags: [],
      priority,
      comments: 0,
      assignees: [{ initials: "AJ", color: "#6c5ce7", bg: "#f0eeff" }],
      columnId,
    });
    onClose();
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(10,8,20,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div style={{ background: "#fff", borderRadius: 18, width: 420, padding: "1.75rem", boxShadow: "0 20px 60px rgba(108,92,231,0.2)" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, marginBottom: 16, background: "linear-gradient(135deg,#6c5ce7,#e84393)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Add Task
        </div>

        <label style={{ fontSize: 12, fontWeight: 600, color: "#6b6b8a", display: "block", marginBottom: 6 }}>Title *</label>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Task title…"
          style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: "1.5px solid rgba(108,92,231,0.2)", borderRadius: 10, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", marginBottom: 14 }}
        />

        <label style={{ fontSize: 12, fontWeight: 600, color: "#6b6b8a", display: "block", marginBottom: 6 }}>Priority</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["high", "medium", "low"] as Priority[]).map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              style={{
                flex: 1, padding: "7px 0", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .15s",
                background: priority === p ? "linear-gradient(135deg,#6c5ce7,#e84393)" : "#f5f4ff",
                color: priority === p ? "#fff" : "#6b6b8a",
                border: priority === p ? "none" : "1.5px solid rgba(108,92,231,0.12)",
              }}
            >{p.charAt(0).toUpperCase() + p.slice(1)}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: "pointer", background: "#f5f4ff", color: "#6b6b8a", border: "none", fontFamily: "'DM Sans',sans-serif" }}>
            Cancel
          </button>
          <button onClick={submit} style={{ flex: 2, padding: "10px 0", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "linear-gradient(135deg,#6c5ce7,#e84393)", color: "#fff", border: "none", boxShadow: "0 4px 12px rgba(108,92,231,0.3)", fontFamily: "'DM Sans',sans-serif" }}>
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────

const TaskModal = ({ task, onClose }: { task: Task | null; onClose: () => void }) => {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [input, setInput] = useState("");

  if (!task) return null;

  const addComment = () => {
    if (!input.trim()) return;
    setComments([...comments, { initials: "AJ", color: "#6c5ce7", bg: "#f0eeff", name: "Ajith M.", text: input, time: "Just now" }]);
    setInput("");
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(10,8,20,0.4)", zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 580, maxHeight: "88vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(108,92,231,0.2)" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#6c5ce7,#e84393)", padding: "1.5rem", borderRadius: "20px 20px 0 0", position: "relative" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{task.title}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Nexus App • {task.tags[0]?.label}</div>
          <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", width: 28, height: 28, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.15)", cursor: "pointer", color: "#fff", fontSize: 16 }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem" }}>
          {/* Meta grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: "1.25rem" }}>
            {[
              { label: "Priority", value: <PriorityBadge priority={task.priority} /> },
              { label: "Due Date", value: task.dueDate || "—" },
              { label: "Status", value: COLUMNS.find(c => c.id === task.columnId)?.label || "—" },
              {
                label: "Assignees", value: (
                  <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                    {task.assignees.map((a, i) => (
                      <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, background: a.bg, color: a.color }}>
                        {a.initials}
                      </div>
                    ))}
                  </div>
                )
              },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: "#f8f6ff", borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#6b6b8a", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#0a0814" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          {task.description && (
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#6b6b8a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Description</div>
              <div style={{ fontSize: 13, color: "#0a0814", lineHeight: 1.75, fontWeight: 300, background: "#f8f6ff", borderRadius: 10, padding: 12 }}>{task.description}</div>
            </div>
          )}

          {/* Comments */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#6b6b8a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              Comments ({comments.length})
            </div>
            {comments.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: c.bg, color: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{c.initials}</div>
                <div style={{ flex: 1, background: "#f8f6ff", borderRadius: 12, padding: "10px 14px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0a0814", marginBottom: 3 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "#6b6b8a", lineHeight: 1.5, fontWeight: 300 }}>{c.text}</div>
                  <div style={{ fontSize: 10, color: "#ccc", marginTop: 4 }}>{c.time}</div>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addComment()}
                placeholder="Write a comment..."
                style={{ flex: 1, padding: "10px 14px", border: "1.5px solid rgba(108,92,231,0.15)", borderRadius: 10, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", background: "#fafbff" }}
              />
              <button
                onClick={addComment}
                style={{ padding: "10px 18px", background: "linear-gradient(135deg,#6c5ce7,#e84393)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, cursor: "pointer", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}
              >Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const NAV_ROUTES: Record<string, string> = {
  Home: "/",
  Dashboard: "/dashboard",
  Chat: "/chat",
  Docs: "/docs",
  Analytics: "/analytics",
};

export default function KanbanPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeFilter, setActiveFilter] = useState("All Tasks");
  const [addTaskColumn, setAddTaskColumn] = useState<ColumnId | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, colId: ColumnId) => {
    e.preventDefault();
    if (!draggingId) return;
    setTasks((prev) => prev.map((t) => t.id === draggingId ? { ...t, columnId: colId } : t));
    setDraggingId(null);
  };

  const filters = ["All Tasks", "My Tasks", "High Priority", "Due Soon"];

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #f8f6ff; }
      `}</style>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>

        {/* ── Sidebar ── */}
        <div style={{
          background: "linear-gradient(180deg,#6c5ce7 0%,#e84393 60%,#0099cc 100%)",
          padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: 4,
          position: "relative", overflow: "hidden",
        }}>
          {/* glow orb */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: "1.5rem", padding: "0 0.5rem", position: "relative", zIndex: 1 }}>
            Nexus
          </div>

          {[
            { icon: "🏠", label: "Home", badge: null, active: false },
            { icon: "▦", label: "Dashboard", badge: null, active: true },
            { icon: "💬", label: "Chat", badge: "3", active: false },
            { icon: "📄", label: "Docs", badge: null, active: false },
            { icon: "📊", label: "Analytics", badge: null, active: false },
          ].map(({ icon, label, badge, active }) => (
            <div key={label} onClick={() => router.push(NAV_ROUTES[label])} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10,
              fontSize: 13, color: active ? "#fff" : "rgba(255,255,255,0.7)", cursor: "pointer",
              background: active ? "rgba(255,255,255,0.15)" : "transparent", fontWeight: active ? 500 : 400,
              position: "relative", zIndex: 1,
            }}>
              <span>{icon}</span>{label}
              {badge && <span style={{ marginLeft: "auto", background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 10, padding: "2px 7px", borderRadius: 100, fontWeight: 600 }}>{badge}</span>}
            </div>
          ))}

          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase", padding: "0 0.5rem", margin: "1rem 0 0.5rem", position: "relative", zIndex: 1 }}>
            Projects
          </div>

          {[
            { label: "Nexus App", active: true },
            { label: "Marketing", active: false },
            { label: "Design System", active: false },
          ].map(({ label, active }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10,
              fontSize: 13, color: active ? "#fff" : "rgba(255,255,255,0.6)", cursor: "pointer",
              background: active ? "rgba(255,255,255,0.15)" : "transparent", position: "relative", zIndex: 1,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: active ? "#fff" : "rgba(255,255,255,0.5)", flexShrink: 0 }} />
              {label}
            </div>
          ))}

          {/* User */}
          <div style={{ marginTop: "auto", padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#fff", border: "2px solid rgba(255,255,255,0.3)" }}>AJ</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#fff" }}>Ajith M.</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Owner</div>
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>

          <Topbar
            title="Nexus App"
            subtitle={`${tasks.length} tasks`}
            actions={
              <>
                <button style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", background: "#fff", border: "1.5px solid rgba(108,92,231,0.2)", color: "#6c5ce7", fontFamily: "'DM Sans', sans-serif" }}>
                  ⚙ Settings
                </button>
                <button onClick={() => setAddTaskColumn("todo")} style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", background: "linear-gradient(135deg,#6c5ce7,#e84393)", color: "#fff", border: "none", boxShadow: "0 4px 12px rgba(108,92,231,0.3)", fontFamily: "'DM Sans', sans-serif" }}>
                  + Add Task
                </button>
              </>
            }
          />

          {/* Filter bar */}
          <div style={{ background: "#fff", borderBottom: "1px solid rgba(108,92,231,0.06)", padding: ".875rem 1.5rem", display: "flex", alignItems: "center", gap: 8 }}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
                  border: "1.5px solid rgba(108,92,231,0.12)", fontFamily: "'DM Sans', sans-serif", transition: "all .2s",
                  background: activeFilter === f ? "linear-gradient(135deg,#6c5ce7,#e84393)" : "#fff",
                  color: activeFilter === f ? "#fff" : "#6b6b8a",
                  borderColor: activeFilter === f ? "transparent" : "rgba(108,92,231,0.12)",
                  boxShadow: activeFilter === f ? "0 3px 10px rgba(108,92,231,0.25)" : "none",
                }}
              >{f}</button>
            ))}
            {/* Search */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", marginLeft: "auto" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" style={{ position: "absolute", left: 10 }}>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input placeholder="Search tasks..." style={{ padding: "7px 14px 7px 32px", border: "1.5px solid rgba(108,92,231,0.12)", borderRadius: 8, fontSize: 12, fontFamily: "'DM Sans', sans-serif", outline: "none", width: 180, background: "#fafbff" }} />
            </div>
            {/* Avatars */}
            <div style={{ display: "flex", marginLeft: 8 }}>
              {[
                { i: "AJ", c: "#6c5ce7", b: "#f0eeff" },
                { i: "JM", c: "#00b894", b: "#e0fff6" },
                { i: "SR", c: "#e84393", b: "#ffeaf5" },
              ].map((a, idx) => (
                <div key={idx} style={{ width: 26, height: 26, borderRadius: "50%", border: "2px solid #fff", background: a.b, color: a.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, marginLeft: idx === 0 ? 0 : -6 }}>
                  {a.i}
                </div>
              ))}
              <div style={{ width: 26, height: 26, borderRadius: "50%", border: "1.5px dashed #ddd", background: "#f8f7ff", color: "#6b6b8a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, marginLeft: -6 }}>+2</div>
            </div>
          </div>

          {/* Kanban board */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.25rem", padding: "1.5rem", alignItems: "start", background: "#f8f6ff", overflowY: "auto" }}>
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                col={col}
                tasks={tasks.filter((t) => t.columnId === col.id)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onTaskClick={setSelectedTask}
                onAddTask={() => setAddTaskColumn(col.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Task detail modal */}
      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}

      {/* Add task modal */}
      {addTaskColumn && (
        <AddTaskModal
          columnId={addTaskColumn}
          onClose={() => setAddTaskColumn(null)}
          onAdd={(task) => setTasks((prev) => [...prev, task])}
        />
      )}
    </>
  );
}