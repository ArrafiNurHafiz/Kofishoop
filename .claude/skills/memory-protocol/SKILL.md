---
name: memory-protocol
description: Use this skill at the start and end of every session to manage persistent memory via agentmemory MCP
---

## Session Start Protocol
1. Call agentmemory tool: memory_recall with query "project context preferences decisions"
2. Call agentmemory tool: memory_recall with query "current project $(basename $PWD)"
3. Load recalled context before doing anything else.

## Session End Protocol
1. Save key decisions made this session
2. Save patterns or conventions discovered
3. Save bugs found and their fixes
4. Save user preferences observed
Use: memory_save for each item.

## During Session
- If you discover something important: memory_save immediately, don't wait
- If unsure about context: memory_recall before asking the user
