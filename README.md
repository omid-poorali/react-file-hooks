# React File Hooks

[![NPM Version][npm-image]][npm-url]
[![Github License][license-image]][license-url]

React File Hooks is a hook simply for file upload
It can be used with a simple `<input type="file"/>`

🖥️[Live Example](https://codesandbox.io/s/react-file-hooks-ygi10)

## Installation

```bash
npm install @toranj/react-file-hooks axios
```

or

```bash
yarn add @toranj/react-file-hooks axios
```

## Usage

### `useUploader`

```jsx
import * as React from 'react';
import { useUploader } from '@toranj/react-file-hooks';

type TriggerProps = {
  styles?: {
    root?: React.CSSProperties,
    button?: React.CSSProperties
  };
  name?: string;
  onClick?: (taskId: string) => void
}

const Trigger = (props: TriggerProps) => {

  const { name, styles, onClick } = props;
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div style={styles?.root}>
      <button
        style={styles?.button}
        onClick={() => {
          if (onClick) onClick(inputRef.current?.value ?? "taskId")
        }}
      >
        {name}
      </button>
      <input
        type="text"
        placeholder='taskId'
        ref={inputRef}
      />
    </div>
  )
}


export default () => {

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [tasks, handler] = useUploader({
    url: "https://file.io?expires=1w",
    fieldname: "file",
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    // separately:true  if you want to create seperate task for each file
  });

  function handleChange(e: any) {
    handler.start(
      e.currentTarget.files,
      // {
      //   key1: "value1",      
      //   key2: "value2"       
      // }
    );
  }


  const styles = {
    mx: { marginRight: 5, marginLeft: 5 },
    mt: { marginTop: 5 }
  }

  return (
    <div>
      <pre>
        {JSON.stringify(tasks, null, 2)}
      </pre>

      <input
        multiple
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
        onChange={handleChange}
      />
      <button
        style={styles.mx}
        onClick={() => inputRef.current?.click()}
      >
        upload
      </button>

      <Trigger
        name="stop"
        styles={{
          root: styles.mt,
          button: styles.mx
        }}
        onClick={(taskId: string) => handler.stop(taskId)}
      />
      <Trigger
        name="remove"
        styles={{
          root: styles.mt,
          button: styles.mx
        }}
        onClick={(taskId: string) => handler.remove(taskId)}
      />
      <Trigger
        name="retry"
        styles={{
          root: styles.mt,
          button: styles.mx
        }}
        onClick={(taskId: string) => handler.retry(taskId)}
      />
    </div>
  );
};

```

## License
MIT

[npm-image]: https://img.shields.io/npm/v/@toranj/react-file-hooks
[npm-url]: https://www.npmjs.com/package/@toranj/react-file-hooks
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://raw.githubusercontent.com/toranj-org/react-file-hooks/main/LICENSE