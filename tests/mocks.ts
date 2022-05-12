import { AxiosRequestConfig } from 'axios';

export const successful = async ({
  onUploadProgress,
}: AxiosRequestConfig) => {
  if (onUploadProgress) {
    const total = 100;
    await delay(500);
    onUploadProgress({ total, loaded: 25 });
    await delay(500);
    onUploadProgress({ total, loaded: 50 });
    await delay(500);
    onUploadProgress({ total, loaded: 100 });
  }
  return Promise.resolve({
    status: 200,
    data: { uploadedUrl: 'http://dummy.com/image.jpg' },
  });
};

export const failed = async () => {
  return Promise.reject({
    response: { status: 401, data: { message: 'unauthorized' } },
  });
};


function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}