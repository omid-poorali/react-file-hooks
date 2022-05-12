import * as React from 'react';
import { useUploader } from '@toranj/react-file-hooks';

export default () => {

  const stopId = React.useRef<HTMLInputElement>(null);
  const removeId = React.useRef<HTMLInputElement>(null);
  const retryId = React.useRef<HTMLInputElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [uploadTasks, uploadTasksHelper] = useUploader({
    url: "https://file.io?expires=1w",
    fieldname: "file",
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    // separately:true  if you want to create seperate task for each file
  });

  function handleChange(e: any) {
    uploadTasksHelper.start(
      e.currentTarget.files,
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
          onClick={() => uploadTasksHelper.stop(stopId.current?.value ?? "taskId")}
        >
          stop
        </button>
        <input
          placeholder='taskId'
          ref={stopId}
          type="text"
        />
      </div>
      <div style={{ marginTop: 5 }}>
        <button
          style={{ marginRight: 5, marginLeft: 5 }}
          onClick={() => uploadTasksHelper.remove(removeId.current?.value ?? "taskId")}
        >
          remove
        </button>
        <input
          placeholder='taskId'
          ref={removeId}
          type="text"
        />
      </div>
      <div style={{ marginTop: 5 }}>
        <button
          style={{ marginRight: 5, marginLeft: 5 }}
          onClick={() => uploadTasksHelper.retry(retryId.current?.value ?? "taskId")}
        >
          retry
        </button>
        <input
          placeholder='taskId'
          ref={retryId}
          type="text"
        />
      </div>
    </div>
  );
};