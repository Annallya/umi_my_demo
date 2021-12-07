import { useState } from 'react';
import isNaN from 'lodash/isNaN';
import { InputNumberProps } from 'antd/lib/input-number';
import { RANGE } from '..';

export interface UseInputNumberProps extends InputNumberProps {
  value: number;
  onChange?: any;
  min: number;
  max: number;
  getScrollContainer?: () => HTMLElement | null;
  [propName: string]: any;
}

const useInputNumber = (props: UseInputNumberProps) => {
  const {
    value,
    min = RANGE.min,
    max = RANGE.max,
    onChange,
    getScrollContainer = () => null,
  } = props;

  const [isFocus, setFocus] = useState<boolean>(false);

  const handleScrollElement = (option: string) => {
    const el = getScrollContainer();
    if (el) {
      el.style.overflowY = `${option}`;
    }
  };

  const onWheel = e => {
    if (!isFocus) return;
    if (isNaN(value)) return;
    // 滚动鼠标时，禁止滚动父元素
    handleScrollElement('hidden');
    const data = e.deltaY;
    if (data > 0) {
      onChange(value + 1);
    }
    if (data < 0) {
      onChange(value - 1);
    }
  };
  const onBlur = e => {
    const {
      target: { value: number },
    } = e;

    console.log(number);
    if (parseInt(number, 10) === 0) {
      onChange(min);
    }
    handleScrollElement('auto');
    setFocus(false);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const onFocus = () => {
    setFocus(true);
  };

  const formatter = number => {
    if (isNaN(number)) {
      return value;
    }
    if (parseInt(number, 10) === 0) {
      return 1;
    }

    return number;
  };

  const parser = number => {
    if (number.includes('.')) {
      return parseInt(number.replace('.', ''), 10);
    }
    if (!number) {
      return '';
    }

    if (number > max) {
      return max;
    }
    return parseInt(number, 10);
  };

  return { ...props, onWheel, onBlur, onFocus, formatter, parser };
};

export default useInputNumber;
