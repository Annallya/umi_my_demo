import { useState, useEffect } from 'react';
import { InputNumberProps } from 'antd/lib/input-number';
import isNaN from 'lodash/isNaN';

export interface Props extends InputNumberProps {
  getScrollContainer: () => HTMLElement | null;
  outliter?: number;
  value?: number;
  defaultValue?: number;
}
const MAX = 999;
const useRangeNumber = (props: Props) => {
  const {
    getScrollContainer = () => null,
    onChange,
    onBlur,
    outliter = 1,
    min = 1,
    value: propsValue,
    defaultValue,
    ...otherProps
  } = props;

  const [value, setValue] = useState<number | undefined>(1);
  const [isFocus, setFocus] = useState<boolean>(false);

  const setPropsValue = option => {
    if (!option) return;
    const newValue = option <= 0 ? 1 : option;
    setValue(Number(newValue));
  };

  useEffect(() => {
    setPropsValue(propsValue);
  });

  useEffect(() => {
    setPropsValue(defaultValue);
  });

  const setValues = number => {
    setValue(number);
    if (onChange) onChange(Number(number));
  };

  // rewrite onChange
  const onChangeRE = number => {
    if (isNaN(number)) {
      setValues(min);
    } else {
      setValues(number);
    }
  };

  const handleScrollElement = option => {
    const el = getScrollContainer();
    if (el) {
      el.style.overflowY = `${option}`;
    }
  };

  const handleOnFocus = () => {
    setFocus(true);
  };

  const onBlurRE = e => {
    const {
      target: { value: number },
    } = e;
    const newValue = number && number >= min ? value : min;
    onChangeRE(newValue);
    handleScrollElement('auto');
    setFocus(false);
    if (onBlur) onBlur(e);
  };

  const onwheel = e => {
    if (!isFocus) return;
    if (isNaN(value)) return;
    // 禁止滚动元素滚动
    handleScrollElement('hidden');
    const data = e.deltaY;
    if (data > 0) {
      if (!isNaN(value)) onChangeRE(Number(value) + 1);
    }
    if (data < 0) {
      if (!isNaN(value) && Number(value) >= 1) onChangeRE(Number(value) - 1);
    }
  };

  const formatter = number => {
    const realValue = Number(value) === Number(number) ? number : value;
    if (realValue === 0 || realValue === '0') {
      return outliter;
    } else {
      return realValue;
    }
  };

  const parser = number => {
    if (number.includes('.')) {
      return Number(number.replace('.', ''));
    }
    if (!number) {
      return '';
    }
    if (number >= MAX) {
      return MAX;
    }
    return Number(number);
  };
  return {
    onWheel: onwheel,
    onFocus: handleOnFocus,
    onChange: onChangeRE,
    onBlur: onBlurRE,
    formatter,
    parser,
    max: MAX,
    min,
    value,
    step: 1,
    ...otherProps,
  };
};

export default useRangeNumber;
