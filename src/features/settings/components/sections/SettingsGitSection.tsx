import type { AppSettings } from "../../../../types";

type SettingsGitSectionProps = {
  appSettings: AppSettings;
  onUpdateAppSettings: (next: AppSettings) => Promise<void>;
  gitPullRequestPromptDraft: string;
  gitPullRequestPromptDirty: boolean;
  gitPullRequestPromptSaving: boolean;
  onSetGitPullRequestPromptDraft: (next: string) => void;
  onSaveGitPullRequestPrompt: () => Promise<void>;
  onResetGitPullRequestPrompt: () => Promise<void>;
};

export function SettingsGitSection({
  appSettings,
  onUpdateAppSettings,
  gitPullRequestPromptDraft,
  gitPullRequestPromptDirty,
  gitPullRequestPromptSaving,
  onSetGitPullRequestPromptDraft,
  onSaveGitPullRequestPrompt,
  onResetGitPullRequestPrompt,
}: SettingsGitSectionProps) {
  return (
    <section className="settings-section">
      <div className="settings-section-title">Git</div>
      <div className="settings-section-subtitle">
        Manage how diffs are loaded and pull request prompts are composed.
      </div>
      <div className="settings-toggle-row">
        <div>
          <div className="settings-toggle-title">Preload git diffs</div>
          <div className="settings-toggle-subtitle">Make viewing git diff faster.</div>
        </div>
        <button
          type="button"
          className={`settings-toggle ${appSettings.preloadGitDiffs ? "on" : ""}`}
          onClick={() =>
            void onUpdateAppSettings({
              ...appSettings,
              preloadGitDiffs: !appSettings.preloadGitDiffs,
            })
          }
          aria-pressed={appSettings.preloadGitDiffs}
        >
          <span className="settings-toggle-knob" />
        </button>
      </div>
      <div className="settings-toggle-row">
        <div>
          <div className="settings-toggle-title">Ignore whitespace changes</div>
          <div className="settings-toggle-subtitle">
            Hides whitespace-only changes in local and commit diffs.
          </div>
        </div>
        <button
          type="button"
          className={`settings-toggle ${appSettings.gitDiffIgnoreWhitespaceChanges ? "on" : ""}`}
          onClick={() =>
            void onUpdateAppSettings({
              ...appSettings,
              gitDiffIgnoreWhitespaceChanges: !appSettings.gitDiffIgnoreWhitespaceChanges,
            })
          }
          aria-pressed={appSettings.gitDiffIgnoreWhitespaceChanges}
        >
          <span className="settings-toggle-knob" />
        </button>
      </div>
      <div className="settings-field">
        <label className="settings-field-label" htmlFor="git-pr-prompt">
          Pull request prompt
        </label>
        <div className="settings-help">
          Template used when asking questions about GitHub pull requests. Available tokens:{" "}
          <code>{"{{number}}"}</code>, <code>{"{{title}}"}</code>,{" "}
          <code>{"{{url}}"}</code>, <code>{"{{author}}"}</code>,{" "}
          <code>{"{{baseRef}}"}</code>, <code>{"{{headRef}}"}</code>,{" "}
          <code>{"{{updatedAt}}"}</code>, <code>{"{{draftState}}"}</code>,{" "}
          <code>{"{{descriptionSection}}"}</code>, <code>{"{{diffSummary}}"}</code>,{" "}
          <code>{"{{questionSection}}"}</code>.
        </div>
        <textarea
          id="git-pr-prompt"
          className="settings-agents-textarea"
          value={gitPullRequestPromptDraft}
          onChange={(event) => onSetGitPullRequestPromptDraft(event.target.value)}
          placeholder="Describe the pull request context for Codex…"
          spellCheck={false}
          disabled={gitPullRequestPromptSaving}
        />
        <div className="settings-field-actions">
          <button
            type="button"
            className="ghost settings-button-compact"
            onClick={() => void onResetGitPullRequestPrompt()}
            disabled={gitPullRequestPromptSaving}
          >
            Reset
          </button>
          <button
            type="button"
            className="primary settings-button-compact"
            onClick={() => void onSaveGitPullRequestPrompt()}
            disabled={gitPullRequestPromptSaving || !gitPullRequestPromptDirty}
          >
            {gitPullRequestPromptSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </section>
  );
}
