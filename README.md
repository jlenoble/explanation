# explanation
A fancy logging tool

## Usage

```js
import {info, warn, error} from 'explanation';

info({
  message: "Doing this",
  explain: "We want that"
});

warn({ // explain can be an arbitary array of messages
  message: "Something has occurred",
  explain: [ "You should have done this",
  "and you should have done this",
  "and this" ]
});

error({ // An instance explanation can be a 2-array
  message: "An error has occurred",
  explain: [ "You have called : ",
  data ] // Problem with this data
});

error({ // Explanations types can be mixed
  message: "An error has occurred",
  explain: [ ["You have called : ",
  data],
  "Dummy you!",
  ["And you have also called",
  data2],
  "That's even worse :(!" ]
});
```

Here is the output when the above examples were tested:

![alt text](https://cloud.githubusercontent.com/assets/20752619/20630961/7a979678-b334-11e6-966b-729f4edb806e.png)

```info``` and ```warn``` don't throw errors unless you pass an Error Type as argument. ```error``` always throws an error, either the one passed as argument or a new one generated from the message passed.

## License

explanation is [MIT licensed](./LICENSE).

© 2016 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
