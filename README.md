# tyson - Use Typescript in JSON

## Benefits
1. Re-use Typescript interfaces for JSON schemas.
2. Allows comments in JSON 
3. no need for key value to be a string 
4. Can use variables for JSON
5. Import all configs into a singular config

## Here's what I have in mind

```
// test.interface.ts
export interface TsonTest {
  title: string;
  position: number;
  type: string;
}
```

```
import ( TsonTest } from 'test.interface';

// test.tson or test.tyson (.tyson for all you jokesters out there)
{: TsonTest
  title: "sample title",
  position: 0,
  type: "sample type",
} 
```

compiles to 
```
/// test.json 
{
  "title": "sample title",
  "position": 0,
  "type": "sample type"
} 
```