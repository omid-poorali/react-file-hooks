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
import * as React from "react";
import { useUploader } from "@toranj/react-file-hooks";

export default () => {
  const stopId = React.useRef(null);
  const removeId = React.useRef(null);
  const retryId = React.useRef(null);
  const inputRef = React.useRef(null);

  const [uploadTasks, uploadTasksHelper] = useUploader({
    url: "https://file.io?expires=1w",
    fieldname: "file",
    method: "post",
    headers: { "Content-Type": "multipart/form-data" }
    // separately:true  if you want to create seperate task for each file
  });

  function handleChange(e) {
    uploadTasksHelper.start(
      e.currentTarget.files
      // {
      //   key1: "value1",
      //   key2: "value2"
      // }
    );
  }

  return (
    <div>
      <pre>{JSON.stringify(uploadTasks, null, 2)}</pre>
      <input
        multiple
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
        onChange={handleChange}
      />
      <button
        style={{ marginRight: 5, marginLeft: 5 }}
        onClick={() => inputRef.current?.click()}
      >
        upload
      </button>
      <div style={{ marginTop: 5 }}>
        <button
          style={{ marginRight: 5, marginLeft: 5 }}
          onClick={() =>
            uploadTasksHelper.stop(stopId.current?.value ?? "taskId")
          }
        >
          stop
        </button>
        <input placeholder="taskId" ref={stopId} type="text" />
      </div>
      <div style={{ marginTop: 5 }}>
        <button
          style={{ marginRight: 5, marginLeft: 5 }}
          onClick={() =>
            uploadTasksHelper.remove(removeId.current?.value ?? "taskId")
          }
        >
          remove
        </button>
        <input placeholder="taskId" ref={removeId} type="text" />
      </div>
      <div style={{ marginTop: 5 }}>
        <button
          style={{ marginRight: 5, marginLeft: 5 }}
          onClick={() =>
            uploadTasksHelper.retry(retryId.current?.value ?? "taskId")
          }
        >
          retry
        </button>
        <input placeholder="taskId" ref={retryId} type="text" />
      </div>
    </div>
  );
};

```

[npm-image]: https://img.shields.io/npm/v/@toranj/react-file-hooks
[npm-url]: https://www.npmjs.com/package/@toranj/react-file-hooks
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://raw.githubusercontent.com/toranj-org/react-file-hooks/main/LICENSE