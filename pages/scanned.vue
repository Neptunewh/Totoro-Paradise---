<script setup lang="ts">
import TotoroApiWrapper from '~/src/wrappers/TotoroApiWrapper'

const sunrunPaper = useSunRunPaper()
const session = useSession()
const selectValue = ref('')
const runMode = ref<'sunshine' | 'free'>('sunshine')
const data = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const isSessionValid = computed(() => !!session.value?.token)

const breq = computed(() => ({
  token: session.value!.token,
  campusId: session.value!.campusId,
  schoolId: session.value!.schoolId,
  stuNumber: session.value!.stuNumber,
}))

onMounted(async () => {
  if (!isSessionValid.value) {
    navigateTo('/')
    return
  }
  try {
    const result = await TotoroApiWrapper.getSunRunPaper(breq.value)
    data.value = result
    if (result) sunrunPaper.value = result
  }
  catch (e) {
    console.error('Failed to load sun run paper:', e)
    error.value = '加载路线数据失败'
  }
  finally {
    loading.value = false
  }
})

const handleUpdate = (target: string) => {
  selectValue.value = target
}

const handleModeChange = (mode: 'sunshine' | 'free') => {
  runMode.value = mode
  selectValue.value = ''
}

const pickRandomRoute = () => {
  if (!data.value?.runPointList?.length) return
  const list = data.value.runPointList
  selectValue.value = list[Math.floor(Math.random() * list.length)].pointId
}
</script>
<template>
  <div v-if="loading" class="d-flex justify-center align-center" style="min-height: 200px;">
    <VProgressCircular indeterminate color="primary" />
  </div>

  <div v-else-if="!isSessionValid" class="text-center pa-4">
    <VAlert type="warning">请先扫码登录</VAlert>
    <VBtn color="primary" class="mt-4" @click="navigateTo('/')">返回首页</VBtn>
  </div>

  <template v-else>
    <VAlert v-if="error" type="error" closable class="mb-4" @click:close="error = null">
      {{ error }}
    </VAlert>

    <VCard variant="outlined" class="mb-4">
      <VCardText>
        <div class="d-flex align-center ga-3">
          <VIcon icon="mdi-account-circle" size="40" color="primary" />
          <div>
            <div class="text-subtitle-1 font-weight-bold">{{ session?.stuName }}</div>
            <div class="text-caption text-medium-emphasis">{{ session?.campusName }} · {{ session?.collegeName }} · {{ session?.stuNumber }}</div>
          </div>
        </div>
      </VCardText>
    </VCard>

    <VCard class="mb-4">
      <VCardTitle class="text-subtitle-1">选择跑步模式</VCardTitle>
      <VCardText>
        <VRow dense>
          <VCol cols="6">
            <VCard
              :variant="runMode === 'sunshine' ? 'elevated' : 'outlined'"
              :color="runMode === 'sunshine' ? 'primary' : undefined"
              class="cursor-pointer h-100"
              @click="handleModeChange('sunshine')"
            >
              <VCardText class="text-center pa-3">
                <VIcon size="36" class="mb-1">mdi-map-marker-path</VIcon>
                <div class="text-subtitle-2">阳光跑</div>
                <div class="text-caption">固定路线</div>
              </VCardText>
            </VCard>
          </VCol>
          <VCol cols="6">
            <VCard
              :variant="runMode === 'free' ? 'elevated' : 'outlined'"
              :color="runMode === 'free' ? 'primary' : undefined"
              class="cursor-pointer h-100"
              @click="handleModeChange('free')"
            >
              <VCardText class="text-center pa-3">
                <VIcon size="36" class="mb-1">mdi-run-fast</VIcon>
                <div class="text-subtitle-2">自由跑</div>
                <div class="text-caption">自定义参数</div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <template v-if="data && runMode === 'sunshine'">
      <VSelect
        v-model="selectValue"
        :items="data.runPointList"
        item-title="pointName"
        item-value="pointId"
        variant="outlined"
        label="选择路线"
        density="comfortable"
        class="mb-3"
      />
      <div class="d-flex ga-2 mb-3">
        <VBtn variant="outlined" color="primary" prepend-icon="mdi-shuffle-variant" @click="pickRandomRoute">
          随机路线
        </VBtn>
        <VSpacer />
        <VBtn
          color="primary"
          :disabled="!selectValue"
          append-icon="mdi-arrow-right"
          :to="selectValue ? `/run/${encodeURIComponent(selectValue)}` : undefined"
        >
          开始跑步
        </VBtn>
      </div>
      <p class="text-caption text-medium-emphasis mb-2">地图中的路线仅为展示路线生成效果，不等于最终路线</p>
      <div class="map-container">
        <ClientOnly>
          <AMap :target="selectValue" @update:target="handleUpdate" />
        </ClientOnly>
      </div>
    </template>

    <template v-if="runMode === 'free'">
      <VBtn color="primary" append-icon="mdi-arrow-right" block class="mb-3" @click="navigateTo('/freerun')">
        开始自由跑
      </VBtn>
      <VAlert type="info" variant="tonal" density="compact">
        <ul class="pl-4 text-body-2 mb-0">
          <li>自定义跑步距离（0.5-20km）和目标时间</li>
          <li>自动计算配速、卡路里、步数</li>
          <li>支持批量执行和预设模板</li>
        </ul>
      </VAlert>
    </template>

    <VDivider class="my-4" />
    <h3 class="text-subtitle-1 mb-3">其他功能</h3>
    <VCard class="cursor-pointer" hover @click="navigateTo('/morningsign')">
      <VCardText class="d-flex align-center ga-3">
        <VIcon size="36" color="warning">mdi-alarm-check</VIcon>
        <div>
          <div class="text-subtitle-2">早操签到</div>
          <div class="text-caption text-medium-emphasis">查看签到任务、提交签到、查看成绩</div>
        </div>
      </VCardText>
    </VCard>
  </template>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 40vh;
  min-height: 250px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
