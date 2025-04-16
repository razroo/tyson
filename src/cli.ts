#!/usr/bin/env node

import { compileTyson, TysonOptions } from './index';
import * as path from 'path';
import * as fs from 'fs';

// Parse command line arguments
const args = process.argv.slice(2);
const options: TysonOptions = {
  inputFile: '',
  outputFile: '',
};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--input' || arg === '-i') {
    options.inputFile = args[++i];
  } else if (arg === '--output' || arg === '-o') {
    options.outputFile = args[++i];
  } else if (arg === '--interface' || arg === '-f') {
    options.interfaceFile = args[++i];
  } else if (arg === '--interface-name' || arg === '-n') {
    options.interfaceName = args[++i];
  } else if (arg === '--tsconfig' || arg === '-t') {
    options.tsConfigPath = args[++i];
  } else if (arg === '--debug' || arg === '-d') {
    process.env.DEBUG = 'true';
  } else if (arg === '--help' || arg === '-h') {
    printHelp();
    process.exit(0);
  } else if (!options.inputFile) {
    // If no explicit input flag, use the first argument as input file
    options.inputFile = arg;
  } else if (!options.outputFile) {
    // If no explicit output flag, use the second argument as output file
    options.outputFile = arg;
  }
}

// Validate options
if (!options.inputFile) {
  console.error('Error: Input file is required');
  printHelp();
  process.exit(1);
}

// If output file is not specified, use the input file name with .json extension
if (!options.outputFile) {
  const inputExt = path.extname(options.inputFile);
  const baseName = path.basename(options.inputFile, inputExt);
  options.outputFile = path.join(path.dirname(options.inputFile), `${baseName}.json`);
}

// Check if input file exists
if (!fs.existsSync(options.inputFile)) {
  console.error(`Error: Input file ${options.inputFile} does not exist`);
  process.exit(1);
}

// Compile the tyson file
try {
  compileTyson(options);
} catch (error: unknown) {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

// Print help message
function printHelp() {
  console.log(`
  tyson - TypeScript in JSON compiler

  Usage: tyson [options] [input-file] [output-file]

  Options:
    -i, --input <file>         Input .tyson file
    -o, --output <file>        Output .json file
    -f, --interface <file>     TypeScript interface file
    -n, --interface-name <n>   Interface name to validate against
    -t, --tsconfig <file>      Custom tsconfig.json file path
    -d, --debug                Enable debug output
    -h, --help                 Print this help message

  Examples:
    tyson test.tyson test.json
    tyson -i test.tyson -o test.json -f test.interface.ts -n TsonTest
    tyson -i test.tyson -o test.json -t ./tsconfig.custom.json
  `);
} 