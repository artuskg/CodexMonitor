import type { GitHubPullRequest, GitHubPullRequestDiff } from "../types";

export const DEFAULT_PULL_REQUEST_PROMPT_TEMPLATE = `You are reviewing a GitHub pull request.
PR: #{{number}} {{title}}
URL: {{url}}
Author: @{{author}}
Branches: {{baseRef}} <- {{headRef}}
Updated: {{updatedAt}}{{draftState}}{{descriptionSection}}

Diff: {{diffSummary}}{{questionSection}}`;

const TEMPLATE_TOKEN_REGEX = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;

export function buildPullRequestDraft(pullRequest: GitHubPullRequest) {
  return `Question about PR #${pullRequest.number} (${pullRequest.title}):\n`;
}

export function buildPullRequestPrompt(
  pullRequest: GitHubPullRequest,
  diffs: GitHubPullRequestDiff[],
  question: string,
  template: string = DEFAULT_PULL_REQUEST_PROMPT_TEMPLATE,
) {
  const author = pullRequest.author?.login ?? "unknown";
  const diffSummary =
    diffs.length === 0
      ? "unavailable in this message."
      : `${diffs.length} file${diffs.length === 1 ? "" : "s"} changed (not included).`;
  const draftState = pullRequest.isDraft ? "\nState: draft" : "";
  const body = pullRequest.body?.trim();
  const descriptionSection = body ? `\n\nDescription:\n${body}` : "";
  const trimmedQuestion = question.trim();
  const questionSection = trimmedQuestion
    ? `\n\nQuestion:\n${trimmedQuestion}`
    : "";
  const resolvedTemplate = template.trim()
    ? template
    : DEFAULT_PULL_REQUEST_PROMPT_TEMPLATE;
  const valueMap: Record<string, string> = {
    number: pullRequest.number.toString(),
    title: pullRequest.title,
    url: pullRequest.url,
    author,
    baseRef: pullRequest.baseRefName,
    headRef: pullRequest.headRefName,
    updatedAt: pullRequest.updatedAt,
    draftState,
    descriptionSection,
    diffSummary,
    questionSection,
  };
  const filled = resolvedTemplate.replace(
    TEMPLATE_TOKEN_REGEX,
    (_, key) => valueMap[key] ?? "",
  );

  return filled.replace(/\n{3,}/g, "\n\n").trim();
}
