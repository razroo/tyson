// initial implemetation 

// tyson.ts

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

interface TysonOptions {
  inputFile: string;
  outputFile: string;
}

function compileTyson(options: TysonOptions): void {
  const { inputFile, outputFile } = options;

  // Read the input file
  const inputContent = fs.readFileSync(inputFile, 'utf-8');

  // Create a TypeScript program
  const program = ts.createProgram([inputFile], {
    target: ts.ScriptTarget.ES2015,
    module: ts.ModuleKind.CommonJS,
  });

  // Get the TypeChecker
  const checker = program.getTypeChecker();

  // Parse the input file
  const sourceFile = program.getSourceFile(inputFile);
  if (!sourceFile) {
    throw new Error(`Could not find source file: ${inputFile}`);
  }

  // Find the object literal expression
  let objectLiteral: ts.ObjectLiteralExpression | undefined;
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isObjectLiteralExpression(node)) {
      objectLiteral = node;
    }
  });

  if (!objectLiteral) {
    throw new Error('No object literal found in the input file');
  }

  // Convert the object literal to a plain JavaScript object
  const result: Record<string, any> = {};
  objectLiteral.properties.forEach((prop) => {
    if (ts.isPropertyAssignment(prop)) {
      const name = prop.name.getText(sourceFile);
      const value = evaluateNode(prop.initializer, checker);
      result[name] = value;
    }
  });

  // Write the result to the output file
  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
  console.log(`TYSON compiled successfully. Output written to ${outputFile}`);
}

function evaluateNode(node: ts.Node, checker: ts.TypeChecker): any {
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) {
    return node.text;
  } else if (ts.isIdentifier(node)) {
    const symbol = checker.getSymbolAtLocation(node);
    if (symbol && symbol.valueDeclaration) {
      return evaluateNode(symbol.valueDeclaration, checker);
    }
  } else if (ts.isVariableDeclaration(node) && node.initializer) {
    return evaluateNode(node.initializer, checker);
  }
  // Add more cases as needed for other types of nodes
  return undefined;
}

// Usage
const options: TysonOptions = {
  inputFile: 'test.tyson',
  outputFile: 'test.json',
};

compileTyson(options);

// test.interface.ts
export interface TsonTest {
  title: string;
  position: number;
  type: string;
}

// test.tyson
import { TsonTest } from './test.interface';

const config: TsonTest = {
  title: "sample title",
  position: 0,
  type: "sample type",
};

export default config;
