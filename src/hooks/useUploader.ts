import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { formatFileSize } from '../utils';
import { UploadParams, Uploader, Task } from '../types';

const useUploader = ({
  url,
  fieldname,
  method,
  headers,
  multiple = true,
}: UploadParams): Uploader => {
  const [state, setState] = useState<Task[] | []>([]);
  const uploadTasks = useRef<Task[] | []>(state);

  const setUploadTask = (callback: Function) => {
    uploadTasks.current = callback(uploadTasks.current);
    setState(uploadTasks.current);
  };

  const updateTask = useCallback(
    (id: string, data: Partial<Task>) => {
      setUploadTask((odt: Task[]) => {
        return odt.map((el: Task) => {
          if (el.id === id) {
            return { ...el, ...data } as Task;
          }
          return el as Task;
        });
      });
    },
    [setUploadTask]
  );

  const uploadFile = useCallback(
    async ({ id, file, files, meta, callback }: Task) => {
      const defaultConfig = {
        onUploadProgress: ({ total, loaded }: ProgressEvent) => {
          const progress = Math.round((loaded / total) * 100);
          const status: Task['status'] = 'uploading';
          updateTask(id, { progress, status });
        },
        data: file,
      };
      try {
        const form = new FormData();

        for (let key in meta) {
          if (meta.hasOwnProperty(key)) {
            form.append(`${key}`, meta[key]);
          }
        }

        if (files) {
          for (let file of files) {
            form.append(`${fieldname}`, file);
          }
        } else if (file) {
          form.append(`${fieldname}`, file);
        }

        const res = await axios.request({
          ...defaultConfig,
          ...{ url, method, headers, data: form },
        });
        const status: Task['status'] = 'uploaded';
        updateTask(id, {
          status,
          responseData: res.data,
          httpStatus: res.status,
        });
        if (callback) {
          callback(uploadTasks.current.find((task: Task) => task.id === id));
        }
      } catch (e) {
        const status: Task['status'] = 'failed';
        updateTask(id, {
          status,
          httpStatus: e && e.response && e.response.status,
          responseData: e && e.response && e.response.data,
        });
        if (callback) {
          callback(uploadTasks.current.find((task: Task) => task.id === id));
        }
      }
    },
    [uploadTasks, updateTask]
  );

  const retryUploadTask = useCallback(
    (id: string) => {
      const shouldUpdateTask = uploadTasks.current.find(
        (task: Task) => task.id === id
      );
      if (shouldUpdateTask) {
        uploadFile(shouldUpdateTask);
      }
    },
    [uploadTasks, uploadFile]
  );

  const startUploadTask = useCallback(
    (
      acceptedFiles: File[] | FileList,
      meta?: { [key: string]: any } | Function,
      callback?: Function
    ) => {
      // return if null or undefined
      if (!acceptedFiles) {
        return;
      }
      if (typeof meta === 'function') {
        callback = meta;
        meta = undefined;
      }
      const fileList = Array.from(acceptedFiles); // converts to array if FileList
      let arr: Task[] | [] = [];

      if (multiple) {
        arr = fileList.map((file: File) => {
          return {
            id: uuidv4(),
            file,
            progress: 0,
            status: 'uploading',
            formattedSize: formatFileSize(file.size),
            meta,
            callback,
          } as Task;
        });
      } else {
        let filesSize: number = 0;
        for (const file of fileList) {
          filesSize = filesSize + file.size;
        }

        arr = [
          {
            id: uuidv4(),
            files: fileList,
            progress: 0,
            status: 'uploading',
            formattedSize: formatFileSize(filesSize),
            meta,
            callback,
          } as Task,
        ];
      }

      setUploadTask((odt: Task[]) => [...odt, ...arr]);
      arr.map((task: Task) => uploadFile(task));
    },
    [uploadFile, setUploadTask]
  );

  const stopUploadTask = useCallback(
    (id: string) => {
      setUploadTask((odt: Task[]) => odt.filter((el: Task) => el.id !== id));
    },
    [setUploadTask]
  );

  const clearUploadTasks = useCallback(() => {
    setUploadTask(() => []);
  }, [setUploadTask]);

  return [
    state,
    { startUploadTask, retryUploadTask, stopUploadTask, clearUploadTasks },
  ];
};

export default useUploader;
