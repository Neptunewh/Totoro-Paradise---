<script setup lang="ts">
import TotoroApiWrapper from '~/src/wrappers/TotoroApiWrapper'

const router = useRouter()
const { data } = await useFetch<{ uuid: string; imgUrl: string }>('/api/scanQr')
const message = ref('')
const loading = ref(false)
const session = useSession()

const randomPoem = computed(() => poem[Math.floor(Math.random() * poem.length)].join('\n'))

const handleScanned = async () => {
  loading.value = true
  const scanRes = await $fetch(`/api/scanQr/${data!.value!.uuid}`)
  const code = (scanRes as { code: string; message: null } | { code: null; message: string })
    .code as string
  try {
    const loginResult = (
      await Promise.all([TotoroApiWrapper.getLesseeServer(code), TotoroApiWrapper.getAppAd(code)])
    )[0]
    if (!loginResult.token) {
      message.value = loginResult.message as string
      return
    }
    const personalInfo = await TotoroApiWrapper.login({ token: loginResult.token })
    session.value = { ...personalInfo, token: loginResult.token, code, data: null }
    const breq = {
      token: loginResult.token,
      campusId: personalInfo.campusId,
      schoolId: personalInfo.schoolId,
      stuNumber: personalInfo.stuNumber,
    }
    await TotoroApiWrapper.getAppFrontPage(breq)
    await TotoroApiWrapper.getAppSlogan(breq)
    await TotoroApiWrapper.updateAppVersion(breq)
    await TotoroApiWrapper.getAppNotice(breq)
    router.push('/scanned')
  }
  catch (e) {
    console.error(e)
    message.value = '龙猫服务器错误'
  }
  finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="home-page">
    <VCard class="welcome-card mb-6" variant="flat">
      <VCardText class="text-center pa-6">
        <VIcon icon="mdi-paw" size="56" color="primary" class="mb-3" />
        <h1 class="text-h5 font-weight-bold mb-1">
          欢迎来到龙猫乐园
        </h1>
        <p class="text-body-2 text-medium-emphasis">
          阳光跑 · 自由跑 · 早操签到
        </p>
      </VCardText>
    </VCard>

    <VCard class="mb-6" variant="outlined">
      <VCardText class="pa-5">
        <div class="d-flex align-center mb-4">
          <VIcon icon="mdi-qrcode-scan" color="primary" class="me-2" />
          <span class="text-subtitle-1 font-weight-medium">扫码登录</span>
        </div>

        <div class="d-flex flex-column align-center">
          <VCard
            class="qr-card mb-4"
            width="220"
            height="220"
            variant="tonal"
            color="primary"
          >
            <div v-if="!data" class="d-flex justify-center align-center h-100">
              <VProgressCircular indeterminate color="primary" />
            </div>
            <img
              v-else-if="!message"
              :src="data.imgUrl"
              class="w-100 h-100"
              style="object-fit: contain;"
              referrerpolicy="no-referrer"
            >
            <div v-else class="d-flex justify-center align-center h-100 text-center pa-4">
              <VIcon icon="mdi-alert-circle" color="error" class="me-2" />
              <span class="text-body-2 text-error">{{ message }}</span>
            </div>
          </VCard>

          <p class="text-body-2 text-medium-emphasis mb-4 text-center">
            请使用微信扫描上方二维码
          </p>

          <VBtn
            color="primary"
            size="large"
            :loading="loading"
            :disabled="!!message"
            append-icon="mdi-arrow-right"
            @click="handleScanned"
          >
            已扫码，下一步
          </VBtn>
        </div>
      </VCardText>
    </VCard>

    <VCard variant="flat" color="surface-variant" class="poem-card">
      <VCardText class="pa-4">
        <VIcon icon="mdi-format-quote-open" size="20" class="me-1 text-medium-emphasis" />
        <p class="text-body-2 text-medium-emphasis pre-wrap mb-0">
          {{ randomPoem }}
        </p>
      </VCardText>
    </VCard>

    <p class="text-caption text-center text-medium-emphasis mt-6">
      古典时代的人发现人体是权力的对象和目标。—— 米歇尔·福柯
    </p>
  </div>
</template>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1), rgba(var(--v-theme-secondary), 0.05));
  border-radius: 16px;
}

.qr-card {
  border-radius: 12px;
  overflow: hidden;
}

.poem-card {
  border-radius: 12px;
  border-left: 3px solid rgba(var(--v-theme-primary), 0.5);
}

.pre-wrap {
  white-space: pre-wrap;
}
</style>
