# React File Hooks

[![NPM Version][npm-image]][npm-url]
[![Linux Build][travis-image]][travis-url]
[![Github License][license-image]][license-url]

React File Hooks is a hook simply for file upload
It can be used with a simple `<input type="file"/>`


🖥️[Live Example](https://codesandbox.io/s/react-file-hooks-ygi10)

## Install

```bash
// npm
npm install @toranj/react-file-hooks axios

// or yarn
yarn add @toranj/react-file-hooks axios
```

## Usage

```typescript jsx
import React from "react";
import { useUploader } from "@toranj/react-file-hooks";

const App = () => {
  const inputRef = React.useRef(null);
  const [id, setId] = React.useState("");

  const [uploadTasks, uploadTasksHelper] = useUploader({
    url: "/api/upload",
    fieldname: "file",
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    multiple: false
  });

  function handleChange(e) {
    uploadTasksHelper.startUploadTask(e.currentTarget.files);
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
      <div>
        <button
          style={{ marginRight: 5, marginLeft: 5 }}
          onClick={() => inputRef.current?.click()}
        >
          startUploadTask
        </button>
        <button
          style={{ marginRight: 5, marginLeft: 5 }}
          onClick={() => uploadTasksHelper.clearUploadTasks()}
        >
          clearUploadTasks
        </button>
      </div>

      <div style={{ marginRight: 5, marginLeft: 5, marginTop: 15 }}>
        <button onClick={() => uploadTasksHelper.removeUploadTask(id)}>
          removeUploadTask
        </button>
        <input
          value={id}
          onChange={(e) => setId(() => e.target.value)}
          type="text"
        />
      </div>

      <div style={{ marginRight: 5, marginLeft: 5, marginTop: 15 }}>
        <button onClick={() => uploadTasksHelper.retryUploadTask(id)}>
          retryUploadTask
        </button>
        <input
          value={id}
          onChange={(e) => setId(() => e.target.value)}
          type="text"
        />
      </div>
    </div>
  );
};
```

## License
MIT

[npm-image]: https://img.shields.io/npm/v/@toranj/react-file-hooks
[npm-url]: https://www.npmjs.com/package/@toranj/react-file-hooks
[travis-image]: https://api.travis-ci.com/toranj-org/react-file-hooks.svg?branch=main
[travis-url]: https://app.travis-ci.com/github/toranj-org/react-file-hooks
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://raw.githubusercontent.com/toranj-org/react-file-hooks/main/LICENSE
