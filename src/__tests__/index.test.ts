import { TysonCompiler, parseTyson, TsonTest } from '../index';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('TysonCompiler', () => {
  let tempDir: string;
  let interfaceFilePath: string;
  let tysonFilePath: string;
  let jsonFilePath: string;

  beforeEach(() => {
    // Create a temporary directory for test files
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tyson-test-'));
    
    // Create test interface file
    interfaceFilePath = path.join(tempDir, 'test.interface.ts');
    fs.writeFileSync(interfaceFilePath, `
      export interface TsonTest {
        title: string;
        position: number;
        type: string;
      }
    `);
    
    // Create test tyson file
    tysonFilePath = path.join(tempDir, 'test.tyson');
    fs.writeFileSync(tysonFilePath, `
      import { TsonTest } from './test.interface';
      
      {: TsonTest
        title: "sample title",
        position: 0,
        type: "sample type",
      }
    `);
    
    // Set output JSON path
    jsonFilePath = path.join(tempDir, 'test.json');
  });

  afterEach(() => {
    // Clean up temporary files
    try {
      fs.unlinkSync(interfaceFilePath);
      fs.unlinkSync(tysonFilePath);
      if (fs.existsSync(jsonFilePath)) {
        fs.unlinkSync(jsonFilePath);
      }
      // Use recursive option to handle non-empty directories
      fs.rmdirSync(tempDir, { recursive: true });
    } catch (error) {
      console.error('Error cleaning up test files:', error);
    }
  });

  test('should parse tyson file correctly', () => {
    const compiler = new TysonCompiler({
      inputFile: tysonFilePath,
      interfaceFile: interfaceFilePath,
      interfaceName: 'TsonTest'
    });
    
    const result = compiler.parse();
    
    expect(result).toEqual({
      title: 'sample title',
      position: 0,
      type: 'sample type'
    });
  });

  test('should compile tyson to json', () => {
    const compiler = new TysonCompiler({
      inputFile: tysonFilePath,
      outputFile: jsonFilePath,
      interfaceFile: interfaceFilePath,
      interfaceName: 'TsonTest'
    });
    
    compiler.compile();
    
    expect(fs.existsSync(jsonFilePath)).toBe(true);
    
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
    const parsedJson = JSON.parse(jsonContent);
    
    expect(parsedJson).toEqual({
      title: 'sample title',
      position: 0,
      type: 'sample type'
    });
  });

  test('should handle comments in tyson files', () => {
    const tysonWithComments = path.join(tempDir, 'with-comments.tyson');
    fs.writeFileSync(tysonWithComments, `
      // This is a comment
      {: TsonTest
        title: "sample title", // This is an inline comment
        position: 0,
        // This is another comment
        type: "sample type",
      }
    `);
    
    const result = parseTyson({
      inputFile: tysonWithComments,
      interfaceName: 'TsonTest'
    });
    
    expect(result).toEqual({
      title: 'sample title',
      position: 0,
      type: 'sample type'
    });
  });

  test('should support unquoted keys', () => {
    const tysonWithUnquotedKeys = path.join(tempDir, 'unquoted-keys.tyson');
    fs.writeFileSync(tysonWithUnquotedKeys, `
      {: TsonTest
        title: "sample title",
        position: 0,
        type: "sample type",
      }
    `);
    
    const result = parseTyson({
      inputFile: tysonWithUnquotedKeys,
      interfaceName: 'TsonTest'
    });
    
    expect(result).toEqual({
      title: 'sample title',
      position: 0,
      type: 'sample type'
    });
  });
});
