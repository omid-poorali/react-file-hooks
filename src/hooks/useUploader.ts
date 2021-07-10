import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { formatFileSize } from '../utils';
import { UploadParams, Uploader, Task } from '../types';

const useUploader = ({
  url,
  fieldname,
  method,
  headers,
  meta,
}: UploadParams): Uploader => {
  const [uploadTasks, setUploadTask] = useState<Task[] | []>([]);

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
    async (id: string, file: File) => {
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
        form.append(`${fieldname}`, file);
        const res = await axios.request({
          ...defaultConfig,
          ...{ url, method, headers, data: form },
        });
        const status: Task['status'] = 'uploaded';
        updateTask(id, {
          responseData: res.data,
          status,
          httpStatus: res.status,
          meta,
        });
      } catch (e) {
        const status: Task['status'] = 'failed';
        updateTask(id, {
          status,
          httpStatus: e && e.response && e.response.status,
          responseData: e && e.response && e.response.data,
        });
      }
    },
    [updateTask]
  );

  const retryUploadTask = useCallback(
    (id: string) => {
      const shouldUpdateTask = uploadTasks.find(el => el.id === id);
      if (shouldUpdateTask) {
        uploadFile(id, shouldUpdateTask.file);
      }
    },
    [uploadTasks, uploadFile]
  );

  const startUploadTask = useCallback(
    (acceptedFiles: File[] | FileList) => {
      // return if null or undefined
      if (!acceptedFiles) {
        return;
      }
      const fileList = Array.from(acceptedFiles); // converts to array if FileList
      const arr: Task[] = fileList.map((file: File) => {
        return {
          id: uuidv4(),
          file,
          progress: 0,
          status: 'uploading',
          formattedSize: formatFileSize(file.size),
        } as Task;
      });

      setUploadTask(odt => [...odt, ...arr]);
      arr.map(({ id, file }) => uploadFile(id, file));
    },
    [setUploadTask]
  );

  const stopUploadTask = useCallback(
    (id: string) => {
      setUploadTask(odt => odt.filter((el: Task) => el.id !== id));
    },
    [setUploadTask]
  );

  const clearUploadTasks = useCallback(() => {
    setUploadTask(() => []);
  }, [setUploadTask]);

  return [
    uploadTasks,
    { startUploadTask, retryUploadTask, stopUploadTask, clearUploadTasks },
  ];
};

export default useUploader;
