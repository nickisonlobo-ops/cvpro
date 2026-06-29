<template>
  <div class="w-full max-w-md">
    <!-- Cabeçalho fora do card -->
    <div class="flex flex-col items-center gap-3 mb-8">
      <!-- Ícone SignPRO -->
      <div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30 bg-gradient-to-br from-violet-500 to-indigo-600">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/>
        </svg>
      </div>
      <div class="text-center">
        <h1 class="text-2xl font-bold tracking-tight">Sign<span style="background: linear-gradient(135deg, #7c3aed, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text">PRO</span></h1>
        <p class="text-sm text-gray-500 mt-0.5">Sistema para comunicação visual</p>
      </div>
    </div>

    <!-- Card -->
    <div class="rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-100/60 p-8" style="background: #ffffff">
      <!-- Abas -->
      <div class="flex rounded-xl p-1 mb-6" style="background: #eef2ff">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          :class="[
            'flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200',
            activeTab === tab.key
              ? 'text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-600',
          activeTab === tab.key ? '' : '',
          ]"
          :style="activeTab === tab.key ? 'background: linear-gradient(135deg, #1e40af, #4f46e5)' : ''"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Título dinâmico -->
      <p class="text-base font-semibold text-gray-700 text-center mb-6">
        {{ activeTab === 'login' ? 'Entre na sua conta' : 'Crie sua conta' }}
      </p>

    <!-- Entrar -->
    <form v-if="activeTab === 'login'" class="form-group" @submit.prevent="handleLogin">
      <AppInput
        v-model="login.email"
        label="E-mail"
        type="email"
        placeholder="Digite seu e-mail"
        :error="formErrors.email"
        required
      />
      <AppInput
        v-model="login.password"
        :type="showPassword ? 'text' : 'password'"
        label="Senha"
        placeholder="Digite sua senha"
        :error="formErrors.password"
        required
      >
        <template #trailing>
          <button type="button" class="text-gray-400 hover:text-gray-600 transition-colors" @click="showPassword = !showPassword">
            <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </button>
        </template>
      </AppInput>
      <p v-if="authError" class="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 text-center">
        {{ authError }}
      </p>
      <AppButton variant="secondary" size="lg" type="submit" :loading="authLoading" class="mt-2 w-full font-bold !text-white !border-0" style="background: linear-gradient(135deg, #1e40af, #4f46e5)">
        Entrar
      </AppButton>
    </form>

    <!-- Criar conta -->
    <form v-else class="form-group" @submit.prevent="handleRegister">
      <AppInput
        v-model="register.name"
        label="Nome"
        type="text"
        placeholder="Digite seu nome completo"
        :error="registerErrors.name"
        required
      />
      <AppInput
        v-model="register.nomeEmpresa"
        label="Nome da empresa"
        type="text"
        placeholder="Nome da sua empresa"
        :error="registerErrors.nomeEmpresa"
        required
      />
      <AppInput
        v-model="register.email"
        label="E-mail"
        type="email"
        placeholder="Digite seu e-mail"
        :error="registerErrors.email"
        required
      />
      <AppInput
        v-model="register.password"
        :type="showRegisterPassword ? 'text' : 'password'"
        label="Senha"
        placeholder="Digite sua senha"
        :error="registerErrors.password"
        required
      >
        <template #trailing>
          <button type="button" class="text-gray-400 hover:text-gray-600 transition-colors" @click="showRegisterPassword = !showRegisterPassword">
            <svg v-if="showRegisterPassword" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </button>
        </template>
      </AppInput>
      <AppInput
        v-model="register.confirmPassword"
        :type="showRegisterPassword ? 'text' : 'password'"
        label="Confirmar Senha"
        placeholder="Confirme sua senha"
        :error="registerErrors.confirmPassword"
        required
      />
      <p v-if="authError" class="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 text-center">
        {{ authError }}
      </p>
      <p v-if="registerSuccess" class="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2.5 text-center">
        Cadastro realizado! Verifique seu e-mail para confirmar a conta.
      </p>
      <AppButton variant="secondary" size="lg" type="submit" :loading="authLoading" class="mt-2 w-full font-bold !text-white !border-0" style="background: linear-gradient(135deg, #1e40af, #4f46e5)">
        Criar conta
      </AppButton>
    </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AppInput from '~/components/AppInput.vue'
import AppButton from '~/components/AppButton.vue'
import { useAuth } from '~/composables/useAuth'

defineOptions({ name: 'LoginForm' })

const props = withDefaults(defineProps<{ initialTab?: 'login' | 'register' }>(), { initialTab: 'login' })

const router = useRouter()
const { login: authLogin, register: authRegister, loading: authLoading, error: authError } = useAuth()

const tabs: { key: 'login' | 'register'; label: string }[] = [
  { key: 'login',    label: 'Entrar' },
  { key: 'register', label: 'Criar conta' },
]

const activeTab = ref<'login' | 'register'>(props.initialTab)
const showPassword = ref(false)
const showRegisterPassword = ref(false)

const login = reactive({ email: '', password: '' })
const register = reactive({ name: '', nomeEmpresa: '', email: '', password: '', confirmPassword: '' })

const formErrors = reactive({ email: '', password: '' })
const registerErrors = reactive({ name: '', nomeEmpresa: '', email: '', password: '', confirmPassword: '' })

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateLogin(): boolean {
  formErrors.email = ''
  formErrors.password = ''

  if (!login.email) {
    formErrors.email = 'O e-mail é obrigatório.'
  } else if (!emailRegex.test(login.email)) {
    formErrors.email = 'Informe um e-mail válido.'
  }

  if (!login.password) {
    formErrors.password = 'A senha é obrigatória.'
  }

  return !formErrors.email && !formErrors.password
}

function validateRegister(): boolean {
  registerErrors.name = ''
  registerErrors.nomeEmpresa = ''
  registerErrors.email = ''
  registerErrors.password = ''
  registerErrors.confirmPassword = ''

  if (!register.name.trim()) {
    registerErrors.name = 'O nome é obrigatório.'
  }

  if (!register.nomeEmpresa.trim()) {
    registerErrors.nomeEmpresa = 'O nome da empresa é obrigatório.'
  }

  if (!register.email) {
    registerErrors.email = 'O e-mail é obrigatório.'
  } else if (!emailRegex.test(register.email)) {
    registerErrors.email = 'Informe um e-mail válido.'
  }

  if (!register.password) {
    registerErrors.password = 'A senha é obrigatória.'
  } else if (register.password.length < 8) {
    registerErrors.password = 'A senha deve ter no mínimo 8 caracteres.'
  } else if (!/[A-Z]/.test(register.password) || !/[0-9]/.test(register.password)) {
    registerErrors.password = 'A senha deve conter pelo menos 1 letra maiúscula e 1 número.'
  }

  if (!register.confirmPassword) {
    registerErrors.confirmPassword = 'Confirme sua senha.'
  } else if (register.password !== register.confirmPassword) {
    registerErrors.confirmPassword = 'As senhas não coincidem.'
  }

  return !registerErrors.name && !registerErrors.nomeEmpresa && !registerErrors.email && !registerErrors.password && !registerErrors.confirmPassword
}

async function handleLogin() {
  if (!validateLogin()) return
  const ok = await authLogin(login.email, login.password)
  if (ok) {
    await router.push('/')
  }
}

const registerSuccess = ref(false)

async function handleRegister() {
  if (!validateRegister()) return
  const { ok, needsConfirmation } = await authRegister(register.name, register.email, register.password, register.nomeEmpresa)
  if (ok) {
    if (needsConfirmation) {
      registerSuccess.value = true
    } else {
      // Limpa tema do usuário anterior para não herdar cores de outra empresa
      try { localStorage.removeItem('empresa_tema') } catch {}
      await router.push('/')
    }
  }
}
</script>
