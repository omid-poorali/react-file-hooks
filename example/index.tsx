import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useUploader } from '../.';

const App = () => {

  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [id, setId] = React.useState("")

  const [uploadTasks, uploadTasksHelper] = useUploader({
    url: 'http://localhost:3001/api/upload',
    fieldname: "file",
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  const handleChange = (e) => {
    uploadTasksHelper.startUploadTask(e.currentTarget.files);
  };

  return (
    <div>
      <pre>
        {JSON.stringify(uploadTasks, null, ' ')}
      </pre>
      <input
        multiple
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
        onChange={handleChange}
      />
      <div>
        <button style={{ marginRight: 5, marginLeft: 5 }} onClick={() => inputRef.current?.click()}>startUploadTask</button>
        <button style={{ marginRight: 5, marginLeft: 5 }} onClick={() => uploadTasksHelper.clearUploadTasks()}>clearUploadTasks</button>

      </div>

      <div style={{ marginRight: 5, marginLeft: 5, marginTop: 15 }}>
        <button onClick={() => uploadTasksHelper.removeUploadTask(id)}>removeUploadTask</button>
        <input value={id} onChange={e => setId(() => e.target.value)} type="text" />
      </div>

      <div style={{ marginRight: 5, marginLeft: 5, marginTop: 15 }}>
        <button onClick={() => uploadTasksHelper.retryUploadTask(id)}>retryUploadTask</button>
        <input value={id} onChange={e => setId(() => e.target.value)} type="text" />
      </div>

    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));