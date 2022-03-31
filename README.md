# tyson
Typescript equivalent for JSON

![tyson](tyson-twitter.png)

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
  "type": "sample type",
} 
```
