import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import $cookies from 'vue-cookies'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Cookie 補助関数
  const getCookie = (key) => {
    if (typeof $cookies !== 'undefined' && $cookies?.get) {
      return $cookies.get(key)
    }
    if (typeof window !== 'undefined' && window.$cookies?.get) {
      return window.$cookies.get(key)
    }
    return null
  }

  const setCookie = (key, val, expire = 60 * 60) => {
    if (typeof $cookies !== 'undefined' && $cookies?.set) {
      $cookies.set(key, val, expire)
    } else if (typeof window !== 'undefined' && window.$cookies?.set) {
      window.$cookies.set(key, val, expire)
    }
  }

  const removeCookie = (key) => {
    if (typeof $cookies !== 'undefined' && $cookies?.remove) {
      $cookies.remove(key)
    } else if (typeof window !== 'undefined' && window.$cookies?.remove) {
      window.$cookies.remove(key)
    }
  }

  // トークンをリアクティブな ref として管理（Cookie初期値）
  const token = ref(getCookie("access_token"))

  // ゲッター (computed)
  const isLoggedIn = computed(() => !!token.value)

  const displayName = computed(() => {
    return user.value?.global_name || user.value?.username || ''
  })

  const avatarUrl = computed(() => {
    if (user.value?.avatar && user.value?.id) {
      const isGif = user.value.avatar.startsWith('a_')
      const ext = isGif ? 'gif' : 'png'
      return `https://cdn.discordapp.com/avatars/${user.value.id}/${user.value.avatar}.${ext}`
    }
    if (user.value?.id) {
      const defaultIndex = (BigInt(user.value.id) >> 22n) % 6n
      return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`
    }
    return ''
  })

  // アクション
  /**
   * Discord APIからユーザー情報を取得
   * @param {string} [token] アクセストークン（未指定の場合はCookieから取得）
   */
  async function fetchUser(tokenArg) {
    const accessToken = tokenArg || token.value || getCookie('access_token')
    if (!accessToken) {
      error.value = 'アクセストークンが見つかりません。'
      return null
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'ユーザー情報の取得に失敗しました。')
      }

      user.value = data
      return data
    } catch (err) {
      console.error('[UserStore] fetchUser error:', err)
      error.value = err.message || 'エラーが発生しました。'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * トークンを保存（Cookieとリアクティブstateを更新）
   */
  function setTokens(accessToken, refreshToken, expire = 60 * 60) {
    token.value = accessToken
    setCookie('access_token', accessToken, expire)
    if (refreshToken) {
      setCookie('refresh_token', refreshToken, expire * 24 * 7)
    }
  }

  /**
   * ユーザー情報を直接セット
   * @param {object|null} userData
   */
  function setUser(userData) {
    user.value = userData
  }

  /**
   * ログアウト処理（Cookieとストアの状態をクリア）
   */
  function logout() {
    user.value = null
    token.value = null
    error.value = null
    removeCookie('access_token')
    removeCookie('refresh_token')
  }

  return {
    user,
    token,
    loading,
    error,
    isLoggedIn,
    displayName,
    avatarUrl,
    fetchUser,
    setUser,
    setTokens,
    logout
  }
})
