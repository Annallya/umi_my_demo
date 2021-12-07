import React, { useState } from 'react';
import { Tree } from 'antd';

const { DirectoryTree } = Tree;
interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

const initTreeDate: DataNode[] = [
  {
    title: '开发层',
    key: 'kaifaceng',
    children: [
      {
        title: '开发层的存储源1',
        key: 'kaifaceng-1',
      },
    ],
  },
  {
    title: '主题层',
    key: 'zhuticeng',
    children: [
      {
        title: '主题层的存储源1',
        key: 'zhuticeng-1',
      },
    ],
  },
];

function updateTreeData(list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] {
  return list.map(node => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    } else if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
}

const LoadTree = () => {
  const [treeData, setTreeData] = useState(initTreeDate);

  const onLoadData = ({ key, children }: any) => {
    return new Promise<void>(resolve => {
      if (children) {
        resolve();
        return;
      }
      setTimeout(() => {
        setTreeData(origin => {
          return updateTreeData(origin, key, [
            { title: '异步加载的数据1', key: '1-1-1', isLeaf: true },
            { title: '异步加载的数据2', key: '1-1-2', isLeaf: true },
          ]);
        });
        resolve();
      }, 1000);
    });
  };

  return (
    <>
      <DirectoryTree loadData={onLoadData} treeData={treeData} />
    </>
  );
};

export default LoadTree;
