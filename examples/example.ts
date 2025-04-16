import { compileTyson, parseTyson } from '../src/index';
import * as path from 'path';

// Get the path to the example files
const interfaceFile = path.resolve(__dirname, 'test.interface.ts');
const tysonFile = path.resolve(__dirname, 'test.tyson');
const jsonFile = path.resolve(__dirname, 'test.json');

console.log('Parsing tyson file...');
const data = parseTyson({
  inputFile: tysonFile,
  interfaceFile: interfaceFile,
  interfaceName: 'TsonTest'
});

console.log('Parsed data:', data);

console.log('Compiling tyson to JSON...');
compileTyson({
  inputFile: tysonFile,
  outputFile: jsonFile,
  interfaceFile: interfaceFile,
  interfaceName: 'TsonTest'
});

console.log('Done! Check the output at:', jsonFile); 