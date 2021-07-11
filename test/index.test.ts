import { useUploader } from '../src';
import { renderHook, act } from '@testing-library/react-hooks';
import axios from 'axios';
import {
  passByOnlyHavingMeta,
  failedUpload,
  successfulUpload,
  successfulUploadWithoutProgress,
} from './mocks';
import { Task } from '../src/types';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

it('returns correct object', async () => {
  // init
  const { result, waitForNextUpdate } = renderHook(() =>
    useUploader({
      url: 'http://dummy.com/api/upload',
      fieldname: 'file',
      method: 'post',
    })
  );

  expect(result.current[0]).toEqual([]);

  expect(Object.keys(result.current[1])).toEqual([
    'startUploadTask',
    'retryUploadTask',
    'stopUploadTask',
    'clearUploadTasks',
  ]);

  mockAxios.request.mockImplementationOnce(successfulUpload);
  // upload
  act(() => {
    result.current[1].startUploadTask([file]);
  });

  expect(result.current[0][0].status).toEqual('uploading');

  await waitForNextUpdate();

  expect(result.current[0][0].file).toEqual(file);
  expect(result.current[0][0].formattedSize).toEqual('12 B');
  expect(result.current[0][0].progress).toEqual(25);
  expect(result.current[0][0].status).toEqual('uploading');

  await waitForNextUpdate();

  expect(result.current[0][0].file).toEqual(file);
  expect(result.current[0][0].formattedSize).toEqual('12 B');
  expect(result.current[0][0].progress).toEqual(50);
  expect(result.current[0][0].status).toEqual('uploading');

  await waitForNextUpdate();

  expect(result.current[0][0].file).toEqual(file);
  expect(result.current[0][0].formattedSize).toEqual('12 B');
  expect(result.current[0][0].progress).toEqual(100);
  expect(result.current[0][0].status).toEqual('uploaded');
  expect(result.current[0][0].responseData).toEqual({
    uploadedUrl: 'http://dummy.com/image.jpg',
  });

  // clear
  act(() => {
    result.current[1].clearUploadTasks();
  });

  expect(result.current[0]).toEqual([]);

  // startUploadTask with null
  act(() => {
    result.current[1].startUploadTask(null as any);
  });

  expect(result.current[0]).toEqual([]);
});

it('handles upload failure', async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    useUploader({
      url: 'http://dummy.com/api/upload',
      fieldname: 'file',
      method: 'post',
    })
  );

  expect(result.current[0]).toEqual([]);

  expect(Object.keys(result.current[1])).toEqual([
    'startUploadTask',
    'retryUploadTask',
    'stopUploadTask',
    'clearUploadTasks',
  ]);

  mockAxios.request.mockImplementationOnce(failedUpload);

  act(() => {
    result.current[1].startUploadTask([file]);
  });

  await waitForNextUpdate();

  expect(result.current[0][0].file).toEqual(file);
  expect(result.current[0][0].formattedSize).toEqual('12 B');
  expect(result.current[0][0].progress).toEqual(0);
  expect(result.current[0][0].status).toEqual('failed');
  expect(result.current[0][0].httpStatus).toEqual(403);
  expect(result.current[0][0].responseData).toEqual({
    message: 'unauthorized',
  });

  mockAxios.request.mockImplementationOnce(successfulUploadWithoutProgress);
  // retry
  act(() => {
    result.current[1].retryUploadTask(result.current[0][0].id);
  });

  await waitForNextUpdate();

  expect(result.current[0][0].file).toEqual(file);
  expect(result.current[0][0].formattedSize).toEqual('12 B');
  expect(result.current[0][0].progress).toEqual(100);
  expect(result.current[0][0].status).toEqual('uploaded');
  expect(result.current[0][0].httpStatus).toEqual(200);
  expect(result.current[0][0].responseData).toEqual({
    uploadedUrl: 'http://dummy.com/image.jpg',
  });

  // remove
  act(() => {
    result.current[1].stopUploadTask(result.current[0][0].id);
  });

  expect(result.current[0].length).toEqual(0);
});

it('fail because having no meta', async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    useUploader({
      url: 'http://dummy.com/api/upload',
      fieldname: 'file',
      method: 'post',
    })
  );

  expect(result.current[0]).toEqual([]);

  expect(Object.keys(result.current[1])).toEqual([
    'startUploadTask',
    'retryUploadTask',
    'stopUploadTask',
    'clearUploadTasks',
  ]);

  mockAxios.request.mockImplementationOnce(passByOnlyHavingMeta);

  act(() => {
    result.current[1].startUploadTask([file]);
  });

  await waitForNextUpdate();

  expect(result.current[0][0].file).toEqual(file);
  expect(result.current[0][0].formattedSize).toEqual('12 B');
  expect(result.current[0][0].progress).toEqual(0);
  expect(result.current[0][0].status).toEqual('failed');
  expect(result.current[0][0].httpStatus).toEqual(400);
  expect(result.current[0][0].responseData).toEqual({
    message: 'forbidden',
  });
});

it('upload only if having key as meta', async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    useUploader({
      url: 'http://dummy.com/api/upload',
      fieldname: 'file',
      method: 'post',
    })
  );

  expect(result.current[0]).toEqual([]);

  expect(Object.keys(result.current[1])).toEqual([
    'startUploadTask',
    'retryUploadTask',
    'stopUploadTask',
    'clearUploadTasks',
  ]);

  mockAxios.request.mockImplementationOnce(passByOnlyHavingMeta);

  act(() => {
    result.current[1].startUploadTask([file], { key: 'value' });
  });

  await waitForNextUpdate();

  expect(result.current[0][0].file).toEqual(file);
  expect(result.current[0][0].formattedSize).toEqual('12 B');
  expect(result.current[0][0].progress).toEqual(100);
  expect(result.current[0][0].status).toEqual('uploaded');
  expect(result.current[0][0].httpStatus).toEqual(200);
  expect(result.current[0][0].responseData).toEqual({
    uploadedUrl: 'http://dummy.com/image.jpg',
  });
});

it('callback must return uploaded task', async done => {
  const { result, waitForNextUpdate } = renderHook(() =>
    useUploader({
      url: 'http://dummy.com/api/upload',
      fieldname: 'file',
      method: 'post',
    })
  );

  expect(result.current[0]).toEqual([]);

  expect(Object.keys(result.current[1])).toEqual([
    'startUploadTask',
    'retryUploadTask',
    'stopUploadTask',
    'clearUploadTasks',
  ]);

  mockAxios.request.mockImplementationOnce(successfulUploadWithoutProgress);

  act(() => {
    result.current[1].startUploadTask([file], (task: Task) => {
      expect(task.file).toEqual(file);
      expect(task.formattedSize).toEqual('12 B');
      expect(task.progress).toEqual(100);
      expect(task.status).toEqual('uploaded');
      expect(task.httpStatus).toEqual(200);
      expect(task.responseData).toEqual({
        uploadedUrl: 'http://dummy.com/image.jpg',
      });
      done();
    });
  });

  await waitForNextUpdate();

  expect(result.current[0][0].file).toEqual(file);
  expect(result.current[0][0].formattedSize).toEqual('12 B');
  expect(result.current[0][0].progress).toEqual(100);
  expect(result.current[0][0].status).toEqual('uploaded');
  expect(result.current[0][0].httpStatus).toEqual(200);
  expect(result.current[0][0].responseData).toEqual({
    uploadedUrl: 'http://dummy.com/image.jpg',
  });
});

it('upload all files in one task', async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    useUploader({
      url: 'http://dummy.com/api/upload',
      fieldname: 'file',
      method: 'post',
      multiple: false,
    })
  );

  expect(result.current[0]).toEqual([]);

  expect(Object.keys(result.current[1])).toEqual([
    'startUploadTask',
    'retryUploadTask',
    'stopUploadTask',
    'clearUploadTasks',
  ]);

  mockAxios.request.mockImplementationOnce(successfulUploadWithoutProgress);

  act(() => {
    result.current[1].startUploadTask([file, file]);
  });

  await waitForNextUpdate();
  expect(result.current[0][0].files).toEqual([file, file]);
  expect(result.current[0][0].formattedSize).toEqual('24 B');
  expect(result.current[0][0].progress).toEqual(100);
  expect(result.current[0][0].status).toEqual('uploaded');
  expect(result.current[0][0].httpStatus).toEqual(200);
});
