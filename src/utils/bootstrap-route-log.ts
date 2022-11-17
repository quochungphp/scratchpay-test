import { NestExpressApplication } from '@nestjs/platform-express';
import Table = require('cli-table');

export async function bootstrapRouteLog(app: NestExpressApplication) {
  const table = new Table({ head: ['Method', 'Path'] });
  const router = app.getHttpServer()._events.request._router;

  const availableRoutes: [] = router.stack
    .map((layer) => {
      if (layer.route) {
        return {
          route: {
            path: layer.route?.path,
            method: layer.route?.stack[0].method,
          },
        };
      }
    })
    .filter((item) => item !== undefined);
  availableRoutes.map((item: any) => {
    const routePath = item.route;
    if (routePath) {
      const row = {};
      row[`${routePath.method.toUpperCase()}`] = routePath.path;
      table.push(row);
    }
  });
  console.log(`\n${table.toString()}`);
}
