export const whitelistedRoutes: RegExp[] = [
  new RegExp('(^/auth$)|(^/auth/.*$)'),
  new RegExp('(^/public$)|(^/public/.*$)'),
  new RegExp('^(^/docs$)|(^/docs/.*$)'),
  new RegExp('^/?$'),
  new RegExp('^/favicon.ico$'),
  new RegExp('^/healthcheck/?$')
]
