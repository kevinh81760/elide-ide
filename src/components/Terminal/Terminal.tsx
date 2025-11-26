// components/Terminal/Terminal
import React from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import { Command } from "@tauri-apps/plugin-shell";
import "xterm/css/xterm.css";

export function Terminal() {
  const terminalRef = React.useRef<HTMLDivElement>(null);
  const xtermRef = React.useRef<XTerm | null>(null);
  const fitAddonRef = React.useRef<FitAddon | null>(null);

  React.useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    const xterm = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: "#1e1e1e",
        foreground: "#d4d4d4",
        cursor: "#d4d4d4",
        black: "#000000",
        red: "#cd3131",
        green: "#0dbc79",
        yellow: "#e5e510",
        blue: "#2472c8",
        magenta: "#bc3fbc",
        cyan: "#11a8cd",
        white: "#e5e5e5",
        brightBlack: "#666666",
        brightRed: "#f14c4c",
        brightGreen: "#23d18b",
        brightYellow: "#f5f543",
        brightBlue: "#3b8eea",
        brightMagenta: "#d670d6",
        brightCyan: "#29b8db",
        brightWhite: "#ffffff",
      },
    });

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = xterm;
    fitAddonRef.current = fitAddon;

    xterm.writeln("Terminal ready. Type commands below:");
    xterm.writeln("");

    let currentInput = "";

    const executeCommand = async (cmd: string) => {
      try {
        const command = Command.create("sh", ["-c", cmd]);
        
        command.stdout.on("data", (line) => {
          xterm.writeln(line);
        });
        
        command.stderr.on("data", (line) => {
          xterm.writeln(`\x1b[31m${line}\x1b[0m`);
        });

        const output = await command.execute();
        
        if (output.code !== 0 && !output.stdout && !output.stderr) {
          xterm.writeln(`\x1b[31mCommand failed with exit code ${output.code}\x1b[0m`);
        }
      } catch (error) {
        xterm.writeln(`\x1b[31mError: ${error}\x1b[0m`);
      }
      
      xterm.write("\r\n$ ");
    };

    xterm.onData((data) => {
      const code = data.charCodeAt(0);

      if (code === 13) {
        xterm.writeln("");
        if (currentInput.trim()) {
          executeCommand(currentInput.trim());
        } else {
          xterm.write("$ ");
        }
        currentInput = "";
      } else if (code === 127) {
        if (currentInput.length > 0) {
          currentInput = currentInput.slice(0, -1);
          xterm.write("\b \b");
        }
      } else if (code >= 32) {
        currentInput += data;
        xterm.write(data);
      }
    });

    xterm.write("$ ");

    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      xterm.dispose();
      xtermRef.current = null;
      fitAddonRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fitAddonRef.current?.fit();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full w-full bg-[#1e1e1e] p-2">
      <div ref={terminalRef} className="h-full w-full" />
    </div>
  );
}

