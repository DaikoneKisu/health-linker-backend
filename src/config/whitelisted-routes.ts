export const whitelistedRoutes: RegExp[] = [
  new RegExp('/auth/?.*'),
  new RegExp('/public/?.*'),
  new RegExp('/docs/?.*'),
  new RegExp('^/?$'),
  new RegExp('^/favicon.ico$'),
  new RegExp('^/healthcheck/?$')
]
