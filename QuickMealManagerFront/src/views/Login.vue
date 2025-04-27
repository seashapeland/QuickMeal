<template>
    <div class="login-container">
      <div class="login-box">
        <div class="login-header">
          <img src="@/assets/logo.png" alt="logo" class="logo logo-glow" />
          <h1>曲辰智慧点餐 · 管理后台</h1>
        </div>
        <div class="login-form">
            <!-- 用户名 -->
            <div class="input-group">
                <input v-model="username" placeholder="用户名" />
                <span class="clear-btn" v-if="username" @click="username = ''">×</span>
            </div>

            <!-- 密码 -->
            <div class="input-group">
                <input v-model="password" type="password" placeholder="密码" @keyup.enter="handleLogin"/>
                <span class="clear-btn" v-if="password" @click="password = ''">×</span>
            </div>
            <button @click="handleLogin">登录</button>
            <p class="hint">请联系系统管理员分配账号</p>
        </div>
      </div>
    </div>
</template>
  
<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { loginAdmin } from '@/api/auth'
  
  const username = ref('')
  const password = ref('')
  const router = useRouter()
  
  const handleLogin = async () => {
    try {
        // 调用后端的登录接口
        const res = await loginAdmin({ username: username.value, password: password.value })

        // 如果后端返回token，保存到localStorage，并跳转到dashboard
        if (res.token) {
            localStorage.setItem('token', res.token)  // 保存token到localStorage
            localStorage.setItem('username', res.username)
            localStorage.setItem('role', res.role)
            router.replace('/dashboard')  // 跳转到后台首页
        } else {
            // 登录失败，显示后端返回的错误信息
            alert(`登录失败：${res.detail || '未知错误'}`)
        }
    } catch (err) {
        // 捕获异常，显示异常信息
        alert('登录出错')
    }
  }
</script>
  
<style scoped>
    .login-container {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: flex-start; /* ✅ 靠上对齐 */
        padding-top: 10vh;        /* ✅ 向下偏移一点 */
    }

    /* ✅ 背景图层 */
    .login-container::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: url('/bg-food2.png') center/cover no-repeat;
        z-index: -1;
    }

    .login-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 500px;
        padding: 36px 32px;
        /*background: #ffffff;*/
        border-radius: 10px;
        /*box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);*/
    }

    .login-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px; /* LOGO 和文字间距 */
        margin-bottom: 24px;
    }

    .logo {
        height: 48px; /* ✅ 放大 logo */
    }

    h1 {
        font-size: 30px;      /* ✅ 更大字体 */
        font-weight: 700;
        color: #333;
        margin: 0;
    }

    .login-form {
        width: 80%;
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    .input-group {
        position: relative;
    }

    .input-group input {
        width: 100%;
        padding: 10px 25px 10px 25px; /* 左右内边距，右边留给 × 按钮 */
        font-size: 16px;
        border: 1px solid #e7e7e7;
        border-radius: 6px;
        outline: none;
        transition: border 0.2s ease;
        background-color: #fff;
        box-sizing: border-box;
    }
    .input-group input:focus {
        border: 1px solid #14803c;
    }
    .clear-btn {
        position: absolute;
        right: 10px;
        top: 45%;
        transform: translateY(-50%);
        cursor: pointer;
        color: #999;
        font-size: 25px;
        user-select: none;
        opacity: 0.8;
        transition: opacity 0.2s ease;
    }
    .clear-btn:hover {
        color: #333;
        opacity: 1;
    }

    button {
        padding: 10px;
        background: #14803c;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 4px;
        margin-top: 20px;
        font-size: 16px;
        transition: background 0.3s ease;
    }
    button:hover {
        background: #36a750;
    }

    .hint {
        color: #03230e;
        font-size: 12px;
        text-align: center;
        margin-top: 8px;
    }

    .logo-glow {
        animation: glow 2.4s ease-in-out infinite;
        box-shadow: 0 0 6px rgba(64, 158, 255, 0.3); /* 初始光晕 */
        border-radius: 12px;
    }

    /* 动画：呼吸式发光 */
    @keyframes glow {
        0% {
            box-shadow: 0 0 6px rgba(64, 152, 99, 0.3);
        }
        50% {
            box-shadow: 0 0 14px rgba(64, 152, 99, 0.6);
        }
        100% {
            box-shadow: 0 0 6px rgba(64, 152, 99, 0.3);
        }
    }
</style>
  