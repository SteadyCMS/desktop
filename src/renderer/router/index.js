import { createRouter, createWebHistory } from 'vue-router'

import AppDashboard from '../views/AppDashboard.vue'
import PostsView from '../views/dashboard/PostsView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: AppDashboard,
      children: [
        {
          path: 'posts',
          name: 'posts',
          component: PostsView
        },
        {
          path: 'pages',
          name: 'pages',
          component: () => import('../views/dashboard/PagesView.vue')
        },
        {
          path: 'tags',
          name: 'tags',
          component: () => import('../views/dashboard/TagsView.vue')
        },
      ]
    },
    {
      path: '/new-website',
      name: 'newwebsite',
      props: true,
      component: () => import('../views/AppNewWebsite.vue'),
    },
    {
      path: '/editor',
      name: 'editor',
      component: () => import('../views/BlockEditorView.vue'),
    },
    {
      path: "/:catchAll(.*)",
      name: 'notfound',
      component: () => import('../views/NotFound.vue')
    },
  ]
})

export default router
