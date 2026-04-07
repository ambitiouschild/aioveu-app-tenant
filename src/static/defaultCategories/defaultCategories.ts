
const TLIST_ICONURL= "https://cdn.aioveu.com/aioveu/aioveu-server/avatar/avatar.png";

// 在你的组件中引入
// import { DEFAULT_CATEGORIES } from "@/static/defaultCategories/defaultCategories";

// 或者按需引入
// import { DEFAULT_CATEGORIES, getDefaultIcon } from "@/static/defaultCategories/defaultCategories";

/**
 * 分类项接口
 */
export interface CategoryItem {
  id: number;
  name: string;
  parentId: number;
  sort: number;
  iconUrl?: string;
}

/**
 * 默认分类数据接口
 */
export interface DefaultCategories {
  flist: CategoryItem[];
  slist: CategoryItem[];
  tlist: CategoryItem[];
}

/**
 * 默认分类数据
 * 用于在网络异常或API失败时显示
 */
export const DEFAULT_CATEGORIES: DefaultCategories = {
  flist: [
    { id: 1, name: "手机数码", parentId: 0, sort: 1 },
    { id: 2, name: "电脑办公", parentId: 0, sort: 2 },
    { id: 3, name: "家用电器", parentId: 0, sort: 3 },
    { id: 4, name: "服装鞋包", parentId: 0, sort: 4 },
    { id: 5, name: "美妆个护", parentId: 0, sort: 5 },
    { id: 6, name: "食品生鲜", parentId: 0, sort: 6 },
    { id: 7, name: "母婴用品", parentId: 0, sort: 7 },
    { id: 8, name: "运动户外", parentId: 0, sort: 8 },
    { id: 9, name: "图书音像", parentId: 0, sort: 9 },
    { id: 10, name: "家居家装", parentId: 0, sort: 10 }
  ],
  slist: [
    // 手机数码下的二级分类
    { id: 101, name: "手机", parentId: 1, sort: 1 },
    { id: 102, name: "平板电脑", parentId: 1, sort: 2 },
    { id: 103, name: "智能穿戴", parentId: 1, sort: 3 },
    { id: 104, name: "摄影摄像", parentId: 1, sort: 4 },
    { id: 105, name: "数码配件", parentId: 1, sort: 5 },

    // 电脑办公下的二级分类
    { id: 201, name: "笔记本电脑", parentId: 2, sort: 1 },
    { id: 202, name: "台式电脑", parentId: 2, sort: 2 },
    { id: 203, name: "电脑配件", parentId: 2, sort: 3 },
    { id: 204, name: "办公设备", parentId: 2, sort: 4 },
    { id: 205, name: "网络产品", parentId: 2, sort: 5 },

    // 家用电器下的二级分类
    { id: 301, name: "大家电", parentId: 3, sort: 1 },
    { id: 302, name: "厨房电器", parentId: 3, sort: 2 },
    { id: 303, name: "生活电器", parentId: 3, sort: 3 },
    { id: 304, name: "个护健康", parentId: 3, sort: 4 },
    { id: 305, name: "影音电器", parentId: 3, sort: 5 },

    // 服装鞋包下的二级分类
    { id: 401, name: "男装", parentId: 4, sort: 1 },
    { id: 402, name: "女装", parentId: 4, sort: 2 },
    { id: 403, name: "童装", parentId: 4, sort: 3 },
    { id: 404, name: "鞋靴", parentId: 4, sort: 4 },
    { id: 405, name: "箱包", parentId: 4, sort: 5 },

    // 美妆个护下的二级分类
    { id: 501, name: "护肤", parentId: 5, sort: 1 },
    { id: 502, name: "彩妆", parentId: 5, sort: 2 },
    { id: 503, name: "香水", parentId: 5, sort: 3 },
    { id: 504, name: "美发", parentId: 5, sort: 4 },
    { id: 505, name: "个人护理", parentId: 5, sort: 5 }
  ],
  tlist: [
    // 手机下的三级分类
    { id: 1001, name: "智能手机", parentId: 101, sort: 1, iconUrl: TLIST_ICONURL },
    { id: 1002, name: "老人手机", parentId: 101, sort: 2, iconUrl: TLIST_ICONURL },
    { id: 1003, name: "游戏手机", parentId: 101, sort: 3, iconUrl: TLIST_ICONURL },
    { id: 1004, name: "拍照手机", parentId: 101, sort: 4, iconUrl: TLIST_ICONURL },

    // 平板电脑下的三级分类
    { id: 1101, name: "iPad", parentId: 102, sort: 1, iconUrl: TLIST_ICONURL },
    { id: 1102, name: "安卓平板", parentId: 102, sort: 2, iconUrl: TLIST_ICONURL },
    { id: 1103, name: "二合一平板", parentId: 102, sort: 3, iconUrl: TLIST_ICONURL },

    // 智能穿戴下的三级分类
    { id: 1201, name: "智能手表", parentId: 103, sort: 1, iconUrl: TLIST_ICONURL },
    { id: 1202, name: "手环", parentId: 103, sort: 2, iconUrl: TLIST_ICONURL },
    { id: 1203, name: "VR设备", parentId: 103, sort: 3, iconUrl: TLIST_ICONURL },

    // 笔记本电脑下的三级分类
    { id: 2101, name: "轻薄本", parentId: 201, sort: 1, iconUrl: TLIST_ICONURL },
    { id: 2102, name: "游戏本", parentId: 201, sort: 2, iconUrl: TLIST_ICONURL },
    { id: 2103, name: "商务本", parentId: 201, sort: 3, iconUrl: TLIST_ICONURL },
    { id: 2104, name: "设计本", parentId: 201, sort: 4, iconUrl: TLIST_ICONURL },

    // 男装下的三级分类
    { id: 4101, name: "衬衫", parentId: 401, sort: 1, iconUrl: TLIST_ICONURL },
    { id: 4102, name: "T恤", parentId: 401, sort: 2, iconUrl: TLIST_ICONURL },
    { id: 4103, name: "裤子", parentId: 401, sort: 3, iconUrl: TLIST_ICONURL },
    { id: 4104, name: "外套", parentId: 401, sort: 4, iconUrl: TLIST_ICONURL },

    // 护肤下的三级分类
    { id: 5101, name: "洁面", parentId: 501, sort: 1, iconUrl: TLIST_ICONURL },
    { id: 5102, name: "爽肤水", parentId: 501, sort: 2, iconUrl: TLIST_ICONURL },
    { id: 5103, name: "乳液面霜", parentId: 501, sort: 3, iconUrl: TLIST_ICONURL },
    { id: 5104, name: "面膜", parentId: 501, sort: 4, iconUrl: TLIST_ICONURL },

    // 彩妆下的三级分类
    { id: 5201, name: "口红", parentId: 502, sort: 1, iconUrl: TLIST_ICONURL },
    { id: 5202, name: "粉底", parentId: 502, sort: 2, iconUrl: TLIST_ICONURL },
    { id: 5203, name: "眼影", parentId: 502, sort: 3, iconUrl: TLIST_ICONURL },
    { id: 5204, name: "腮红", parentId: 502, sort: 4, iconUrl: TLIST_ICONURL }
  ]
};

/**
 * 获取默认图标
 */
export const getDefaultIcon = (categoryId: number): string => {
  const iconMap: Record<number, string> = {
    1001: TLIST_ICONURL,
    1002: TLIST_ICONURL,
    1003: TLIST_ICONURL,
    1004: TLIST_ICONURL,
    1101: TLIST_ICONURL,
    1102: TLIST_ICONURL,
    1103: TLIST_ICONURL,
    1201: TLIST_ICONURL,
    1202: TLIST_ICONURL,
    1203: TLIST_ICONURL,
    2101: TLIST_ICONURL,
    2102: TLIST_ICONURL,
    2103: TLIST_ICONURL,
    2104: TLIST_ICONURL,
    4101: TLIST_ICONURL,
    4102: TLIST_ICONURL,
    4103: TLIST_ICONURL,
    4104: TLIST_ICONURL,
    5101: TLIST_ICONURL,
    5102: TLIST_ICONURL,
    5103: TLIST_ICONURL,
    5104: TLIST_ICONURL,
    5201: TLIST_ICONURL,
    5202: TLIST_ICONURL,
    5203: TLIST_ICONURL,
    5204: TLIST_ICONURL
  };

  return iconMap[categoryId] || TLIST_ICONURL;
};

/**
 * 导出默认分类数据的工具函数
 */
export default {
  DEFAULT_CATEGORIES,
  getDefaultIcon
};
