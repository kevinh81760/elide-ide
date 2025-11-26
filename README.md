# Elide IDE

A modern IDE built with Tauri, React, and TypeScript, featuring a VS Code-inspired interface with file tree navigation and tabbed editing.

## Features

- 🌳 **File Tree Explorer** - Browse your filesystem with a collapsible tree view
- 📑 **Tabbed Interface** - Open multiple files in tabs with easy navigation
- 🎨 **Theme Support** - Toggle between light and dark modes
- 📱 **Responsive Design** - Works on desktop with mobile-optimized sidebar
- 🚀 **Fast & Lightweight** - Built with Tauri for native performance

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Tauri v2, Rust
- **UI Components**: Custom components with shadcn/ui patterns
- **Icons**: Lucide React
- **Build Tool**: Vite (via Bun)

## Project Structure

```
elide-ide/
├── src/
│   ├── components/
│   │   ├── FileTree/          # File tree navigation component
│   │   └── ui/                # Reusable UI components (Button, etc.)
│   ├── layout/
│   │   └── IDELayout.tsx      # Main IDE layout component
│   ├── lib/
│   │   ├── file-types.ts      # TypeScript type definitions
│   │   ├── tauri-fs.ts        # Tauri filesystem integration
│   │   └── utils.ts           # Utility functions
│   ├── App.tsx                # Root component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles with Tailwind
├── src-tauri/                # Tauri backend (Rust)
└── tailwind.config.js        # Tailwind configuration
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) - JavaScript runtime and package manager
- [Rust](https://www.rust-lang.org/) - Required for Tauri

### Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

### Development

Run the development server:

```bash
bun run tauri dev
```

This will:
- Start the Vite dev server for hot module replacement
- Launch the Tauri application window

### Build

Create a production build:

```bash
bun run tauri build
```

## Configuration

### Filesystem Permissions

The IDE uses Tauri's filesystem plugin with the following permissions (configured in `src-tauri/capabilities/default.json`):

- `fs:allow-read-dir` - Read directory contents
- `fs:allow-read-text-file` - Read text file contents
- `fs:allow-read-file` - Read binary file contents
- `fs:allow-exists` - Check if files/directories exist

### Theme Colors

Theme colors are configured in `src/index.css` using CSS custom properties. Both light and dark mode variants are included.

## Customization

### Adding New File Types

Edit `src/lib/tauri-fs.ts` to add new file extension mappings in the `getLanguageFromExtension()` function.

### Styling

The project uses Tailwind CSS with custom IDE-specific color tokens:
- `--sidebar-background`
- `--sidebar-foreground`
- `--sidebar-border`
- `--sidebar-accent`

Modify these in `src/index.css` to customize the IDE appearance.

## Roadmap

- [ ] Monaco Editor integration for syntax highlighting
- [ ] File editing and saving
- [ ] Search functionality
- [ ] Git integration
- [ ] Terminal panel
- [ ] Extension system

## License

MIT

