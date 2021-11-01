import { useToken } from '@/hooks'
import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { menus } from './menus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const router = createRouter({
  history: createWebHistory(),
  routes: menus
})

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  document.title = (to.meta.title as string) || '后台管理'
  const token = useToken()
  NProgress.start()

  // 无token返回登录页
  if (!token && to.path !== '/login') next({ path: `/login?redirect=${to.path}` })

    // 有token情况返回首页
  if (token && to.path === '/login') next({ path: '/dashboard' })

  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router