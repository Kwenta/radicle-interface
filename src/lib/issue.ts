import type { Author } from "@app/lib/cobs";
import type { Host } from "@app/lib/api";

import { Request } from "@app/lib/api";

export interface TimelineItem {
  person: Author;
  message: string;
  timestamp: number;
}

export interface IIssue {
  id: string;
  author: Author;
  title: string;
  state: State;
  discussion: Thread[];
  tags: string[];
  assignees: string[];
  timestamp: number;
}

export type State =
  | {
      status: "open";
    }
  | {
      status: "closed";
      reason: string;
    };

export interface Comment<R = null> {
  author: Author;
  body: string;
  reactions: Record<string, number>;
  timestamp: number;
  replyTo: R;
}

export type Thread = Comment<Comment[]>;

export function groupIssues(issues: Issue[]): {
  open: Issue[];
  closed: Issue[];
} {
  return issues.reduce(
    (acc, issue) => {
      acc[issue.state.status].push(issue);
      return acc;
    },
    { open: [] as Issue[], closed: [] as Issue[] },
  );
}

export class Issue {
  id: string;
  author: Author;
  title: string;
  state: State;
  discussion: Thread[];
  tags: string[];
  assignees: string[];
  timestamp: number;

  constructor(issue: IIssue) {
    this.id = issue.id;
    this.author = issue.author;
    this.title = issue.title;
    this.state = issue.state;
    this.discussion = issue.discussion;
    this.tags = issue.tags;
    this.assignees = issue.assignees;
    this.timestamp = issue.discussion[0].timestamp;
  }

  // Counts the amount of comments and replies in a discussion
  countComments(): number {
    return this.discussion.reduce(acc => {
      return acc + 1; // If there are no replies, we simply add 1 for the comment in this loop.
    }, 0);
  }

  static async createIssue(
    project: string,
    title: string,
    description: string,
    assignees: string[],
    tags: string[],
    host: Host,
    authToken: string,
  ): Promise<void> {
    await new Request(`projects/${project}/issues`, host).post(
      {
        title,
        description,
        assignees,
        tags,
      },
      { Authorization: `Bearer ${authToken}` },
    );
  }

  static async getIssues(id: string, host: Host): Promise<Issue[]> {
    const response: IIssue[] = await new Request(
      `projects/${id}/issues`,
      host,
    ).get();
    return response.map(issue => new Issue(issue));
  }

  static async getIssue(id: string, issue: string, host: Host): Promise<Issue> {
    const response: IIssue = await new Request(
      `projects/${id}/issues/${issue}`,
      host,
    ).get();
    return new Issue(response);
  }
}
