import React, { useState } from 'react';
import { Input, Button } from 'antd';

import './index.scss';

const Dichotomy = () => {
  const [arr, setArr] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [target, settarget] = useState<number>(0);
  const [result, setResult] = useState<number | string>('');

  //   const handleChangeArr = ({ target: { value } }) => {
  //     setArr(value);
  //   };

  const handleChangeTarget = ({ target: { value } }) => {
    settarget(value);
  };

  // !二分搜索
  const calculate = () => {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const middle = Math.floor((left + right) / 2);
      if (arr[middle] === Number(target)) {
        return middle;
      } else if (arr[middle] > Number(target)) {
        right = middle - 1;
      } else if (arr[middle] < Number(target)) {
        left = middle + 1;
      }
    }
    return '没有记录';
  };

  const getResult = () => {
    const value = calculate();
    setResult(value);
  };

  return (
    <>
      <p className="p_title">二分算法</p>
      <Input defaultValue={arr.join(',')} disabled />
      {/* <Input placeholder="请输入有序数组" onChange={handleChangeArr} /> */}
      <Input placeholder="请输入目标值" onChange={handleChangeTarget} />
      <Button onClick={getResult}>查询</Button>
      <p>结果：{result}</p>
    </>
  );
};

export default Dichotomy;
