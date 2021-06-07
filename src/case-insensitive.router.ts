import { inject } from '@loopback/core';
import { createResolvedRoute, Request, RestBindings, RestRouterOptions, TrieRouter } from '@loopback/rest';

// Hack from https://github.com/strongloop/loopback-next/blob/master/packages/rest/src/router/router-base.ts
// ... just to have case insensitve paths
export class CaseInsensitiveRouter extends TrieRouter {
  constructor(@inject(RestBindings.ROUTER_OPTIONS, { optional: true }) options?: RestRouterOptions) {
    super(options);
  }

  find(request: Request) {
    // Put path to lower case
    let path = request.path;
    const pathArray = path.split('/');
    const index = path.startsWith('/') ? 1 : 0;
    if (pathArray.length > index) {
      pathArray[index] = pathArray[index].toLowerCase();
    }
    path = pathArray.join('/');

    // Non-strict mode
    if (this.options.strict) {
      return this.findARoute(request.method, path);
    }

    // First try the exact match
    const route = this.findARoute(request.method, path);
    if (route || path === '/') return route;
    if (path.endsWith('/')) {
      // Fall back to the path without trailing slash
      path = path.substring(0, path.length - 1);
    } else {
      // Fall back to the path with trailing slash
      path = path + '/';
    }
    return this.findARoute(request.method, path);
  }

  private findARoute(verb: string, path: string) {
    const key = this.getKey(verb, path);
    const route = this.routesWithoutPathVars[key];
    if (route) return createResolvedRoute(route, {});
    else return this.findRouteWithPathVars(verb, path);
  }
}
