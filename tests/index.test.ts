import { Failed, Stopped, Uploaded, Uploading, useUploader } from '../src';
import { renderHook, act } from '@testing-library/react-hooks';
import axios from 'axios';
import {
  failed,
  successful
} from './mocks';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

const file = new File(['(⌐□_□)'], 'name.png', { type: 'image/png' });

it('sucessfully uploaded a file', async () => {
  // init
  const { result, waitForNextUpdate } = renderHook(() =>
    useUploader({
      url: 'http://dummy.com/api/upload',
      fieldname: 'file',
      method: 'post'
    })
  );

  expect(result.current[0]).toEqual([]);

  expect(Object.keys(result.current[1])).toEqual([
    'start',
    'stop',
    'retry',
    'remove'
  ]);

  mockAxios.request.mockImplementationOnce(successful);
  // upload
  act(() => {
    result.current[1].start(file, {
      key1: "value1",
      key2: "value2"
    });
  });

  await waitForNextUpdate();

  expect(result.current[0][0].source).toEqual([file]);
  expect(result.current[0][0].meta).toEqual({
    key1: "value1",
    key2: "value2"
  });
  expect(result.current[0][0].formattedSize).toEqual('12 B');
  expect(result.current[0][0].size).toEqual(12)
  expect(result.current[0][0].progress).toEqual(25);
  expect(result.current[0][0].status).toEqual(Uploading);

  await waitForNextUpdate();
  expect(result.current[0][0].progress).toEqual(50);


  await waitForNextUpdate();
  expect(result.current[0][0].progress).toEqual(100);
  expect(result.current[0][0].status).toEqual(Uploaded);
  expect(result.current[0][0].result).toEqual({
    httpStatus: 200,
    responseData: {
      "uploadedUrl": "http://dummy.com/image.jpg"
    }
  });

  expect(result.current[0][0].result?.error).toBeUndefined();
});

it('stop uploading process', async () => {
  // init
  const { result, waitForNextUpdate } = renderHook(() =>
    useUploader({
      url: 'http://dummy.com/api/upload',
      fieldname: 'file',
      method: 'post'
    })
  );

  expect(result.current[0]).toEqual([]);

  expect(Object.keys(result.current[1])).toEqual([
    'start',
    'stop',
    'retry',
    'remove'
  ]);

  mockAxios.request.mockImplementationOnce(successful);
  // upload
  act(() => {
    result.current[1].start(file, {
      key1: "value1",
      key2: "value2"
    });
  });

  await waitForNextUpdate();

  expect(result.current[0][0].source).toEqual([file]);
  expect(result.current[0][0].meta).toEqual({
    key1: "value1",
    key2: "value2"
  });
  expect(result.current[0][0].formattedSize).toEqual('12 B');
  expect(result.current[0][0].size).toEqual(12)
  expect(result.current[0][0].progress).toEqual(25);
  expect(result.current[0][0].status).toEqual(Uploading);

  act(() => {
    result.current[1].stop(result.current[0][0].id);
  });

  await waitForNextUpdate();
  expect(result.current[0][0].status).toEqual(Stopped);
});


it('uploaded failed', async () => {
  // init
  const { result, waitForNextUpdate } = renderHook(() =>
    useUploader({
      url: 'http://dummy.com/api/upload',
      fieldname: 'file',
      method: 'post'
    })
  );

  expect(result.current[0]).toEqual([]);

  expect(Object.keys(result.current[1])).toEqual([
    'start',
    'stop',
    'retry',
    'remove'
  ]);

  mockAxios.request.mockImplementationOnce(failed);
  // upload
  act(() => {
    result.current[1].start(file, {
      key1: "value1",
      key2: "value2"
    });
  });

  await waitForNextUpdate();

  expect(result.current[0][0].source).toEqual([file]);
  expect(result.current[0][0].meta).toEqual({
    key1: "value1",
    key2: "value2"
  });
  expect(result.current[0][0].formattedSize).toEqual('12 B');
  expect(result.current[0][0].size).toEqual(12)
  expect(result.current[0][0].status).toEqual(Failed);
  expect(result.current[0][0].result).toEqual({
    error: {
      response: {
        data: {
            message: "unauthorized",
        },
        status: 401,
      },
    },
    httpStatus: 401,
    responseData: {
      message: 'unauthorized'
    }
  });
});