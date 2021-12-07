import React from 'react';
import { InputNumber } from 'antd';
import useInputNumber, { UseInputNumberProps } from './UseInputNumber';

const InputNumberFC = (props: UseInputNumberProps) => {
  const InputNumberProps = useInputNumber({ ...props });
  return (
    <div onWheel={InputNumberProps.onWheel} style={{ display: 'initial' }}>
      <InputNumber {...InputNumberProps} />
    </div>
  );
};

export default InputNumberFC;
