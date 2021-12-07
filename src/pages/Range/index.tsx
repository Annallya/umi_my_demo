import React, { useState } from 'react';
import CS from 'classnames';
import InputNumberFC from './hooks/index';

// import styles from './index.less';

interface RangeValue {
  preNumber?: number;
  nextNumber?: number;
}

interface RangeNumberProps {
  value?: RangeValue;
  onChange?: (value: RangeValue) => void;
  getScrollContainer?: () => HTMLElement | null;
  [propName: string]: any;
}

const MAX = 999;

const RANGE = {
  min: 1,
  max: MAX,
};

const RangeNumber: React.FC<RangeNumberProps> = ({ value = {}, onChange, disabled, ...rest }) => {
  const [preNumber, setPreNumber] = useState<number>(1);
  const [nextNumber, setNextNumber] = useState<number>(preNumber);

  const triggerChange = changedValue => {
    if (onChange) {
      onChange({ preNumber, nextNumber, ...value, ...changedValue });
    }
  };
  const onChangePreNumber = e => {
    const number = parseInt(e, 10);
    if (!('preNumber' in value)) {
      setPreNumber(number);
    }

    const newNextNumber =
      // @ts-ignore
      value.nextNumber <= number ? number : value.nextNumber;
    triggerChange({ preNumber: number, nextNumber: newNextNumber });
  };

  const onChangeNextNumber = e => {
    const number = parseInt(e, 10);
    if (!('nextNumber' in value)) {
      setNextNumber(e);
    }
    triggerChange({ nextNumber: number });
  };

  return (
    <>
      <InputNumberFC
        {...RANGE}
        value={value.preNumber || preNumber}
        onChange={onChangePreNumber}
        // disabled
        {...rest}
      />
      <span
        style={{ margin: '0 8px' }}
        // className={CS({
        //   [styles.disable]: disabled,
        // })}
      >
        至
      </span>
      <InputNumberFC
        min={value.preNumber || preNumber}
        max={MAX}
        value={value.nextNumber || nextNumber}
        onChange={onChangeNextNumber}
        // disabled
        {...rest}
      />
    </>
  );
};

export default RangeNumber;

export { RANGE };
