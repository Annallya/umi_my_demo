import { Reducer } from 'redux';
import { Effect } from 'dva';
import { fromJS } from 'immutable';
import { notification } from 'antd';
import { max as Max } from 'lodash';

import * as API from '@/services/DataService/association';
import { listLayer, listCatalogs, listTag, showEnum } from '@/services/DataService/publishManage';
import { getTreeData, getTagTreeData } from './dwsManage';

const CHILDREN_PROP_NAME = 'children';
// *目前支持的数据源类型
const SUPPORT_TYPE = ['hive', 'stork', 'teryx', 'gaussdb'];
// *问题数据库标识
const WT_IDENTIFY = 'wt';

const getJoinType = targetNode => {
  if (!targetNode) return '';
  const DEFAULT_JOIN_TYPE = 'left'; // left - 默认左关联
  return DEFAULT_JOIN_TYPE;
};

const generateNewAssociationNode = (targetNode, newNode, path) => {
  const fieldsSetting: { parent: string; child: string }[] = [];
  if (targetNode) {
    const parentFields = targetNode.fields;
    const childFields = newNode.fields;
    const sameField = parentFields.find(field => childFields.includes(field));
    if (sameField) {
      fieldsSetting.push({
        parent: sameField,
        child: sameField,
      });
    }
  }

  return {
    ...newNode,
    path,
    main: targetNode, // 主表
    children: [],
    joinType: getJoinType(targetNode),
    fieldsSetting,
  };
};

const getActualPath = path => {
  const actualPath = path
    .replace(/-/g, `-${CHILDREN_PROP_NAME}-`)
    .split('-')
    .filter(value => value !== '');
  return actualPath;
};

const getTargetNode = associationData => {
  return {
    ...associationData,
    fieldsSetting: [],
    main: null,
    children: [],
  };
};

const getActualFieldsSettingPath = node => [...getActualPath(node.path), 'fieldsSetting'];

const isRootNode = node => node.main === null;

const straightenSiblingsPath = (node, root) => {
  if (isRootNode(node)) return root;
  const parentPath = node.path
    .split('-')
    .slice(0, -1)
    .join('-');
  const actualSiblingsPath = [...getActualPath(parentPath), CHILDREN_PROP_NAME];
  const newSiblings = root
    .getIn(actualSiblingsPath)
    .map((item, index) => item.set('path', `${parentPath}-${index}`));
  return root.setIn(actualSiblingsPath, newSiblings);
};

const getCommonParams = (data, connectid) => {
  return {
    tableid: data.id,
    tablename: data.title,
    sourcedbid: data.parent.id,
    sourcedbname: data.parent.dbname,
    sourceschema: data.parent.sourcename,
    sourcedbtype: data.parent.sourcetype,
    sourceengineid: data.layersInfo.engineid,
    fields: (data.fieldinfo || []).map(item => ({
      index: `${data.id}_${item.name}_${connectid}`,
    })),
  };
};

const getParamData = associationData => {
  if (associationData.length === 0) return [];
  const main = associationData[0];
  const mainInfo = [
    {
      connectid: 0,
      ...getCommonParams(main, 0),
    },
  ];
  const children = main.children.map((item, index) => {
    return {
      connectid: index + 1,
      connecttype: item.joinType,
      mainfields: item.fieldsSetting.map(field => field.parent),
      connectfields: item.fieldsSetting.map(field => field.child),
      ...getCommonParams(item, index + 1),
    };
  });

  const params = mainInfo.concat(children);
  return params;
};

const getCommonFieldsInfo = (allFields, data, connectid) => {
  const maxNum = Max(allFields.map(item => item.fieldindex));
  return (data.fieldinfo || []).map((item, index) => {
    return {
      fieldindex: allFields.length === 0 ? index : maxNum + index + 1,
      fieldname: item.name,
      fieldtype: item.fieldtype,
      rename: item.name,
      typechange: '',
      isselected: true,
      comments: '',
      ruleinfo: {
        ruleid: '',
      },
      dictinfo: {
        dictid: '',
        dictname: '',
      },
      index: `${data.id}_${item.name}_${connectid}`,
    };
  });
};

const getParamFieldsInfo = associationData => {
  if (associationData.length === 0) return [];
  const main = associationData[0];
  let allFields = getCommonFieldsInfo([], main, 0);
  main.children.forEach((item, index) => {
    const fieldsInfo = getCommonFieldsInfo(allFields, item, index + 1);
    allFields = allFields.concat(fieldsInfo);
  });

  return allFields;
};

// 联表还原
const getAllTableInfo = treeData => {
  let tables = [];
  treeData.forEach(item => {
    if (item.children) {
      item.children.forEach(table => {
        tables = tables.concat(table.children);
      });
    }
  });
  return tables.filter(item => item);
};

const getTargetTable = (sources, target) => {
  const table = sources.find(item => item.id === target.tableid);
  return table;
};
const getMain = (tables, param) => {
  const table = getTargetTable(tables, param);
  const main = {
    ...table,
    name: param.tablename,
    title: param.tablename,
    fieldsSetting: [],
    path: `${param.connectid}`,
    main: null,
    children: [],
    joinType: '',
  };
  return main;
};
const getChildren = (tables, paramtb, main) => {
  const other = paramtb.slice(1);
  const children = other.map(item => {
    const table = getTargetTable(tables, item);
    const fieldsSetting = item.mainfields.map((field, index) => ({
      parent: field,
      child: item.connectfields[index],
    }));
    return {
      ...table,
      fieldsSetting,
      path: `0-${item.connectid - 1}`,
      main,
      children: [],
      joinType: item.connecttype,
    };
  });
  return children;
};

const recoverData = (treeData, paramtb) => {
  const tables = getAllTableInfo(treeData);

  const main = getMain(tables, paramtb[0]);
  const other = getChildren(tables, paramtb, main);
  const actualData = [{ ...main, children: other }];

  return actualData;
};

// 获取联表的来源(属于哪个存储源)
const getSourceDbIds = paramtb => {
  if (paramtb.length === 0) return [];
  return Array.from(new Set(paramtb.map(({ sourcedbid }) => sourcedbid)));
};

// 查询专题表
const getQueryParamtb = (paramtb, isSql) => {
  return isSql
    ? paramtb.map(({ sourcedbname, sourcedbtype, sourceengineid, sourceschema }) => ({
        sourcedbname,
        sourcedbtype,
        sourceengineid,
        sourceschema,
      }))
    : paramtb;
};

const checkIsSql = type => {
  return type === 2;
};

const getCurDataBase = (treeData, paramtb) => {
  if (paramtb.length === 0) return;
  let database = [] as { sourcename: string }[];
  treeData.forEach(item => {
    if (item.children) {
      database = database.concat(item.children);
    }
  });
  const target = database.find(item => item.sourcename === paramtb[0].sourceschema);

  return target || { id: '', sourcename: '' };
};

const getNewFieldTypeInfo = (fieldtype = []) => {
  const newField = fieldtype.reduce((acu, cur: {}) => {
    return { ...acu, ...cur };
  }, {});

  return newField;
};

const getAllowEdit = (userEdit, dwsInfo) => {
  // Object.keys(dwsInfo).length === 0 新增专题表
  return (
    userEdit &&
    ((Object.keys(dwsInfo).length !== 0 && dwsInfo.onlinestatus !== 1 && !dwsInfo.ispublished) ||
      Object.keys(dwsInfo).length === 0)
  );
};

export type tableType = {
  id: string;
  title: string;
  tbname: string;
  isTable: boolean;
  fields: Array<string>;
  dbtype: string;
};

type treeDataType = {
  id: string;
  title: string;
  children: {
    id: string;
    title: string;
    children: tableType[];
  }[];
};

const OWN_STATE = {
  associationData: [],
  treeData: [] as treeDataType[],
  sqlExpandedKeys: [] as Array<string>,
  associationExpandedKeys: [] as Array<string>,
  tableData: [], // 联表的结果数据
  paramtb: [], // 联表信息
  paramFieldInfo: [] as Array<{
    fieldname: string;
    fieldtype: string;
    rename: string;
    isselected: string;
    typechange: string;
    ruleinfo: { ruleid: string };
    dictinfo: { dictid: string; dictname: string };
  }>, // 字段信息
  paramFilter: [] as import('@/components/FilterModal/index').filterItemProps[] | never[],
};

const INIT_STATE = {
  ...OWN_STATE,
  // 保存数据列举
  queryDetail: {} as any,
  catalogs: [],
  originCatalogs: [],
  tagsOfTreeData: [] as Array<{
    id: string;
    name: string;
    children: { id: string; name: string; color: string }[];
  }>,
  dataBase: [] as Array<{
    title: string;
    value: string;
    [propName: string]: any;
  }>, // 数据库(存储源)
  storages: [],
  curDataBase: { id: '', sourcename: '', parent: { id: '', name: '' } }, // 当前选中的数据库
  tablesInfo: { fieldtype: {} } as {
    fieldtype: { [propName: string]: string };
    records: { [propName: string]: any }[];
  }, // { fieldtype: {}, records: []}
  queryId: '',
  allowSave: false,
  allowEdit: true,
  allowEditStructure: true, // 是否允许修改表结构
};

export type StateType = typeof INIT_STATE;

export interface AssociationType {
  name: 'dwsAssociation';
  state: StateType;
  effects: { [key: string]: Effect };
  reducers: { [key: string]: Reducer<any> };
}
// *数据源要过滤掉问题库
function filterWTDatabase(database, curLayers) {
  return database
    .map(item => {
      const isWt = item?.storageinfo?.identity === WT_IDENTIFY;
      return (
        !isWt && {
          ...item,
          isStorage: true,
          key: item.id,
          title: item.sourcename,
          parent: curLayers,
        }
      );
    })
    .filter(item => item);
}

const dwsAssociation: AssociationType = {
  name: 'dwsAssociation',
  state: INIT_STATE,
  effects: {
    // FIXME 重新修改左侧树请求方法

    *queryTreeData(_, { call, put }) {
      try {
        const data = yield call(API.listTreeData, { id: '', querytype: 1 });
        if (data.code === 200) {
          // *过滤掉问题数据库
          // *过滤掉layer数据isbazaar为true的层
          // *过滤掉不支持的数据库类型
          const treeData = (data.result || [])
            .map(layers => {
              return {
                ...layers,
                isLayer: true,
                key: layers.id,
                title: layers.name,
                children: layers.children ? filterWTDatabase(layers.children, layers) : null,
              };
            })
            .filter(item => {
              const firstChild = (item.children || []).length !== 0 ? item.children[0] : null;
              if (!firstChild) return !item.isbazaar;
              return !item.isbazaar && firstChild && SUPPORT_TYPE.includes(firstChild.sourcetype);
            });
          console.log(treeData);
        } else {
          notification.error({ message: '数据源请求失败' });
        }
      } catch (e) {
        console.error(e);
      }
    },

    // 列举左侧树
    *listTreeData({ payload: { dwsId, getEditTipsModal } }, { call, put }) {
      try {
        const data = yield call(API.listTreeData, {
          id: '',
          querytype: 1,
          // scenes: 2,
        });
        if (data.code === 200) {
          yield put({
            type: 'listAllTable',
            payload: {
              folderList: data.result || [],
              dwsId,
              getEditTipsModal,
            },
          });
        } else {
          notification.error({ message: '列举分层及存储源失败' });
        }
        return data;
      } catch (e) {
        notification.error({ message: '请求错误' });
      }
    },

    *listAllTable({ payload }, { call, put, select }) {
      const supportType = ['hive', 'stork', 'teryx', 'gaussdb'];
      const { folderList, dwsId, getEditTipsModal } = payload;
      try {
        const data = yield call(API.listAllTable, {
          queryid: 'all',
          querytype: -1,
        });
        if (data.code === 200) {
          const tableList = data.result || [];
          const expandKeys = folderList.map(item => item.id);
          const newData = folderList
            .map(item => {
              return {
                ...item,
                key: item.id,
                title: item.name,
                isLayer: true,
                children: item.children
                  ? item.children
                      .map(child => {
                        // *过滤问题数据库
                        const isWt = child?.storageinfo?.identity === 'wt';
                        const targetTables = tableList
                          .filter(table => table.sourceid === child.id)
                          .map(list => {
                            const fields = (list.fieldinfo || []).map(field => field.name);
                            return {
                              ...list,
                              isTable: true,
                              key: list.id,
                              title: list.tbname,
                              fields,
                              parent: child,
                              layersInfo: item,
                            };
                          });
                        return !isWt
                          ? {
                              ...child,
                              key: child.id,
                              title: child.sourcename,
                              isStorage: true,
                              ...(targetTables.length !== 0 && {
                                children: targetTables,
                              }),
                              parent: item,
                            }
                          : null;
                      })
                      .filter(_item => _item)
                  : null,
              };
            })
            .filter(item => {
              const firstChild = (item.children || []).length !== 0 ? item.children[0] : null;
              if (!firstChild) return !item.isbazaar;
              return !item.isbazaar && firstChild && supportType.includes(firstChild.sourcetype);
            });
          const { curDataBase } = yield select(state => state.dwsAssociation);
          yield put({
            type: 'updateState',
            payload: {
              treeData: newData,
              sqlExpandedKeys: curDataBase.id
                ? Array.from(new Set(expandKeys.concat([curDataBase.id])))
                : expandKeys,
              associationExpandedKeys: expandKeys,
              storages: folderList.filter(item => item.isbazaar),
              dataBase: folderList.filter(item => !item.isbazaar),
            },
          });

          if (dwsId) {
            yield put({
              type: 'queryDws',
              payload: {
                id: dwsId,
                treeData: newData,
                getEditTipsModal,
              },
            });
          }
        }
      } catch (e) {
        console.log('请求错误');
      }
    },

    *queryDws({ payload }, { call, put, select }) {
      try {
        const { noRequest = false, treeData: treeData_re, getEditTipsModal } = payload;
        const data = yield call(API.getDwsTable, { id: payload.id });
        if (data.code === 200) {
          if (!data.result) return;
          const {
            detail: { paramtype, paramtb, sqltxt, paramfilter },
            detail,
            paramfieldinfo,
            hasData,
            ispublished,
          } = data.result;
          const isSql = checkIsSql(paramtype);
          const newParamtb = getQueryParamtb(paramtb, isSql);
          const { canCurrentPageEdit } = yield select(state => state.user);
          const { associationExpandedKeys, sqlExpandedKeys, treeData } = yield select(
            state => state.dwsAssociation,
          );
          const newTreeData = treeData_re || treeData;
          const allowEdit = getAllowEdit(canCurrentPageEdit, {
            ...detail,
            hasData,
            ispublished,
          });
          yield put({
            type: 'updateState',
            payload: {
              queryDetail: {
                ...detail,
                hasData,
                ispublished,
              },
              paramtb: newParamtb,
              // allowEdit,
            },
          });

          if (!isSql) {
            // *检测表ID是否存在
            const tables = getAllTableInfo(treeData);
            const isExsit = newParamtb
              .map(item => item.tableid)
              .some(item => {
                return tables.find(_item => _item.id === item);
              });
            if (!isExsit) {
              notification.warn({
                message: '数据来源表已删除或被重建，请重新选择数据来源表',
              });
              yield put({
                type: 'updateState',
                paramFieldInfo: [],
                paramFilter: [],
                associationData: [],
                allowEdit: true,
              });
              return;
            }

            if (!noRequest) {
              // 请求预览区数据
              yield put({
                type: 'showResult',
                payload: {
                  paramtb,
                  paramFieldInfo: paramfieldinfo,
                  isInitQuery: true,
                },
              });
            }
            // 联表操作 需要更新associationData
            const newAssociationData = recoverData(newTreeData, newParamtb);
            const sourceids = getSourceDbIds(newParamtb);

            yield put({
              type: 'updateState',
              payload: {
                paramFieldInfo: paramfieldinfo,
                paramFilter: paramfilter,
                associationData: newAssociationData,
                associationExpandedKeys:
                  sourceids.length === 0
                    ? associationExpandedKeys
                    : Array.from(new Set(associationExpandedKeys.concat(sourceids))),
                allowEdit,
              },
            });
          } else {
            // 发送tryrun请求
            if (!payload.noRequest) {
              yield put({
                type: 'dwsSql/tryRun',
                payload: {
                  paramtb: newParamtb,
                  sqltxt,
                },
              });
            }
            const base = getCurDataBase(treeData, newParamtb);
            yield put({
              type: 'updateState',
              payload: {
                allowEdit,
                curDataBase: base,
                sqlExpandedKeys: (base as { id: string }).id
                  ? Array.from(new Set(sqlExpandedKeys.concat([(base as { id: string }).id])))
                  : sqlExpandedKeys,
              },
            });
            yield put({
              type: 'dwsSql/updateState',
              payload: {
                isSql: true,
                sqltxt,
              },
            });
          }

          // *编辑提醒
          if (allowEdit && hasData) {
            getEditTipsModal(detail);
          }
        } else if (data.code === 10012) {
          notification.warn({
            message: data.result || '专题数据库已被删除，请重新编辑表设置信息',
          });
          yield put({
            type: 'updateState',
            allowEdit: true,
          });
        } else {
          notification.error({ message: '专题表请求错误' });
        }
        return data;
      } catch (e) {
        console.log('请求错误');
      }
    },
    // 列举脱敏规则
    *listRules(_, { call }) {
      try {
        const data = yield call(API.listRules, {});
        return { code: data.code, result: data.result || [] };
      } catch (e) {
        notification.error({ message: '请求错误' });
      }
    },

    // 列举代码表
    *listStandardDir(_, { call, select }) {
      try {
        const { projectId } = yield select(({ user }) => user);
        const payload = {
          projectid: projectId,
          dirtype: 'standarddir',
          sorttype: 1,
        };
        const data = yield call(API.listStandardDir, payload);
        return {
          code: data.code,
          result: (data.result || []).map(item => ({
            ...item,
            children: [],
            title: item.name,
            value: item.id,
            type: 'folder',
          })),
        };
      } catch (e) {
        notification.error({ message: '请求错误' });
      }
    },

    // 列举代码表
    *listStandard(_, { call, select }) {
      try {
        const { projectId } = yield select(({ user }) => user);
        const params = {
          projectid: projectId,
          searchcontent: [],
          sortcontent: { name: 'standardname', number: 0 },
          mode: 3,
        };
        const data = yield call(API.listStandard, params);
        const newRes = (data.result || [])
          .filter(item => item.status === 2)
          .map(item => ({
            ...item,
            parentid: item.dirid,
            title: item.name,
            value: item.id,
          }));

        return { code: data.code, result: newRes };
      } catch (e) {
        notification.error({ message: '请求错误' });
      }
    },

    *listLayer(_, { call, select, put }) {
      try {
        const { projectId } = yield select(({ user }) => user);
        const data = yield call(listLayer, { projectid: projectId });
        if (data.code === 200) {
          yield put({
            type: 'listCatalogs',
            payload: { layerList: data.result, projectId },
          });
        }
      } catch (e) {
        notification.error({ message: '请求错误' });
      }
    },

    *listCatalogs({ payload: { layerList, projectId } }, { call, put }) {
      try {
        const data = yield call(listCatalogs, {
          projectid: projectId,
          dirtype: 'catalog',
        });

        if (data.code === 200) {
          const catalogTree = getTreeData(data.result);
          const servicesId = layerList
            .map(item => {
              if (item.isbazaar) return item.id;
              return null;
            })
            .filter(item => item);
          const catalogs = catalogTree
            .map(item => {
              if (servicesId.includes(item.id)) return item;
              return null;
            })
            .filter(item => item);
          yield put({
            type: 'updateState',
            payload: { catalogs, originCatalogs: data.result || [] },
          });
        }
      } catch (e) {
        notification.error({ message: '请求错误' });
      }
    },

    // 列举标签文件夹
    *listTagDir(_, { call, select }) {
      try {
        const { projectId: projectid } = yield select(state => state.user);
        const { code, result = [] } = yield call(listCatalogs, {
          projectid,
          dirtype: 'tagdir',
        });

        const listTagDirs = result.map(item => {
          const { id, name, parentid, count, number } = item;
          return {
            title: name,
            id,
            key: id,
            type: 'folder',
            count: count || 0,
            parentid,
            sort: number,
          };
        });

        return { code, listTagDirs };
      } catch (e) {
        notification.error({ message: '请求错误' });
      }
    },

    // 列举标签
    *getTags({ payload }, { call, select, put }) {
      const state = yield select(({ user: { projectId } }) => ({
        projectId,
      }));
      try {
        const { code, result = [] } = yield call(listTag, {
          searchcontent: [],
          projectid: state.projectId,
        });
        if (code === 200) {
          const newListtagdirArr = payload.listTagDirs.map(item => {
            return {
              name: item.title,
              id: item.id,
              parentid: item.parentid,
            };
          });
          const newListtagArr = result.map(item => {
            const { id, name, dirid, color } = item;
            return {
              name,
              color,
              id,
              dirid,
              parentid: dirid,
            };
          });

          const arr = getTagTreeData([...newListtagdirArr, ...newListtagArr]);
          const itemTree = arr.find(item => item.name === '表');
          yield put({
            type: 'updateState',
            payload: {
              tagsOfTreeData: itemTree && itemTree.children ? itemTree.children : [],
            },
          });
        }
      } catch (e) {
        notification.error({ message: '请求错误' });
      }
    },

    // 保存接口
    *save({ payload }, { call, select, put }) {
      const { paramFilter } = yield select(state => state.dwsAssociation);
      try {
        const { projectId } = yield select(({ user }) => user);
        const data = yield call(API.save, {
          ...payload,
          paramfilter: paramFilter,
          projectid: projectId,
        });
        if (data.code === 200) {
          notification.success({ message: `${payload.tbname}专题表保存成功` });
          yield put({ type: 'updateState', payload: { allowSave: false } });
        } else {
          notification.error({ message: `${payload.tbname}专题表保存失败` });
        }
        return data;
      } catch (e) {
        notification.error({ message: '请求错误' });
      }
    },

    // 更新专题表接口
    *update({ payload }, { call, select, put }) {
      try {
        const { projectId } = yield select(({ user }) => user);
        const data = yield call(API.update, {
          ...payload,
          projectid: projectId,
        });
        if (data.code === 200) {
          notification.success({ message: `${payload.tbname}专题表修改成功` });
          yield put({ type: 'updateState', payload: { allowSave: false } });
        } else {
          notification.error({ message: `${payload.tbname}专题表修改成功` });
        }
        return data;
      } catch (e) {
        notification.error({ message: '请求错误' });
      }
    },

    *getTables({ payload }, { call }) {
      try {
        const data = yield call(API.listAllTable, { ...payload, querytype: 2 });
        return { code: data.code, result: data.result || [] };
      } catch (e) {
        notification.error({ message: '请求错误' });
      }
    },

    // 联表接口
    *showResult({ payload }, { call, select, put }) {
      const { associationData, paramFilter, allowSave } = yield select(
        state => state.dwsAssociation,
      );

      const paramFieldInfo = payload.paramFieldInfo
        ? payload.paramFieldInfo
        : getParamFieldsInfo(associationData);
      const paramtb = payload.paramtb ? payload.paramtb : getParamData(associationData);
      const paramfilter = payload.paramFilter || paramFilter;
      const params = {
        paramtype: 1, // 1 图表操作
        paramtb,
        paramfieldinfo: paramFieldInfo,
        paramfilter,
      };

      // 联表为空的时候，不请求
      if (paramtb.length === 0) {
        yield put({
          type: 'updateState',
          payload: {
            tableData: [],
            paramtb: [],
            paramFieldInfo: [], // 筛选器需要清空
            paramFilter: [], // 筛选条件需要清空
            tablesInfo: { fieldtype: {} },
          },
        });
        return;
      }

      try {
        const data = yield call(API.showResult, params);
        if (data.code === 200) {
          const { fieldtype } = data.result;
          yield put({
            type: 'updateState',
            payload: {
              tableData: data.result ? data.result.records || [] : [],
              tablesInfo: {
                ...data.result,
                fieldtype: getNewFieldTypeInfo(fieldtype),
              } || { fieldtype: {} },
              paramtb,
              paramFieldInfo: data.result ? data.result.paramfieldinfo : paramFieldInfo,
              ...(!allowSave && !payload.isInitQuery && { allowSave: true }),
            },
          });
          yield put({
            type: 'dwsSql/updateState',
            payload: {
              sqltxt: data.result ? data.result.sql : '',
            },
          });
        } else {
          // 特殊处理 联表字段长度报错 #7777
          if (data.code === 10012) {
            notification.error({ message: data.result });
          } else {
            notification.error({ message: '表数据请求错误' });
          }
          yield put({
            type: 'updateState',
            payload: {
              tableData: [],
              tablesInfo: { fieldtype: {} },
            },
          });
          yield put({
            type: 'dwsSql/updateState',
            payload: {
              sqltxt: '',
            },
          });
        }
        return data;
      } catch (e) {
        notification.error({ message: '请求错误' });
      }
    },
    *showEnum({ payload }, { call, select }) {
      const { paramFieldInfo, paramtb } = yield select(state => state.dwsAssociation);

      const params = {
        paramtype: 1, // 1 图表操作
        paramtb,
        paramfieldinfo: paramFieldInfo,
        paramenum: payload?.paramenum,
      };
      try {
        const data = yield call(showEnum, params);
        if (data.code !== 200) {
          notification.warning({
            message: `${payload?.paramenum} 枚举值获取失败!`,
          });
        }
        return data;
      } catch (error) {
        notification.error({ message: '请求错误' });
      }
    },
  },
  reducers: {
    updateState(state, { payload }): StateType {
      return { ...state, ...payload };
    },
    add(state, { payload }): StateType {
      const { associationData } = state;
      const { newNode } = payload;
      let data = fromJS(associationData);
      let targetNode = null;
      const mainPath = '0';
      if (associationData.length === 0) {
        const item = generateNewAssociationNode(targetNode, newNode, mainPath);
        data = data.push(item);
      } else {
        const targetNodeActualPath = getActualPath(mainPath);
        const nodeChildren = data.getIn(targetNodeActualPath.concat(CHILDREN_PROP_NAME));
        const newNodePath = `${mainPath}-${nodeChildren.size}`;

        targetNode = getTargetNode(associationData[0]);
        const newAssociationNode = generateNewAssociationNode(targetNode, newNode, newNodePath);
        data = data.setIn(
          targetNodeActualPath.concat(CHILDREN_PROP_NAME),
          nodeChildren.push(newAssociationNode),
        );
      }
      return {
        ...state,
        associationData: data.toJS(),
      };
    },

    remove({ associationData, ...others }, { payload: { node } }): StateType {
      let data = fromJS(associationData).deleteIn(getActualPath(node.path));
      // 修正兄弟节点路径
      data = straightenSiblingsPath(node, data);

      return { ...others, associationData: data.toJS() };
    },

    // 更新联表方式
    updateJoinType({ associationData, ...others }, { payload }): StateType {
      const { node, joinType } = payload;
      const data = fromJS(associationData).setIn(
        getActualPath(node.path).concat('joinType'),
        joinType,
      );
      return {
        ...others,
        associationData: data.toJS(),
      };
    },

    // 增加设置字段
    addField({ associationData, ...others }, { payload: { node, fieldIndex, value } }): StateType {
      const actualFieldsSettingItemPath = getActualFieldsSettingPath(node);
      let data = fromJS(associationData);
      data = data.setIn(
        actualFieldsSettingItemPath,
        data.getIn(actualFieldsSettingItemPath).splice(fieldIndex, 0, value),
      );

      return { ...others, associationData: data.toJS() };
    },

    // 删除字段
    removeField({ associationData, ...others }, { payload: { node, fieldIndex } }): StateType {
      const actualFieldsSettingItemPath = getActualFieldsSettingPath(node);
      let data = fromJS(associationData);

      data = data.setIn(
        actualFieldsSettingItemPath,
        data.getIn(actualFieldsSettingItemPath).splice(fieldIndex, 1),
      );
      return { ...others, associationData: data.toJS() };
    },

    // 更新字段
    updateField(
      { associationData, ...others },
      { payload: { node, fieldIndex, value } },
    ): StateType {
      const actualFieldsSettingItemPath = getActualFieldsSettingPath(node).concat(fieldIndex);

      let data = fromJS(associationData);
      if (!data.getIn(actualFieldsSettingItemPath)) {
        data = data.setIn(actualFieldsSettingItemPath, {});
      }

      data = data.mergeIn(actualFieldsSettingItemPath, value);

      return { ...others, associationData: data.toJS() };
    },
  },
};

export default dwsAssociation;
export { OWN_STATE, INIT_STATE, getQueryParamtb, getNewFieldTypeInfo };
