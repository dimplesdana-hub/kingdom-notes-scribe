import { useCallback, useEffect, useState } from "react";
import { RefreshCw, GitBranch, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";

const REPO = "dimplesdana-hub/kingdom-notes-scribe";

type CompareStatus = "identical" | "ahead" | "behind" | "diverged";
type CompareResult = {
  status: CompareStatus;
  ahead_by: number;
  behind_by: number;
  mainSha: string;
};

export function SyncStatus() {
  const builtSha = __GIT_COMMIT_SHA__;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);

  const check = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.github.com/repos/${REPO}/compare/${builtSha}...main`,
        { headers: { Accept: "application/vnd.github+json" } },
      );
      if (!res.ok) {
        if (res.status === 403) throw new Error("GitHub rate limit reached. Try again later.");
        if (res.status === 404) throw new Error("Built commit not found on GitHub.");
        throw new Error(`GitHub API error (${res.status})`);
      }
      const json = await res.json();
      setResult({
        status: json.status as CompareStatus,
        ahead_by: json.ahead_by ?? 0,
        behind_by: json.behind_by ?? 0,
        mainSha: json.commits?.length
          ? json.commits[json.commits.length - 1].sha
          : builtSha,
      });
      setCheckedAt(new Date());
    } catch (e: any) {
      setError(e?.message ?? "Failed to check");
    } finally {
      setLoading(false);
    }
  }, [builtSha]);

  useEffect(() => {
    check();
  }, [check]);

  // From GitHub's perspective: behind_by = commits on main not in built.
  const commitsBehindMain = result?.behind_by ?? 0;
  const inSync = result && commitsBehindMain === 0;

  return (
    <div className="px-4 py-3 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <GitBranch className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground">Sync Status</div>
            <div className="text-xs text-muted-foreground">Build vs GitHub main</div>
          </div>
        </div>
        <button
          onClick={check}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-primary px-2.5 py-1 text-xs font-semibold text-primary disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Checking" : "Check"}
        </button>
      </div>

      <div className="rounded-lg bg-muted/40 p-2.5 text-xs font-mono space-y-1">
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">built</span>
          <a
            href={`https://github.com/${REPO}/commit/${builtSha}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline truncate"
          >
            {builtSha.slice(0, 7)}
          </a>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">main</span>
          {result ? (
            <a
              href={`https://github.com/${REPO}/commit/${result.mainSha}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline truncate"
            >
              {result.mainSha.slice(0, 7)}
            </a>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!error && result && (
        <div
          className={`flex items-start gap-2 rounded-lg p-2.5 text-xs ${
            inSync
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
          }`}
        >
          {inSync ? (
            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            {inSync ? (
              <span>Build is up to date with main.</span>
            ) : (
              <span>
                Build is {commitsBehindMain} commit{commitsBehindMain === 1 ? "" : "s"} behind
                main. A new deploy is needed to pick them up.
              </span>
            )}
            {result.ahead_by > 0 && (
              <span className="block opacity-80">
                Build is also {result.ahead_by} commit{result.ahead_by === 1 ? "" : "s"} ahead.
              </span>
            )}
          </div>
        </div>
      )}

      {result && (
        <a
          href={`https://github.com/${REPO}/compare/${builtSha}...main`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          Open GitHub changes <ExternalLink className="h-3 w-3" />
        </a>
      )}

      {result && commitsBehindMain > 0 && (
        <div className="text-[10px] text-muted-foreground">
          {commitsBehindMain} commit{commitsBehindMain === 1 ? "" : "s"} behind main
        </div>
      )}

      {checkedAt && (
        <div className="text-[10px] text-muted-foreground">
          Checked {checkedAt.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
