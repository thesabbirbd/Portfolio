# CLAUDE EXECUTION RUNBOOK — THE SABBiR

Use this together with `CLAUDE_CODE_MASTER_PROMPT.md` and `THE_SABBiR_PROJECT_CONTEXT.md` in the local repository root.

## Recommended workflow

1. Start Claude Code in the actual `sabbir.nav.bd` project directory.
2. Use **Claude Opus with High effort** for Phase 0 and Phase 1 because the first job is architectural diagnosis and performance root-cause analysis. If an Extra/Extended effort setting is available, reserve it for Phase 0/1 or a particularly complicated scroll/timeline problem; it is not necessary for every CSS phase.
3. Paste this instruction:

   > Read `CLAUDE_CODE_MASTER_PROMPT.md`, `THE_SABBiR_PROJECT_CONTEXT.md`, and `CLAUDE_EXECUTION_RUNBOOK.md` fully. Follow the phase execution contract. Start with Phase 0 and then Phase 1 only if safe. Do not execute later phases yet. Preserve all local changes. No commit, push, merge, or deploy. Implement real fixes and report exactly what was verified.

4. Review the Phase 0/1 report and the local diff. Open the local preview at the reported URL; if on the same Wi-Fi, use the LAN URL Claude gives you. Remember that an emulator is not a physical phone.
5. Continue one phase per session with prompts such as:
   - `Run Phase 2 only. Read prior reports and inspect current code/diff first. Stop after validation.`
   - `Run Phase 3 only...`
   - Continue sequentially through Phase 15.
6. Before beginning any phase, Claude must verify which earlier changes are actually present rather than trusting old reports.
7. After a phase, check `git status --short` and review the diff. Do not authorize commit/push until you personally decide the result is ready.

## Why not run the whole roadmap in one giant session?

The site currently needs performance diagnosis and a significant visual re-art direction. Doing all of these at once can create competing animation systems, regress working routes, and leave no clean point to review the new design. The staged workflow makes each change inspectable and lets performance be compared before/after.

## Design direction in one sentence

**Tactile Editorial** for Hero and story, **Luxury Glass & Fluid** for navigation/content surfaces, and restrained **Cyber AI** for Engineering Lab—unified by THE SABBiR’s orange identity, consistent typography/spacing, accessible themes, and a light performance budget.

## Mandatory stop conditions

- Never run `git commit`, `git push`, `git merge`, deployment, or destructive cleanup without separate explicit authorization.
- Never claim a performance score, FPS or physical-device verification without evidence.
- Do not invent the correct Omnidesk description or preserve the 60% latency claim unless evidence supports it.
- Do not autoplay sound. Sound must be opt-in and OFF by default.
