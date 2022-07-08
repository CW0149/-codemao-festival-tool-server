import fetch from 'node-fetch';
import Koa from 'koa';

export type Ctx = Koa.Context;

const getCookie = (ctx: Ctx) => {
  const token = ctx.header.token;
  return token ? `internal_account_token=${token}` : '';
};

export const postCrmData = (
  ctx: Ctx,
  url: string,
  data: Record<string, unknown> = {},
  headers: Record<string, unknown> = {},
) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Accept: "application/json, text/plain, */*",
      authorization_type: "3",
      ...headers,
      Cookie: getCookie(ctx),
    },
    body: data && JSON.stringify(data),
  }).then((res: any) => {
    return res.json();
  });
};


export const getCrmData = (
  ctx: Ctx,
  url: string,
  headers: Record<string, unknown> = {},
) => {
  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      authorization_type: "3",
      ...headers,
      Cookie: getCookie(ctx),
    },
  }).then((res: any) => {
    return res.json();
  });
};

export const getStudentsByClass =  (ctx: Ctx, classId: number, termId: number) => {
  return postCrmData(
    ctx,
    "https://api-codecamp-crm.codemao.cn/annual/class/overview?page=1&limit=500",
    {
      class_id: classId,
      term_id: termId,
    },
  );
};

export const getStudentsAddrByClass =  (ctx: Ctx, classId: number, termId: number) => {
  return postCrmData(ctx, 
    "https://api-codecamp-crm.codemao.cn/user-data/no-class",
    {
      class_id: classId,
      term_id: termId,
      page: 1,
      limit: 500,
    },

  );
};

export const getLogistics =  (ctx: Ctx, phone: string) => {
  return postCrmData(ctx, 'https://cloud-gateway.codemao.cn/platform-sup-chain-admin-service/admin/freight/waybill/query', {
    consigneePhone: phone,
    pageIndex: 1,
    pageSize: 20,
  });
};

export const getUserData = (ctx: Ctx, userId: string) => {
  return getCrmData(ctx, `https://api-codecamp-crm.codemao.cn/users/${userId}`);
}

const getLoginTicket =  (ctx: Ctx, email: string) => {
  return  postCrmData(ctx, 'https://open-service.codemao.cn/captcha/rule', {
    identity: email,
    timestamp: Date.now(),
  },
)
};

export const login =  async (ctx: Ctx, email: string, password: string) => {
  const { ticket } = await getLoginTicket(ctx, email);

  return  postCrmData(ctx, 'https://internal-account-api.codemao.cn/auth/login', {
    identity: email,
    password: password,
    timestamp: Date.now(),
  }, {
    'X-Captcha-Id': '',
    'X-Captcha-Ticket': ticket
  })
}
