import React from 'react';
import { InputNumber } from 'antd';
import useRangeNumber, { Props } from './useRangeNumber';

const InputNumberFuc = (props: Props) => {
  const InputNumberProps = useRangeNumber({ ...props });
  return (
    <div onWheel={InputNumberProps.onWheel} style={{ display: 'initial' }}>
      <InputNumber {...InputNumberProps} />
    </div>
  );
};
export default InputNumberFuc;
