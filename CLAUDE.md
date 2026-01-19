# CLAUDE.md - AI Assistant Guidelines

This file provides guidance for AI assistants working with this repository.

## Repository Overview

**Repository**: ClaudeTesting
**Owner**: isleofdan
**Status**: New repository (initialized January 2026)

This repository is currently in its initial setup phase. As the codebase grows, this document will be updated to reflect the project structure, conventions, and workflows.

## Project Structure

```
ClaudeTesting/
├── CLAUDE.md          # AI assistant guidelines (this file)
└── .git/              # Git repository
```

*Note: Update this section as new directories and files are added.*

## Development Workflow

### Branch Naming Convention

- Feature branches: `feature/<description>`
- Bug fixes: `fix/<description>`
- Documentation: `docs/<description>`
- Claude AI branches: `claude/<session-id>` (auto-generated for AI sessions)

### Commit Message Guidelines

Follow conventional commit format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic changes)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(auth): add user login functionality
fix(api): resolve null pointer in response handler
docs: update README with setup instructions
```

### Pull Request Process

1. Create a feature branch from the main branch
2. Make changes with clear, atomic commits
3. Push branch and open a pull request
4. Request review if applicable
5. Merge after approval

## Code Conventions

### General Guidelines

- Write clean, readable, self-documenting code
- Keep functions focused and single-purpose
- Use meaningful variable and function names
- Add comments only where logic is non-obvious
- Follow the principle of least surprise

### File Organization

- Group related functionality together
- Keep files focused on a single concern
- Use consistent naming conventions within the project

## AI Assistant Instructions

### Before Making Changes

1. **Read before editing**: Always read files before modifying them
2. **Understand context**: Explore related files to understand the codebase
3. **Check existing patterns**: Follow established conventions in the codebase
4. **Minimal changes**: Only make changes that are directly requested

### When Writing Code

1. **Match existing style**: Follow the patterns already established
2. **Avoid over-engineering**: Keep solutions simple and focused
3. **No unnecessary additions**: Don't add features, comments, or abstractions beyond what's needed
4. **Security first**: Be mindful of common vulnerabilities (OWASP Top 10)

### When Committing

1. Use descriptive commit messages following the guidelines above
2. Make atomic commits (one logical change per commit)
3. Verify changes work before committing
4. Never commit sensitive data (credentials, API keys, etc.)

### Testing

- Run existing tests before and after making changes
- Add tests for new functionality when a testing framework is present
- Ensure tests pass before pushing changes

## Environment Setup

*Add environment setup instructions here as the project develops.*

```bash
# Example setup commands (update as needed)
git clone <repository-url>
cd ClaudeTesting
# Add dependency installation commands
# Add build/run commands
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `CLAUDE.md` | AI assistant guidelines and project documentation |

*Add important files to this table as the project grows.*

## Common Tasks

### Starting Development

```bash
# Ensure you're on the correct branch
git checkout <branch-name>

# Pull latest changes
git pull origin <branch-name>
```

### Making a Commit

```bash
git add <files>
git commit -m "type(scope): description"
git push -u origin <branch-name>
```

## Troubleshooting

*Add common issues and solutions here as they are discovered.*

---

## Changelog

- **2026-01-19**: Initial CLAUDE.md created for new repository setup

---

*This document should be updated as the project evolves. When adding new patterns, tools, or conventions, document them here for future reference.*
