export const deepTree = (list) => {
  let newList = [];
  let map = {};

  list.forEach((e) => (map[e.id] = e));

  list.forEach((e) => {
    let parent = map[e.parentId];

    if (parent) {
      (parent.children || (parent.children = [])).push(e);
    } else {
      if (!e.parentId) {
        newList.push(e);
      }
    }
  });

  const fn = (list) => {
    list.map((e) => {
      if (e.children instanceof Array) {
        e.children = orderBy(e.children, "id");
        fn(e.children);
      }
    });
  };

  fn(newList);

  return orderBy(newList, "id");
};

export function orderBy(list, key) {
  return list.sort((a, b) => a[key] - b[key]);
}

export const evalDepartment = (department,menus) => {
  console.log(111)
  if (department.children) {
    for (var i = 0; i < department.children.length; i++) {
      menus.push(evalDepartment(department.children[i]))
    }
  }
  return menus;
}
export const revisePath = (path) => {
  if (!path) {
    return "";
  }

  if (path[0] == "/") {
    return path;
  } else {
    return `/${path}`;
  }
};

export const isNull = (value) => {
  return value === "" || value === undefined || value === null;
};

/**
 * @description 获取节点的所有父节点
 * @param {*} tree
 * @param {*} func
 * @param {*} path
 * @return {*}
 */
export const treeFindPath = (tree, func, name = "id", path = []) => {
  if (!tree) return [];
  for (const data of tree) {
    //* 这里按照你的需求来存放最后返回的内容吧
    path.push(data[name]);
    if (func(data)) return path;
    if (data.children) {
      const findChildren = treeFindPath(data.children, func, name, path);
      if (findChildren.length) return findChildren;
    }
    path.pop();
  }
  return [];
};

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export const debounce = (func, wait, immediate) => {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};
