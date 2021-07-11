# React File Hooks


React File Hooks is a hook simply for file upload


🖥️[Live Example](https://codesandbox.io/s/react-file-hooks-dbj71)

## Install

```bash
// npm
npm install @toranj/react-file-hooks

// or yarn
yarn add @toranj/react-file-hooks
```

## Usage

```typescript jsx
import React,{ useEffect} from 'react';
import { useUploader } from 'react-file-hooks';

const App = () => {

   const [uploadTasks, uploadTasksHelper] = useUploader({
          url:  'https://file.io?expires=1w',
          fieldname:  "file",
          method:  'post',
          headers: { 'Content-Type':  'multipart/form-data' } //optional
          multiple:false        // optional and default is true
   })

   const {  startUploadTask,  //  start a file or files uploading
            retryUploadTask,   //  retry a failed uploading task
            stopUploadTask,   //  remove uploading task
            clearUploadTasks   //  remove all tasks
        } = uploadTasksHelper

   const  handleChange = (e) => {
      startUploadTask(
          e.currentTarget.files,  // file or files that you want to upload
          // optional arg
          {'any-other-stuff': 'hello'}, // any data that you want to send beside uploading file to server
          // optional arg
          (task)=>{}); // callback with uploaded task as argument
   };

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <pre>{JSON.stringify(uploadTasks, null, 2)}</pre>
    </div>
  );
};
```

### Functions and parameters

`useUploader()` takes in an object of type `UploadParams` as an argument

```typescript jsx
export interface UploadParams {
     url: string;
     fieldname: string;
     method: 'put' | 'post' | 'patch' | string;
     headers?: { [key: string]: any };
     multiple?: boolean;
}
```


### Task Interface

```typescript jsx
export interface Task {
    id: string;
    file?: File;
    files?: File[];
    progress: number;  // 0 - 100
    formattedSize: string;
    status: 'uploading' | 'uploaded' | 'failed';
    httpStatus: number | null;
    responseData: any; // the response body from the server
    meta?: { [key: string]: any }; // any extra data 
}
```

## License

[MIT](http://vjpr.mit-license.org)

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg