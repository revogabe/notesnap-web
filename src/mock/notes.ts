import type { Note } from "@/types"

export const NOTES: Note[] = [
  {
    id: "1",
    title: "Super secret passwords",
    content: "<password>",
    tags: ["passwords", "secret"],
    images: [],
    companion: {
      visibility: "private",
      email_allow: ["user@example.com"],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Work Meeting Notes",
    content:
      "Today we discussed the project timeline and deliverables.\n\nAction Items:\n- Finalize the project scope\n- Assign tasks to team members\n- Schedule the next meeting",
    tags: ["work", "meeting"],
    images: [],
    companion: {
      visibility: "public",
      email_allow: [],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Untitled",
    content: "",
    tags: [],
    images: [],
    companion: {
      visibility: "public",
      email_allow: [],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Super secret passwords",
    content: "<password>",
    tags: ["passwords", "secret"],
    images: [],
    companion: {
      visibility: "private",
      email_allow: ["user@example.com"],
    },
    created_at: "2023-10-01T12:00:00Z",
    updated_at: "2023-10-01T12:00:00Z",
  },
  {
    id: "5",
    title: "Work Meeting Notes",
    content:
      "Today we discussed the project timeline and deliverables.\n\nAction Items:\n- Finalize the project scope\n- Assign tasks to team members\n- Schedule the next meeting",
    tags: ["work", "meeting"],
    images: [],
    companion: {
      visibility: "public",
      email_allow: [],
    },
    created_at: "2023-10-01T12:00:00Z",
    updated_at: "2023-10-01T12:00:00Z",
  },
  {
    id: "6",
    title: "Untitled",
    content: "",
    tags: [],
    images: [],
    companion: {
      visibility: "public",
      email_allow: [],
    },
    created_at: "2023-10-01T12:00:00Z",
    updated_at: "2023-10-01T12:00:00Z",
  },
  {
    id: "7",
    title: "Super secret passwords",
    content: "<password>",
    tags: ["passwords", "secret"],
    images: [],
    companion: {
      visibility: "private",
      email_allow: ["user@example.com"],
    },
    created_at: "2023-10-01T12:00:00Z",
    updated_at: "2023-10-01T12:00:00Z",
  },
  {
    id: "8",
    title: "Work Meeting Notes",
    content:
      "Today we discussed the project timeline and deliverables.\n\nAction Items:\n- Finalize the project scope\n- Assign tasks to team members\n- Schedule the next meeting",
    tags: ["work", "meeting"],
    images: [],
    companion: {
      visibility: "public",
      email_allow: [],
    },
    created_at: "2023-10-01T12:00:00Z",
    updated_at: "2023-10-01T12:00:00Z",
  },
  {
    id: "9",
    title: "Untitled",
    content: "",
    tags: [],
    images: [],
    companion: {
      visibility: "public",
      email_allow: [],
    },
    created_at: "2023-10-05T12:00:00Z",
    updated_at: "2023-10-05T12:00:00Z",
  },
  {
    id: "10",
    title: "Super secret passwords",
    content: "<password>",
    tags: ["passwords", "secret"],
    images: [],
    companion: {
      visibility: "private",
      email_allow: ["user@example.com"],
    },
    created_at: "2023-10-05T12:00:00Z",
    updated_at: "2023-10-05T12:00:00Z",
  },
  {
    id: "11",
    title: "Work Meeting Notes",
    content:
      "Today we discussed the project timeline and deliverables.\n\nAction Items:\n- Finalize the project scope\n- Assign tasks to team members\n- Schedule the next meeting",
    tags: ["work", "meeting"],
    images: [],
    companion: {
      visibility: "public",
      email_allow: [],
    },
    created_at: "2023-10-05T12:00:00Z",
    updated_at: "2023-10-05T12:00:00Z",
  },
  {
    id: "12",
    title: "Untitled",
    content: "",
    tags: [],
    images: [],
    companion: {
      visibility: "public",
      email_allow: [],
    },
    created_at: "2023-10-05T12:00:00Z",
    updated_at: "2023-10-05T12:00:00Z",
  },
]
