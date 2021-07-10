export interface UploadParams {
  url: string;
  fieldname: string;
  method: any;
  headers?: { [key: string]: any };
  meta?: { [key: string]: any }; // any extra data to forward to the FileBag.meta
}

export interface Task {
  id: string;
  file: File;
  progress: number;
  formattedSize: string;
  status: 'uploading' | 'uploaded' | 'failed';
  httpStatus: number | null;
  message: string;
  responseData: any;
  meta?: { [key: string]: any }; // any extra data forwarded from getUploadParams()
}

export type Uploader = [
  Task[] | [],
  {
    startUploadTask: (files: File[] | FileList) => void;
    retryUploadTask: (id: string) => void;
    stopUploadTask: (id: string) => void;
    clearUploadTasks: () => void;
  }
];
