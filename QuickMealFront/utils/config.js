const BASE_URL = 'http://localhost:8000'; // http://localhost:8000
// http://101.201.39.232:8000

module.exports = {
  BASE_URL,
  DISH_CATEGORY_API: `${BASE_URL}/dish/categories/`,
  DISH_LIST_API: `${BASE_URL}/dish/list/`,
  PACKAGE_LIST_API: `${BASE_URL}/package/list/`,
  USER_LOGIN_API: `${BASE_URL}/user/login/`,
  USER_REGISTER_API: `${BASE_URL}/user/register/`,
  USER_UPDATE_API: `${BASE_URL}/user/update/`,
  REVIEW_DISH_API: `${BASE_URL}/review/dish/submit/`,
  REVIEW_PACKAGE_API: `${BASE_URL}/review/package/submit/`,
  REVIEW_STORE_API: `${BASE_URL}/review/store/submit/`,
  DISH_REVIEW_LIST_API: `${BASE_URL}/review/dish/`,     // + dish_id/list/
  PACKAGE_REVIEW_LIST_API: `${BASE_URL}/review/package/`, // + package_id/list/
  FAVORITE_TOGGLE_API: `${BASE_URL}/user/favorite/toggle/`,
  FAVORITE_STATUS_API: `${BASE_URL}/user/favorite/status/`,
  UPDATE_TABLE_STATUS_API: `${BASE_URL}/table/update_status/`,
  CREATE_ORDER_API: `${BASE_URL}/order/create/`,
  USER_ORDER_LIST_API: `${BASE_URL}/order/user/orders/`,
  ORDER_DETAIL_API: `${BASE_URL}/order/order/`,
  TABLE_STATUS_LIST_API: `${BASE_URL}/table/status/list/`,
  ORDER_UPDATE_STATUS_API: `${BASE_URL}/order/update_status/`,
  UPDATE_TABLE_STATUS_API: `${BASE_URL}/table/update_status/`,
  UNBIND_ORDER_API:`${BASE_URL}/table/unbind_order/`,
};
