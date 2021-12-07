import React from 'react';
import { Button } from 'antd';

interface IApiResponse {
  bar: string;
}

const responseIsBar = (response: unknown): response is IApiResponse => {
  return (
    (response as IApiResponse).bar !== undefined &&
    typeof (response as IApiResponse).bar === 'string'
  );
};

const callFooApi = async (): Promise<IApiResponse> => {
  const response = await httpRequest('...');
  if (responseIsBar(response)) return response;
  throw Error('response is wrong');
};

interface myInterface {
  say: string;
}

const result = { say: 'hi' } as const;
result.say = 'bye';

const TableForm = () => {
  return (
    <Button
      onClick={() => {
        console.log(1);
      }}
    >
      提交
    </Button>
  );
};

export default TableForm;
