# tyson - Use Typescript in JSON

Tyson allows you to use TypeScript interfaces for JSON with enhanced features:

## Benefits
1. Re-use Typescript interfaces for JSON schemas.
2. Allows comments in JSON 
3. No need for key values to be strings 
4. Can use variables for JSON
5. Import all configs into a singular config

## Installation

```bash
# Install globally
npm install -g tyson

# Or install locally in your project
npm install --save tyson
```

## Usage

### Define a TypeScript interface

```typescript
// test.interface.ts
export interface TsonTest {
  title: string;
  position: number;
  type: string;
}
```

### Create a tyson file

```typescript
// test.tyson or test.tson
import { TsonTest } from './test.interface';

// Comments are allowed!
{: TsonTest
  title: "sample title",
  position: 0,
  type: "sample type", // Inline comments work too
} 
```

### Compile to JSON

```bash
# CLI usage
tyson test.tyson test.json

# With options
tyson --input test.tyson --output test.json --interface test.interface.ts --interface-name TsonTest
```

### Programmatic Usage

```typescript
import { compileTyson, parseTyson } from 'tyson';

// Compile a tyson file to JSON
compileTyson({
  inputFile: 'test.tyson',
  outputFile: 'test.json',
  interfaceFile: 'test.interface.ts',
  interfaceName: 'TsonTest'
});

// Or parse a tyson file and get the data
const data = parseTyson({
  inputFile: 'test.tyson',
  interfaceFile: 'test.interface.ts',
  interfaceName: 'TsonTest'
});
```

### Result

The compiled JSON will look like:

```json
{
  "title": "sample title",
  "position": 0,
  "type": "sample type"
}
```

## Features

- **Type Checking**: Validates your JSON against TypeScript interfaces
- **Comments**: Include comments in your JSON files that won't appear in the output
- **Unquoted Keys**: No need to quote object keys
- **TypeScript Integration**: Seamlessly work with your existing TypeScript codebase

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.