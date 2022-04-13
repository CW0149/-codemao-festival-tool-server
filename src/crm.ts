import fetch from 'node-fetch';
import dotenv from 'dotenv';

const envConfig = dotenv.config()?.parsed;

export const postCrmData = (
  url: string,
  data?: Record<string, unknown>
) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Accept: "application/json, text/plain, */*",
      authorization_type: "3",
      Cookie: envConfig.COOKIE,
    },
    body: data && JSON.stringify(data),
  }).then((res: any) => {
    return res.json();
  });
};

export const getCrmData = (
  url: string,
) => {
  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      authorization_type: "3",
      Cookie: envConfig.COOKIE,
    },
  }).then((res: any) => {
    return res.json();
  });
};

export const getStudentsByClass = (classId: number, termId: number) => {
  return postCrmData(
    "https://api-codecamp-crm.codemao.cn/annual/class/overview?page=1&limit=500",
    {
      class_id: classId,
      term_id: termId,
    }
  );
};

export const getStudentsAddrByClass = (classId: number, termId: number) => {
  return postCrmData(
    "https://api-codecamp-crm.codemao.cn/user-data/no-class",
    {
      class_id: classId,
      term_id: termId,
      page: 1,
      limit: 500,
    }
  );
};

export const getLogistics = (phone: string) => {
  return postCrmData('https://cloud-gateway.codemao.cn/platform-sup-chain-admin-service/admin/freight/waybill/query', {
    consigneePhone: phone,
    pageIndex: 1,
    pageSize: 20,
  })
};

export const getUserData = (userId: string) => {
  return getCrmData(`https://api-codecamp-crm.codemao.cn/users/${userId}`);
}
