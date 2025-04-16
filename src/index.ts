// initial implemetation 

// tyson.ts

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Options for the Tyson compiler
 */
export interface TysonOptions {
  inputFile: string;
  outputFile?: string;
  interfaceFile?: string;
  interfaceName?: string;
}

/**
 * Main class for parsing and compiling Tyson files
 */
export class TysonCompiler {
  private options: TysonOptions;
  private typeChecker: ts.TypeChecker | null = null;
  private program: ts.Program | null = null;

  constructor(options: TysonOptions) {
    this.options = options;
  }

  /**
   * Parse a .tyson file and return the parsed data
   */
  public parse(): Record<string, any> {
    const content = fs.readFileSync(this.options.inputFile, 'utf8');
    return this.parseContent(content);
  }

  /**
   * Parse tyson content string
   */
  private parseContent(content: string): Record<string, any> {
    // Extract interface name if present
    const interfaceMatch = content.match(/{\s*:\s*(\w+)/);
    const interfaceName = interfaceMatch ? interfaceMatch[1] : this.options.interfaceName;
    
    // Extract import statement if present
    const importMatch = content.match(/import\s+{\s*(\w+)\s*}\s+from\s+['"](.*)['"]/);
    const importedInterface = importMatch ? importMatch[1] : null;
    const interfaceFile = importMatch ? importMatch[2] : this.options.interfaceFile;

    if (interfaceName && !this.typeChecker && interfaceFile) {
      this.initTypeChecker([interfaceFile]);
    }

    // Remove interface declaration and imports
    let cleanedContent = content
      .replace(/import.*from.*['"].*['"];?\s*/g, '')
      .replace(/{\s*:\s*\w+/, '{');

    // Handle comments (both inline and full-line)
    cleanedContent = cleanedContent.replace(/\/\/.*$/gm, '');
    
    // Make sure all keys are properly quoted
    cleanedContent = this.quoteObjectKeys(cleanedContent);

    // Remove trailing commas which are not allowed in JSON
    cleanedContent = cleanedContent.replace(/,(\s*[}\]])/g, '$1');
    
    // Remove any extra whitespace
    cleanedContent = cleanedContent.trim();

    try {
      // Parse the JSON
      const result = JSON.parse(cleanedContent);
      
      // Validate against interface if specified
      if (interfaceName && this.typeChecker) {
        this.validateAgainstInterface(result, interfaceName);
      }
      
      return result;
    } catch (e: unknown) {
      if (process.env.DEBUG === 'true') {
        console.error("Failed to parse content:", cleanedContent);
      }
      
      // Provide more detailed error message with line information
      const errorMessage = e instanceof Error ? e.message : String(e);
      const match = errorMessage.match(/position\s+(\d+)/);
      
      if (match) {
        const position = parseInt(match[1], 10);
        const lines = content.substring(0, position).split('\n');
        const lineNumber = lines.length;
        const column = lines[lines.length - 1].length + 1;
        
        throw new Error(
          `Error parsing tyson content at line ${lineNumber}, column ${column}: ${errorMessage}`
        );
      }
      
      throw new Error(`Error parsing tyson content: ${errorMessage}`);
    }
  }

  /**
   * Compile a .tyson file to .json
   */
  public compile(): void {
    if (!this.options.outputFile) {
      throw new Error('Output file is required for compilation');
    }

    const result = this.parse();
    fs.writeFileSync(
      this.options.outputFile,
      JSON.stringify(result, null, 2),
      'utf8'
    );
    
    console.log(`Compiled ${this.options.inputFile} to ${this.options.outputFile}`);
  }

  /**
   * Initialize the TypeScript type checker with the given files
   */
  private initTypeChecker(files: string[]): void {
    this.program = ts.createProgram(files, {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
    });
    this.typeChecker = this.program.getTypeChecker();
  }

  /**
   * Validate the parsed data against a TypeScript interface
   */
  private validateAgainstInterface(data: any, interfaceName: string): void {
    // This is a placeholder for more sophisticated validation
    // In a complete implementation, we would use the TypeScript compiler API
    // to validate the data against the interface
    console.log(`Validating against interface: ${interfaceName}`);
  }

  /**
   * Quote object keys that aren't already quoted
   */
  private quoteObjectKeys(content: string): string {
    // More robust regex to quote unquoted keys
    // Match word characters at the start of a line or after whitespace/brackets/commas
    // followed by optional whitespace and a colon
    return content.replace(/(?<=(^|[{\s,]))\s*(\w+)\s*:/g, '"$2":');
  }
}

/**
 * Compile a tyson file to JSON
 */
export function compileTyson(options: TysonOptions): void {
  const compiler = new TysonCompiler(options);
  compiler.compile();
}

/**
 * Parse a tyson file and return the data
 */
export function parseTyson(options: TysonOptions): Record<string, any> {
  const compiler = new TysonCompiler(options);
  return compiler.parse();
}

// Export the interface for use in tests and examples
export interface TsonTest {
  title: string;
  position: number;
  type: string;
}
