import { AxiosError, AxiosRequestHeaders, Method } from "axios";

export const Uploading = "uploading";
export const Stopped = "stopped";
export const Uploaded = "uploaded";
export const Failed = "failed";
export type UploadStatus =  typeof Uploading | typeof Stopped | typeof Uploaded | typeof Failed;

export type UploadParams = {
  url: any;
  fieldname: any;
  method: Method
  headers?: AxiosRequestHeaders,
  separately?:boolean;
}

export type TaskResult<A = any> = {
  httpStatus: number | undefined;
  responseData: A | undefined;
  error?: AxiosError<A> | Error | undefined;
}

export type Task<A = any> = {
  id: string;
  source: File | File[];
  progress: number;
  status: UploadStatus;
  formattedSize: string;
  size: number;
  meta?: { [key: string]: any };
  result?: TaskResult<A>;
}

type Start = {
  (source: File | File[] | FileList): void;
  (source: File | File[] | FileList, meta?: { [key: string]: any }): void;
}

export type Uploader<Result> = [
  Task<Result>[],
  {
    start: Start;
    stop: (id: string) => void;
    retry: (id: string) => void;
    remove: (id: string) => void;
  }
];
