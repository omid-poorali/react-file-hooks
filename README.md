# React File Hooks

React File Hooks is a hook simply for file upload using axios

🖥️[Live Example](https://codesandbox.io/s/react-file-hooks-ngxy4)

## Install
```bash
// npm
npm install @toranj/react-file-hooks axios

// or yarn
yarn add @toranj/react-file-hooks axios
```

## Usage

```typescript jsx
import  React,{ useEffect} from  'react';
import { useUploader } from  'react-file-hooks';

const  App = () => {

  const [uploadTasks, uploadTasksHelper] = useUploader({
    url:  'https://file.io?expires=1w',
    fieldname:  "file",
    method:  'post',
    headers: { 'Content-Type':  'multipart/form-data' } //optional
    multiple:false  // optional and default is true
  })

  const { startUploadTask,
          retryUploadTask, // (id: string) => void
          removeUploadTask, // (id: string) => void
          clearUploadTasks,
         } = uploadTasksHelper

// explain startUploadTask arguments here

   const  handleChange = (e) => {
      startUploadTask(e.currentTarget.files, // file or files that you want to upload
      {'any-other-stuff':  'hello'}, // Optional data that you want to send beside uploading file
      (task)=>console.log(task)); // call whenever uploading task failed or be success
   }

   return (
         <div>
            <input  type="file"  onChange={handleChange} />
            <pre>{JSON.stringify(uploadTasks, null, 2)}</pre>
         </div>
   );
};
```

### Functions and parameters

`useUploader()` takes  object of type `UploadParams` as an argument

```typescript jsx
export  interface  UploadParams {
    url: string;
    fieldname: string;
    method: 'put' | 'post' | 'patch' | string;
    headers?: { [key: string]: any };
    multiple?: boolean;
}
```
## License
[MIT](http://vjpr.mit-license.org)

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg