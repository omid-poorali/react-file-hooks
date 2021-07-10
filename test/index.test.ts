import { useUploader } from '../src';
import { renderHook, act } from '@testing-library/react-hooks';
import axios from 'axios';
import {
  failedUpload,
  successfulUpload,
  successfulUploadWithoutProgress,
} from './mocks';

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

  // call onDrop with null
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
