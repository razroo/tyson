# tyson
Typescript equivalent for JSON

![tyson](tyson-twitter.png)

## Here's what I have in mind

```
interface TsonTest {
  title: string;
  position: number;
  type: string;
}
// tson
{: TsonTest
  title: "sample title",
  position: 0,
  type: "sample type",
} 
```

compiles to 
```
/// json 
{
  "title": "sample title",
  "position": 0,
  "type": "sample type",
} 
```
