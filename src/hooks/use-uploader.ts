import * as React from 'react';
import * as Utils from '../utils';
import axios, { AxiosError } from 'axios';
import { Failed, Stopped, Task, Uploaded, Uploader, Uploading, UploadParams } from '../types';

type AbortMap = {
  [key: string]: AbortController
}

export function useUploader<Result = any>({
  url, fieldname, method, headers, separately = false
}: UploadParams): Uploader<Result> {

  const mounted = React.useRef<boolean>(false);
  const abortMap = React.useRef<AbortMap>({});
  const [tasks, setTasks] = React.useState<Task<Result>[]>([]);


  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    }
  }, [mounted])

  const addTask = (newTask: Task<Result>) => {
    if (!mounted.current) return;
    setTasks(prevData => [...prevData, newTask]);
  }

  const updateTask = (id: string, newData: Partial<Task<Result>>) => {
    if (!mounted.current) return;
    setTasks(tasks => tasks.map(t => {
      if (t.id === id) {
        return { ...t, ...newData };
      }
      return t;
    }));
  }


  const removeTask = (id: string) => {
    if (!mounted.current) return;
    setTasks((prevData: Task<Result>[]) => prevData.filter((task: Task<Result>) => task.id !== id));
  }

  const setAbort = (id: string, controller: AbortController): void => {
    abortMap.current[id] = controller;
  }

  const getAbort = (id: string): AbortController => {
    return abortMap.current[id];
  }

  const uploadFile = async ({ id, source, meta }: Task<Result>) => {

    const controller = new AbortController();
    setAbort(id, controller);
    const defaultConfig = {
      signal: controller.signal,
      onUploadProgress: ({ total, loaded }: ProgressEvent) => {
        const progress = Math.round((loaded / total) * 100);
        updateTask(id, {
          progress
        });
      }
    };
    try {
      const form = new FormData();

      for (let key in meta) {
        if (meta.hasOwnProperty(key)) {
          form.append(`${key}`, meta[key]);
        }
      }

      if (Array.isArray(source)) {
        for (let file of source) {
          form.append(`${fieldname}`, file);
        }
      }
      else form.append(`${fieldname}`, source);


      const res = await axios.request<Result>({
        ...defaultConfig,
        ...{ url, method, headers, data: form },
      })

      updateTask(id, {
        status: Uploaded, result: {
          httpStatus: res.status,
          responseData: res.data
        }
      });

    } catch (error) {
      const { response }: any = error;
      if (response) {
        const errorResult = axios.isAxiosError(error) ? error as AxiosError<Result> : error as Error;

        updateTask(id, {
          status: Failed, result: {
            httpStatus: response?.status,
            responseData: response?.data,
            error: errorResult
          }
        });
      }
    }
  }


  const start = (
    source: File | File[] | FileList,
    meta?: { [key: string]: any },
  ) => {
    // return if null or undefined
    if (!source) return;

    let fileList: File[] = [];
    if (source instanceof File) {
      fileList.push(source);
    }
    if (source instanceof FileList) {
      fileList = Array.from(source); // converts to array if FileList
    }

    if (!fileList.length) return;

    if (separately) {
      fileList.map((file: File) => {
        const newTask: Task<Result> = {
          id: Utils.nextId(),
          source: file,
          progress: 0,
          status: Uploading,
          formattedSize: Utils.formatFileSize(file.size),
          size: file.size,
          meta
        }
        addTask(newTask);
        uploadFile(newTask)
      })
    }
    else {

      let filesSize: number = 0;
      for (const file of fileList) {
        filesSize = filesSize + file.size;
      }

      const newTask: Task<Result> = {
        id: Utils.nextId(),
        source: fileList,
        progress: 0,
        status: Uploading,
        formattedSize: Utils.formatFileSize(filesSize),
        size: filesSize,
        meta
      }
      addTask(newTask);
      uploadFile(newTask)
    }

  }

  const retry = (id: string) => {
    const targetTask = tasks.find((task: Task<Result>) => task.id.includes(id));
    if (targetTask) {
      updateTask(id, {
        status: Uploading
      });
      uploadFile(targetTask);
    }
  }

  const remove = (id: string) => {
    removeTask(id);
    const controller = getAbort(id);
    if (controller) controller.abort()
  }

  const stop = (id: string) => {
    const targetTask = tasks.find((task: Task<Result>) => task.id.includes(id));
    if (targetTask) {
      updateTask(id, {
        status: Stopped
      });
    }
    const controller = getAbort(id);
    if (controller) controller.abort()
  }

  return [tasks, { start, stop, retry, remove }];
};