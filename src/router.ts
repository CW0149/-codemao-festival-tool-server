import Router from '@koa/router';
import { getLogistics, getStudentsAddrByClass, getStudentsByClass, getUserData } from './crm';


const router = new Router();
router.prefix('/api/codemao');

router.post('/class/students', async (ctx, next) => {
  const { class_id, term_id } = ctx.request.body;
  const classId = class_id && Number(class_id);
  const termId = term_id && Number(term_id);

  const data = await getStudentsByClass(ctx, classId, termId) ?? [];
  const dataWithAddr = await getStudentsAddrByClass(ctx, classId, termId) ?? [];
  const userIdToDataWithAddr = dataWithAddr?.items?.reduce((res: any, item: any) => ({ ...res, [item.user_id]: item }), {} as Record<string, any>);


  ctx.body = {
    ...data,
    items:  data?.items?.map((item: any, index: number) => ({
      ...item,
      ...(userIdToDataWithAddr[item.user_id] ?? {}),
      index,
      parent_name: userIdToDataWithAddr[item.user_id].parent_name && (userIdToDataWithAddr[item.user_id].parent_name !== '-') ? userIdToDataWithAddr[item.user_id].parent_name : ''
    }))
  };
  next();
});

router.get('/class/students', async (ctx, next) => {
  const res = await getStudentsByClass(ctx, 52413, 5290);

  ctx.body = res;
  next();
});

router.post('/student/logistics', async (ctx, next) => {
  const { phone } = ctx.request.body;

  const res = await getLogistics(ctx, phone);

  ctx.body = res;
  next();
});

router.get('/student/logistics', async (ctx, next) => {
  const res = await getLogistics(ctx, '13401014676');

  ctx.body = res;
  next();
});

router.get('/users/:userId', async (ctx, next) => {
  const { userId } = ctx.params;

  const res = await getUserData(ctx, userId);

  ctx.body = res;
  next();
});

export default router;
